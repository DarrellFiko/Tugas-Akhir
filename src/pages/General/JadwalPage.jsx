import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import TableTemplate from "../../components/tables/TableTemplate";
import { handlePrint } from "../../utils/utils";
import { getSimpleTahunAjaran } from "../../services/tahunAjaranService";
import { getJadwalGuru, getJadwalSiswa } from "../../services/jadwalPelajaranService";

export default function JadwalPage() {
  const printRef = useRef();
  const role = localStorage.getItem("role")?.toLowerCase(); // pastikan lowercase agar aman

  // ================== STATES ==================
  const [tahunAjaranList, setTahunAjaranList] = useState([]);
  const [selectedTahun, setSelectedTahun] = useState("");
  const [jadwalData, setJadwalData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ================== COLUMNS ==================
  const studentColumns = [
    { field: "jam", label: "Jam", width: "auto" },
    { field: "pelajaran", label: "Pelajaran", width: "180px" },
    { field: "pengajar", label: "Pengajar", width: "220px" },
  ];

  const teacherColumns = [
    { field: "jam", label: "Jam", width: "auto" },
    { field: "pelajaran", label: "Pelajaran", width: "220px" },
    { field: "kelas", label: "Kelas", width: "180px" },
  ];

  // ================== FETCH FUNCTION (UTILITY) ==================
  const fetchJadwalByRole = async (role, tahunId) => {
    if (!tahunId) return {};
    try {
      let res;

      if (role === "guru") {
        res = await getJadwalGuru(tahunId);
      } else if (role === "siswa") {
        res = await getJadwalSiswa(tahunId);
      } else {
        console.warn("Role tidak dikenali:", role);
        return {};
      }

      // Backend sudah return object grouped per hari (misal: {Senin: [...], Selasa: [...]})
      return res?.data || {};
    } catch (err) {
      console.error("Error fetch jadwal:", err);
      return {};
    }
  };

  // ================== FETCH TAHUN AJARAN ==================
  const fetchTahunAjaran = async () => {
    try {
      const res = await getSimpleTahunAjaran();
      const data = res?.data || [];
      setTahunAjaranList(data);

      if (data.length > 0) {
        const last = data[data.length - 1];
        setSelectedTahun(last.id_tahun_ajaran);

        setIsLoading(true);
        const jadwal = await fetchJadwalByRole(role, last.id_tahun_ajaran);
        setJadwalData(jadwal);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error fetch tahun ajaran:", err);
    }
  };

  // ================== FETCH JADWAL SAAT GANTI TAHUN ==================
  useEffect(() => {
    if (!selectedTahun) return;
    const fetch = async () => {
      setIsLoading(true);
      const jadwal = await fetchJadwalByRole(role, selectedTahun);
      setJadwalData(jadwal);
      setIsLoading(false);
    };
    fetch();
  }, [selectedTahun]);

  // ================== FETCH SAAT MOUNT ==================
  useEffect(() => {
    fetchTahunAjaran();
  }, []);

  // ================== SORT HARI (Senin - Sabtu) ==================
  const dayOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const sortedJadwal = Object.keys(jadwalData)
    .sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b))
    .reduce((obj, key) => {
      obj[key] = jadwalData[key];
      return obj;
    }, {});

  // ================== RENDER ==================
  return (
    <>
      {/* HEADER */}
      <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <Typography variant="h4">Jadwal Pelajaran</Typography>
        </Grid>

        {/* Dropdown Tahun Ajaran */}
        <Grid item size={{ xs: 12, sm: "auto" }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center"}}>
            {/* Select Tahun Ajaran */}
            <FormControl size="small" sx={{ minWidth: 180 }}>
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

            {/* Print Button */}
            <Button
              variant="contained"
              color="primary"
              endIcon={<PrintOutlinedIcon />}
              onClick={() => handlePrint(printRef)}
              disabled={isLoading}
            >
              {isLoading ? "Memuat..." : "Cetak Jadwal"}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* CONTENT */}
      <Box ref={printRef}>
        <Grid container spacing={3}>
          {isLoading ? (
            <Grid item size={{ xs: 12 }}>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Memuat jadwal...
              </Typography>
            </Grid>
          ) : Object.keys(sortedJadwal).length > 0 ? (
            Object.entries(sortedJadwal).map(([hari, data]) => (
              <Grid item size={{ xs: 12, md: 6 }} key={hari}>
                <TableTemplate
                  key={hari}
                  title={hari}
                  columns={role === "siswa" ? studentColumns : teacherColumns}
                  rows={data || []}
                  initialRowsPerPage={999}
                  tableHeight={400}
                  isCheckbox={false}
                  isUpdate={false}
                  isDelete={false}
                  isUpload={false}
                  isCreate={false}
                  isDownload={false}
                  isPagination={false}
                  hideToolbar
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Tidak ada jadwal tersedia untuk tahun ajaran ini.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
}
