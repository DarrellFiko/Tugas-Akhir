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
  getAllKelasTahunAjaran,
  createKelasTahunAjaran,
  updateKelasTahunAjaran,
  deleteKelasTahunAjaran,
} from "../../services/kelasTahunAjaranService";
import { getSimpleUsers } from "../../services/authService";
import { getSimpleTahunAjaran } from "../../services/tahunAjaranService";
import { getSimpleKelas } from "../../services/kelasService";
import { getSimplePelajaran } from "../../services/pelajaranService";

export default function MasterPeriodePelajaranPage() {
  const [rows, setRows] = useState([]);
  const [tahunAjaranList, setTahunAjaranList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [pelajaranList, setPelajaranList] = useState([]);
  const [guruList, setGuruList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [optionLoading, setOptionLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);

  const defaultFormValues = {
    id_tahun_ajaran: null,
    id_kelas: null,
    id_pelajaran: null,
    guru_pengampu: null,
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
    { field: "nama_tahun_ajaran", label: "Tahun Ajaran", width: 200, sortable: true },
    { field: "nama_kelas", label: "Kelas", width: 200, sortable: true },
    { field: "nama_pelajaran", label: "Pelajaran", width: 200, sortable: true },
    { field: "nama_guru_pengampu", label: "Guru Pengampu", width: 250, sortable: true },
  ];

  const transformRows = (data) => {
    return (data || []).map((item) => ({
      id_kelas_tahun_ajaran: item.id_kelas_tahun_ajaran,
      id_tahun_ajaran: item.id_tahun_ajaran,
      id_kelas: item.id_kelas,
      id_pelajaran: item.id_pelajaran,
      guru_pengampu: item.guru_pengampu,
      created_at: item.created_at,
      updated_at: item.updated_at,
      deleted_at: item.deleted_at,
      nama_tahun_ajaran: item.TahunAjaran?.nama || "-",
      nama_kelas: item.Kelas?.nama_kelas || "-",
      nama_pelajaran: item.Pelajaran?.nama_pelajaran || "-",
      nama_guru_pengampu: item.GuruPengampu?.nama || "-",
    }));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllKelasTahunAjaran();
      setRows(transformRows(res.data || []));
    } catch (err) {
      console.error("Gagal fetch data:", err);
    }
    setLoading(false);
  };


  const fetchOptions = async () => {
    setOptionLoading(true);
    try {
      const tahunRes = await getSimpleTahunAjaran();
      setTahunAjaranList(Array.isArray(tahunRes.data) ? tahunRes.data : []);

      const kelasRes = await getSimpleKelas();
      setKelasList(Array.isArray(kelasRes.data?.data) ? kelasRes.data.data : []);

      const pelajaranRes = await getSimplePelajaran();
      setPelajaranList(Array.isArray(pelajaranRes.data?.data) ? pelajaranRes.data.data : []);

      const guruRes = await getSimpleUsers("guru");
      setGuruList(Array.isArray(guruRes.data) ? guruRes.data : []);
    } catch (err) {
      console.error("Gagal fetch options:", err);
      ToastError.fire({ title: "Gagal mengambil data dropdown" });
    }
    setOptionLoading(false);
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
      id_tahun_ajaran: row.id_tahun_ajaran,
      id_kelas: row.id_kelas,
      id_pelajaran: row.id_pelajaran,
      guru_pengampu: row.guru_pengampu,
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
    setSubmitLoading(true);
    try {
      if (editMode) {
        await updateKelasTahunAjaran(editData.id_kelas_tahun_ajaran, data);
        ToastSuccess.fire({ title: "Data berhasil diupdate" });
      } else {
        await createKelasTahunAjaran(data);
        ToastSuccess.fire({ title: "Data berhasil dibuat" });
      }
      reset(defaultFormValues);
      setOpenDialog(false);
      fetchData();
    } catch (err) {
      console.error("Save gagal:", err);
      ToastError.fire({ title: "Gagal menyimpan data" });
    }
    setSubmitLoading(false);
  };

  const handleDelete = async (data) => {
    const confirm = await PopupDelete.fire();
    if (confirm.isConfirmed) {
      setDeleteLoading(true);
      try {
        await deleteKelasTahunAjaran(data.id_kelas_tahun_ajaran);
        ToastSuccess.fire({ title: "Data berhasil dihapus" });
        fetchData();
      } catch (err) {
        console.error("Delete gagal:", err);
        ToastError.fire({ title: "Gagal menghapus data" });
      }
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Manajemen Periode Pelajaran
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Halaman ini digunakan untuk menentukan pelajaran apa saja yang diampu
        masing-masing kelas dalam periode tertentu.
      </Typography>

      <Box sx={{ width: "100%" }}>
        <TableTemplate
          isLoading={loading || deleteLoading}
          title="Daftar Mata Pelajaran Periode"
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
        <DialogTitle>{editMode ? "Update Data" : "Tambah Data"}</DialogTitle>
        <DialogContent dividers>
          {optionLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 200,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Controller
                name="id_tahun_ajaran"
                control={control}
                rules={{ required: "Tahun Ajaran wajib dipilih" }}
                render={({ field }) => (
                  <Autocomplete
                    options={tahunAjaranList}
                    getOptionLabel={(option) => option?.nama || ""}
                    value={
                      tahunAjaranList.find(
                        (t) => t.id_tahun_ajaran === field.value
                      ) || null
                    }
                    onChange={(_, newValue) =>
                      field.onChange(newValue ? newValue.id_tahun_ajaran : null)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tahun Ajaran"
                        margin="normal"
                        required
                        error={!!errors.id_tahun_ajaran}
                        helperText={errors.id_tahun_ajaran?.message}
                      />
                    )}
                  />
                )}
              />

              <Controller
                name="id_kelas"
                control={control}
                rules={{ required: "Kelas wajib dipilih" }}
                render={({ field }) => (
                  <Autocomplete
                    options={kelasList}
                    getOptionLabel={(option) => option?.nama_kelas || ""}
                    value={
                      kelasList.find((k) => k.id_kelas === field.value) || null
                    }
                    onChange={(_, newValue) =>
                      field.onChange(newValue ? newValue.id_kelas : null)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Kelas"
                        margin="normal"
                        required
                        error={!!errors.id_kelas}
                        helperText={errors.id_kelas?.message}
                      />
                    )}
                  />
                )}
              />

              <Controller
                name="id_pelajaran"
                control={control}
                rules={{ required: "Pelajaran wajib dipilih" }}
                render={({ field }) => (
                  <Autocomplete
                    options={pelajaranList}
                    getOptionLabel={(option) => option?.nama_pelajaran || ""}
                    value={
                      pelajaranList.find(
                        (p) => p.id_pelajaran === field.value
                      ) || null
                    }
                    onChange={(_, newValue) =>
                      field.onChange(newValue ? newValue.id_pelajaran : null)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Pelajaran"
                        margin="normal"
                        required
                        error={!!errors.id_pelajaran}
                        helperText={errors.id_pelajaran?.message}
                      />
                    )}
                  />
                )}
              />

              <Controller
                name="guru_pengampu"
                control={control}
                rules={{ required: "Guru wajib dipilih" }}
                render={({ field }) => (
                  <Autocomplete
                    options={guruList}
                    getOptionLabel={(option) => option?.nama || ""}
                    value={
                      guruList.find((g) => g.id_user === field.value) || null
                    }
                    onChange={(_, newValue) =>
                      field.onChange(newValue ? newValue.id_user : null)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Guru Pengampu"
                        margin="normal"
                        required
                        error={!!errors.guru_pengampu}
                        helperText={errors.guru_pengampu?.message}
                      />
                    )}
                  />
                )}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} disabled={submitLoading}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={submitLoading}
            startIcon={
              submitLoading ? <CircularProgress size={18} color="inherit" /> : null
            }
          >
            {submitLoading ? "Menyimpan..." : editMode ? "Update" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
