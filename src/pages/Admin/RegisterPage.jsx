// src/pages/RegisterPage.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  FormHelperText,
} from "@mui/material";
import TableTemplate from "../../components/tables/TableTemplate";
import { handleDownloadFile, handleUploadFile } from "../../utils/utils";
import {
  ToastError,
  ToastSuccess,
  PopupDelete,
  PopupEdit,
} from "../../composables/sweetalert";
import {
  bulkRegister,
  getAllUsers,
  registerUser,
  updateUser,
  deleteUser,
} from "../../services/authService";

export default function RegisterPage() {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    nama: "",
    email: "",
    password: "",
    role: "",
    nis: "",
    nisn: "",
    gender: "",
    tgl_lahir: "",
    tempat_lahir: "",
    agama: "",
    alamat: "",
    nama_ayah: "",
    nama_ibu: "",
    telp: "",
    telp_ortu: "",
    profile_picture: null,
  });
  const [errors, setErrors] = useState({});

  // ====== Upload Dialog ======
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState("");

  const columns = [
    { field: "username", label: "Username", width: 150, sortable: true },
    { field: "nama", label: "Nama", width: 200, sortable: true },
    { field: "email", label: "Email", width: 250 },
    { field: "role", label: "Role", width: 120 },
    { field: "nis", label: "NIS", width: 120 },
    { field: "nisn", label: "NISN", width: 120 },
    { field: "gender", label: "Gender", width: 120 },
    { field: "tgl_lahir", label: "Tanggal Lahir", width: 150 },
    { field: "tempat_lahir", label: "Tempat Lahir", width: 150 },
    { field: "agama", label: "Agama", width: 120 },
    { field: "alamat", label: "Alamat", width: 200 },
    { field: "nama_ayah", label: "Nama Ayah", width: 200 },
    { field: "nama_ibu", label: "Nama Ibu", width: 200 },
    { field: "telp", label: "Telp", width: 150 },
    { field: "telp_ortu", label: "Telp Ortu", width: 150 },
    {
      field: "status",
      label: "Status",
      width: 120,
      render: (value) => (value === 1 ? "Aktif" : "Tidak Aktif"),
    },
    { field: "profile_picture", label: "Foto Profil", width: 150 },
  ];

  // ================== FETCH USERS ==================
  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setRows(res.users || []);
    } catch (err) {
      console.error("Gagal fetch users:", err);
      ToastError.fire({ title: "Gagal mengambil data users" });
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  // ================== RESET FORM ==================
  const resetForm = () => {
    setFormData({
      username: "",
      nama: "",
      email: "",
      password: "",
      role: "",
      nis: "",
      nisn: "",
      gender: "",
      tgl_lahir: "",
      tempat_lahir: "",
      agama: "",
      alamat: "",
      nama_ayah: "",
      nama_ibu: "",
      telp: "",
      telp_ortu: "",
      profile_picture: null,
    });
    setErrors({});
    setEditMode(false);
    setEditData(null);
  };

  // ================== HANDLE DIALOG ==================
  const openCreateDialog = () => {
    resetForm();
    setEditMode(false);
    setOpenDialog(true);
  };

  const openUpdateDialog = (row) => {
    setEditMode(true);
    setEditData(row);
    const { created_at, updated_at, deleted_at, ...cleanRow } = row;
    setFormData({ ...cleanRow, password: "", profile_picture: null });
    setErrors({});
    setOpenDialog(true);
  };

  const handleCancel = async () => {
    if (
      (formData.username ||
        formData.nama ||
        formData.email ||
        formData.password) &&
      !editMode
    ) {
      const confirmClose = await PopupEdit.fire({
        title: "Batalkan?",
        text: "Data sudah diisi sebagian. Yakin ingin membatalkan?",
      });
      if (!confirmClose.isConfirmed) return;
    }
    resetForm();
    setOpenDialog(false);
  };

  // ================== VALIDASI ==================
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim())
      newErrors.username = "Username wajib diisi";
    if (!formData.nama.trim()) newErrors.nama = "Nama wajib diisi";
    if (!formData.email.trim()) newErrors.email = "Email wajib diisi";
    if (!editMode && !formData.password.trim())
      newErrors.password = "Password wajib diisi";
    if (!formData.role) newErrors.role = "Role wajib dipilih";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================== SAVE ==================
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const { created_at, updated_at, deleted_at, ...cleanData } = formData;

      if (editMode) {
        await updateUser(editData.id_user, cleanData);
        ToastSuccess.fire({ title: "User berhasil diupdate" });
      } else {
        await registerUser(cleanData);
        ToastSuccess.fire({ title: "User berhasil dibuat" });
      }
      resetForm();
      setOpenDialog(false);
      fetchUsers();
    } catch (err) {
      console.error("Save gagal:", err);
    }
  };

  // ================== DELETE ==================
  const handleDelete = async (data) => {
    const confirm = await PopupDelete.fire();
    if (confirm.isConfirmed) {
      try {
        await deleteUser(data.id_user);
        ToastSuccess.fire({ title: "User berhasil dihapus" });
        fetchUsers();
      } catch (err) {
        console.error("Delete gagal:", err);
      }
    }
  };

  // ================== UPLOAD ==================
  const handleUploadConfirm = async () => {
    if (!uploadFile) {
      setUploadError("File wajib diisi!");
      return;
    }
    if (
      !uploadFile.name.endsWith(".xlsx") &&
      !uploadFile.name.endsWith(".xls")
    ) {
      setUploadError("File harus berformat Excel (.xlsx atau .xls)");
      return;
    }
    try {
      const itemsData = await handleUploadFile(uploadFile, columns);
      const res = await bulkRegister({ users: itemsData.rows });
      ToastSuccess.fire({ title: res.message || "Bulk register success!" });
      fetchUsers();
      setOpenUploadDialog(false);
      setUploadFile(null);
      setUploadError("");
    } catch (err) {
      console.error("Bulk register gagal:", err);
    }
  };

  // ================== DOWNLOAD ==================
  const handleDownload = () => {
    if (!rows || rows.length === 0) {
      ToastError.fire({ title: "Tidak ada data untuk diunduh!" });
      return;
    }
    const rowsWithPassword = rows.map((row) => ({ ...row, password: "" }));
    const success = handleDownloadFile(rowsWithPassword, "users");
    if (success) ToastSuccess.fire({ title: "Download Success!" });
    else ToastError.fire({ title: "Download Failed!" });
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Manajemen User
      </Typography>

      <Box sx={{ width: "100%" }}>
        <TableTemplate
          title="Daftar User"
          columns={columns}
          rows={rows}
          initialRowsPerPage={10}
          isDownload
          isUpload
          isUpdate
          isDelete
          onCreate={openCreateDialog}
          onUpdate={openUpdateDialog}
          onDelete={handleDelete}
          onUpload={() => setOpenUploadDialog(true)}
          onDownload={handleDownload}
        />
      </Box>

      {/* ===== Dialog Form User ===== */}
      <Dialog open={openDialog} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>
          {editMode ? "Update User" : "Tambah User Baru"}
        </DialogTitle>
        <DialogContent dividers>
          {/* Username */}
          <TextField
            label="Username"
            fullWidth
            required
            margin="normal"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            error={!!errors.username}
            helperText={errors.username}
          />
          {/* Nama */}
          <TextField
            label="Nama"
            fullWidth
            required
            margin="normal"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            error={!!errors.nama}
            helperText={errors.nama}
          />
          {/* Email */}
          <TextField
            label="Email"
            fullWidth
            required
            margin="normal"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={!!errors.email}
            helperText={errors.email}
          />
          {/* Password hanya saat create */}
          {!editMode && (
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              margin="normal"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={!!errors.password}
              helperText={errors.password}
            />
          )}
          {/* Role */}
          <TextField
            label="Role"
            fullWidth
            required
            margin="normal"
            select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            error={!!errors.role}
            helperText={errors.role}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Guru">Guru</MenuItem>
            <MenuItem value="Siswa">Siswa</MenuItem>
          </TextField>
          {/* NIS */}
          <TextField
            label="NIS"
            fullWidth
            margin="normal"
            value={formData.nis}
            onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
          />
          {/* NISN */}
          <TextField
            label="NISN"
            fullWidth
            margin="normal"
            value={formData.nisn}
            onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
          />
          {/* Gender */}
          <TextField
            label="Gender"
            fullWidth
            margin="normal"
            select
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
          >
            <MenuItem value="Laki-laki">Laki-laki</MenuItem>
            <MenuItem value="Perempuan">Perempuan</MenuItem>
          </TextField>
          {/* Tanggal Lahir */}
          <TextField
            label="Tanggal Lahir"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.tgl_lahir}
            onChange={(e) =>
              setFormData({ ...formData, tgl_lahir: e.target.value })
            }
          />
          {/* Tempat Lahir */}
          <TextField
            label="Tempat Lahir"
            fullWidth
            margin="normal"
            value={formData.tempat_lahir}
            onChange={(e) =>
              setFormData({ ...formData, tempat_lahir: e.target.value })
            }
          />
          {/* Agama */}
          <TextField
            label="Agama"
            fullWidth
            margin="normal"
            value={formData.agama}
            onChange={(e) =>
              setFormData({ ...formData, agama: e.target.value })
            }
          />
          {/* Alamat */}
          <TextField
            label="Alamat"
            fullWidth
            margin="normal"
            multiline
            minRows={2}
            value={formData.alamat}
            onChange={(e) =>
              setFormData({ ...formData, alamat: e.target.value })
            }
          />
          {/* Nama Ayah */}
          <TextField
            label="Nama Ayah"
            fullWidth
            margin="normal"
            value={formData.nama_ayah}
            onChange={(e) =>
              setFormData({ ...formData, nama_ayah: e.target.value })
            }
          />
          {/* Nama Ibu */}
          <TextField
            label="Nama Ibu"
            fullWidth
            margin="normal"
            value={formData.nama_ibu}
            onChange={(e) =>
              setFormData({ ...formData, nama_ibu: e.target.value })
            }
          />
          {/* Telp */}
          <TextField
            label="Telp"
            fullWidth
            margin="normal"
            value={formData.telp}
            onChange={(e) =>
              setFormData({ ...formData, telp: e.target.value })
            }
          />
          {/* Telp Ortu */}
          <TextField
            label="Telp Ortu"
            fullWidth
            margin="normal"
            value={formData.telp_ortu}
            onChange={(e) =>
              setFormData({ ...formData, telp_ortu: e.target.value })
            }
          />
          {/* Upload Foto Profil */}
          <div style={{ marginTop: "16px" }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Upload Foto Profil
            </Typography>
            {editMode && editData?.profile_picture && !formData.profile_picture && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 1 }}
              >
                File sudah ada: {editData.profile_picture || "File lama"}
              </Typography>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && !file.type.startsWith("image/")) {
                  ToastError.fire({ title: "File harus berupa gambar (jpg, png, dll)" });
                  e.target.value = "";
                  return;
                }
                setFormData({
                  ...formData,
                  profile_picture: file,
                });
              }}
            />
            {errors.profile_picture && (
              <FormHelperText error>Foto profil wajib diupload</FormHelperText>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Batal</Button>
          <Button onClick={handleSave} variant="contained">
            {editMode ? "Update" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== Dialog Upload Excel ===== */}
      <Dialog
        open={openUploadDialog}
        onClose={() => setOpenUploadDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Upload Data User</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Silakan upload file Excel (.xlsx / .xls) untuk bulk register user.
          </Typography>
          {/* Upload File Excel */}
          <div style={{ marginTop: "16px" }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Upload File Excel
            </Typography>
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={(e) => {
                const file = e.target.files[0];
                if (
                  file &&
                  ![
                    "application/vnd.ms-excel",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  ].includes(file.type)
                ) {
                  ToastError.fire({
                    title: "File harus berupa Excel (.xls atau .xlsx)",
                  });
                  e.target.value = "";
                  return;
                }
                setUploadFile(file);
              }}
            />
            {uploadFile && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 1 }}
              >
                File terpilih: {uploadFile.name}
              </Typography>
            )}
            {uploadError && (
              <FormHelperText error>{uploadError}</FormHelperText>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadDialog(false)}>Batal</Button>
          <Button onClick={handleUploadConfirm} variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
