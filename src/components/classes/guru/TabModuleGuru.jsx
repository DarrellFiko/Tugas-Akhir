import { useState } from "react";
import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  MenuItem,
  Grid,
  useTheme,
} from "@mui/material";
import TableTemplate from "../../tables/TableTemplate";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useNavigate } from "react-router-dom";
import { PopupEdit } from "../../../composables/sweetalert";

export default function TabModuleGuru() {
  const navigate = useNavigate();
  const theme = useTheme();

  const initialForm = {
    namaModule: "",
    jenisModule: "",
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 60 * 60 * 1000),
    keterangan: "",
    sifat: "Online",
    status: "Perorangan",
    type: "PDF"
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Helper format datetime-local
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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    const newErrors = {};
    if (!formData.namaModule.trim()) {
      newErrors.namaModule = "Nama module wajib diisi";
    }
    if (!formData.jenisModule.trim()) {
      newErrors.jenisModule = "Jenis module wajib diisi";
    }
    if (formData.startTime > formData.endTime) {
      newErrors.deadline = "Start date tidak boleh lebih dari End date";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    console.log("Module baru:", formData);

    // reset state
    setFormData(initialForm);
    setIsDirty(false);
    setOpenDialog(false);
  };

  const handleClose = async () => {
    if (isDirty) {
      const confirmClose = await PopupEdit.fire({
        title: "Cancel Create Data?",
        text: "Data sudah diisi sebagian. Yakin ingin membatalkan?",
      });
      if (!confirmClose.isConfirmed) return;
    }
    setFormData(initialForm);
    setIsDirty(false);
    setErrors({});
    setOpenDialog(false);
  };

  const columnsModule = [
    { field: "namaModule", label: "Nama Module", width: "250px" },
    { field: "jenisModule", label: "Jenis Module", width: "120px" },
    { field: "sifat", label: "Sifat", width: "100px" },
    { field: "deadline", label: "Deadline", width: "250px" },
    { field: "status", label: "Status", width: "120px" },
    {
      field: "banyakPengumpulan",
      label: "Banyak Pengumpulan",
      width: "150px",
    },
    {
      field: "action",
      label: "Action",
      width: "100px",
      align: "center",
      render: (value, row) => (
        <IconButton
          onClick={() => navigate(`/kelas/detail/${row.id}/module/${row.id}`)}
        >
          <InfoOutlinedIcon color="primary" />
        </IconButton>
      ),
    },
  ];

  const rowsModule = [
    {
      id: 1,
      namaModule: "Regresi Linier Sederhana",
      jenisModule: "TUGAS",
      sifat: "Online",
      deadline: "2023-05-08 10:00:00 s/d 2023-05-15 08:00:00",
      status: "Perorangan",
      banyakPengumpulan: "26 / 31",
    },
    {
      id: 2,
      namaModule: "Tugas 2 Soal UTS",
      jenisModule: "TUGAS",
      sifat: "Online",
      deadline: "2023-02-27 08:06:00 s/d 2023-03-06 10:30:00",
      status: "Perorangan",
      banyakPengumpulan: "29 / 31",
    },
  ];

  return (
    <>
      <TableTemplate
        key={"modul"}
        title={"Modul"}
        columns={columnsModule}
        rows={rowsModule}
        initialRowsPerPage={10}
        tableHeight={400}
        isCheckbox={false}
        isUpdate={false}
        isDelete={false}
        isUpload={false}
        isDownload={false}
        onCreate={() => setOpenDialog(true)}
      />

      {/* Dialog Buat Module */}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Buat Module</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Nama Module"
              value={formData.namaModule}
              onChange={(e) => handleChange("namaModule", e.target.value)}
              fullWidth
              size="small"
              error={!!errors.namaModule}
              helperText={errors.namaModule}
            />
            <TextField
              label="Jenis Module"
              value={formData.jenisModule}
              onChange={(e) => handleChange("jenisModule", e.target.value)}
              fullWidth
              size="small"
              error={!!errors.jenisModule}
              helperText={errors.jenisModule}
            />
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Start Date"
                  type="datetime-local"
                  value={formatDateTimeLocal(formData.startTime)}
                  onChange={(e) =>
                    handleChange("startTime", new Date(e.target.value))
                  }
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  size="small"
                  error={!!errors.deadline}
                  helperText={errors.deadline}
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="End Date"
                  type="datetime-local"
                  value={formatDateTimeLocal(formData.endTime)}
                  onChange={(e) =>
                    handleChange("endTime", new Date(e.target.value))
                  }
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  size="small"
                  error={!!errors.deadline}
                  helperText={errors.deadline}
                />
              </Grid>
            </Grid>
            <TextField
              label="Keterangan"
              value={formData.keterangan}
              onChange={(e) => handleChange("keterangan", e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={3}
            />
            <TextField
              label="Tipe File Modul"
              value={formData.type}
              fullWidth
              size="small"
            />
            <TextField
              label="Sifat Pengumpulan"
              value={formData.sifat}
              fullWidth
              size="small"
              disabled
            />
            <TextField
              select
              label="Status Module"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="Perorangan">Perorangan</MenuItem>
              <MenuItem value="Kelompok">Kelompok</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
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
