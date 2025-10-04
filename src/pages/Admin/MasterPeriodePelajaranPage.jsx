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
    {
      field: "TahunAjaran",
      label: "Tahun Ajaran",
      width: 200,
      render: (row) => row.nama ? row.nama : "-",
    },
    {
      field: "Kelas",
      label: "Kelas",
      width: 200,
      render: (row) => row.nama_kelas || "-",
    },
    {
      field: "Pelajaran",
      label: "Pelajaran",
      width: 200,
      render: (row) => row.nama_pelajaran || "-",
    },
    {
      field: "GuruPengampu",
      label: "Guru Pengampu",
      width: 250,
      render: (row) => row.nama || "-",
    },
  ];

  // =============== FETCH DATA ===============
  const fetchData = async () => {
    try {
      const res = await getAllKelasTahunAjaran();
      setRows(res.data || []);
    } catch (err) {
      console.error("Gagal fetch data:", err);
    }
  };

  const fetchOptions = async () => {
    try {
      const tahunRes = await getSimpleTahunAjaran();
      setTahunAjaranList(Array.isArray(tahunRes.data?.data) ? tahunRes.data.data : []);

      const kelasRes = await getSimpleKelas();
      setKelasList(Array.isArray(kelasRes.data?.data) ? kelasRes.data.data : []);

      const pelajaranRes = await getSimplePelajaran();
      setPelajaranList(Array.isArray(pelajaranRes.data?.data) ? pelajaranRes.data.data : []);

      const guruRes = await getSimpleUsers("guru");
      setGuruList(Array.isArray(guruRes.users) ? guruRes.users : []);
    } catch (err) {
      console.error("Gagal fetch options:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchOptions();
  }, []);

  // =============== HANDLE DIALOG ===============
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

  // =============== SAVE ===============
  const onSubmit = async (data) => {
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
  };

  // =============== DELETE ===============
  const handleDelete = async (data) => {
    const confirm = await PopupDelete.fire();
    if (confirm.isConfirmed) {
      try {
        await deleteKelasTahunAjaran(data.id_kelas_tahun_ajaran);
        ToastSuccess.fire({ title: "Data berhasil dihapus" });
        fetchData();
      } catch (err) {
        console.error("Delete gagal:", err);
        ToastError.fire({ title: "Gagal menghapus data" });
      }
    }
  };

  return (
    <>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Mata Pelajaran Periode
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Halaman ini digunakan untuk menentukan pelajaran apa saja yang diampu
        masing-masing kelas dalam periode tertentu.
      </Typography>

      <Box sx={{ width: "100%" }}>
        <TableTemplate
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

      {/* ===== Dialog Form ===== */}
      <Dialog open={openDialog} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>
          {editMode ? "Update Data" : "Tambah Data"}
        </DialogTitle>
        <DialogContent dividers>
          {/* Tahun Ajaran */}
          <Controller
            name="id_tahun_ajaran"
            control={control}
            rules={{ required: "Tahun Ajaran wajib dipilih" }}
            render={({ field }) => (
              <Autocomplete
                options={tahunAjaranList}
                getOptionLabel={(option) => option?.nama || ""}
                value={
                  tahunAjaranList.find((t) => t.id_tahun_ajaran === field.value) ||
                  null
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

          {/* Kelas */}
          <Controller
            name="id_kelas"
            control={control}
            rules={{ required: "Kelas wajib dipilih" }}
            render={({ field }) => (
              <Autocomplete
                options={kelasList}
                getOptionLabel={(option) => option?.nama_kelas || ""}
                value={kelasList.find((k) => k.id_kelas === field.value) || null}
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

          {/* Pelajaran */}
          <Controller
            name="id_pelajaran"
            control={control}
            rules={{ required: "Pelajaran wajib dipilih" }}
            render={({ field }) => (
              <Autocomplete
                options={pelajaranList}
                getOptionLabel={(option) => option?.nama_pelajaran || ""}
                value={
                  pelajaranList.find((p) => p.id_pelajaran === field.value) ||
                  null
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

          {/* Guru */}
          <Controller
            name="guru_pengampu"
            control={control}
            rules={{ required: "Guru wajib dipilih" }}
            render={({ field }) => (
              <Autocomplete
                options={guruList}
                getOptionLabel={(option) => option?.nama || ""}
                value={guruList.find((g) => g.id_user === field.value) || null}
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
