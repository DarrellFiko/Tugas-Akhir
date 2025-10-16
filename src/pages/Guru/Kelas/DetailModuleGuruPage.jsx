// src/pages/classes/guru/DetailModuleGuruPage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import TableTemplate from "../../../components/tables/TableTemplate";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { getModulById, updateModul } from "../../../services/modulService";
import { getListSiswaByKelasTahunAjaran } from "../../../services/kelasSiswaService";
import { ToastSuccess, ToastError } from "../../../composables/sweetalert";
import { downloadPengumpulanModulZip } from "../../../services/pengumpulanModulService";

export default function DetailModuleGuruPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { modulId } = useParams();
  const userId = parseInt(localStorage.getItem("id_user"));

  const [loading, setLoading] = useState(true);
  const [moduleInfo, setModuleInfo] = useState(null);
  const [rowsPengumpulan, setRowsPengumpulan] = useState([]);
  const [errors, setErrors] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState("");

  // =================== Helper ===================
  const formatDateTimeLocal = (date) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n) => (n < 10 ? "0" + n : n);
    return (
      d.getFullYear() +
      "-" +
      pad(d.getMonth() + 1) +
      "-" +
      pad(d.getDate()) +
      "T" +
      pad(d.getHours()) +
      ":" +
      pad(d.getMinutes())
    );
  };

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

      if(payload.id_created_by !== userId) {
        navigate(-1);
        return;
      }

      const rawStart = payload.start_date ?? null;
      const rawEnd = payload.end_date ?? null;
      const parsedStart = rawStart ? new Date(rawStart) : new Date();
      const parsedEnd = rawEnd ? new Date(rawEnd) : new Date(parsedStart.getTime() + 60 * 60 * 1000);

      setModuleInfo({
        id_modul: payload.id_modul,
        id_kelas_tahun_ajaran: payload.id_kelas_tahun_ajaran,
        nama_modul: payload.nama_modul ?? "",
        jenis_modul: payload.jenis_modul ?? "",
        keterangan: payload.keterangan ?? "",
        sifat_pengumpulan: payload.sifat_pengumpulan ?? "Online",
        sifat_modul: payload.status_modul ?? "Perorangan",
        tipe_file_modul: payload.tipe_file_modul ?? "PDF",
        status_modul: payload.status_modul ?? "Perorangan",
        start_date: parsedStart,
        end_date: parsedEnd,
      });

      setStartTime(parsedStart);
      setEndTime(parsedEnd);

      // simpan data pengumpulan mentah untuk merge nanti
      const pengumpulan = payload.pengumpulan ?? [];
      await fetchListSiswa(payload.id_kelas_tahun_ajaran, pengumpulan);
    } catch (err) {
      console.error("fetchModul error:", err);
      ToastError.fire({ title: "Gagal memuat data modul" });
      setModuleInfo(null);
    } finally {
      setLoading(false);
    }
  };

  // =================== Fetch Siswa + Merge Pengumpulan ===================
  const fetchListSiswa = async (idKelasTahunAjaran, pengumpulan) => {
    if (!idKelasTahunAjaran) return;
    try {
      const res = await getListSiswaByKelasTahunAjaran(idKelasTahunAjaran);
      const siswaList = res?.data || [];

      // merge siswa + pengumpulan (pakai id_user)
      const merged = siswaList.map((s) => {
        const found = pengumpulan.find((p) => p.id_siswa === s.id_user);
        return {
          id_user: s.id_user,
          nis: s.nis ?? "-",
          nisn: s.nisn ?? "-",
          nama: s.nama ?? "-",
          waktu_kumpul: found?.created_at
            ? formatterDateTime.format(new Date(found.created_at))
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

  // =================== Edit Handler ===================
  const handleOpenEdit = () => {
    if (!moduleInfo) return;
    setEditData({ ...moduleInfo });
    setOpenEdit(true);
  };

  const handleSaveEdit = async () => {
    const newErrors = {};
    if (!editData.nama_modul?.trim()) newErrors.nama_modul = "Nama modul wajib diisi";
    if (!editData.jenis_modul?.trim()) newErrors.jenis_modul = "Jenis modul wajib diisi";
    if (startTime > endTime) newErrors.deadline = "Waktu mulai tidak boleh lebih dari waktu selesai";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        nama_modul: editData.nama_modul,
        jenis_modul: editData.jenis_modul,
        keterangan: editData.keterangan,
        sifat_pengumpulan: editData.sifat_pengumpulan,
        sifat_modul: editData.sifat_modul,
        tipe_file_modul: editData.tipe_file_modul,
        status_modul: editData.status_modul,
        start_date: startTime.toISOString(),
        end_date: endTime.toISOString(),
      };
      await updateModul(modulId, payload);
      ToastSuccess.fire({ title: "Modul berhasil diperbarui!" });
      setOpenEdit(false);
      fetchModul();
    } catch (err) {
      console.error("updateModul error:", err);
      ToastError.fire({ title: "Gagal memperbarui modul" });
    }
  };

  // =================== Table Config ===================
  const columnsPengumpulan = [
    { field: "nis", label: "NIS", width: "150px" },
    { field: "nama", label: "Nama", width: "300px" },
    { field: "waktu_kumpul", label: "Waktu Kumpul", width: "250px" },
    { field: "status_kumpul", label: "Status", width: "200px" },
  ];

  const semuaSudah =
    rowsPengumpulan.length > 0 &&
    rowsPengumpulan.every((r) => r.isSubmitted === true);

  // =================== UI ===================
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
        <Typography variant="h4" sx={{ mb: 3 }}>
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
          bgcolor: semuaSudah ? "seagreen" : "firebrick",
          color: "white",
          borderRadius: 2,
          textAlign: "center",
          p: 4,
          mb: 3,
        }}
      >
        <Typography variant="h6">
          {semuaSudah ? "Semua Siswa Sudah Mengumpulkan" : "Masih Ada yang Belum Mengumpulkan"}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {timeLeft}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => downloadPengumpulanModulZip(modulId)}
        >
          Download Semua Pengumpulan (ZIP)
        </Button>
      </Box>

      <Grid container spacing={2}>
        {/* Info Modul */}
        <Grid item size={{ xs: 12, md: 5 }}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Informasi Modul</Typography>
                <Button variant="outlined" size="small" onClick={handleOpenEdit}>
                  Edit
                </Button>
              </Box>

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

      {/* Dialog Edit */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Modul</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Nama Modul"
              value={editData.nama_modul || ""}
              onChange={(e) => setEditData({ ...editData, nama_modul: e.target.value })}
              fullWidth
              size="small"
              error={!!errors.nama_modul}
              helperText={errors.nama_modul}
            />
            <TextField
              label="Jenis Modul"
              value={editData.jenis_modul || ""}
              onChange={(e) => setEditData({ ...editData, jenis_modul: e.target.value })}
              fullWidth
              size="small"
              error={!!errors.jenis_modul}
              helperText={errors.jenis_modul}
            />
            <TextField
              label="Keterangan"
              value={editData.keterangan || ""}
              onChange={(e) => setEditData({ ...editData, keterangan: e.target.value })}
              fullWidth
              size="small"
              multiline
              rows={3}
            />
            <TextField
              select
              label="Tipe File Modul"
              value={editData.tipe_file_modul || "PDF"}
              onChange={(e) => setEditData({ ...editData, tipe_file_modul: e.target.value })}
              fullWidth
              size="small"
            >
              <MenuItem value="PDF">PDF</MenuItem>
              <MenuItem value="PPT">PPT</MenuItem>
              <MenuItem value="Word">Word</MenuItem>
            </TextField>

            <TextField
              label="Start Date"
              type="datetime-local"
              value={formatDateTimeLocal(startTime)}
              onChange={(e) => {
                const d = new Date(e.target.value);
                if (!Number.isNaN(d.getTime())) setStartTime(d);
              }}
              fullWidth
              size="small"
            />
            <TextField
              label="End Date"
              type="datetime-local"
              value={formatDateTimeLocal(endTime)}
              onChange={(e) => {
                const d = new Date(e.target.value);
                if (!Number.isNaN(d.getTime())) setEndTime(d);
              }}
              fullWidth
              size="small"
            />
            {errors.deadline && (
              <Typography color="error" variant="body2">
                {errors.deadline}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Batal</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      <style>
        {`
          input[type="datetime-local"]::-webkit-calendar-picker-indicator {
            filter: ${theme.palette.mode === "dark" ? "invert(1)" : "invert(0)"};
          }
          input[type="datetime-local"] {
            color-scheme: ${theme.palette.mode};
          }
        `}
      </style>
    </>
  );
}
