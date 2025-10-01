import React, { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  IconButton,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
} from "@mui/material";
import TableTemplate from "../../tables/TableTemplate";
import { PopupError, PopupEdit, PopupDelete } from "../../../composables/sweetalert";

export default function TabMateriGuru() {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // state untuk dialog create/edit
  const [openCreate, setOpenCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    namaFile: "",
    pertemuan: "",
    deskripsi: "",
    file: null,
  });

  // error state
  const [errors, setErrors] = useState({});

  // rows dummy
  const [rows, setRows] = useState([
    {
      id: 1,
      namaFile: "Maleficent",
      pertemuan: "11",
      deskripsi:
        "The lesson for next week will be about watching the movie The Maleficent 2014...",
      file: null,
    },
    {
      id: 2,
      namaFile: "Spooky story",
      pertemuan: "10",
      deskripsi:
        "We'll have a Trick or Treat, a Halloween Storytelling activity...",
      file: null,
    },
    {
      id: 3,
      namaFile: "Speaking Project I",
      pertemuan: "7",
      deskripsi: "Speaking project I is to promote or sell a product...",
      file: null,
    },
  ]);

  const handleInfoClick = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleOpenCreate = () => {
    setFormData({ id: null, namaFile: "", pertemuan: "", deskripsi: "", file: null });
    setErrors({});
    setIsEdit(false);
    setOpenCreate(true);
  };

  const handleOpenEdit = (row) => {
    setFormData({ ...row });
    setErrors({});
    setIsEdit(true);
    setOpenCreate(true);
  };

  const handleCloseCreate = async () => {
    const { namaFile, pertemuan, deskripsi, file } = formData;
    if ((namaFile || pertemuan || deskripsi || file) && !isEdit) {
      const confirmClose = await PopupEdit.fire({
        title: "Batalkan?",
        text: "Data sudah diisi sebagian. Yakin ingin membatalkan?",
      });
      if (!confirmClose.isConfirmed) return;
    }
    setOpenCreate(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.namaFile.trim()) {
      newErrors.namaFile = "Nama file wajib diisi";
    }
    if (!formData.pertemuan.trim()) {
      newErrors.pertemuan = "Pertemuan wajib diisi";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitCreate = () => {
    if (!validateForm()) return;

    if (isEdit) {
      setRows((prev) =>
        prev.map((r) => (r.id === formData.id ? { ...formData } : r))
      );
      console.log("Updated materi:", formData);
    } else {
      const newId = rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
      const newRow = { ...formData, id: newId };
      setRows((prev) => [...prev, newRow]);
      console.log("Materi baru:", newRow);
    }

    setOpenCreate(false);
  };

  const handleDelete = async (row) => {
    const confirmDelete = await PopupDelete.fire({ title: "Delete Data?" });
    if (!confirmDelete.isConfirmed) return;
    
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    console.log("Materi dihapus, id:", row.id);
  };

  const handleOpenFile = () => {
    if (!selectedRow?.file) {
      PopupError.fire({title: "Error", html: "File belum tersedia untuk materi ini."});
      return;
    }
    const file = selectedRow.file;
    const fileURL = URL.createObjectURL(file);
    const ext = file.name.split(".").pop().toLowerCase();

    if (["pdf", "jpg", "jpeg", "png"].includes(ext)) {
      window.open(fileURL, "_blank");
    } else if (["ppt", "pptx", "doc", "docx"].includes(ext)) {
      alert(
        "File PPT/DOC harus diupload ke server agar bisa dipreview. Sekarang hanya bisa dibuka via download."
      );
      window.open(fileURL, "_blank");
    } else {
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = file.name;
      link.click();
    }
  };

  const columns = [
    { field: "namaFile", label: "Nama File", width: "150px" },
    { field: "pertemuan", label: "Pertemuan", width: "100px" },
    { field: "deskripsi", label: "Deskripsi", width: "500px" },
    {
      field: "action",
      label: "Action",
      width: "160px",
      align: "center",
      render: (value, row) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Detail Info">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleInfoClick(row)}
            >
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download File">
            <IconButton
              size="small"
              color="primary"
              onClick={() => console.log("Download:", row.namaFile)}
            >
              <DownloadOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="warning"
              onClick={() => handleOpenEdit(row)}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(row)}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <TableTemplate
        key={"Materi"}
        title={"Materi"}
        columns={columns}
        rows={rows}
        initialRowsPerPage={10}
        tableHeight={400}
        isCheckbox={false}
        isUpdate={false}
        isDelete={false}
        isUpload={false}
        isDownload={false}
        onCreate={handleOpenCreate}
      />

      {/* Dialog Detail */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Detail Materi</DialogTitle>
        <DialogContent dividers>
          {selectedRow && (
            <>
              <Typography variant="subtitle1" fontWeight="bold">
                {selectedRow.namaFile}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Pertemuan: {selectedRow.pertemuan}
              </Typography>
              <DialogContentText sx={{ mt: 2 }}>
                {selectedRow.deskripsi}
              </DialogContentText>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOpenFile} variant="contained" color="primary">
            Lihat File Materi
          </Button>
          <Button onClick={handleClose} variant="contained" color="primary">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Create/Edit */}
      <Dialog
        open={openCreate}
        onClose={handleCloseCreate}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{isEdit ? "Edit Materi" : "Buat Materi Baru"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Nama Materi"
              name="namaFile"
              value={formData.namaFile}
              onChange={handleChange}
              fullWidth
              size="small"
              error={!!errors.namaFile}
              helperText={errors.namaFile}
            />
            <TextField
              label="Pertemuan"
              name="pertemuan"
              value={formData.pertemuan}
              onChange={handleChange}
              fullWidth
              size="small"
              error={!!errors.pertemuan}
              helperText={errors.pertemuan}
            />
            <TextField
              label="Deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Upload File (opsional)
              </Typography>
              {isEdit && formData.file && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 1 }}
                >
                  File sudah ada: {formData.file.name || "File lama"}
                </Typography>
              )}
              <input
                type="file"
                name="file"
                onChange={handleChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
              />
              {errors.file && (
                <Typography variant="caption" color="error">
                  {errors.file}
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate}>Batal</Button>
          <Button
            onClick={handleSubmitCreate}
            variant="contained"
            color="primary"
          >
            {isEdit ? "Update" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
