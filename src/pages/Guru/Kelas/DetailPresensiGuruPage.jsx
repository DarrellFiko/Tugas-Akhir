// src/pages/classes/guru/DetailPresensiGuruPage.jsx

import React, { useState, useEffect, useMemo } from "react";
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
import { PopupEdit, ToastError, ToastSuccess } from "../../../composables/sweetalert";
import { getListSiswaByKelasTahunAjaran } from "../../../services/kelasSiswaService";
import {
  createBeritaAcara,
  getBeritaAcaraById,
  updateBeritaAcara,
} from "../../../services/beritaAcaraService";

const statusOptions = ["Hadir", "Izin", "Sakit", "Alpha"];

export default function DetailPresensiGuruPage() {
  const { id, presensiId } = useParams();
  const navigate = useNavigate();
  const [loadingCreate, setLoadingCreate] = useState(false);

  // default hari ini
  const today = new Date().toISOString().split("T")[0];

  // form berita acara
  const [judul, setJudul] = useState("");
  const [tanggal, setTanggal] = useState(today);
  const [deskripsi, setDeskripsi] = useState("");
  const [errorJudul, setErrorJudul] = useState(false);

  // absensi siswa
  const [rowsAbsensi, setRowsAbsensi] = useState([]);
  const [loadingSiswa, setLoadingSiswa] = useState(false);

  const presensiIdIsInteger = () => {
    if (!presensiId) return false;
    const n = Number(presensiId);
    return Number.isInteger(n) && !Number.isNaN(n);
  };

  // ================== FETCH DATA ==================
  const fetchData = async () => {
    if (!id) return;
    try {
      setLoadingSiswa(true);

      const listRes = await getListSiswaByKelasTahunAjaran(id);
      const siswaList = listRes?.data || [];

      // jika belum ada presensi, default Hadir
      if (!presensiIdIsInteger()) {
        setRowsAbsensi(siswaList.map((s) => ({ ...s, status: "Hadir" })));
        return;
      }

      try {
        const beritaRes = await getBeritaAcaraById(presensiId);
        const berita = beritaRes?.data || null;

        if (berita) {
          setJudul(berita.judul || "");
          setTanggal(berita.tanggal || today);
          setDeskripsi(berita.deskripsi || "");
        }

        // mapping status dari berita acara
        const presensiList = (berita?.presensiList || []).reduce((acc, p) => {
          const siswaId = p?.siswa?.id_user ?? p.id_siswa;
          if (siswaId != null) acc[String(siswaId)] = p;
          return acc;
        }, {});

        // merge dengan daftar siswa terbaru
        const merged = siswaList.map((s) => {
          const idUser = s.id_user ?? s.id_siswa ?? s.id;
          const pres = presensiList[String(idUser)];
          return {
            ...s,
            id_user: idUser,
            status: pres ? pres.status : "Alpha",
          };
        });

        setRowsAbsensi(merged);
      } catch (err) {
        console.error("Gagal ambil berita acara, fallback ke daftar siswa:", err);
        setRowsAbsensi(siswaList.map((s) => ({ ...s, status: "Hadir" })));
      }
    } catch (err) {
      console.error("Gagal memuat daftar siswa:", err);
    } finally {
      setLoadingSiswa(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id, presensiId]);

  // ================== LOGIC ==================
  const initialData = useMemo(
    () => ({
      judul: "",
      tanggal: today,
      deskripsi: "",
      absensi: rowsAbsensi.map((s) => ({ ...s, status: "Hadir" })),
    }),
    [today]
  );

  const isChanged = () => {
    if (presensiIdIsInteger()) return false;
    if (judul !== initialData.judul) return true;
    if (tanggal !== initialData.tanggal) return true;
    if (deskripsi !== initialData.deskripsi) return true;
    for (let i = 0; i < rowsAbsensi.length; i++) {
      if (rowsAbsensi[i].status !== "Hadir") return true;
    }
    return false;
  };

  const columnsAbsensi = [
    { field: "nis", label: "NIS", width: "150px" },
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
                r.id_user === row.id_user ? { ...r, status: e.target.value } : r
              )
            )
          }
          sx={{ justifyContent: "center" }}
        >
          {statusOptions.map((opt) => (
            <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
          ))}
        </RadioGroup>
      ),
    },
  ];

  // ================== HANDLE SIMPAN ==================
  const handleSimpan = async () => {
    if (!judul.trim()) {
      setErrorJudul(true);
      return;
    }
    setErrorJudul(false);
    setLoadingCreate(true);
    try {
      const body = {
        id_kelas_tahun_ajaran: id,
        judul,
        deskripsi,
        tanggal,
        presensi: rowsAbsensi.map((r) => ({
          id_siswa: r.id_user,
          status: r.status,
        })),
      };

      if (presensiIdIsInteger()) {
        await updateBeritaAcara(presensiId, body);
      } else {
        await createBeritaAcara(body);
      }

      ToastSuccess.fire({
        text: presensiIdIsInteger()
          ? "Presensi berhasil diperbarui"
          : "Presensi berhasil disimpan",
      });
      navigate(`/kelas/detail/${id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCreate(false);
    }
  };

  // ================== HANDLE BACK ==================
  const handleBack = async () => {
    if (isChanged()) {
      const confirmClose = await PopupEdit.fire({
        title: "Batalkan?",
        text: "Data sudah diisi sebagian. Yakin ingin membatalkan?",
      });
      if (!confirmClose.isConfirmed) return;
    }
    navigate(`/kelas/detail/${id}`);
  };

  // ================== RENDER ==================
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
        <Typography variant="h4">Presensi Kelas - {presensiId ?? id}</Typography>
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
        isLoading={loadingSiswa}
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
        <Button
          disabled={loadingCreate}
          variant="contained"
          color="primary"
          onClick={handleSimpan}
        >
          Simpan Presensi
        </Button>
      </Box>
    </Box>
  );
}
