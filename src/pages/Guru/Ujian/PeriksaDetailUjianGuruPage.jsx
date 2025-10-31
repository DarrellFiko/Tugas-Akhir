// src/pages/ujian/PeriksaDetailUjianGuruPage.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Radio,
  Checkbox,
  TextField,
  Grid,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useParams, useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { getPeriksaUjianDetail } from "../../../services/ujianService";
import TextEditor from "../../../components/inputs/TextEditor";
import useIsMobile from "../../../plugins/useIsMobile";

export default function PeriksaDetailUjianGuruPage() {
  const { idUjian, idUser } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [loading, setLoading] = useState(false);
  const [ujianDetail, setUjianDetail] = useState(null);
  const [soalList, setSoalList] = useState([]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await getPeriksaUjianDetail(idUjian, idUser);
      setUjianDetail(res);
      setSoalList(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [idUjian, idUser]);

  const parseJSON = (v) => {
    try {
      return JSON.parse(v);
    } catch {
      return v;
    }
  };

  const handleScoreChange = (id_soal, newScore) => {
    setSoalList((prev) =>
      prev.map((s) =>
        s.id_soal === id_soal ? { ...s, nilai_siswa: Number(newScore) } : s
      )
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!ujianDetail) {
    return (
      <Typography align="center" sx={{ mt: 5 }}>
        Data ujian tidak ditemukan
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Periksa Detail Ujian</Typography>
        <Button
          variant="contained"
          color="warning"
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigate(-1)}
        >
          Kembali
        </Button>
      </Box>

      {/* INFO UJIAN */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">Informasi Ujian</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography>
            Nama Siswa: <b>{ujianDetail.siswa?.nama_lengkap || "-"}</b>
          </Typography>
          <Typography>
            Pelajaran: <b>{ujianDetail.ujian?.pelajaran || "-"}</b>
          </Typography>
          <Typography>
            Jenis Ujian: <b>{ujianDetail.ujian?.jenis_ujian || "-"}</b>
          </Typography>
        </CardContent>
      </Card>

      {/* LIST SOAL */}
      {Array.isArray(soalList) && soalList.length > 0 ? (
        soalList.map((soal, index) => {
          const listJawaban = parseJSON(soal.list_jawaban) || [];
          const jawabanBenar = parseJSON(soal.jawaban_benar);
          const jawabanSiswa = parseJSON(soal.jawaban_siswa);

          let benar = false;

          if (soal.jenis_soal === "pilihan_ganda_satu") {
            benar = jawabanBenar === jawabanSiswa;
          } else if (soal.jenis_soal === "pilihan_ganda_banyak") {
            if (Array.isArray(jawabanBenar) && Array.isArray(jawabanSiswa)) {
              benar =
                jawabanBenar.length === jawabanSiswa.length &&
                jawabanBenar.every((v) => jawabanSiswa.includes(v));
            }
          } else {
            // Soal isian — tidak perlu indikator
            benar = null;
          }

          return (
            <Card key={soal.id_soal} sx={{ mb: 3 }}>
              <CardContent>
                {/* HEADER SOAL */}
                <Grid container spacing={1} alignItems="center" justifyContent="space-between">
                  <Grid item size={{ xs: 12, sm: 9 }} sm="auto">
                    <Typography variant="subtitle1">
                      Soal {index + 1} ({soal.jenis_soal})
                    </Typography>
                  </Grid>

                  {/* indikator benar/salah */}
                  {benar !== null && (
                    <Grid item size={{ xs: 12, sm: 3 }} sm="auto">
                      <Typography
                        color={benar ? "success.main" : "error.main"}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          justifyContent: isMobile ? "flex-start" : "flex-end",
                          mt: isMobile ? 0.5 : 0, 
                        }}
                      >
                        {benar ? (
                          <CheckCircleOutlineIcon color="success" fontSize="small" />
                        ) : (
                          <HighlightOffIcon color="error" fontSize="small" />
                        )}
                        {benar ? "Benar" : "Salah"}
                      </Typography>
                    </Grid>
                  )}
                </Grid>

                {/* TEKS SOAL */}
                <Typography sx={{ mt: 1 }}>{soal.text_soal}</Typography>

                {/* GAMBAR */}
                {soal.gambar_url && (
                  <Box sx={{ mt: 1 }}>
                    <img
                      src={soal.gambar_url}
                      alt="soal"
                      style={{ maxWidth: "200px", borderRadius: "8px" }}
                    />
                  </Box>
                )}

                {/* PILIHAN GANDA */}
                {(soal.jenis_soal === "pilihan_ganda_satu" ||
                  soal.jenis_soal === "pilihan_ganda_banyak") && (
                  <Box sx={{ mt: 2 }}>
                    {listJawaban.map((opt, idx) => {
                      const isBenar = Array.isArray(jawabanBenar)
                        ? jawabanBenar.includes(idx)
                        : jawabanBenar === idx;
                      const isDipilih = Array.isArray(jawabanSiswa)
                        ? jawabanSiswa.includes(idx)
                        : jawabanSiswa === idx;

                      return (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          {soal.jenis_soal === "pilihan_ganda_satu" ? (
                            <Radio checked={isDipilih} disabled />
                          ) : (
                            <Checkbox checked={isDipilih} disabled />
                          )}
                          <Typography
                            sx={{
                              color: isBenar ? "success.main" : "inherit",
                              fontWeight: isBenar ? 600 : 400,
                            }}
                          >
                            {opt}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                )}

                {/* Jawaban isian */}
                {soal.jenis_soal === "isian" && (
                  <Box sx={{ mt: 2 }}>
                    <Typography sx={{ mb: 1, fontWeight: 500 }}>Jawaban Siswa:</Typography>

                    <TextEditor
                      value={jawabanSiswa || ""}
                      onChange={(val) => {
                        setSoalList((prev) =>
                          prev.map((s) =>
                            s.id_soal === soal.id_soal ? { ...s, jawaban_siswa: val } : s
                          )
                        );
                      }}
                    />

                    {/* Input nilai (score) di bawah editor */}
                    <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography fontWeight={500}>Score:</Typography>
                      <input
                        type="number"
                        min="0"
                        max={soal.score}
                        value={soal.nilai_siswa || 0}
                        onChange={(e) => {
                          const newScore = parseFloat(e.target.value) || 0;
                          setSoalList((prev) =>
                            prev.map((s) =>
                              s.id_soal === soal.id_soal
                                ? { ...s, nilai_siswa: newScore }
                                : s
                            )
                          );
                        }}
                        style={{
                          width: 80,
                          padding: "6px 8px",
                          borderRadius: 6,
                          border: "1px solid #ccc",
                          outline: "none",
                        }}
                      />
                      <Typography sx={{ fontSize: "0.9rem", opacity: 0.6 }}>
                        dari {soal.score}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* KUNCI JAWABAN */}
                {benar === false && (
                  <Box sx={{ mt: 1 }}>
                    <Typography color="success.main">
                      Jawaban Benar:{" "}
                      {Array.isArray(jawabanBenar)
                        ? jawabanBenar.map((i) => listJawaban[i]).join(", ")
                        : listJawaban[jawabanBenar]}
                    </Typography>
                  </Box>
                )}

                {/* Input skor juga untuk semua tipe soal (readonly untuk PG) */}
                {soal.jenis_soal !== "isian" && (
                  <TextField
                    type="number"
                    label="Nilai Soal"
                    size="small"
                    sx={{ mt: 2, width: "150px" }}
                    value={soal.nilai_siswa ?? 0}
                    disabled
                  />
                )}
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Typography>Tidak ada soal untuk ujian ini</Typography>
      )}

      {/* Simpan Perubahan */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => console.log("Simpan nilai:", soalList)}
      >
        Simpan Nilai
      </Button>
    </Box>
  );
}
