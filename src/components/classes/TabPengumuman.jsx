import { useState, useEffect } from "react";
import Pengumuman from "./Pengumuman";
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
import { PopupEdit } from "../../composables/sweetalert";

export default function TabPengumuman() {
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

  const role = localStorage.getItem("role");

  const sendComment = (id, text, setText) => {
    if (!text.trim()) return;
    console.log("Pengumuman ID:", id, "Comment:", text);
    setText("");
  };

  useEffect(() => {
    setLoading(true);
    const data = [];
    for (let i = 1; i <= 10; i++) {
      const hasComments = Math.random() > 0.5;
      const comments = hasComments
        ? Array.from({ length: 15 }, (_, idx) => ({
            from: idx % 2 === 0 ? "Fiko" : "No Name",
            text: `Komentar ${String.fromCharCode(
              65 + idx
            )} untuk pengumuman ${i}`,
          }))
        : [];

      data.push({
        id: i,
        title: `Pengumuman ${i}`,
        description: `Ini description pengumuman yang ke-${i}`,
        comments,
        file: `file-${i}.pdf`,
        from: "admin",
      });
    }
    setPengumuman(data);
    setLoading(false);
  }, []);

  const handleCreate = () => {
    let hasError = false;
    const newErrors = { title: false, file: false };

    if (!newTitle.trim()) {
      newErrors.title = true;
      hasError = true;
    }
    if (!newFile) {
      newErrors.file = true;
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    const newData = {
      id: pengumuman.length + 1,
      title: newTitle,
      description: newDesc,
      comments: [],
      file: newFile.name,
      from: "teacher",
    };

    console.log("Create Data:", newData);   // <<=== log data

    setPengumuman([newData, ...pengumuman]);
    resetForm();
    setOpenDialog(false);
  };

  const handleUpdate = () => {
    let hasError = false;
    const newErrors = { title: false, file: false };

    if (!newTitle.trim()) {
      newErrors.title = true;
      hasError = true;
    }
    if (!newFile && !editData?.file) {
      newErrors.file = true;
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    const updatedData = pengumuman.map((item) =>
      item.id === editData.id
        ? {
            ...item,
            title: newTitle,
            description: newDesc,
            file: newFile ? newFile.name : editData.file,
          }
        : item
    );

    setPengumuman(updatedData);
    resetForm();
    setOpenDialog(false);
  };

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
    setNewTitle(data.title || "");
    setNewDesc(data.description || "");
    setNewFile(null);
    setOpenDialog(true);
  };

  return (
    <>
      <Pengumuman
        title="Pengumuman Kelas"
        data={pengumuman}
        commentInputs={commentInputs}
        setCommentInputs={setCommentInputs}
        sendComment={sendComment}
        itemsPerPage={10}
        isCreate={role == "teacher"}
        isUpdate={role == "teacher"}
        isDelete={role == "teacher"}
        onCreate={role == "teacher" ? openCreateDialog : () => {}}
        onUpdate={role == "teacher" ? (item) => openUpdateDialog(item) : () => {}}
        onDelete={role == "teacher" ? (id) => console.log("Delete ID:", id) : () => {}}
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
              Upload File
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
