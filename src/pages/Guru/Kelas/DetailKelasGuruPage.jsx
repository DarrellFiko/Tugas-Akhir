import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useNavigate, useParams } from "react-router-dom";

import TabPengumuman from "../../../components/classes/TabPengumuman";
import TabMateri from "../../../components/classes/TabMateri";
import TabDaftarSiswa from "../../../components/classes/TabDaftarSiswa";
import { getKelasTahunAjaranById } from "../../../services/kelasTahunAjaranService";
import TabPresensi from "../../../components/classes/TabPresensi";
import TabModule from "../../../components/classes/TabModule";
import TableTemplate from "../../../components/tables/TableTemplate";
import { getNilaiGuruByKelas } from "../../../services/nilaiService";

export default function DetailKelasGuruPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ambil tab terakhir dari localStorage, default = 0
  const savedTab = Number(localStorage.getItem("detailKelasSiswaTab") || 0);
  const [tab, setTab] = useState(savedTab);
  const [kelas, setKelas] = useState(null);

  // State untuk nilai siswa
  const [loadingSiswa, setLoadingSiswa] = useState(false);
  const [rowsNilaiSiswa, setRowsNilaiSiswa] = useState([]);
  const [nilaiSiswa, setNilaiSiswa] = useState([]);

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

  // Fetch nilai siswa (guru)
  const fetchNilaiGuru = async () => {
    setLoadingSiswa(true);
    try {
      const res = await getNilaiGuruByKelas(id);
      const headers = res.headers || [];
      const rows = res.rows || [];

      // Format kolom untuk TableTemplate
      const columns = [
        ...headers.map((h) => ({
          field: h?.field,
          label: h?.label,
          width: h?.width,
        })),
      ];

      setNilaiSiswa(columns);
      setRowsNilaiSiswa(rows);
    } catch (error) {
      console.error("Gagal mengambil nilai:", error);
    } finally {
      setLoadingSiswa(false);
    }
  };

  useEffect(() => {
    fetchKelasTahunAjaran();
  }, []);

  useEffect(() => {
    if (tab === 4) {
      fetchNilaiGuru();
    }
  }, [tab]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ }}>
          {`${kelas?.Pelajaran?.nama_pelajaran || "-"} - ${
            kelas?.Kelas?.nama_kelas || "-"
          }`}
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
        <Tab label="Nilai Siswa" />
        <Tab label="Pengumuman" />
      </Tabs>

      {/* Materi */}
      {tab === 0 && <TabMateri idKelasTahunAjaran={id} />}

      {/* Daftar Siswa */}
      {tab === 1 && <TabDaftarSiswa idKelasTahunAjaran={id} />}

      {/* Presensi */}
      {tab === 2 && <TabPresensi idKelasTahunAjaran={id} />}

      {/* Module */}
      {tab === 3 && <TabModule />}

      {/* Nilai Siswa */}
      {tab === 4 && (
        <>
        {console.log(rowsNilaiSiswa)}
        {console.log(nilaiSiswa)}
          {loadingSiswa ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableTemplate
              isLoading={loadingSiswa}
              key={"nilai"}
              title={"Nilai Siswa"}
              columns={nilaiSiswa}
              rows={rowsNilaiSiswa}
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
        </>
      )}

      {/* Pengumuman */}
      {tab === 5 && <TabPengumuman />}
    </>
  );
}
