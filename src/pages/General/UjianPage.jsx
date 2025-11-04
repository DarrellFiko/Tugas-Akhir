import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getPelajaranByRole } from "../../services/kelasTahunAjaranService";
import { getSimpleTahunAjaran } from "../../services/tahunAjaranService";

export default function UjianPage() {
  const navigate = useNavigate();

  const [tahunAjaranList, setTahunAjaranList] = useState([]);
  const [selectedTahun, setSelectedTahun] = useState("");
  const [kelasList, setKelasList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ================== FETCH PELAJARAN SESUAI ROLE ==================
  const fetchPelajaranByRole = async (tahunId) => {
    if (!tahunId) return [];
    try {
      const res = await getPelajaranByRole(tahunId);
      return res?.data?.data || res?.data || [];
    } catch (err) {
      console.error("Error fetch pelajaran:", err);
      return [];
    }
  };

  // ================== FETCH TAHUN AJARAN ==================
  const fetchTahunAjaran = async () => {
    try {
      const res = await getSimpleTahunAjaran();
      const data = res?.data?.data || res?.data || [];
      setTahunAjaranList(data);

      if (data.length > 0) {
        // const last = data[data.length - 1];
        setSelectedTahun(data[0]);

        setIsLoading(true);
        const kelas = await fetchPelajaranByRole(last.id_tahun_ajaran);
        setKelasList(kelas);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error fetch tahun ajaran:", err);
    }
  };

  // ================== FETCH SAAT GANTI TAHUN ==================
  useEffect(() => {
    if (!selectedTahun) return;
    const fetch = async () => {
      setIsLoading(true);
      const kelas = await fetchPelajaranByRole(selectedTahun);
      setKelasList(kelas);
      setIsLoading(false);
    };
    fetch();
  }, [selectedTahun]);

  // ================== FETCH SAAT MOUNT ==================
  useEffect(() => {
    fetchTahunAjaran();
  }, []);

  // ================== HANDLER CARD CLICK ==================
  const handleCardClick = (kelas) => {
    localStorage.setItem("detailKelasSiswaTab", 0);
    navigate(`/ujian/detail/${kelas.id_kelas_tahun_ajaran}`, { state: { kelas } });
  };

  return (
    <>
      {/* Header */}
      <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h4">Ujian Online</Typography>
        </Grid>

        {/* Dropdown Tahun Ajaran */}
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "flex-end",
            }}
          >
            <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
              <InputLabel id="tahun-select-label">Pilih Tahun Ajaran</InputLabel>
              <Select
                labelId="tahun-select-label"
                value={selectedTahun}
                onChange={(e) => setSelectedTahun(e.target.value)}
              >
                {tahunAjaranList.map((item) => (
                  <MenuItem key={item.id_tahun_ajaran} value={item.id_tahun_ajaran}>
                    {item.nama}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>

      {/* Grid Kelas */}
      <Grid container spacing={3} alignItems="stretch">
        {isLoading ? (
          <Grid item size={{ xs: 12 }}>
            <Typography variant="body1">Memuat data kelas...</Typography>
          </Grid>
        ) : kelasList.length > 0 ? (
          kelasList.map((c, index) => (
            <Grid item key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                onClick={() => handleCardClick(c)}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  boxShadow: 1,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 4,
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent sx={{ flex: 1, textAlign: "center" }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                    {c.nama_pelajaran}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ wordBreak: "break-word", whiteSpace: "normal", mb: 1 }}
                  >
                    {c.nama_kelas || "-"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ wordBreak: "break-word", whiteSpace: "normal" }}
                  >
                    {c.nama_pengajar || "-"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Tidak ada kelas tersedia untuk tahun ajaran ini.
            </Typography>
          </Grid>
        )}
      </Grid>
    </>
  );
}
