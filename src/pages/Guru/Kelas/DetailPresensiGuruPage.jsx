import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Grid,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import TableTemplate from "../../../components/tables/TableTemplate";
import { PopupEdit } from "../../../composables/sweetalert";

// Dummy data siswa
const dummyStudents = [
  { id: 1, nrp: "221170552", nama: "DEVINA NYOLANDA" },
  { id: 2, nrp: "221170553", nama: "ELIZABETH MICHELLIN KRISTIANI" },
  { id: 3, nrp: "221170566", nama: "STEPHEN REYNALD" },
  { id: 4, nrp: "221170567", nama: "ALICIA WIDYADHARI KOSMAN" },
  { id: 5, nrp: "221170572", nama: "CLARISSA AVRELIA TANWIJAYA" },
  { id: 6, nrp: "221170574", nama: "GRACIELLA JENNIEFER ADIWIJAYA" },
  { id: 7, nrp: "221170585", nama: "YOANES DE BRITTO BRANADI RYANDONO" },
];

const statusOptions = ["Hadir", "Tidak Hadir", "Ijin", "Sakit"];

export default function DetailPresensiGuruPage() {
  const { id, presensiId } = useParams();
  const navigate = useNavigate();

  // default hari ini
  const today = new Date().toISOString().split("T")[0];

  // form berita acara
  const [judul, setJudul] = useState("");
  const [tanggal, setTanggal] = useState(today);
  const [deskripsi, setDeskripsi] = useState("");
  const [errorJudul, setErrorJudul] = useState(false);

  // absensi siswa
  const [rowsAbsensi, setRowsAbsensi] = useState(
    dummyStudents.map((s) => ({
      ...s,
      status: "Hadir", // default hadir
    }))
  );

  // simpan data awal untuk deteksi perubahan
  const initialData = useMemo(
    () => ({
      judul: "",
      tanggal: today,
      deskripsi: "",
      absensi: dummyStudents.map((s) => ({ ...s, status: "Hadir" })),
    }),
    [today]
  );

  // cek apakah ada perubahan
  const isChanged = () => {
    if (judul !== initialData.judul) return true;
    if (tanggal !== initialData.tanggal) return true;
    if (deskripsi !== initialData.deskripsi) return true;
    for (let i = 0; i < rowsAbsensi.length; i++) {
      if (rowsAbsensi[i].status !== initialData.absensi[i].status) return true;
    }
    return false;
  };

  // columns untuk TableTemplate
  const columnsAbsensi = [
    { field: "nrp", label: "NRP", width: "150px" },
    { field: "nama", label: "Nama", width: "300px" },
    {
      field: "status",
      label: "Status Absensi",
      align: "center",
      width: "400px",
      render: (value, row) => (
        <RadioGroup
          row
          value={row.status}
          onChange={(e) =>
            setRowsAbsensi((prev) =>
              prev.map((r) =>
                r.id === row.id ? { ...r, status: e.target.value } : r
              )
            )
          }
          sx={{ justifyContent: "center" }}
        >
          {statusOptions.map((opt) => (
            <FormControlLabel
              key={opt}
              value={opt}
              control={<Radio />}
              label={opt}
            />
          ))}
        </RadioGroup>
      ),
    },
  ];

  const handleSimpan = () => {
    if (!judul.trim()) {
      setErrorJudul(true);
      return;
    }
    setErrorJudul(false);

    const data = {
      beritaAcara: {
        judul,
        tanggal,
        deskripsi,
      },
      absensi: rowsAbsensi,
    };
    console.log("Presensi tersimpan:", data);
    alert("Presensi berhasil disimpan! (lihat console.log)");
  };

  const handleBack = async () => {
    if (isChanged()) {
      const confirmClose = await PopupEdit.fire({
        title: "Cancel Create Data?",
        text: "Data sudah diisi sebagian. Yakin ingin membatalkan?",
      });
      if (!confirmClose.isConfirmed) return;
    }

    // jika presensiId bukan angka → kembali ke halaman kelas
    if (!presensiId || isNaN(Number(presensiId))) {
      navigate(`/kelas/detail/${id}`);
    } else {
      navigate(-1);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">
          Presensi Kelas {id} - {presensiId}
        </Typography>
        <Button
          variant="contained"
          color="warning"
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={handleBack}
        >
          Kembali
        </Button>
      </Box>

      {/* Form Berita Acara */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Berita Acara Presensi
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                label="Judul"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                error={errorJudul}
                helperText={errorJudul ? "Judul wajib diisi" : ""}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Tanggal"
                InputLabelProps={{ shrink: true }}
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Deskripsi"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table Absensi */}
      <TableTemplate
        key={"absensi"}
        title={"Daftar Absensi Siswa"}
        columns={columnsAbsensi}
        rows={rowsAbsensi}
        initialRowsPerPage={999}
        tableHeight={"auto"}
        isCheckbox={false}
        isUpload={false}
        isDownload={false}
        isCreate={false}
        isUpdate={false}
        isDelete={false}
        isPagination={false}
      />

      {/* Tombol Simpan */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSimpan}>
          Simpan Presensi
        </Button>
      </Box>
    </Box>
  );
}
