import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  IconButton,
  Paper,
  Checkbox,
  Radio,
  FormControlLabel,
} from "@mui/material";
import { Add, Delete, Upload } from "@mui/icons-material";

export default function FormUjianGuruPage() {
  const [formData, setFormData] = useState({
    jenisUjian: "",
    totalSiswa: "",
    waktu: new Date().toISOString().slice(0, 16), // default hari ini
    durasi: "",
    soal: [],
  });
  const [errors, setErrors] = useState({});

  // Tambah soal baru
  const handleAddSoal = (type) => {
    setFormData((prev) => ({
      ...prev,
      soal: [
        ...prev.soal,
        {
          id: Date.now(),
          type,
          pertanyaan: "",
          options:
            type === "pilihan_ganda_satu" || type === "pilihan_ganda_banyak"
              ? ["", ""]
              : [],
          jawaban:
            type === "pilihan_ganda_satu"
              ? null
              : type === "pilihan_ganda_banyak"
              ? []
              : "",
          image: null,
        },
      ],
    }));
  };

  // Hapus soal
  const handleRemoveSoal = (id) => {
    setFormData((prev) => ({
      ...prev,
      soal: prev.soal.filter((s) => s.id !== id),
    }));
  };

  // Update soal field
  const handleSoalChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      soal: prev.soal.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));
  };

  // Tambah pilihan
  const handleAddOption = (id) => {
    setFormData((prev) => ({
      ...prev,
      soal: prev.soal.map((s) =>
        s.id === id ? { ...s, options: [...s.options, ""] } : s
      ),
    }));
  };

  // Update isi option
  const handleOptionChange = (id, idx, value) => {
    setFormData((prev) => ({
      ...prev,
      soal: prev.soal.map((s) => {
        if (s.id === id) {
          const updatedOptions = s.options.map((opt, i) =>
            i === idx ? value : opt
          );
          return { ...s, options: updatedOptions };
        }
        return s;
      }),
    }));
  };

  // Toggle jawaban benar
  const handleJawabanBenar = (id, idx, type) => {
    setFormData((prev) => ({
      ...prev,
      soal: prev.soal.map((s) => {
        if (s.id === id) {
          if (type === "pilihan_ganda_satu") {
            return { ...s, jawaban: idx }; // hanya 1 yang bisa dipilih
          } else if (type === "pilihan_ganda_banyak") {
            let updated = [...s.jawaban];
            if (updated.includes(idx)) {
              updated = updated.filter((j) => j !== idx);
            } else {
              updated.push(idx);
            }
            return { ...s, jawaban: updated };
          }
        }
        return s;
      }),
    }));
  };

  // Upload gambar
  const handleUploadImage = (id, file) => {
    const url = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      soal: prev.soal.map((s) =>
        s.id === id ? { ...s, image: url } : s
      ),
    }));
  };

  // Validasi
  const validateForm = () => {
    let newErrors = {};

    if (!formData.jenisUjian) {
      newErrors.jenisUjian = "Jenis ujian wajib diisi";
    }

    formData.soal.forEach((s, index) => {
      if (!s.pertanyaan.trim()) {
        newErrors[`soal-${s.id}-pertanyaan`] =
          "Pertanyaan wajib diisi";
      }
      if (
        (s.type === "pilihan_ganda_satu" ||
          s.type === "pilihan_ganda_banyak") &&
        s.options.length < 2
      ) {
        newErrors[`soal-${s.id}-options`] =
          "Minimal 2 opsi diperlukan";
      }
      if (
        s.type === "pilihan_ganda_satu" &&
        (s.jawaban === null || s.jawaban === undefined)
      ) {
        newErrors[`soal-${s.id}-jawaban`] =
          "Harus pilih 1 jawaban benar";
      }
      if (
        s.type === "pilihan_ganda_banyak" &&
        (!s.jawaban || s.jawaban.length === 0)
      ) {
        newErrors[`soal-${s.id}-jawaban`] =
          "Minimal 1 jawaban benar harus dipilih";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    console.log("Form Data:", formData);
    alert("Form ujian tersimpan! (lihat console)");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Form Ujian Guru
      </Typography>

      <Grid container spacing={2}>
        {/* Jenis Ujian */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Jenis Ujian"
            name="jenisUjian"
            value={formData.jenisUjian}
            onChange={(e) =>
              setFormData({ ...formData, jenisUjian: e.target.value })
            }
            required
            fullWidth
            error={!!errors.jenisUjian}
            helperText={errors.jenisUjian}
          />
        </Grid>

        {/* Total Siswa */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Total Siswa"
            type="number"
            name="totalSiswa"
            value={formData.totalSiswa}
            onChange={(e) =>
              setFormData({ ...formData, totalSiswa: e.target.value })
            }
            fullWidth
          />
        </Grid>

        {/* Waktu */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Waktu Pelaksanaan"
            type="datetime-local"
            name="waktu"
            value={formData.waktu}
            onChange={(e) =>
              setFormData({ ...formData, waktu: e.target.value })
            }
            fullWidth
          />
        </Grid>

        {/* Durasi */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Durasi (menit)"
            type="number"
            name="durasi"
            value={formData.durasi}
            onChange={(e) =>
              setFormData({ ...formData, durasi: e.target.value })
            }
            fullWidth
          />
        </Grid>
      </Grid>

      {/* List Soal */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Soal Ujian</Typography>

        {formData.soal.map((s, index) => (
          <Paper
            key={s.id}
            sx={{ p: 2, mb: 2, border: "1px solid #ddd" }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography variant="subtitle1">
                Soal {index + 1} ({s.type})
              </Typography>
              <IconButton onClick={() => handleRemoveSoal(s.id)}>
                <Delete />
              </IconButton>
            </Box>

            {/* Pertanyaan */}
            <TextField
              label="Pertanyaan"
              fullWidth
              multiline
              required
              sx={{ mt: 1 }}
              value={s.pertanyaan}
              error={!!errors[`soal-${s.id}-pertanyaan`]}
              helperText={errors[`soal-${s.id}-pertanyaan`]}
              onChange={(e) =>
                handleSoalChange(s.id, "pertanyaan", e.target.value)
              }
            />

            {/* Upload Gambar */}
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<Upload />}
              >
                Upload Gambar (opsional)
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    handleUploadImage(s.id, e.target.files[0])
                  }
                />
              </Button>
              {s.image && (
                <Box sx={{ mt: 1 }}>
                  <img
                    src={s.image}
                    alt="soal"
                    style={{ maxWidth: "200px", borderRadius: "8px" }}
                  />
                </Box>
              )}
            </Box>

            {/* Kalau pilihan ganda */}
            {(s.type === "pilihan_ganda_satu" ||
              s.type === "pilihan_ganda_banyak") && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Pilihan:
                </Typography>
                {s.options.map((opt, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    {s.type === "pilihan_ganda_satu" ? (
                      <FormControlLabel
                        control={
                          <Radio
                            checked={s.jawaban === idx}
                            onChange={() =>
                              handleJawabanBenar(s.id, idx, s.type)
                            }
                          />
                        }
                        label=""
                      />
                    ) : (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={s.jawaban.includes(idx)}
                            onChange={() =>
                              handleJawabanBenar(s.id, idx, s.type)
                            }
                          />
                        }
                        label=""
                      />
                    )}
                    <TextField
                      placeholder={`Opsi ${idx + 1}`}
                      value={opt}
                      required
                      onChange={(e) =>
                        handleOptionChange(s.id, idx, e.target.value)
                      }
                      fullWidth
                    />
                  </Box>
                ))}
                {errors[`soal-${s.id}-options`] && (
                  <Typography color="error" variant="caption">
                    {errors[`soal-${s.id}-options`]}
                  </Typography>
                )}
                {errors[`soal-${s.id}-jawaban`] && (
                  <Typography color="error" variant="caption">
                    {errors[`soal-${s.id}-jawaban`]}
                  </Typography>
                )}
                <Button
                  size="small"
                  onClick={() => handleAddOption(s.id)}
                  sx={{ mt: 1 }}
                >
                  + Tambah Pilihan
                </Button>
              </Box>
            )}
          </Paper>
        ))}

        {/* Tombol tambah soal */}
        <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => handleAddSoal("pilihan_ganda_satu")}
          >
            Pilihan Ganda (1 Jawaban)
          </Button>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => handleAddSoal("pilihan_ganda_banyak")}
          >
            Pilihan Ganda (Lebih dari 1 Jawaban)
          </Button>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => handleAddSoal("jawaban_singkat")}
          >
            Jawaban Singkat
          </Button>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => handleAddSoal("uraian")}
          >
            Uraian
          </Button>
        </Box>
      </Box>

      <Button type="submit" variant="contained" sx={{ mt: 3 }}>
        Simpan Ujian
      </Button>
    </Box>
  );
}
