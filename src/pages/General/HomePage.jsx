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
import { useForm } from "react-hook-form";
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
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [pengumuman, setPengumuman] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const role = localStorage.getItem("role");

  // ============ Hook Form ============
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      judul: "",
      isi: "",
      file: null,
    },
  });

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
      await createKomentar({ id_pengumuman, komentar: text });
      setText("");
      await fetchPengumuman();
    } catch (error) {
      console.error("Gagal mengirim komentar:", error);
    }
  };

  // ================== UPDATE KOMENTAR ==================
  const handleUpdateComment = async (id_komentar, text) => {
    if (!text.trim()) return;
    try {
      await updateKomentar(id_komentar, { komentar: text });
      ToastSuccess.fire({ title: "Komentar berhasil diupdate" });
      await fetchPengumuman();
    } catch (error) {
      console.error("Gagal update komentar:", error);
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
    }
  };

  // ================== SAVE (CREATE/UPDATE) ==================
  const onSubmit = async (data) => {
    setLoadingCreate(true);
    try {
      // Validasi file (hanya pdf)
      if (!editMode && !data.file) {
        ToastError.fire({ title: "File wajib diupload" });
        setLoadingCreate(false);
        return;
      }
      if (data.file && data.file.type !== "application/pdf") {
        ToastError.fire({ title: "Hanya file PDF yang diperbolehkan!" });
        setLoadingCreate(false);
        return;
      }

      const formData = new FormData();
      formData.append("judul", data.judul);
      formData.append("isi", data.isi);
      if (data.file) formData.append("file", data.file);

      if (editMode) {
        await updatePengumuman(editData.id_pengumuman, formData);
        ToastSuccess.fire({ title: "Berhasil Mengubah Pengumuman" });
      } else {
        await createPengumuman(formData);
        ToastSuccess.fire({ title: "Berhasil Membuat Pengumuman" });
      }

      await fetchPengumuman();
      reset();
      setOpenDialog(false);
      setEditMode(false);
      setEditData(null);
    } catch (err) {
      console.error("Gagal simpan pengumuman:", err);
    }
    setLoadingCreate(false);
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

  // ================== DIALOG HANDLER ==================
  const handleCancel = async () => {
    const formValues = watch();
    if ((formValues.judul || formValues.isi || formValues.file) && !editMode) {
      const confirmClose = await PopupEdit.fire({
        title: "Batalkan?",
        text: "Data sudah diisi sebagian. Yakin ingin membatalkan?",
      });
      if (!confirmClose.isConfirmed) return;
    }
    reset();
    setOpenDialog(false);
    setEditMode(false);
    setEditData(null);
  };

  const openCreateDialog = () => {
    reset();
    setEditMode(false);
    setOpenDialog(true);
  };

  const openUpdateDialog = (data) => {
    setEditMode(true);
    setEditData(data);
    reset({
      judul: data.judul || "",
      isi: data.isi || "",
      file: null,
    });
    setOpenDialog(true);
  };

  useEffect(() => {
    fetchPengumuman();
    const interval = setInterval(() => {
      fetchPengumuman();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (openDialog && !editMode) {
      reset({
        judul: "",
        isi: "",
        file: null,
      });
    }
  }, [openDialog, editMode, reset]);

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
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
        expanded={expanded}
        setExpanded={setExpanded}
        itemsPerPage={10}
        isCreate={role === "admin"}
        isUpdate={role === "admin"}
        isDelete={role === "admin"}
        onCreate={openCreateDialog}
        onUpdate={openUpdateDialog}
        onDelete={handleDelete}
        onDownload={handleDownload}
      />

      {/* ===== DIALOG FORM ===== */}
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
            {...register("judul", { required: "Judul wajib diisi" })}
            error={!!errors.judul}
            helperText={errors.judul?.message}
          />
          <TextField
            label="Deskripsi"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            {...register("isi")}
          />
          <div style={{ marginTop: "16px" }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Upload File (PDF)
            </Typography>
            {editMode && editData?.file && !watch("file") && (
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
              onChange={(e) => {
                const file = e.target.files[0];
                setValue("file", file);
              }}
            />
            {errors.file && (
              <FormHelperText error>{errors.file.message}</FormHelperText>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Batal</Button>
          <Button disabled={loadingCreate} loading={loadingCreate} onClick={handleSubmit(onSubmit)} variant="contained">
            {editMode ? "Update" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
