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
} from "@mui/material";
import { PopupEdit } from "../../composables/sweetalert";

export default function TabPengumuman() {
  const [loading, setLoading] = useState(false);
  const [pengumuman, setPengumuman] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
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
    for (let i = 1; i <= 95; i++) {
      const hasComments = Math.random() > 0.5;

      const comments = hasComments
        ? Array.from({ length: 12 }, (_, idx) => ({
            from: idx % 2 === 0 ? "Fiko" : "No Name",
            text: `Komentar ${String.fromCharCode(
              65 + idx
            )} untuk pengumuman aaaaaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaa aaa aaa ${i}`,
          }))
        : [];

      data.push({
        id: i,
        title: `Pengumuman ${i}`,
        detail: `Ini detail pengumuman yang ke-${i}`,
        comments,
        file: Math.random() > 0.5,
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
      detail: newDesc,
      comments: [],
      file: newFile.name,
      from: "teacher",
    };

    setPengumuman([newData, ...pengumuman]);
    resetForm();
    setOpenDialog(false);
  };

  const resetForm = () => {
    setNewTitle("");
    setNewDesc("");
    setNewFile(null);
    setErrors({ title: false, file: false });
  };

  const handleCancel = async () => {
    if (newTitle || newDesc || newFile) {
      const confirmClose = await PopupEdit.fire({
        title: "Cancel Create Data?",
        text: "Data sudah diisi sebagian. Yakin ingin membatalkan?",
      });
      if (!confirmClose.isConfirmed) return;
    }
    resetForm();
    setOpenDialog(false);
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
        isEdit={role == "teacher"}
        isDelete={role == "teacher"}
        onCreate={role == "teacher" ? () => setOpenDialog(true) : () => {}}
        onEdit={role == "teacher" ? () => setOpenDialog(true) : () => {}}
        onDelete={role == "teacher" ? () => setOpenDialog(true) : () => {}}
      />

      {/* Dialog Create Pengumuman */}
      <Dialog open={openDialog} onClose={handleCancel} fullWidth>
        <DialogTitle>Buat Pengumuman Baru</DialogTitle>
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
          <Button onClick={handleCreate} variant="contained">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
