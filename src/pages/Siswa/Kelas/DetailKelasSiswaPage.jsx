import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TabPengumuman from "../../../components/classes/TabPengumuman";
import TabMateri from "../../../components/classes/TabMateri";
import TabDaftarSiswa from "../../../components/classes/TabDaftarSiswa";
import TabPresensi from "../../../components/classes/TabPresensi";

import TabModule from "../../../components/classes/TabModule";
import { getKelasTahunAjaranById } from "../../../services/kelasTahunAjaranService";

export default function DetailKelasSiswaPage() {
  const location = useLocation();
  const [kelas, setKelas] = useState(null)
  const { id } = useParams();
  const navigate = useNavigate();

  const savedTab = Number(localStorage.getItem("detailKelasSiswaTab") || 0);
  const [tab, setTab] = useState(savedTab);

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    localStorage.setItem("detailKelasSiswaTab", newValue);
  };

  // Fetch detail kelas
  const fetchKelasTahunAjaran = async () => {
    try {
      const res = await getKelasTahunAjaranById(id);
      setKelas(res.data);
    } catch (error) {
      navigate("/kelas");
    }
  };

  useEffect(() => {
    fetchKelasTahunAjaran()
  }, [])

  return (
    <>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ }}>
          Detail Kelas { kelas?.Pelajaran?.nama_pelajaran }
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

      {/* TABS */}
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
        <Tab label="Modul" />
        <Tab label="Pengumuman" />
      </Tabs>

      {/* TAB CONTENT */}
      {tab === 0 && <TabMateri idKelasTahunAjaran={id} />}
      {tab === 1 && <TabDaftarSiswa idKelasTahunAjaran={id} />}
      {tab === 2 && <TabPresensi idKelasTahunAjaran={id} />}
      {tab === 3 && <TabModule />}
      {tab === 4 && <TabPengumuman idKelasTahunAjaran={id} />}
    </>
  );
}
