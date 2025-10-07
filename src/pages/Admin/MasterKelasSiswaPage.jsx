import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  IconButton,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import {
  VisibilityOutlined,
  UploadFileOutlined,
  DeleteOutline,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";

import TableTemplate from "../../components/tables/TableTemplate";
import {
  ToastError,
  ToastSuccess,
  PopupDelete,
  PopupEdit,
} from "../../composables/sweetalert";
import {
  getAllKelasSiswa,
  createKelasSiswa,
  deleteKelasSiswa,
  uploadRaporKelasSiswa,
  deleteRaporKelasSiswa,
} from "../../services/kelasSiswaService";
import { getSimpleUsers } from "../../services/authService";
import { getAllKelas } from "../../services/kelasService";
import { getAllTahunAjaran } from "../../services/tahunAjaranService";

export default function MasterKelasSiswaPage() {
  const [rows, setRows] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [tahunAjaranList, setTahunAjaranList] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedRaporType, setSelectedRaporType] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [file, setFile] = useState(null);

  const defaultFormValues = {
    id_kelas: null,
    id_tahun_ajaran: null,
    id_siswa: null,
  };

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormValues,
  });

  const columns = [
    { field: "kelas", label: "Kelas", width: 200 },
    { field: "tahunAjaran", label: "Tahun Ajaran", width: 200 },
    {
      field: "siswa",
      label: "Siswa",
      width: 250,
      render: (value, row) => row.siswa?.nama || "-",
    },
    {
      field: "rapor_ganjil",
      label: "Rapor Ganjil",
      width: 220,
      render: (value, row) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Upload Rapor Ganjil">
            <IconButton
              color="success"
              size="small"
              onClick={() => {
                handleOpenUpload(row, "ganjil");
              }}
            >
              <UploadFileOutlined />
            </IconButton>
          </Tooltip>

          <Tooltip title="Lihat Rapor Ganjil">
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleViewRapor(value)}
              disabled={!value}
            >
              <VisibilityOutlined />
            </IconButton>
          </Tooltip>

          {value && (
            <Tooltip title="Hapus Rapor Ganjil">
              <IconButton
                color="error"
                size="small"
                onClick={() => handleDeleteRapor(row, "ganjil")}
              >
                <DeleteOutline />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
    {
      field: "rapor_genap",
      label: "Rapor Genap",
      width: 220,
      render: (value, row) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Upload Rapor Genap">
            <IconButton
              color="success"
              size="small"
              onClick={() => {
                handleOpenUpload(row, "genap");
              }}
            >
              <UploadFileOutlined />
            </IconButton>
          </Tooltip>

          <Tooltip title="Lihat Rapor Genap">
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleViewRapor(value)}
              disabled={!value}
            >
              <VisibilityOutlined />
            </IconButton>
          </Tooltip>

          {value && (
            <Tooltip title="Hapus Rapor Genap">
              <IconButton
                color="error"
                size="small"
                onClick={() => handleDeleteRapor(row, "genap")}
              >
                <DeleteOutline />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  // ================== FETCH ==================
  const fetchData = async () => {
    try {
      const res = await getAllKelasSiswa();
      const formatted = res.data.map((item) => ({
        ...item,
        kelas: item.kelas?.nama_kelas || "-",
        tahunAjaran: item.tahunAjaran?.nama || "-",
        siswa: item.siswa || null,
        rapor_ganjil: item.rapor_ganjil || null,
        rapor_genap: item.rapor_genap || null,
      }));
      setRows(formatted);
    } catch (err) {
      console.error("Gagal fetch kelas siswa:", err);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [kelas, tahunAjaran, siswa] = await Promise.all([
        getAllKelas(),
        getAllTahunAjaran(),
        getSimpleUsers("siswa"),
      ]);

      setKelasList(kelas.data || []);
      setTahunAjaranList(tahunAjaran.data || []);
      setSiswaList(siswa.data || []);
    } catch (err) {
      console.error("Gagal fetch dropdown:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDropdowns();
  }, []);

  // ================== HANDLE RAPOR ==================
  const handleOpenUpload = (row, type) => {
    setSelectedRow(row);
    setSelectedRaporType(type);
    setFile(null);
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
    setSelectedRow(null);
    setSelectedRaporType(null);
    setFile(null);
  };

  const handleUploadRapor = async () => {
    if (!file) return ToastError.fire({ title: "File belum dipilih" });
    if (!selectedRow?.id_kelas_siswa)
      return ToastError.fire({ title: "Gagal: ID kelas siswa tidak ditemukan" });

    try {
      const formData = new FormData();
      formData.append("rapor", file);

      await uploadRaporKelasSiswa(selectedRow.id_kelas_siswa, selectedRaporType, formData);

      ToastSuccess.fire({ title: "Rapor berhasil diupload" });
      handleCloseUploadDialog();
      fetchData();
    } catch (err) {
      console.error("Upload gagal:", err);
      ToastError.fire({ title: "Gagal upload rapor" });
    }
  };

  const handleViewRapor = (url) => {
    if (!url) return;
    window.open(url, "_blank");
  };

  const handleDeleteRapor = async (row, tipe) => {
    const confirm = await PopupDelete.fire({
      title: `Hapus rapor ${tipe}?`,
      text: "File akan dihapus secara permanen.",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteRaporKelasSiswa(row.id_kelas_siswa, tipe);
      ToastSuccess.fire({ title: `Rapor ${tipe} berhasil dihapus` });
      fetchData();
    } catch (err) {
      console.error("Gagal hapus rapor:", err);
      ToastError.fire({ title: "Gagal menghapus rapor" });
    }
  };

  // ================== EXISTING HANDLERS (CREATE, DELETE, ETC) ==================
  const openCreateDialog = () => {
    reset(defaultFormValues);
    setOpenDialog(true);
  };

  const handleCancel = async () => {
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
    reset(defaultFormValues);
    setOpenDialog(false);
  };

  const onSubmit = async (data) => {
    try {
      await createKelasSiswa(data);
      ToastSuccess.fire({ title: "Kelas siswa berhasil ditambahkan" });
      setOpenDialog(false);
      fetchData();
    } catch (err) {
      console.error("Gagal simpan:", err);
      ToastError.fire({ title: "Gagal menyimpan data" });
    }
  };

  const handleDelete = async (row) => {
    const confirm = await PopupDelete.fire();
    if (confirm.isConfirmed) {
      try {
        await deleteKelasSiswa(row.id_kelas_siswa);
        ToastSuccess.fire({ title: "Data berhasil dihapus" });
        fetchData();
      } catch (err) {
        console.error("Delete gagal:", err);
      }
    }
  };

  // ================== RENDER ==================
  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Manajemen Kelas Siswa
      </Typography>

      <Box sx={{ width: "100%" }}>
        <TableTemplate
          title="Daftar Kelas Siswa"
          columns={columns}
          rows={rows}
          keyProperty="id_kelas_siswa"
          isUpdate={false}
          isDelete
          isUpload={false}
          isDownload={false}
          onCreate={openCreateDialog}
          onDelete={handleDelete}
        />
      </Box>

      {/* ===== Dialog Tambah ===== */}
      <Dialog open={openDialog} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>Tambah Kelas Siswa</DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <Controller
              name="id_kelas"
              control={control}
              rules={{ required: "Kelas wajib dipilih" }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={kelasList}
                  getOptionLabel={(opt) => opt.nama_kelas || ""}
                  onChange={(_, val) => field.onChange(val?.id_kelas || null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Kelas"
                      error={!!errors.id_kelas}
                      helperText={errors.id_kelas?.message}
                    />
                  )}
                />
              )}
            />

            <Controller
              name="id_tahun_ajaran"
              control={control}
              rules={{ required: "Tahun ajaran wajib dipilih" }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={tahunAjaranList}
                  getOptionLabel={(opt) => opt.nama || ""}
                  onChange={(_, val) => field.onChange(val?.id_tahun_ajaran || null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tahun Ajaran"
                      error={!!errors.id_tahun_ajaran}
                      helperText={errors.id_tahun_ajaran?.message}
                    />
                  )}
                />
              )}
            />

            <Controller
              name="id_siswa"
              control={control}
              rules={{ required: "Siswa wajib dipilih" }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={siswaList}
                  getOptionLabel={(opt) => opt.nama || ""}
                  onChange={(_, val) => field.onChange(val?.id_user || null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Siswa"
                      error={!!errors.id_siswa}
                      helperText={errors.id_siswa?.message}
                    />
                  )}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Batal</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== Dialog Upload Rapor ===== */}
      <Dialog
        open={openUploadDialog}
        onClose={handleCloseUploadDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Upload Rapor {selectedRaporType === "ganjil" ? "Ganjil" : "Genap"}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Siswa: {selectedRow?.siswa?.nama}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <Typography variant="body2">Upload File Rapor (PDF)</Typography>

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const selected = e.target.files[0];
                if (selected && selected.type !== "application/pdf") {
                  ToastError.fire({
                    title: "File harus berupa PDF",
                  });
                  e.target.value = "";
                  return;
                }
                setFile(selected);
              }}
            />

            {file && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 1 }}
              >
                File terpilih: {file.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog}>Batal</Button>
          <Button onClick={handleUploadRapor} variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
