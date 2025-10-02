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
  Autocomplete,
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
  getAllKelas,
  createKelas,
  updateKelas,
  deleteKelas,
} from "../../services/kelasService";
import { getSimpleUsers } from "../../services/authService";

export default function MasterKelasPage() {
  const [rows, setRows] = useState([]);
  const [waliKelasList, setWaliKelasList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);

  const defaultFormValues = {
    nama_kelas: "",
    tingkat: "",
    jurusan: "",
    wali_kelas: null,
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormValues,
  });

  const columns = [
    { field: "nama_kelas", label: "Nama Kelas", width: 200, sortable: true },
    { field: "tingkat", label: "Tingkat", width: 120, sortable: true },
    { field: "jurusan", label: "Jurusan", width: 200, sortable: true },
    { field: "nama_wali_kelas", label: "Wali Kelas", width: 250 },
  ];

  // ================== FETCH DATA ==================
  const fetchData = async () => {
    try {
      const res = await getAllKelas();
      setRows(res.data);
    } catch (err) {
      console.error("Gagal fetch kelas:", err);
      ToastError.fire({ title: "Gagal mengambil data Kelas" });
    }
  };

  const fetchWaliKelas = async () => {
    try {
      const res = await getSimpleUsers("guru");
      setWaliKelasList(res.users || res);
    } catch (err) {
      console.error("Gagal fetch users:", err);
      ToastError.fire({ title: "Gagal mengambil data Wali Kelas" });
    }
  };

  useEffect(() => {
    fetchData();
    fetchWaliKelas();
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
      nama_kelas: cleanRow.nama_kelas || "",
      tingkat: cleanRow.tingkat || "",
      jurusan: cleanRow.jurusan || "",
      wali_kelas: cleanRow.wali_kelas || null, // langsung pakai ID wali_kelas
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

      // pastikan wali_kelas adalah id (number)
      cleanData.wali_kelas =
        typeof cleanData.wali_kelas === "object"
          ? cleanData.wali_kelas?.id_user
          : cleanData.wali_kelas;

      if (editMode) {
        await updateKelas(editData.id_kelas, cleanData);
        ToastSuccess.fire({ title: "Kelas berhasil diupdate" });
      } else {
        await createKelas(cleanData);
        ToastSuccess.fire({ title: "Kelas berhasil dibuat" });
      }
      reset(defaultFormValues);
      setOpenDialog(false);
      fetchData();
    } catch (err) {
      console.error("Save gagal:", err);
      ToastError.fire({ title: "Gagal menyimpan data Kelas" });
    }
  };

  // ================== DELETE ==================
  const handleDelete = async (data) => {
    const confirm = await PopupDelete.fire();
    if (confirm.isConfirmed) {
      try {
        await deleteKelas(data.id_kelas);
        ToastSuccess.fire({ title: "Kelas berhasil dihapus" });
        fetchData();
      } catch (err) {
        console.error("Delete gagal:", err);
        ToastError.fire({ title: "Gagal menghapus data Kelas" });
      }
    }
  };

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Manajemen Kelas
      </Typography>

      <Box sx={{ width: "100%" }}>
        <TableTemplate
          title="Daftar Kelas"
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
          {editMode ? "Update Kelas" : "Tambah Kelas"}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Nama Kelas"
            fullWidth
            required
            margin="normal"
            {...register("nama_kelas", { required: "Nama Kelas wajib diisi" })}
            error={!!errors.nama_kelas}
            helperText={errors.nama_kelas?.message}
          />

          <TextField
            label="Tingkat"
            fullWidth
            required
            margin="normal"
            {...register("tingkat", { required: "Tingkat wajib diisi" })}
            error={!!errors.tingkat}
            helperText={errors.tingkat?.message}
          />

          <TextField
            label="Jurusan"
            fullWidth
            required
            margin="normal"
            {...register("jurusan", { required: "Jurusan wajib diisi" })}
            error={!!errors.jurusan}
            helperText={errors.jurusan?.message}
          />

          {/* Wali Kelas pakai Autocomplete */}
          <Controller
            name="wali_kelas"
            control={control}
            rules={{ required: "Wali Kelas wajib dipilih" }}
            render={({ field }) => (
              <Autocomplete
                options={waliKelasList}
                getOptionLabel={(option) => option?.nama || ""}
                value={
                  waliKelasList.find((u) => u.id_user === field.value) || null
                }
                onChange={(_, newValue) =>
                  field.onChange(newValue ? newValue.id_user : null)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Wali Kelas"
                    margin="normal"
                    required
                    error={!!errors.wali_kelas}
                    helperText={errors.wali_kelas?.message}
                  />
                )}
              />
            )}
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
