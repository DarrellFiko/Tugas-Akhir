import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import TableTemplate from "../../../components/tables/TableTemplate";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { getModulById } from "../../../services/modulService";
import { getListSiswaByKelasTahunAjaran } from "../../../services/kelasSiswaService";
import { ToastError, ToastSuccess } from "../../../composables/sweetalert";
import { createPengumpulanModul } from "../../../services/pengumpulanModulService";
import { compressFile } from "../../../utils/utils";

export default function DetailModuleSiswaPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { modulId } = useParams();

  const [loading, setLoading] = useState(true);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [moduleInfo, setModuleInfo] = useState(null);
  const [rowsPengumpulan, setRowsPengumpulan] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const userId = parseInt(localStorage.getItem("id_user"));

  const formatterDateTime = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // =================== Fetch Modul ===================
  const fetchModul = async () => {
    try {
      setLoading(true);
      const res = await getModulById(modulId);
      const payload = res?.data;

      if (!payload || !payload.id_modul) {
        setModuleInfo(null);
        ToastError.fire({ title: "Data modul tidak ditemukan" });
        return;
      }

      const parsedStart = new Date(payload.start_date);
      const parsedEnd = new Date(payload.end_date);

      setModuleInfo({
        id_modul: payload.id_modul,
        nama_modul: payload.nama_modul ?? "",
        jenis_modul: payload.jenis_modul ?? "",
        keterangan: payload.keterangan ?? "",
        sifat_pengumpulan: payload.sifat_pengumpulan ?? "Online",
        sifat_modul: payload.status_modul ?? "Perorangan",
        tipe_file_modul: payload.tipe_file_modul ?? "PDF",
        status_modul: payload.status_modul ?? "Aktif",
        start_date: parsedStart,
        end_date: parsedEnd,
      });

      setStartTime(parsedStart);
      setEndTime(parsedEnd);

      const pengumpulan = payload.pengumpulan ?? [];
      await fetchListSiswa(payload.id_kelas_tahun_ajaran, pengumpulan);
    } catch (err) {
      console.error("fetchModul error:", err);
      setModuleInfo(null);
    } finally {
      setLoading(false);
    }
  };

  // =================== Fetch List Siswa + Merge ===================
  const fetchListSiswa = async (idKelasTahunAjaran, pengumpulan) => {
    try {
      const res = await getListSiswaByKelasTahunAjaran(idKelasTahunAjaran);
      const siswaList = res?.data || [];

      const isUserInClass = siswaList.some((s) => s.id_user === userId);
      if (!isUserInClass) {
        navigate(-1);
        return;
      }

      const merged = siswaList.map((s) => {
        const found = pengumpulan.find((p) => p.id_siswa === s.id_user);
        return {
          id_user: s.id_user,
          nis: s.nis ?? "-",
          nisn: s.nisn ?? "-",
          nama: s.nama ?? "-",
          waktu_kumpul: found?.updated_at
            ? formatterDateTime.format(new Date(found.updated_at))
            : "-",
          status_kumpul: found ? "Sudah Mengumpulkan" : "Belum Mengumpulkan",
          isSubmitted: !!found,
        };
      });

      setRowsPengumpulan(merged);
    } catch (err) {
      console.error("fetchListSiswa error:", err);
    }
  };


  useEffect(() => {
    if (modulId) fetchModul();
  }, [modulId]);

  // =================== Countdown ===================
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (!startTime || !endTime) {
        setTimeLeft("");
        return;
      }

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
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, endTime]);

  // =================== Upload Handler ===================
  const handleUpload = async () => {
    if (!selectedFile) {
      ToastError.fire({ title: "Pilih file terlebih dahulu!" });
      return;
    }
    
    const allowedExt = moduleInfo.tipe_file_modul.toLowerCase();
    const fileExt = selectedFile.name.split(".").pop().toLowerCase();
    
    if (fileExt !== allowedExt) {
      ToastError.fire({
        title: `File harus bertipe ${allowedExt.toUpperCase()}!`,
      });
      return;
    }
    
    setLoadingUpload(true)
    const formData = new FormData();
    formData.append("id_modul", moduleInfo.id_modul);
    const compressedFile = await compressFile(selectedFile);
    formData.append("file_pengumpulan", compressedFile);

    try {
      const res = await createPengumpulanModul(formData);
      ToastSuccess.fire({ title: "Berhasil mengunggah file" });
      setSelectedFile(null);
      fetchModul();
    } catch (err) {
      console.error(err);
    }
    setLoadingUpload(false)
  };

  const columnsPengumpulan = [
    { field: "nis", label: "NIS", width: "150px" },
    // { field: "nisn", label: "NISN", width: "150px" },
    { field: "nama", label: "Nama", width: "300px" },
    { field: "waktu_kumpul", label: "Waktu Kumpul", width: "250px" },
    { field: "status_kumpul", label: "Status", width: "200px" },
  ];

  const currentUser = rowsPengumpulan.find((r) => r.id_user === userId);
  const currentUserStatus = currentUser?.isSubmitted ?? false;
  const isWithinTime = new Date() >= startTime && new Date() < endTime;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!moduleInfo) {
    return (
      <Typography variant="h6" align="center" mt={4}>
        Data modul tidak ditemukan
      </Typography>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" sx={{ }}>
          Detail Modul
        </Typography>
        <Button
          variant="contained"
          color="warning"
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Kembali
        </Button>
      </Box>

      {/* Status dan Countdown */}
      <Box
        sx={{
          bgcolor: currentUserStatus ? "seagreen" : "firebrick",
          color: "white",
          borderRadius: 2,
          textAlign: "center",
          p: 4,
          mb: 3,
        }}
      >
        <Typography variant="h6">
          {currentUserStatus ? "Sudah Mengumpulkan" : "Belum Mengumpulkan"}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {timeLeft}
        </Typography>

        {isWithinTime && (
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              component="label"
              sx={{ bgcolor: "white", color: "black", "&:hover": { bgcolor: "lightgray" } }}
            >
              Pilih File ({moduleInfo.tipe_file_modul})
              <input
                type="file"
                hidden
                accept={`.${moduleInfo.tipe_file_modul.toLowerCase()}`}
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
            </Button>
            <Button
              variant="outlined"
              color="warning"
              sx={{ ml: 2 }}
              disabled={!selectedFile || loadingUpload}
              loading={loadingUpload}
              onClick={handleUpload}
            >
              Upload
            </Button>

            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic" }}>
                File dipilih: {selectedFile.name}
              </Typography>
            )}
          </Box>
        )}
      </Box>

      <Grid container spacing={2}>
        {/* Info Modul */}
        <Grid item size={{ xs: 12, md: 5 }}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informasi Modul
              </Typography>
              <Box sx={{ mt: 2 }}>
                {[
                  ["Nama Modul", moduleInfo.nama_modul],
                  ["Jenis Modul", moduleInfo.jenis_modul],
                  ["Keterangan", moduleInfo.keterangan],
                  ["Sifat Pengumpulan", moduleInfo.sifat_pengumpulan],
                  ["Sifat Modul", moduleInfo.sifat_modul],
                  ["Tipe File Modul", moduleInfo.tipe_file_modul],
                  ["Status Modul", moduleInfo.status_modul],
                  [
                    "Deadline",
                    `${formatterDateTime.format(startTime)} - ${formatterDateTime.format(endTime)} WIB`,
                  ],
                ].map(([label, value], i) => (
                  <Box key={i} sx={{ display: "flex", my: 1 }}>
                    <Typography sx={{ width: "45%", fontWeight: 500 }}>{label}</Typography>
                    <Typography sx={{ width: "5%" }}>:</Typography>
                    <Typography sx={{ width: "50%" }}>{value ?? "-"}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabel Pengumpulan */}
        <Grid item size={{ xs: 12, md: 7 }}>
          <TableTemplate
            title={"Daftar Pengumpulan Siswa"}
            columns={columnsPengumpulan}
            rows={rowsPengumpulan}
            initialRowsPerPage={999}
            tableHeight={"auto"}
            isCheckbox={false}
            isUpdate={false}
            isDelete={false}
            isUpload={false}
            isCreate={false}
            isDownload={false}
            isPagination={false}
            getRowClassName={(row) =>
              row.isSubmitted ? { backgroundColor: "seagreen" } : {}
            }
          />
        </Grid>
      </Grid>
    </>
  );
}
