import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  Divider,
} from "@mui/material";
import TableTemplate from "../../components/tables/TableTemplate";
import { useRef, useState, useEffect } from "react";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { getNilaiSiswaByTahunAjaran } from "../../services/nilaiService";
import { downloadRaporByTahunAjaran } from "../../services/kelasSiswaService";
import { ToastError } from "../../composables/sweetalert";
import { getSimpleTahunAjaran } from "../../services/tahunAjaranService";

export default function NilaiSiswaPage() {
  const printRef = useRef();
  const [tahunAjaranList, setTahunAjaranList] = useState([]);
  const [selectedTahun, setSelectedTahun] = useState("");
  const [nilaiData, setNilaiData] = useState({});
  const [loading, setLoading] = useState(false);

  const [selectedTipe, setSelectedTipe] = useState("rapor_tengah_ganjil"); // default

  // ================== FETCH TAHUN AJARAN ==================
  const fetchTahunAjaran = async () => {
    try {
      const res = await getSimpleTahunAjaran();
      const data = res?.data || [];
      setTahunAjaranList(data);

      if (data.length > 0) {
        const last = data[data.length - 1];
        setSelectedTahun(last.id_tahun_ajaran);
      }
    } catch (err) {
      console.error("Error fetch tahun ajaran:", err);
    }
  };

  useEffect(() => {
    fetchTahunAjaran();
  }, []);

  // ================== FETCH NILAI ==================
  const fetchNilai = async (id_tahun_ajaran) => {
    if (!id_tahun_ajaran) return;

    try {
      setLoading(true);
      const res = await getNilaiSiswaByTahunAjaran(id_tahun_ajaran);

      if (res.message !== "success") {
        setNilaiData({});
        return;
      }

      const dataPelajaran = Object.fromEntries(
        Object.entries(res).filter(([key]) => key !== "message")
      );
      setNilaiData(dataPelajaran);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTahun) fetchNilai(selectedTahun);
  }, [selectedTahun]);

  // ================== HANDLE DOWNLOAD ==================
  const handleDownloadRapor = async () => {
    if (!selectedTahun || !selectedTipe) return;
    try {
      setLoading(true);
      const res = await downloadRaporByTahunAjaran(selectedTahun, selectedTipe);

      if (res.status === 400 || res?.data?.message) {
        ToastError.fire({
          title: res?.data?.message || "Gagal download rapor. Periksa data terlebih dahulu.",
        });
        return;
      }

      // Jika response Blob lanjutkan download
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${selectedTipe}_${selectedTahun}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        ToastError.fire({
          title: err.response?.data?.message || "Data rapor tidak ditemukan.",
        });
      } else {
        ToastError.fire({ title: "Terjadi kesalahan saat mengunduh rapor." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h4">Nilai Akademik</Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "flex-end",
            }}
          >
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Tahun Ajaran</InputLabel>
              <Select
                label="Tahun Ajaran"
                value={selectedTahun}
                onChange={(e) => setSelectedTahun(e.target.value)}
              >
                {tahunAjaranList.map((th) => (
                  <MenuItem key={th.id_tahun_ajaran} value={th.id_tahun_ajaran}>
                    {th.nama}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Tipe Rapor</InputLabel>
              <Select
                label="Tipe Rapor"
                value={selectedTipe}
                onChange={(e) => setSelectedTipe(e.target.value)}
              >
                <MenuItem value="rapor_tengah_ganjil">Tengah Semester Ganjil</MenuItem>
                <MenuItem value="rapor_akhir_ganjil">Akhir Semester Ganjil</MenuItem>
                <MenuItem value="rapor_tengah_genap">Tengah Semester Genap</MenuItem>
                <MenuItem value="rapor_akhir_genap">Akhir Semester Genap</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              endIcon={<DownloadOutlinedIcon />}
              onClick={handleDownloadRapor}
              disabled={loading}
            >
              {loading ? "Mengunduh..." : "Download Rapor"}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Table Section */}
      <Box ref={printRef} sx={{ width: "100%", maxWidth: "100%" }}>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : Object.keys(nilaiData).length === 0 ? (
          <Typography variant="body1" align="center" sx={{ py: 4 }}>
            Tidak ada data nilai untuk tahun ajaran ini.
          </Typography>
        ) : (
          Object.entries(nilaiData).map(([namaPelajaran, data]) => (
            <Box key={namaPelajaran} sx={{ mb: 5 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {namaPelajaran}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TableTemplate
                key={namaPelajaran}
                title={namaPelajaran}
                columns={data.headers}
                rows={data.rows}
                initialRowsPerPage={999}
                tableHeight="auto"
                isCheckbox={false}
                isUpdate={false}
                isDelete={false}
                isUpload={false}
                isCreate={false}
                isDownload={false}
                isPagination={false}
              />
            </Box>
          ))
        )}
      </Box>
    </>
  );
}
