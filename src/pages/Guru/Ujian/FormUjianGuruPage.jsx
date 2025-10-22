// src/pages/guru/FormUjianGuruPage.jsx
import { useState, useEffect } from "react";
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
  Autocomplete,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Add, Delete, Upload, Close } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { ToastError, ToastSuccess } from "../../../composables/sweetalert";
import { getListSiswaByKelasTahunAjaran } from "../../../services/kelasSiswaService";
import { createUjian, getUjianById, updateUjian } from "../../../services/ujianService";
import { createSoal, updateSoal, deleteSoal } from "../../../services/soalService";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { handleDownloadFileExcel, handleUploadFile } from "../../../utils/utils";
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';

const toLocalDatetime = (date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

// safe JSON parse helper
const safeParse = (val) => {
  if (val === null || val === undefined) return val;
  if (typeof val === "object") return val;
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      // fallback: if it's a plain numeric string like "0", JSON.parse works; if not, return the string
      return val;
    }
  }
  return val;
};

export default function FormUjianGuruPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { idKelasTahunAjaran, idUjian } = useParams();

  const now = new Date();
  const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  const [formData, setFormData] = useState({
    jenisUjian: "",
    startDate: toLocalDatetime(now),
    endDate: toLocalDatetime(twoHoursLater),
    listSiswa: [],
    soal: [],
  });

  const [siswaList, setSiswaList] = useState([]);
  const [loadingSiswa, setLoadingSiswa] = useState(false);
  const [errors, setErrors] = useState({});
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // store IDs of soal that were removed (existing soal) to delete on submit
  const [deletedSoalIds, setDeletedSoalIds] = useState([]);

  // ================== FETCH SISWA ==================
  const fetchSiswa = async () => {
    try {
      setLoadingSiswa(true);
      const res = await getListSiswaByKelasTahunAjaran(idKelasTahunAjaran);
      const data = res?.data || [];
      setSiswaList(data);

      // if currently formData.listSiswa is empty (new form) set default to all siswa
      setFormData((prev) => ({
        ...prev,
        listSiswa:
          (prev.listSiswa && prev.listSiswa.length > 0)
            ? prev.listSiswa
            : data.map((s) => s.id_user),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSiswa(false);
    }
  };

  useEffect(() => {
    if (idKelasTahunAjaran) fetchSiswa();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idKelasTahunAjaran]);

  // ================== FETCH DETAIL UJIAN (EDIT MODE) ==================
  useEffect(() => {
    const fetchUjianDetail = async () => {
      try {
        if (!idUjian) return;
        const res = await getUjianById(idUjian);
        const ujian = res?.data;

        if (ujian) {
          // parse list_siswa safely (it might be a JSON string or an array)
          let parsedListSiswa = [];
          if (Array.isArray(ujian.list_siswa)) {
            parsedListSiswa = ujian.list_siswa;
          } else if (typeof ujian.list_siswa === "string") {
            try {
              parsedListSiswa = JSON.parse(ujian.list_siswa);
            } catch {
              // if parsing fails, try to extract numbers e.g. "[6,5]" fallback already attempted; else keep empty
              parsedListSiswa = [];
            }
          }

          // Soal might be returned under `soalList` or `soal` depending on your backend
          const soalFromResp = ujian.soalList || ujian.soal || [];

          const mappedSoal = (Array.isArray(soalFromResp) ? soalFromResp : []).map((s) => {
            // list_jawaban and jawaban_benar may be JSON strings in response; parse them
            const parsedListJawaban = safeParse(s.list_jawaban) || [];
            let parsedJawabanBenar = safeParse(s.jawaban_benar);

            // Normalize jawaban_benar:
            // - for "pilihan_ganda_satu" we want a number or null
            // - for "pilihan_ganda_banyak" we want an array
            if (s.jenis_soal && s.jenis_soal.includes("satu")) {
              // if parsed is array, take first? but better coerce to number if possible
              if (Array.isArray(parsedJawabanBenar)) {
                parsedJawabanBenar = parsedJawabanBenar.length > 0 ? parsedJawabanBenar[0] : null;
              } else if (typeof parsedJawabanBenar === "string") {
                // "0" -> 0
                const maybeNum = Number(parsedJawabanBenar);
                parsedJawabanBenar = Number.isFinite(maybeNum) ? maybeNum : parsedJawabanBenar;
              }
            } else if (s.jenis_soal && s.jenis_soal.includes("banyak")) {
              if (!Array.isArray(parsedJawabanBenar)) {
                // parse single numeric string into [num] or empty array
                if (typeof parsedJawabanBenar === "number") {
                  parsedJawabanBenar = [parsedJawabanBenar];
                } else if (typeof parsedJawabanBenar === "string") {
                  try {
                    const p = JSON.parse(parsedJawabanBenar);
                    parsedJawabanBenar = Array.isArray(p) ? p : parsedJawabanBenar === "" ? [] : [Number(parsedJawabanBenar)];
                  } catch {
                    // fallback, attempt to convert to number
                    const maybeNum = Number(parsedJawabanBenar);
                    parsedJawabanBenar = Number.isFinite(maybeNum) ? [maybeNum] : [];
                  }
                } else {
                  parsedJawabanBenar = [];
                }
              }
            } else {
              // other types (isian/uraian) keep as string
              if (typeof parsedJawabanBenar === "object") {
                parsedJawabanBenar = String(parsedJawabanBenar);
              }
            }

            return {
              id: s.id_soal,
              type: s.jenis_soal,
              pertanyaan: s.text_soal || "",
              options: Array.isArray(parsedListJawaban) ? parsedListJawaban : (typeof parsedListJawaban === "string" ? safeParse(parsedListJawaban) || [] : []),
              jawaban: parsedJawabanBenar ?? (s.jenis_soal && s.jenis_soal.includes("banyak") ? [] : null),
              image: s.gambar_url ? s.gambar_url : null,
              file: null,
              score: s.score || 0,
            };
          });

          setFormData((prev) => ({
            ...prev,
            jenisUjian: ujian.jenis_ujian || "",
            startDate: ujian.start_date ? toLocalDatetime(new Date(ujian.start_date)) : prev.startDate,
            endDate: ujian.end_date ? toLocalDatetime(new Date(ujian.end_date)) : prev.endDate,
            listSiswa: Array.isArray(parsedListSiswa) ? parsedListSiswa : [],
            soal: mappedSoal,
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUjianDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idUjian]);

  // ================== LOGIC SOAL ==================
  const handleAddSoal = (type) => {
    setFormData((prev) => ({
      ...prev,
      soal: [
        ...prev.soal,
        {
          id: `${Date.now()}-${Math.random()}`,
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
          file: null,
          score: 0,
        },
      ],
    }));
  };

  const handleRemoveSoal = (id) => {
    // if id looks like an existing numeric id (not our temp string), record for deletion
    if (typeof id === "number" || (typeof id === "string" && /^\d+$/.test(String(id)))) {
      setDeletedSoalIds((prev) => {
        const numId = Number(id);
        if (!prev.includes(numId)) return [...prev, numId];
        return prev;
      });
    }
    setFormData((prev) => ({
      ...prev,
      soal: prev.soal.filter((s) => s.id !== id),
    }));
  };

  const handleSoalChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      soal: prev.soal.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
  };

  const handleOptionChange = (id, idx, value) => {
    setFormData((prev) => ({
      ...prev,
      soal: prev.soal.map((s) => {
        if (s.id === id) {
          const updatedOptions = s.options.map((opt, i) => (i === idx ? value : opt));
          return { ...s, options: updatedOptions };
        }
        return s;
      }),
    }));
  };

  const handleAddOption = (id) => {
    setFormData((prev) => ({
      ...prev,
      soal: prev.soal.map((s) => (s.id === id ? { ...s, options: [...s.options, ""] } : s)),
    }));
  };

  const handleDeleteOption = (id, idx) => {
    setFormData((prev) => ({
      ...prev,
      soal: prev.soal.map((s) => {
        if (s.id === id) {
          const updatedOptions = s.options.filter((_, i) => i !== idx);
          let updatedJawaban = s.jawaban;
          if (Array.isArray(s.jawaban)) {
            updatedJawaban = s.jawaban.filter((j) => j !== idx);
          } else if (s.jawaban === idx) {
            updatedJawaban = null;
          }
          return { ...s, options: updatedOptions, jawaban: updatedJawaban };
        }
        return s;
      }),
    }));
  };

  const handleJawabanBenar = (id, idx, type) => {
    setFormData((prev) => ({
      ...prev,
      soal: prev.soal.map((s) => {
        if (s.id === id) {
          if (type === "pilihan_ganda_satu") {
            return { ...s, jawaban: idx };
          } else if (type === "pilihan_ganda_banyak") {
            let updated = Array.isArray(s.jawaban) ? [...s.jawaban] : [];
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

  const handleUploadImage = (id, file) => {
    const url = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      soal: prev.soal.map((s) => (s.id === id ? { ...s, image: url, file } : s)),
    }));
  };

  const handleRemoveImage = (id) => {
    setFormData((prev) => ({
      ...prev,
      soal: prev.soal.map((s) => (s.id === id ? { ...s, image: null, file: null } : s)),
    }));
  };

// ================== IMPORT / EXPORT ==================
  const safeParse = (val) => {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  };

  const handleExportSoal = () => {
    const soal = formData.soal.length
      ? formData.soal
      : [
          {
            type: "pilihan_ganda_satu",
            pertanyaan: "Contoh pertanyaan pilihan ganda 1 jawaban",
            options: ["Opsi A (Benar)", "Opsi B (Salah)", "Opsi C (salah)"],
            jawaban: 0,
            score: 10,
          },
          {
            type: "pilihan_ganda_banyak",
            pertanyaan: "Contoh pertanyaan pilihan ganda banyak jawaban",
            options: ["Opsi A (Benar)", "Opsi B (Benar)", "Opsi C (Salah)"],
            jawaban: [0, 1, 2],
            score: 10,
          },
          {
            type: "isian",
            pertanyaan: "Contoh pertanyaan isian",
            options: [],
            jawaban: "contoh jawaban",
            score: 5,
          },
        ];

    const dataToExport = soal.map((s, i) => ({
      No: i + 1,
      Jenis_Soal: s.type,
      Pertanyaan: s.pertanyaan,
      Opsi: JSON.stringify(s.options || []),
      Jawaban_Benar: JSON.stringify(s.jawaban),
      Skor: s.score,
    }));

    const success = handleDownloadFileExcel(dataToExport, "template_soal");
    if (success) {
      ToastSuccess.fire({ title: "Template soal berhasil di-export!" });
    } else {
      ToastError.fire({ title: "Gagal export file!" });
    }
  };

  const handleImportSoal = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { rows } = await handleUploadFile(file);
      const importedSoal = rows.map((row, i) => ({
        id: `${Date.now()}-${i}`,
        type: row.jenis_soal || "isian",
        pertanyaan: row.pertanyaan || "",
        options: safeParse(row.opsi || "[]"),
        jawaban: safeParse(row.jawaban_benar || ""),
        score: Number(row.skor || 0),
      }));

      setFormData((prev) => ({
        ...prev,
        soal: [...prev.soal, ...importedSoal],
      }));

      ToastSuccess.fire({
        title: `Berhasil import ${importedSoal.length} soal dari Excel!`,
      });
    } catch (err) {
      ToastError.fire({ title: "Gagal import file!" });
    } finally {
      e.target.value = "";
    }
  };

  // ================== VALIDASI ==================
  const validateForm = () => {
    let newErrors = {};
    if (!formData.jenisUjian) newErrors.jenisUjian = "Jenis ujian wajib diisi";
    if (formData.soal.length === 0) newErrors.soal = "Minimal 1 soal diperlukan";

    formData.soal.forEach((s) => {
      if (!s.pertanyaan || !String(s.pertanyaan).trim())
        newErrors[`soal-${s.id}-pertanyaan`] = "Pertanyaan wajib diisi";

      if ((s.type === "pilihan_ganda_satu" || s.type === "pilihan_ganda_banyak") && (!s.options || s.options.length < 2))
        newErrors[`soal-${s.id}-options`] = "Minimal 2 opsi diperlukan";

      if (
        (s.type === "pilihan_ganda_satu" && (s.jawaban === null || s.jawaban === undefined)) ||
        (s.type === "pilihan_ganda_banyak" && (!Array.isArray(s.jawaban) || s.jawaban.length === 0))
      ) {
        newErrors[`soal-${s.id}-jawaban`] = "Minimal 1 jawaban benar wajib dipilih";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================== SUBMIT ==================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoadingSubmit(true);

      const ujianBody = {
        jenis_ujian: formData.jenisUjian,
        start_date: formData.startDate,
        end_date: formData.endDate,
        id_kelas_tahun_ajaran: idKelasTahunAjaran,
        list_siswa: Array.isArray(formData.listSiswa) ? formData.listSiswa : [],
      };

      let id_ujian = idUjian;

      if (!idUjian) {
        // CREATE UJIAN
        const ujianRes = await createUjian(ujianBody);
        id_ujian = ujianRes?.data?.id_ujian;
        if (!id_ujian) throw new Error("ID ujian tidak ditemukan");
      } else {
        // UPDATE UJIAN
        await updateUjian(idUjian, ujianBody);
      }

      // CREATE / UPDATE SOAL
      for (const s of formData.soal) {
        const form = new FormData();
        form.append("id_ujian", id_ujian);
        form.append("jenis_soal", s.type);
        form.append("text_soal", s.pertanyaan);
        form.append("score", s.score || 0);
        form.append("jawaban_benar", JSON.stringify(s.jawaban));
        form.append("list_jawaban", JSON.stringify(s.options));
        if (s.file) form.append("gambar", s.file);

        if (String(s.id).includes("-")) {
          await createSoal(form);
        } else {
          await updateSoal(s.id, form);
        }
      }

      // DELETE soal yang dihapus user saat edit (eksekusi setelah create/update soal)
      if (deletedSoalIds.length > 0) {
        for (const idSoal of deletedSoalIds) {
          try {
            await deleteSoal(idSoal);
          } catch (err) {
            // jangan menghentikan proses karena 1 delete gagal; log saja
            console.error("Gagal menghapus soal id:", idSoal, err);
          }
        }
      }

      ToastSuccess.fire({
        title: idUjian ? "Ujian dan soal berhasil diperbarui!" : "Ujian dan semua soal berhasil dibuat!",
      });
      navigate(-1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // ================== RENDER ==================
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Form Ujian Guru
        </Typography>

        <Button variant="contained" color="warning" startIcon={<ArrowBackOutlinedIcon />} onClick={() => navigate(-1)}>
          Kembali
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Jenis Ujian"
            fullWidth
            value={formData.jenisUjian}
            onChange={(e) => setFormData({ ...formData, jenisUjian: e.target.value })}
            error={!!errors.jenisUjian}
            helperText={errors.jenisUjian}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          {loadingSiswa ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Autocomplete
              multiple
              options={siswaList}
              disableCloseOnSelect
              getOptionLabel={(option) => option.nama || option.username}
              value={siswaList.filter((s) => formData.listSiswa.includes(s.id_user))}
              onChange={(e, newValue) =>
                setFormData({
                  ...formData,
                  listSiswa: newValue.map((s) => s.id_user),
                })
              }
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox checked={selected} />
                  {option.nama || option.username}
                </li>
              )}
              renderInput={(params) => <TextField {...params} label="Pilih Siswa (default semua)" />}
            />
          )}
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Start Date"
            type="datetime-local"
            fullWidth
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="End Date"
            type="datetime-local"
            fullWidth
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      {/* ================== SOAL SECTION ================== */}
      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6">Soal Ujian</Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" startIcon={<DownloadOutlinedIcon />} onClick={handleExportSoal}>
              Export Soal
            </Button>
            <Button variant="outlined" component="label" startIcon={<UploadOutlinedIcon />}>
              Import Soal
              <input type="file" accept=".xlsx" hidden onChange={handleImportSoal} />
            </Button>
          </Box>
        </Box>

        {formData.soal.map((s, index) => (
          <Paper key={s.id} sx={{ p: 2, mb: 2, border: "1px solid #ddd" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle1">
                Soal {index + 1} ({s.type == "pilihan_ganda_satu" ? "Pilihan Ganda 1 Jawaban" : s.type == "pilihan_ganda_banyak" ? "Pilihan Ganda Banyak Jawaban" : "Isian"})
              </Typography>
              <IconButton onClick={() => handleRemoveSoal(s.id)}>
                <Delete />
              </IconButton>
            </Box>

            <TextField
              label="Pertanyaan"
              fullWidth
              multiline
              sx={{ mt: 1 }}
              value={s.pertanyaan}
              onChange={(e) => handleSoalChange(s.id, "pertanyaan", e.target.value)}
              error={!!errors[`soal-${s.id}-pertanyaan`]}
              helperText={errors[`soal-${s.id}-pertanyaan`]}
            />

            <Box sx={{ mt: 2 }}>
              {!s.image ? (
                <Button variant="outlined" component="label" startIcon={<Upload />}>
                  Upload Gambar
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleUploadImage(s.id, e.target.files[0])}
                  />
                </Button>
              ) : (
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <img src={s.image} alt="soal" style={{ maxWidth: "200px", borderRadius: "8px" }} />
                  <IconButton
                    size="small"
                    sx={{ position: "absolute", top: 0, right: 0, background: "rgba(255,255,255,0.7)" }}
                    onClick={() => handleRemoveImage(s.id)}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>

            {(s.type === "pilihan_ganda_satu" || s.type === "pilihan_ganda_banyak") && (
              <Box sx={{ mt: 2 }}>
                {s.options.map((opt, idx) => (
                  <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    {s.type === "pilihan_ganda_satu" ? (
                      <Radio checked={s.jawaban === idx} onChange={() => handleJawabanBenar(s.id, idx, s.type)} />
                    ) : (
                      <Checkbox checked={Array.isArray(s.jawaban) ? s.jawaban.includes(idx) : false} onChange={() => handleJawabanBenar(s.id, idx, s.type)} />
                    )}
                    <TextField placeholder={`Opsi ${idx + 1}`} value={opt} onChange={(e) => handleOptionChange(s.id, idx, e.target.value)} fullWidth />
                    <IconButton color="error" onClick={() => handleDeleteOption(s.id, idx)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                <Button size="small" onClick={() => handleAddOption(s.id)}>
                  + Tambah Pilihan
                </Button>
                {errors[`soal-${s.id}-options`] && (
                  <Typography color="error" fontSize={13}>
                    {errors[`soal-${s.id}-options`]}
                  </Typography>
                )}
                {errors[`soal-${s.id}-jawaban`] && (
                  <Typography color="error" fontSize={13}>
                    {errors[`soal-${s.id}-jawaban`]}
                  </Typography>
                )}
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <TextField
                label="Score"
                type="number"
                inputProps={{ min: 0, max: 100 }}
                value={s.score}
                onChange={(e) => handleSoalChange(s.id, "score", e.target.value)}
                sx={{ width: "100px" }}
              />
            </Box>
          </Paper>
        ))}

        <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
          <Button variant="outlined" startIcon={<Add />} onClick={() => handleAddSoal("pilihan_ganda_satu")}>
            Pilihan Ganda 1 Jawaban
          </Button>
          <Button variant="outlined" startIcon={<Add />} onClick={() => handleAddSoal("pilihan_ganda_banyak")}>
            Pilihan Ganda Banyak Jawaban
          </Button>
          <Button variant="outlined" startIcon={<Add />} onClick={() => handleAddSoal("isian")}>
            Isian
          </Button>
        </Box>

        {errors.soal && (
          <Typography color="error" fontSize={13} sx={{ mt: 1 }}>
            {errors.soal}
          </Typography>
        )}
      </Box>

      <Box sx={{ textAlign: "right", mt: 3 }}>
        <Button variant="contained" color="primary" type="submit" disabled={loadingSubmit}>
          {loadingSubmit ? "Menyimpan..." : idUjian ? "Update Ujian" : "Simpan Ujian"}
        </Button>
      </Box>

      <style>
        {`
          input[type="datetime-local"]::-webkit-calendar-picker-indicator {
            filter: ${theme.palette.mode === "dark" ? "invert(1)" : "invert(0)"};
          }
          input[type="datetime-local"] {
            color-scheme: ${theme.palette.mode};
          }
        `}
      </style>
    </Box>
  );
}
