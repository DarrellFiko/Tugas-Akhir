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
} from "@mui/material";
import { useForm } from "react-hook-form";

import TableTemplate from "../../components/tables/TableTemplate";
import {
  ToastError,
  ToastSuccess,
  PopupDelete,
  PopupEdit,
} from "../../composables/sweetalert";
import {
  getAllPelajaran,
  createPelajaran,
  updatePelajaran,
  deletePelajaran,
} from "../../services/pelajaranService";

export default function MasterPelajaranPage() {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);

  const defaultFormValues = {
    nama_pelajaran: "",
    kode_pelajaran: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormValues,
  });

  const columns = [
    { field: "nama_pelajaran", label: "Nama Pelajaran", width: 250, sortable: true },
    { field: "kode_pelajaran", label: "Kode Pelajaran", width: 200, sortable: true },
  ];

  // ================== FETCH DATA ==================
  const fetchData = async () => {
    try {
      const res = await getAllPelajaran();
      setRows(res.data);
    } catch (err) {
      console.error("Gagal fetch pelajaran:", err);
      ToastError.fire({ title: "Gagal mengambil data Pelajaran" });
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
    reset({
      nama_pelajaran: cleanRow.nama_pelajaran || "",
      kode_pelajaran: cleanRow.kode_pelajaran || "",
    });

    setOpenDialog(true);
  };

  const handleCancel = async () => {
    if (!editMode) {
      const hasChanges = Object.keys(defaultFormValues).some(
        (key) => watch(key) !== defaultFormValues[key]
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
        await updatePelajaran(editData.id_pelajaran, cleanData);
        ToastSuccess.fire({ title: "Pelajaran berhasil diupdate" });
      } else {
        await createPelajaran(cleanData);
        ToastSuccess.fire({ title: "Pelajaran berhasil dibuat" });
      }
      reset(defaultFormValues);
      setOpenDialog(false);
      fetchData();
    } catch (err) {
      console.error("Save gagal:", err);
      ToastError.fire({ title: "Gagal menyimpan data Pelajaran" });
    }
  };

  // ================== DELETE ==================
  const handleDelete = async (data) => {
    const confirm = await PopupDelete.fire();
    if (confirm.isConfirmed) {
      try {
        await deletePelajaran(data.id_pelajaran);
        ToastSuccess.fire({ title: "Pelajaran berhasil dihapus" });
        fetchData();
      } catch (err) {
        console.error("Delete gagal:", err);
        ToastError.fire({ title: "Gagal menghapus data Pelajaran" });
      }
    }
  };

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Manajemen Pelajaran
      </Typography>

      <Box sx={{ width: "100%" }}>
        <TableTemplate
          title="Daftar Pelajaran"
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
          {editMode ? "Update Pelajaran" : "Tambah Pelajaran"}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Nama Pelajaran"
            fullWidth
            required
            margin="normal"
            {...register("nama_pelajaran", { required: "Nama Pelajaran wajib diisi" })}
            error={!!errors.nama_pelajaran}
            helperText={errors.nama_pelajaran?.message}
          />

          <TextField
            label="Kode Pelajaran"
            fullWidth
            margin="normal"
            {...register("kode_pelajaran")}
            error={!!errors.kode_pelajaran}
            helperText={errors.kode_pelajaran?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Batal</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained">
            {editMode ? "Update" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
