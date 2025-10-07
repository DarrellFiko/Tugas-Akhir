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
  CircularProgress,
  Backdrop,
  useTheme,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

import TableTemplate from "../../components/tables/TableTemplate";
import {
  ToastSuccess,
  ToastError,
  PopupDelete,
  PopupEdit,
} from "../../composables/sweetalert";

import {
  createJadwal,
  getAllJadwal,
  updateJadwal,
  deleteJadwal,
} from "../../services/jadwalPelajaranService";
import { getAllKelasTahunAjaran } from "../../services/kelasTahunAjaranService";

export default function MasterJadwalPage() {
  const [rows, setRows] = useState([]);
  const [ktaList, setKtaList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const defaultFormValues = {
    id_kelas_tahun_ajaran: null,
    hari: "",
    jam_mulai: "",
    jam_selesai: "",
  };

  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormValues,
  });

  const columns = [
    {
      field: "TahunAjaran",
      label: "Tahun Ajaran",
      width: 200,
      render: (row) => row?.nama || "-",
      sortable: true,
    },
    {
      field: "Kelas",
      label: "Kelas",
      width: 200,
      render: (row) => row?.nama_kelas || "-",
      sortable: true,
    },
    {
      field: "Pelajaran",
      label: "Pelajaran",
      width: 200,
      render: (row) => row?.nama_pelajaran || "-",
      sortable: true,
    },
    {
      field: "GuruPengampu",
      label: "Guru Pengampu",
      width: 250,
      render: (row) => row.nama || "-",
      sortable: true,
    },
    { field: "hari", label: "Hari", width: 150, sortable: true },
    { field: "jam_mulai", label: "Jam Mulai", width: 150, sortable: true },
    { field: "jam_selesai", label: "Jam Selesai", width: 150, sortable: true },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllJadwal();
      setRows(res.data || []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const res = await getAllKelasTahunAjaran();
      setKtaList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchOptions();
  }, []);

  const openCreateDialog = () => {
    reset(defaultFormValues);
    setEditMode(false);
    setEditData(null);
    setOpenDialog(true);
  };

  const openUpdateDialog = (row) => {
    setEditMode(true);
    setEditData(row);
    reset({
      id_kelas_tahun_ajaran: row.id_kelas_tahun_ajaran,
      hari: row.hari,
      jam_mulai: row.jam_mulai,
      jam_selesai: row.jam_selesai,
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

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (editMode) {
        await updateJadwal(editData.id_jadwal, data);
        ToastSuccess.fire({ title: "Jadwal berhasil diupdate" });
      } else {
        await createJadwal(data);
        ToastSuccess.fire({ title: "Jadwal berhasil dibuat" });
      }
      reset(defaultFormValues);
      setOpenDialog(false);
      fetchData();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (data) => {
    const confirm = await PopupDelete.fire();
    if (confirm.isConfirmed) {
      setLoading(true);
      try {
        await deleteJadwal(data.id_jadwal);
        ToastSuccess.fire({ title: "Jadwal berhasil dihapus" });
        fetchData();
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Backdrop open={loading} sx={{ zIndex: 2000 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Typography variant="h4" sx={{ mb: 1 }}>
        Jadwal Belajar
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Halaman ini digunakan untuk mengatur jadwal pelajaran tiap kelas dalam periode tertentu.
      </Typography>

      <Box sx={{ width: "100%" }}>
        <TableTemplate
          title="Daftar Jadwal Belajar"
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

      <Dialog open={openDialog} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>{editMode ? "Update Jadwal" : "Tambah Jadwal"}</DialogTitle>
        <DialogContent dividers>
          <Controller
            name="id_kelas_tahun_ajaran"
            control={control}
            rules={{ required: "Kelas-Tahun Ajaran wajib dipilih" }}
            render={({ field }) => (
              <Autocomplete
                options={ktaList}
                getOptionLabel={(option) =>
                  option
                    ? `${option.Pelajaran?.nama_pelajaran || "-"} - ${option.Kelas?.nama_kelas || "-"} (${option.TahunAjaran?.nama || "-"})`
                    : ""
                }
                value={ktaList.find((k) => k.id_kelas_tahun_ajaran === field.value) || null}
                onChange={(_, newValue) =>
                  field.onChange(newValue ? newValue.id_kelas_tahun_ajaran : null)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Kelas - Tahun Ajaran"
                    margin="normal"
                    required
                    error={!!errors.id_kelas_tahun_ajaran}
                    helperText={errors.id_kelas_tahun_ajaran?.message}
                  />
                )}
              />
            )}
          />

          <Controller
            name="hari"
            control={control}
            rules={{ required: "Hari wajib dipilih" }}
            render={({ field }) => (
              <Autocomplete
                options={["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]}
                value={field.value || null}
                onChange={(_, newValue) => field.onChange(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Hari"
                    margin="normal"
                    required
                    error={!!errors.hari}
                    helperText={errors.hari?.message}
                  />
                )}
              />
            )}
          />

          <Controller
            name="jam_mulai"
            control={control}
            rules={{
              required: "Jam mulai wajib diisi",
              validate: (value) => {
                const jamSelesai = watch("jam_selesai");
                if (jamSelesai && value >= jamSelesai) {
                  return "Jam mulai harus lebih kecil dari jam selesai";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                type="time"
                label="Jam Mulai"
                margin="normal"
                fullWidth
                required
                error={!!errors.jam_mulai}
                helperText={errors.jam_mulai?.message}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  style: { colorScheme: theme.palette.mode },
                }}
                onFocus={(e) => e.target.showPicker()}
                onClick={(e) => e.target.showPicker()}
              />
            )}
          />

          <Controller
            name="jam_selesai"
            control={control}
            rules={{
              required: "Jam selesai wajib diisi",
              validate: (value) => {
                const jamMulai = watch("jam_mulai");
                if (jamMulai && value <= jamMulai) {
                  return "Jam selesai harus lebih besar dari jam mulai";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                type="time"
                label="Jam Selesai"
                margin="normal"
                fullWidth
                required
                error={!!errors.jam_selesai}
                helperText={errors.jam_selesai?.message}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  style: { colorScheme: theme.palette.mode },
                }}
                onFocus={(e) => e.target.showPicker()}
                onClick={(e) => e.target.showPicker()}
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
