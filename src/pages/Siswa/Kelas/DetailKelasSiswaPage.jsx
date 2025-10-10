import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Badge,
  IconButton,
  Button,
} from "@mui/material";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TableTemplate from "../../../components/tables/TableTemplate";
import { formatDate } from "../../../utils/utils";
import TabPengumuman from "../../../components/classes/TabPengumuman";
import TabMateri from "../../../components/classes/TabMateri";
import TabDaftarSiswa from "../../../components/classes/TabDaftarSiswa";

export default function DetailKelasSiswaPage() {
  const location = useLocation();
  const { kelas } = location.state || {};
  const { id } = useParams();
  const navigate = useNavigate();

  const savedTab = Number(localStorage.getItem("detailKelasSiswaTab") || 0);
  const [tab, setTab] = useState(savedTab);
  const [notifCount, setNotifCount] = useState(0);

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    localStorage.setItem("detailKelasSiswaTab", newValue);
  };

  // Reset badge notifikasi ketika tab pengumuman dibuka
  useEffect(() => {
    if (tab === 4 && notifCount > 0) {
      setNotifCount(0);
    }
  }, [tab, notifCount]);

  // ===================== COLUMNS =====================
  const columnsListSiswa = [
    { field: "nrp", label: "NRP", width: "150px" },
    { field: "nama", label: "Nama", width: "400px" },
  ];

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

  const columnsModule = [
    { field: "namaModule", label: "Nama Module", width: "250px" },
    { field: "jenisModule", label: "Jenis Module", width: "120px" },
    { field: "sifat", label: "Sifat", width: "100px" },
    { field: "deadline", label: "Deadline", width: "250px" },
    { field: "status", label: "Status", width: "120px" },
    { field: "banyakPengumpulan", label: "Banyak Pengumpulan", width: "150px" },
    {
      field: "action",
      label: "Action",
      width: "100px",
      align: "center",
      render: (value, row) => (
        <IconButton
          onClick={() => navigate(`/kelas/detail/${id}/module/${row.id}`)}
        >
          <InfoOutlinedIcon color="primary" />
        </IconButton>
      ),
    },
  ];

  // ===================== DATA STATE =====================
  const [rowsListSiswa, setRowsListSiswa] = useState([]);
  const [rowsPresensi, setRowsPresensi] = useState([]);
  const [rowsModule, setRowsModule] = useState([]);

  // ===================== FETCH DATA =====================
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // TODO: Integrasikan ke API
        // const siswaRes = await getSiswaByKelas(id);
        // const presensiRes = await getPresensiByKelas(id);
        // const moduleRes = await getModulesByKelas(id);

        // setRowsListSiswa(siswaRes.data);
        // setRowsPresensi(presensiRes.data);
        // setRowsModule(moduleRes.data);
      } catch (err) {
        console.error("Gagal memuat data kelas:", err);
      }
    };

    fetchData();
  }, [id]);

  // ===================== RENDER =====================
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          {kelas?.title || "Detail Kelas"}
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
        <Tab
          label={
            <Badge color="error" badgeContent={notifCount}>
              Pengumuman
            </Badge>
          }
        />
      </Tabs>

      {/* Tab Materi */}
      {tab === 0 && <TabMateri idKelasTahunAjaran={id} />}

      {/* Tab Daftar Siswa */}
      {tab === 1 && <TabDaftarSiswa idKelasTahunAjaran={id} />}

      {/* Tab Presensi */}
      {tab === 2 && (
        <TableTemplate
          key={"presensi"}
          title={"Presensi"}
          columns={columnsPresensi}
          rows={rowsPresensi}
          initialRowsPerPage={10}
          tableHeight={400}
          isCheckbox={false}
          isUpdate={false}
          isDelete={false}
          isUpload={false}
          isCreate={false}
          isDownload={false}
        />
      )}

      {/* Tab Modul */}
      {tab === 3 && (
        <TableTemplate
          key={"modul"}
          title={"Modul"}
          columns={columnsModule}
          rows={rowsModule}
          initialRowsPerPage={10}
          tableHeight={400}
          isCheckbox={false}
          isUpdate={false}
          isDelete={false}
          isUpload={false}
          isCreate={false}
          isDownload={false}
        />
      )}

      {/* Tab Pengumuman */}
      {tab === 4 && <TabPengumuman idKelasTahunAjaran={id} />}
    </>
  );
}
