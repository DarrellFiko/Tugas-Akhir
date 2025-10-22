// src/pages/siswa/FormUjianSiswaPage.jsx
import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Button, TextField, Radio, Checkbox } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { ToastError } from "../../../composables/sweetalert";
import { getUjianById } from "../../../services/ujianService";
import { getKelasTahunAjaranById } from "../../../services/kelasTahunAjaranService";
import { getRandomSoal } from "../../../services/soalService";
import { createJawabanUjian } from "../../../services/jawabanUjianService";

export default function FormUjianSiswaPage() {
  const { idKelasTahunAjaran, idUjian } = useParams();
  const navigate = useNavigate();

  const [ujian, setUjian] = useState(null);
  const [kelasTahunAjaran, setKelasTahunAjaran] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isLocked, setIsLocked] = useState(true);
  const [soal, setSoal] = useState(null);
  const [jawaban, setJawaban] = useState("");

  const id_user = localStorage.getItem("id_user");

  // ================== FETCH DATA UJIAN ==================
  useEffect(() => {
    const fetchUjian = async () => {
      try {
        setLoading(true);
        const res = await getUjianById(idUjian);
        const data = res?.data;

        if (!data) {
          ToastError.fire({ title: "Data ujian tidak ditemukan" });
          navigate(-1);
          return;
        }

        let siswaList = [];
        try {
          siswaList =
            typeof data.list_siswa === "string"
              ? JSON.parse(data.list_siswa)
              : data.list_siswa || [];
        } catch {
          siswaList = [];
        }

        if (!id_user || !siswaList.map(Number).includes(Number(id_user))) {
          ToastError.fire({
            title: "Anda tidak terdaftar untuk mengikuti ujian ini.",
          });
          navigate(-1);
          return;
        }

        setUjian(data);
        setStartTime(new Date(data.start_date));
        setEndTime(new Date(data.end_date));
      } catch (err) {
        console.error(err);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    const fetchKelasTahunAjaran = async () => {
      try {
        const res = await getKelasTahunAjaranById(idKelasTahunAjaran);
        setKelasTahunAjaran(res?.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (idUjian) {
      fetchKelasTahunAjaran();
      fetchUjian();
    }
  }, [idUjian, idKelasTahunAjaran]);

  // ================== CEK & KUNCI SELAMA UJIAN BERLANGSUNG ==================

  const handlePopState = () => {
    window.history.pushState(null, null, window.location.pathname);
    alert("Anda tidak dapat meninggalkan halaman selama ujian berlangsung.");
  };

  const handleKeyDown = (e) => {
    if (
      (e.ctrlKey && e.key === "w") ||
      (e.altKey && e.key === "F4") ||
      e.key === "F5" ||
      (e.ctrlKey && e.key === "r")
    ) {
      e.preventDefault();
      e.stopPropagation();
      alert("Shortcut dinonaktifkan selama ujian berlangsung.");
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      alert("Anda meninggalkan halaman ujian! Harap tetap di halaman ujian.");
    }
  };

  // Helper untuk bersihkan semua event listener
  const releaseExamLock = () => {
    window.removeEventListener("popstate", handlePopState);
    window.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };

  // useEffect(() => {
  //   if (!startTime || !endTime) return;

  //   const now = new Date();
  //   const locked = now >= startTime && now < endTime;
  //   setIsLocked(locked);

  //   if (!locked) {
  //     releaseExamLock();
  //     return;
  //   }

  //   window.addEventListener("popstate", handlePopState);
  //   window.addEventListener("keydown", handleKeyDown);
  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  //   window.history.pushState(null, null, window.location.pathname);

  //   return () => {
  //     releaseExamLock();
  //   };
  // }, [startTime, endTime]);

  useEffect(() => {
    if (isLocked) {
      // ujian sedang berlangsung
      localStorage.setItem("isExamMode", "true");
    } else {
      // ujian belum mulai atau sudah selesai
      localStorage.removeItem("isExamMode");
    }

    return () => {
      localStorage.removeItem("isExamMode");
    };
  }, [isLocked]);

  // ================== COUNTDOWN TIMER ==================
  useEffect(() => {
    const timer = setInterval(() => {
      if (!startTime || !endTime) {
        setTimeLeft("");
        return;
      }

      const now = new Date();

      if (now < startTime) {
        const diff = startTime - now;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`Belum mulai: ${h} jam ${m} menit ${s} detik lagi`);
      } else if (now >= startTime && now < endTime) {
        const diff = endTime - now;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`Tersisa ${h} jam ${m} menit ${s} detik`);
      } else {
        setTimeLeft("Waktu pengerjaan telah habis");
        setIsLocked(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  // ================== FETCH RANDOM SOAL ==================
  const fetchSoal = async () => {
    try {
      if (!isLocked) return; // hanya fetch jika ujian sedang aktif

      const res = await getRandomSoal(idUjian);
      if (res?.data) {
        // kalau ada data, set soalnya
        setSoal(res.data);
      } else {
        // kalau null, tandanya semua sudah dijawab
        setSoal(null);
        setIsLocked(false);
        releaseExamLock();
      }
    } catch (err) {
      console.error(err);
      setSoal(null);
      setIsLocked(false);
      releaseExamLock();
    }
  };

  useEffect(() => {
    fetchSoal();
  }, [idUjian, isLocked]);

  // ================== SUBMIT JAWABAN ==================
  const handleSubmit = async () => {
    try {
      if (!jawaban || !soal) {
        ToastError.fire({ title: "Jawaban tidak boleh kosong" });
        return;
      }

      await createJawabanUjian({
        id_ujian: idUjian,
        id_soal: soal.id_soal,
        jawaban,
      });

      fetchSoal()
      setJawaban("");
    } catch (err) {
      console.error(err);
      ToastError.fire({ title: "Gagal menyimpan jawaban" });
    }
  };

  // ================== LOADING ==================
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!ujian) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="error">
          Data ujian tidak ditemukan.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          {`${ujian?.jenis_ujian || "-"} - ${
            kelasTahunAjaran?.Pelajaran?.nama_pelajaran || "-"
          }`}
        </Typography>
      </Box>

      <hr />
      <Box sx={{ textAlign: "center" }}>
        {soal && (
          <Typography variant="body1" sx={{ my: 2 }}>
            {timeLeft}
          </Typography>
        )}
      </Box>

      {/* =============== BAGIAN SOAL RANDOM =============== */}
      <Box sx={{ mt: 4 }}>
        {isLocked ? (
          soal ? (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {soal.text_soal}
              </Typography>

              {soal.gambar_url && (
                <Box sx={{ mb: 2 }}>
                  <img
                    src={soal.gambar_url}
                    alt="gambar soal"
                    style={{ maxWidth: "100%", borderRadius: 8 }}
                  />
                </Box>
              )}

              {/* ===== Pilihan Ganda Satu ===== */}
              {soal.jenis_soal === "pilihan_ganda_satu" && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {Array.isArray(JSON.parse(soal.list_jawaban)) &&
                    JSON.parse(soal.list_jawaban).map((opt, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #ddd",
                          borderRadius: 2,
                          p: 1,
                          cursor: "pointer",
                        }}
                        onClick={() => setJawaban(opt)}
                      >
                        <Radio
                          checked={jawaban === opt}
                          onChange={() => setJawaban(opt)}
                          value={opt}
                          sx={{ mr: 1 }}
                        />
                        <Typography>{opt}</Typography>
                      </Box>
                    ))}
                </Box>
              )}

              {/* ===== Pilihan Ganda Banyak ===== */}
              {soal.jenis_soal === "pilihan_ganda_banyak" && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {Array.isArray(JSON.parse(soal.list_jawaban)) &&
                    JSON.parse(soal.list_jawaban).map((opt, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #ddd",
                          borderRadius: 2,
                          p: 1,
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setJawaban((prev) => {
                            const arr = Array.isArray(prev) ? [...prev] : [];
                            return arr.includes(opt)
                              ? arr.filter((j) => j !== opt)
                              : [...arr, opt];
                          });
                        }}
                      >
                        <Checkbox
                          checked={Array.isArray(jawaban) ? jawaban.includes(opt) : false}
                          value={opt}
                          sx={{ mr: 1 }}
                        />
                        <Typography>{opt}</Typography>
                      </Box>
                    ))}
                </Box>
              )}

              {/* ===== Isian / Uraian ===== */}
              {soal.jenis_soal === "isian" && (
                <TextField
                  id="jawaban-isian"
                  fullWidth
                  label="Jawaban Anda"
                  value={jawaban}
                  onChange={(e) => setJawaban(e.target.value)}
                  multiline
                  rows={3}
                  variant="outlined"
                />
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ mt: 3 }}
              >
                Kirim Jawaban
              </Button>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Semua soal sudah dijawab
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate(-1)}
              >
                Kembali
              </Button>
            </Box>
          )
        ) : (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography sx={{ textAlign: "center", my: 3 }}>
              Ujian belum dimulai atau sudah selesai.
            </Typography>
            <Button
              variant="contained"
              color="warning"
              onClick={() => navigate(`/ujian/detail/${idKelasTahunAjaran}`)}
            >
              Kembali
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
