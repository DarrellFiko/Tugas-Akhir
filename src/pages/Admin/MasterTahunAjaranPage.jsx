import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  useTheme,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

import TableTemplate from "../../components/tables/TableTemplate";
import {
  ToastError,
  ToastSuccess,
  PopupDelete,
  PopupEdit,
} from "../../composables/sweetalert";
import {
  getAllTahunAjaran,
  createTahunAjaran,
  updateTahunAjaran,
  deleteTahunAjaran,
} from "../../services/tahunAjaranService";
import { formatDate } from "../../utils/utils";

export default function MasterTahunAjaranPage() {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const theme = useTheme();

  const defaultFormValues = {
    nama: "",
    semester: "",
    start_date: "",
    end_date: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormValues,
  });

  const watchAllFields = watch();

  const startDate = watch("start_date");
  const endDate = watch("end_date");

  const columns = [
    { field: "nama", label: "Nama", width: 200, sortable: true },
    { field: "semester", label: "Semester", width: 150, sortable: true },
    {
      field: "start_date",
      label: "Tanggal Mulai",
      width: 180,
      sortable: true,
      render: (value) => <div>{formatDate(value, "DD-MMMM-yyyy")}</div>,
    },
    {
      field: "end_date",
      label: "Tanggal Selesai",
      width: 180,
      sortable: true,
      render: (value) => <div>{formatDate(value, "DD-MMMM-yyyy")}</div>,
    },
  ];

  // ================== FETCH DATA ==================
  const fetchData = async () => {
    try {
      const res = await getAllTahunAjaran();
      setRows(res.tahunAjaran || res);
    } catch (err) {
      console.error("Gagal fetch tahun ajaran:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================== HANDLE DIALOG ==================
  const openCreateDialog = () => {
    reset(defaultFormValues);
    setEditMode(false);
    setEditData(null);
    setOpenDialog(true);
  };

  const openUpdateDialog = (row) => {
    setEditMode(true);
    setEditData(row);

    const { created_at, updated_at, deleted_at, ...cleanRow } = row;

    const formattedRow = {
      ...cleanRow,
      start_date: cleanRow.start_date
        ? new Date(cleanRow.start_date).toISOString().split("T")[0]
        : "",
      end_date: cleanRow.end_date
        ? new Date(cleanRow.end_date).toISOString().split("T")[0]
        : "",
      semester: cleanRow.semester || "",
    };

    reset(formattedRow);
    setOpenDialog(true);
  };

  const handleCancel = async () => {
    if (!editMode) {
      // Check if ada perubahan dari default
      const hasChanges = Object.keys(defaultFormValues).some(
        (key) => watchAllFields[key] !== defaultFormValues[key]
      );
      if (hasChanges) {
        const confirmClose = await PopupEdit.fire({
          title: "Batalkan?",
          text: "Data sudah diisi sebagian. Yakin ingin membatalkan?",
        });
        if (!confirmClose.isConfirmed) return;
      }
    }
    reset(defaultFormValues);
    setOpenDialog(false);
  };

  // ================== SAVE ==================
  const onSubmit = async (data) => {
    try {
      const { created_at, updated_at, deleted_at, ...cleanData } = data;
      if (editMode) {
        await updateTahunAjaran(editData.id_tahun_ajaran, cleanData);
        ToastSuccess.fire({ title: "Tahun Ajaran berhasil diupdate" });
      } else {
        await createTahunAjaran(cleanData);
        ToastSuccess.fire({ title: "Tahun Ajaran berhasil dibuat" });
      }
      reset(defaultFormValues);
      setOpenDialog(false);
      fetchData();
    } catch (err) {
      console.error("Save gagal:", err);
    }
  };

  // ================== DELETE ==================
  const handleDelete = async (data) => {
    const confirm = await PopupDelete.fire();
    if (confirm.isConfirmed) {
      try {
        await deleteTahunAjaran(data.id_tahun_ajaran);
        ToastSuccess.fire({ title: "Tahun Ajaran berhasil dihapus" });
        fetchData();
      } catch (err) {
        console.error("Delete gagal:", err);
      }
    }
  };

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Manajemen Tahun Ajaran
      </Typography>

      <Box sx={{ width: "100%" }}>
        <TableTemplate
          title="Daftar Tahun Ajaran"
          columns={columns}
          rows={rows}
          initialRowsPerPage={10}
          isUpdate
          isDelete
          isUpload={false}
          isDownload={false}
          onCreate={openCreateDialog}
          onUpdate={openUpdateDialog}
          onDelete={handleDelete}
        />
      </Box>

      {/* ===== Dialog Form ===== */}
      <Dialog open={openDialog} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>
          {editMode ? "Update Tahun Ajaran" : "Tambah Tahun Ajaran"}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Nama"
            fullWidth
            required
            margin="normal"
            {...register("nama", { required: "Nama wajib diisi" })}
            error={!!errors.nama}
            helperText={errors.nama?.message}
          />

          {/* Semester pakai Controller supaya default value muncul */}
          <Controller
            name="semester"
            control={control}
            rules={{ required: "Semester wajib dipilih" }}
            render={({ field }) => (
              <TextField
                label="Semester"
                fullWidth
                required
                margin="normal"
                select
                {...field}
                error={!!errors.semester}
                helperText={errors.semester?.message}
              >
                <MenuItem value="Ganjil">Ganjil</MenuItem>
                <MenuItem value="Genap">Genap</MenuItem>
              </TextField>
            )}
          />

          <TextField
            label="Tanggal Mulai"
            type="date"
            fullWidth
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
            onFocus={(e) => e.target.showPicker && e.target.showPicker()}
            {...register("start_date", {
              required: "Tanggal Mulai wajib diisi",
              validate: (value) =>
                !endDate ||
                value <= endDate ||
                "Tanggal Mulai tidak boleh lebih besar dari Tanggal Selesai",
            })}
            error={!!errors.start_date}
            helperText={errors.start_date?.message}
          />

          <TextField
            label="Tanggal Selesai"
            type="date"
            fullWidth
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
            onFocus={(e) => e.target.showPicker && e.target.showPicker()}
            {...register("end_date", {
              required: "Tanggal Selesai wajib diisi",
              validate: (value) =>
                !startDate ||
                value >= startDate ||
                "Tanggal Selesai tidak boleh lebih kecil dari Tanggal Mulai",
            })}
            error={!!errors.end_date}
            helperText={errors.end_date?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Batal</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained">
            {editMode ? "Update" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>

      <style>
        {`
          input[type="date"]::-webkit-calendar-picker-indicator {
            filter: ${theme.palette.mode === "dark" ? "invert(1)" : "invert(0)"};
          }
          input[type="date"] {
            color-scheme: ${theme.palette.mode};
          }
        `}
      </style>
    </>
  );
}
