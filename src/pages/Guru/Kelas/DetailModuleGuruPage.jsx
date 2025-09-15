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
} from "@mui/material";
import TableTemplate from "../../../components/tables/TableTemplate";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

export default function DetailModuleGuruPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  // Helper: konversi Date ke format "YYYY-MM-DDTHH:mm"
  const formatDateTimeLocal = (date) => {
    const pad = (n) => (n < 10 ? "0" + n : n);
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  };

  // Default = hari ini jam sekarang
  const now = new Date();
  const [startTime, setStartTime] = useState(now);
  const [endTime, setEndTime] = useState(
    new Date(now.getTime() + 60 * 60 * 1000)
  );

  // State countdown
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      if (now < startTime) {
        const diff = startTime - now;
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(
          `Belum mulai, akan dimulai dalam ${
            hours > 0 ? hours + " jam " : ""
          }${minutes} menit ${seconds} detik`
        );
      } else if (now >= startTime && now < endTime) {
        const diff = endTime - now;
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(
          `${hours > 0 ? hours + " jam " : ""}${minutes} menit ${seconds} detik tersisa`
        );
      } else {
        setTimeLeft("Waktu pengerjaan telah habis");
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  // Format deadline
  const formatterDateTime = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedWorkTime = `${formatterDateTime.format(
    startTime
  )} - ${formatterDateTime.format(endTime)} WIB`;

  // Data Module (editable)
  const [moduleInfo, setModuleInfo] = useState([
    { label: "Nama Module", value: "Regresi Linier Sederhana" },
    { label: "Jenis Module", value: "TUGAS" },
    { label: "Deadline", value: formattedWorkTime },
    {
      label: "Keterangan",
      value:
        "Kerjakan 2 soal regresi linier sederhana dg masing-masing 4 pertanyaan",
    },
    { label: "Sifat Pengumpulan", value: "Online" },
    { label: "Sifat Module", value: "Perorangan" },
    { label: "Tipe File Module", value: "pdf" },
    { label: "Status Module", value: "Aktif" },
    { label: "Total Module Terkumpul", value: "26 / 31" },
  ]);

  // Edit dialog
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [errors, setErrors] = useState({}); // <- error state

  const handleOpenEdit = () => {
    const obj = {};
    moduleInfo.forEach((m) => {
      obj[m.label] = m.value;
    });
    setEditData(obj);
    setOpenEdit(true);
  };

  const handleSaveEdit = () => {
    const newErrors = {};

    // Validasi wajib diisi
    if (!editData["Nama Module"]?.trim()) {
      newErrors["Nama Module"] = "Nama module wajib diisi";
    }
    if (!editData["Jenis Module"]?.trim()) {
      newErrors["Jenis Module"] = "Jenis module wajib diisi";
    }
    if (!startTime || !endTime) {
      newErrors["Deadline"] = "Deadline wajib diisi";
    }

    // Validasi start <= end
    if (startTime > endTime) {
      newErrors["Deadline"] = "Start date tidak boleh lebih dari End date";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // stop simpan
    }

    setErrors({});

    const updated = moduleInfo.map((m) => {
      if (m.label === "Deadline") {
        return {
          ...m,
          value: `${formatterDateTime.format(startTime)} - ${formatterDateTime.format(
            endTime
          )} WIB`,
        };
      }
      return { ...m, value: editData[m.label] };
    });
    setModuleInfo(updated);
    setOpenEdit(false);
  };

  const columnsPengumpulan = [
    { field: "nrp", label: "NRP", width: "150px" },
    { field: "nama", label: "Nama", width: "350px" },
    { field: "waktu", label: "Waktu kumpul", width: "250px" },
  ];

  const rowsPengumpulan = [
    {
      id: 1,
      no: 1,
      nrp: "218116674",
      nama: "ALEXANDER GABRIEL EVAN",
      waktu: "-",
      statusKumpul: false,
    },
    {
      id: 2,
      no: 2,
      nrp: "220116897",
      nama: "WILLIAM TJANDRA",
      waktu: "-",
      statusKumpul: false,
    },
    {
      id: 3,
      no: 3,
      nrp: "221116935",
      nama: "ALDI AFENDIYANTO",
      waktu: "14 May 2023 21:30:10",
      statusKumpul: true,
    },
  ];

  // Status global (semua sudah kumpul atau belum)
  const semuaSudah = rowsPengumpulan.every((r) => r.statusKumpul);

  // Simulasi download semua file
  const handleDownloadAll = () => {
    console.log("Download semua file...");
    alert("Download semua file dimulai!");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          Detail Module
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

      {/* Input Start & End Date */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Start Date"
          type="datetime-local"
          value={formatDateTimeLocal(startTime)}
          onChange={(e) => {
            const newStart = new Date(e.target.value);
            setStartTime(newStart);
            if (newStart > endTime) {
              setErrors((prev) => ({
                ...prev,
                Deadline: "Start date tidak boleh lebih dari End date",
              }));
            } else {
              setErrors((prev) => ({ ...prev, Deadline: undefined }));
            }
          }}
          InputLabelProps={{ shrink: true }}
          inputProps={{
            onFocus: (e) => e.target.showPicker?.(),
          }}
          error={!!errors["Deadline"]}
          helperText={errors["Deadline"]}
        />
        <TextField
          label="End Date"
          type="datetime-local"
          value={formatDateTimeLocal(endTime)}
          onChange={(e) => {
            const newEnd = new Date(e.target.value);
            setEndTime(newEnd);
            if (startTime > newEnd) {
              setErrors((prev) => ({
                ...prev,
                Deadline: "End date tidak boleh kurang dari Start date",
              }));
            } else {
              setErrors((prev) => ({ ...prev, Deadline: undefined }));
            }
          }}
          InputLabelProps={{ shrink: true }}
          inputProps={{
            onFocus: (e) => e.target.showPicker?.(),
          }}
          error={!!errors["Deadline"]}
          helperText={errors["Deadline"]}
        />
      </Box>

      {/* === Banner Status === */}
      <Box
        sx={{
          bgcolor: semuaSudah ? "seagreen" : "firebrick",
          color: "white",
          borderRadius: 2,
          textAlign: "center",
          p: 4,
          mb: 3,
          boxShadow: 2,
        }}
      >
        <Typography variant="body1" fontWeight={500}>
          Status
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {semuaSudah ? "Sudah Mengumpulkan Semua" : "Belum Mengumpulkan Semua"}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadAll}
          sx={{ mt: 2 }}
        >
          Download Semua File
        </Button>
        {/* Countdown */}
        <Typography variant="body2" sx={{ mt: 2 }}>
          {timeLeft}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {/* Info Module */}
        <Grid item size={{ xs: 12, md: 5 }}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Informasi Module
                </Typography>
                <Button variant="outlined" size="small" onClick={handleOpenEdit}>
                  Edit
                </Button>
              </Box>

              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}
              >
                {moduleInfo.map((row, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      gap: 1,
                      my: 1,
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ width: "45%", fontWeight: 500 }}
                    >
                      {row.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ width: "5%" }}
                    >
                      :
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ width: "55%" }}
                    >
                      {row.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Table Pengumpulan */}
        <Grid item size={{ xs: 12, md: 7 }}>
          <TableTemplate
            key={"pengumpulan"}
            title={"Daftar Pengumpulan"}
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
              row.statusKumpul ? "highlight-row" : ""
            }
          />
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Informasi Module</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {Object.keys(editData).map((key, idx) => {
              if (key === "Deadline") {
                return (
                  <Grid container spacing={2}>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Start Date"
                        type="datetime-local"
                        value={formatDateTimeLocal(startTime)}
                        onChange={(e) => {
                          const newStart = new Date(e.target.value);
                          setStartTime(newStart);
                          if (newStart > endTime) {
                            setErrors((prev) => ({
                              ...prev,
                              Deadline: "Start date tidak boleh lebih dari End date",
                            }));
                          } else {
                            setErrors((prev) => ({ ...prev, Deadline: undefined }));
                          }
                        }}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ onFocus: (e) => e.target.showPicker?.() }}
                        fullWidth
                        size="small"
                        error={!!errors["Deadline"]}
                        helperText={errors["Deadline"]}
                      />
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="End Date"
                        type="datetime-local"
                        value={formatDateTimeLocal(endTime)}
                        onChange={(e) => {
                          const newEnd = new Date(e.target.value);
                          setEndTime(newEnd);
                          if (startTime > newEnd) {
                            setErrors((prev) => ({
                              ...prev,
                              Deadline: "End date tidak boleh kurang dari Start date",
                            }));
                          } else {
                            setErrors((prev) => ({ ...prev, Deadline: undefined }));
                          }
                        }}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ onFocus: (e) => e.target.showPicker?.() }}
                        fullWidth
                        size="small"
                        error={!!errors["Deadline"]}
                        helperText={errors["Deadline"]}
                      />
                    </Grid>
                  </Grid>
                );
              }

              // non-editable fields
              if (
                key === "Sifat Pengumpulan" ||
                key === "Status Module" ||
                key === "Total Module Terkumpul"
              ) {
                return (
                  <TextField
                    key={idx}
                    label={key}
                    value={editData[key]}
                    fullWidth
                    size="small"
                    disabled
                  />
                );
              }

              return (
                <TextField
                  key={idx}
                  label={key}
                  value={editData[key]}
                  onChange={(e) =>
                    setEditData({ ...editData, [key]: e.target.value })
                  }
                  fullWidth
                  size="small"
                  error={!!errors[key]}
                  helperText={errors[key]}
                />
              );
            })}
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
          .highlight-row {
            background-color: seagreen !important;
          }
          /* Kalender popup bawaan datetime-local */
          input[type="datetime-local"]::-webkit-calendar-picker-indicator {
            filter: ${theme.palette.mode === "dark"
              ? "invert(1)"
              : "invert(0)"};
          }
          input[type="datetime-local"] {
            color-scheme: ${theme.palette.mode};
          }
        `}
      </style>
    </>
  );
}
