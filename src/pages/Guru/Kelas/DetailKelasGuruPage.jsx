import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Badge,
  Button
} from "@mui/material";
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TableTemplate from "../../../components/tables/TableTemplate";
import { formatDate } from "../../../utils/utils";
import TabPengumuman from "../../../components/classes/TabPengumuman";
import TabMateriGuru from "../../../components/classes/guru/TabMateriGuru";
import TabModuleGuru from "../../../components/classes/guru/TabModuleGuru";

export default function DetailKelasGuruPage() {
  const location = useLocation();
  const { kelas } = location.state || {};
  const { id } = useParams();
  const navigate = useNavigate();
  
  // ambil tab terakhir dari localStorage, default = 0
  const savedTab = Number(localStorage.getItem("detailKelasSiswaTab") || 0);
  const [tab, setTab] = React.useState(savedTab);
  const [notifCount, setNotifCount] = React.useState(3); // contoh awal notifikasi >0

  const handleTabChange = (e, newValue) => { 
    setTab(newValue);
    localStorage.setItem("detailKelasSiswaTab", newValue); // simpan ke localStorage
  };

  // Reset notifCount jika tab pengumuman dibuka
  useEffect(() => {
    if(tab === 4 && notifCount > 0){
      setNotifCount(0);
    }
  }, [tab, notifCount]);

  // === Data & Columns tetap sama ===
  const columnsListSiswa = [
    { field: "nrp", label: "NRP", width: "150px" },
    { field: "nama", label: "Nama", width: "400px" },
  ];

  const rowsListSiswa = [
    { id: 1, nrp: "221170552", nama: "DEVINA NYOLANDA" },
    { id: 2, nrp: "221170553", nama: "ELIZABETH MICHELLIN KRISTIANI" },
    { id: 3, nrp: "221170566", nama: "STEPHEN REYNALD" },
    { id: 4, nrp: "221170567", nama: "ALICIA WIDYADHARI KOSMAN" },
    { id: 5, nrp: "221170572", nama: "CLARISSA AVRELIA TANWIJAYA" },
    { id: 6, nrp: "221170574", nama: "GRACIELLA JENNIEFER ADIWIJAYA" },
    { id: 7, nrp: "221170585", nama: "YOANES DE BRITTO BRANADI RYANDONO" },
  ];

  const columnsPresensi = [
    { 
      field: "hariTanggal", 
      label: "Hari / Tanggal", 
      width: "200px", 
      render: (value) => formatDate(value)
    },
    { field: "topik", label: "Topik", width: "400px" },
    { 
      field: "absensi", 
      label: "Absensi", 
      width: "120px",
      align: "center",
      render: (value) => (
        value ? (
          <Box sx={{ fontSize: 28 }}>
            <CheckOutlinedIcon color="primary" fontSize="inherit" />
          </Box>
        ) : (
          <Box sx={{ fontSize: 28 }}>
            <CloseOutlinedIcon color="error" fontSize="inherit" />
          </Box>
        )
      )
    },
  ];

  const rowsPresensi = [
    { id: 1, hariTanggal: new Date("2025-09-01"), topik: "Pengenalan Materi & Kontrak Kuliah", absensi: true },
    { id: 2, hariTanggal: new Date("2025-09-09"), topik: "Bahasan Dasar - Introduction", absensi: true },
    { id: 3, hariTanggal: new Date("2025-09-17"), topik: "Praktikum Dasar", absensi: false },
    { id: 4, hariTanggal: new Date("2025-09-25"), topik: "Diskusi Studi Kasus", absensi: true },
  ];

  return <>
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {kelas?.title}
      </Typography>

      {/* Back Button */}
      <Button variant="contained" color="warning" startIcon={ <ArrowBackOutlinedIcon /> } onClick={ () => navigate("/kelas") } sx={{ mb: 2 }}>
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
      <Tab label={
        <Badge color="error" badgeContent={notifCount}>
          Pengumuman
        </Badge>
      } />
    </Tabs>

    {/* Materi */}
    {tab === 0 && <TabMateriGuru />}

    {/* Daftar Siswa */}
    {tab === 1 && (
      <TableTemplate
        key={"siswa"}
        title={"Daftar Siswa"}
        columns={columnsListSiswa}
        rows={rowsListSiswa}
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
        onCreate={() => {}}
        onUpdate={() => {console.log("Update")}}
        onDelete={() => {console.log("Delete")}}
      />
    )}

    {/* Module */}
    {tab === 3 && (
      <TabModuleGuru />
    )}

    {/* Penilaian */}
    
    {/* Pengumuman */}
    {tab === 5 && (
      <TabPengumuman />
    )}
  </>
}
