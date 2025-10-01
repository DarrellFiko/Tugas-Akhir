import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormHelperText,
  Typography,
} from "@mui/material";
import Pengumuman from "../../components/classes/Pengumuman";
import { PopupEdit, ToastError, ToastSuccess } from "../../composables/sweetalert";
import {
  getAllPengumuman,
  createPengumuman,
  updatePengumuman,
  deletePengumuman,
  downloadPengumumanFile,
} from "../../services/pengumumanService";
import { createKomentar, deleteKomentar, updateKomentar } from "../../services/komentarService";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [pengumuman, setPengumuman] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [errors, setErrors] = useState({ title: false, file: false });

  // Track accordion yang terbuka biar tidak flicker
  const [expanded, setExpanded] = useState(false);

  const role = localStorage.getItem("role");

  const fetchPengumuman = async () => {
    setLoading(true);
    try {
      const res = await getAllPengumuman();

      setPengumuman((prev) => {
        const mapPrev = new Map(prev.map((p) => [p.id_pengumuman, p]));
        const newData = res.data || [];
        return newData.map((item) => ({
          ...mapPrev.get(item.id_pengumuman),
          ...item,
        }));
      });
    } catch (err) {
      console.error("Gagal fetch pengumuman:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================== CREATE KOMENTAR ==================
  const sendComment = async (id_pengumuman, text, setText) => {
    if (!text.trim()) return;
    try {
      await createKomentar({
        id_pengumuman,
        komentar: text,
      });

      setText("");
      await fetchPengumuman();
    } catch (error) {
      console.error("Gagal mengirim komentar:", error);
    }
  };

  // ================== UPDATE KOMENTAR  ==================
  const handleUpdateComment = async (id_komentar, text) => {
    if (!text.trim()) return;
    try {
      await updateKomentar(id_komentar, { komentar: text });
      ToastSuccess.fire({ title: "Komentar berhasil diupdate" });
      await fetchPengumuman();
    } catch (error) {
      console.error("Gagal update komentar:", error);
      ToastError.fire({ title: "Gagal update komentar" });
    }
  };

  // ================== DELETE KOMENTAR ==================
  const handleDeleteComment = async (id_komentar) => {
    try {
      await deleteKomentar(id_komentar);
      ToastSuccess.fire({ title: "Komentar berhasil dihapus" });
      await fetchPengumuman();
    } catch (error) {
      console.error("Gagal hapus komentar:", error);
      ToastError.fire({ title: "Gagal hapus komentar" });
    }
  };

  // ================== CREATE ==================
  const handleCreate = async () => {
    let hasError = false;
    const newErrors = { title: false, file: false };

    if (!newTitle.trim()) {
      newErrors.title = true;
      hasError = true;
    }
    if (!newFile) {
      newErrors.file = true;
      hasError = true;
    } else if (newFile.type !== "application/pdf") {
      ToastError.fire({ title: "Hanya file PDF yang diperbolehkan!" });
      newErrors.file = true;
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    try {
      const formData = new FormData();
      formData.append("judul", newTitle);
      formData.append("isi", newDesc);
      formData.append("file", newFile);

      await createPengumuman(formData);
      await fetchPengumuman();
      ToastSuccess.fire({ title: "Berhasil Membuat Pengumuman" });

      resetForm();
      setOpenDialog(false);
    } catch (err) {
      console.error("Gagal membuat pengumuman:", err);
    }
  };

  // ================== UPDATE ==================
  const handleUpdate = async () => {
    let hasError = false;
    const newErrors = { title: false, file: false };

    if (!newTitle.trim()) {
      newErrors.title = true;
      hasError = true;
    }
    if (!newFile && !editData?.file) {
      newErrors.file = true;
      hasError = true;
    } else if (newFile && newFile.type !== "application/pdf") {
      ToastError.fire({ title: "Hanya file PDF yang diperbolehkan!" });
      newErrors.file = true;
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    try {
      const formData = new FormData();
      formData.append("judul", newTitle);
      formData.append("isi", newDesc);
      if (newFile) formData.append("file", newFile);

      await updatePengumuman(editData.id_pengumuman, formData);
      await fetchPengumuman();
      ToastSuccess.fire({ title: "Berhasil Mengubah Pengumuman" });

      resetForm();
      setOpenDialog(false);
    } catch (err) {
      console.error("Gagal update pengumuman:", err);
    }
  };

  // ================== DELETE ==================
  const handleDelete = async (id) => {
    try {
      await deletePengumuman(id);
      await fetchPengumuman();
      ToastSuccess.fire({ title: "Berhasil Menghapus Pengumuman" });
    } catch (err) {
      console.error("Gagal hapus pengumuman:", err);
    }
  };

  // ================== DOWNLOAD ==================
  const handleDownload = async (id) => {
    try {
      await downloadPengumumanFile(id);
      ToastSuccess.fire({ title: "Berhasil Mendownload Pengumuman" });
    } catch (err) {
      console.error("Gagal download pengumuman:", err);
    }
  };

  // ================== FORM RESET ==================
  const resetForm = () => {
    setNewTitle("");
    setNewDesc("");
    setNewFile(null);
    setErrors({ title: false, file: false });
    setEditMode(false);
    setEditData(null);
  };

  const handleCancel = async () => {
    if ((newTitle || newDesc || newFile) && !editMode) {
      const confirmClose = await PopupEdit.fire({
        title: "Batalkan?",
        text: "Data sudah diisi sebagian. Yakin ingin membatalkan?",
      });
      if (!confirmClose.isConfirmed) return;
    }
    resetForm();
    setOpenDialog(false);
  };

  const openCreateDialog = () => {
    resetForm();
    setEditMode(false);
    setOpenDialog(true);
  };

  const openUpdateDialog = (data) => {
    setEditMode(true);
    setEditData(data);
    setNewTitle(data.judul || "");
    setNewDesc(data.isi || "");
    setNewFile(null);
    setOpenDialog(true);
  };

  // ================== USE EFFECT ==================
  useEffect(() => {
    fetchPengumuman();
    const interval = setInterval(() => {
      fetchPengumuman();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Pengumuman
      </Typography>

      <Pengumuman
        title="Pengumuman"
        data={pengumuman}
        loading={loading}
        commentInputs={commentInputs}
        setCommentInputs={setCommentInputs}
        sendComment={sendComment}
        onUpdateComment={(id_komentar, text) => handleUpdateComment(id_komentar, text)}
        onDeleteComment={(id_komentar) => handleDeleteComment(id_komentar)}
        expanded={expanded}
        setExpanded={setExpanded}
        itemsPerPage={10}
        isCreate={role === "admin"}
        isUpdate={role === "admin"}
        isDelete={role === "admin"}
        onCreate={openCreateDialog}
        onUpdate={(item) => openUpdateDialog(item)}
        onDelete={(id) => handleDelete(id)}
        onDownload={(id) => handleDownload(id)}
      />

      <Dialog open={openDialog} onClose={handleCancel} fullWidth>
        <DialogTitle>
          {editMode ? "Update Pengumuman" : "Buat Pengumuman Baru"}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Judul"
            fullWidth
            required
            margin="normal"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            error={errors.title}
            helperText={errors.title ? "Judul wajib diisi" : ""}
          />
          <TextField
            label="Deskripsi"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <div style={{ marginTop: "16px" }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Upload File (PDF)
            </Typography>
            {editMode && editData?.file && !newFile && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 1 }}
              >
                File sudah ada: {editData.file || "File lama"}
              </Typography>
            )}
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setNewFile(e.target.files[0])}
            />
            {errors.file && (
              <FormHelperText error>File wajib diupload</FormHelperText>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Batal</Button>
          <Button
            onClick={editMode ? handleUpdate : handleCreate}
            variant="contained"
          >
            {editMode ? "Update" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
