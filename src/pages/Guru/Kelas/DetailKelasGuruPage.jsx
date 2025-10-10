import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Badge,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TableTemplate from "../../../components/tables/TableTemplate";
import {
  formatDate,
  handleDownloadFile,
  handleUploadFile,
} from "../../../utils/utils";
import TabPengumuman from "../../../components/classes/TabPengumuman";
import TabMateri from "../../../components/classes/TabMateri";
import TabModuleGuru from "../../../components/classes/guru/TabModuleGuru";
import { ToastError, ToastSuccess } from "../../../composables/sweetalert";
import TabDaftarSiswa from "../../../components/classes/TabDaftarSiswa";

export default function DetailKelasGuruPage() {
  const location = useLocation();
  const { kelas } = location.state || {};
  const { id } = useParams();
  const navigate = useNavigate();

  // ambil tab terakhir dari localStorage, default = 0
  const savedTab = Number(localStorage.getItem("detailKelasSiswaTab") || 0);
  const [tab, setTab] = useState(savedTab);
  const [notifCount, setNotifCount] = useState(3);

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    localStorage.setItem("detailKelasSiswaTab", newValue);
  };

  useEffect(() => {
    if (tab === 5 && notifCount > 0) {
      setNotifCount(0);
    }
  }, [tab, notifCount]);

  // === Presensi ===
  const columnsPresensi = [
    {
      field: "hariTanggal",
      label: "Hari / Tanggal",
      width: "200px",
      render: (value) => formatDate(value),
    },
    { field: "topik", label: "Topik", width: "400px" },
    {
      field: "absensi",
      label: "Absensi",
      width: "120px",
      align: "center",
      render: (value) =>
        value ? (
          <Box sx={{ fontSize: 28 }}>
            <CheckOutlinedIcon color="primary" fontSize="inherit" />
          </Box>
        ) : (
          <Box sx={{ fontSize: 28 }}>
            <CloseOutlinedIcon color="error" fontSize="inherit" />
          </Box>
        ),
    },
  ];

  const rowsPresensi = [
    {
      id: 1,
      hariTanggal: new Date("2025-09-01"),
      topik: "Pengenalan Materi & Kontrak Kuliah",
      absensi: true,
    },
    {
      id: 2,
      hariTanggal: new Date("2025-09-09"),
      topik: "Bahasan Dasar - Introduction",
      absensi: true,
    },
  ];

  // === Penilaian ===
  const [columnsPenilaian, setColumnsPenilaian] = useState([
    { field: "nama", label: "Nama Siswa", width: "250px" },
  ]);
  const [rowsPenilaian, setRowsPenilaian] = useState([]);

  // === Upload Dialog ===
  const [openUpload, setOpenUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleOpenUpload = () => {
    setSelectedFile(null);
    setOpenUpload(true);
  };
  const handleCloseUpload = () => setOpenUpload(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split(".").pop().toLowerCase();
      if (ext !== "xlsx" && ext !== "csv") {
        ToastError.fire({ title: "File harus berformat XLSX atau CSV" });
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
    }
  };

  const normalizeField = (header) => header.toLowerCase().replace(/\s+/g, "_");

  const handleConfirmUpload = async () => {
    if (!selectedFile) {
      ToastError.fire({ title: "Harap pilih file terlebih dahulu" });
      return;
    }
    try {
      const { columns, rows } = await handleUploadFile(selectedFile);
      const mappedColumns = columns.map((c) => ({
        field: normalizeField(c.label),
        label: c.label,
        width: "150px",
      }));
      const mappedRows = rows.map((row, idx) => {
        const newRow = { id: idx + 1 };
        columns.forEach((c) => {
          const field = normalizeField(c.label);
          newRow[field] = row[c.field];
        });
        return newRow;
      });
      if (!mappedColumns.some((c) => c.field === "nama")) {
        throw new Error("File harus memiliki kolom 'Nama'");
      }
      setColumnsPenilaian(mappedColumns);
      setRowsPenilaian(mappedRows);
      ToastSuccess.fire({ title: "Data uploaded successfully!" });
      setOpenUpload(false);
    } catch (err) {
      ToastError.fire({ title: err.message || "Upload gagal" });
    }
  };

  const handleDownloadPenilaian = () => {
    const success = handleDownloadFile(rowsPenilaian, "penilaian");
    if (success) ToastSuccess.fire({ title: "Download Success!" });
    else ToastError.fire({ title: "Download Failed!" });
  };

  useEffect(() => {
    if (!kelas) navigate("/kelas");
  }, []);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          {`${kelas?.nama_pelajaran} - ${kelas?.nama_kelas}`}
        </Typography>

        <Button
          variant="contained"
          color="warning"
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigate("/kelas")}
          sx={{ mb: 2 }}
        >
          Kembali
        </Button>
      </Box>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="scrollable"
        textColor="inherit"
        indicatorColor="primary"
        sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
      >
        <Tab label="Materi" />
        <Tab label="Daftar Siswa" />
        <Tab label="Presensi" />
        <Tab label="Module" />
        <Tab label="Penilaian" />
        <Tab
          label={
            <Badge color="error" badgeContent={notifCount}>
              Pengumuman
            </Badge>
          }
        />
      </Tabs>

      {/* Materi */}
      {tab === 0 && <TabMateri idKelasTahunAjaran={id} />}

      {/* Daftar Siswa */}
      {tab === 1 && <TabDaftarSiswa idKelasTahunAjaran={id} />}

      {/* Presensi */}
      {tab === 2 && (
        <TableTemplate
          key={"presensi"}
          title={"Presensi"}
          columns={columnsPresensi}
          rows={rowsPresensi}
          initialRowsPerPage={10}
          tableHeight={400}
          isCheckbox={false}
          isUpload={false}
          isDownload={false}
          onCreate={() => navigate(`/kelas/detail/${id}/presensi/new`)}
          onUpdate={(row) => navigate(`/kelas/detail/${id}/presensi/${row.id}`)}
          onDelete={(row) => console.log("Delete presensi:", row.id)}
        />
      )}

      {/* Module */}
      {tab === 3 && <TabModuleGuru />}

      {/* Penilaian */}
      {tab === 4 && (
        <>
          <TableTemplate
            key={"penilaian"}
            title={"Penilaian"}
            columns={columnsPenilaian}
            rows={rowsPenilaian}
            initialRowsPerPage={10}
            tableHeight={400}
            isCheckbox={false}
            isCreate={false}
            onUpload={handleOpenUpload}
            onDownload={handleDownloadPenilaian}
          />

          {/* Dialog Upload */}
          <Dialog open={openUpload} onClose={handleCloseUpload} fullWidth maxWidth="sm">
            <DialogTitle>Upload File XLSX</DialogTitle>
            <DialogContent dividers>
              <TextField
                type="file"
                fullWidth
                required
                inputProps={{ accept: ".xlsx,.csv" }}
                onChange={handleFileChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseUpload} color="primary">
                Batal
              </Button>
              <Button onClick={handleConfirmUpload} variant="contained" color="primary">
                Upload
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {/* Pengumuman */}
      {tab === 5 && <TabPengumuman />}
    </>
  );
}
