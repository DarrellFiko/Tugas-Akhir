import { useState, useEffect } from "react";
import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  MenuItem,
  Grid,
  useTheme,
} from "@mui/material";
import TableTemplate from "../tables/TableTemplate";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate, useParams } from "react-router-dom";
import {
  PopupEdit,
  PopupDelete,
  ToastError,
  ToastSuccess,
} from "../../composables/sweetalert";
import { useForm, Controller } from "react-hook-form";
import {
  getAllModul,
  createModul,
  deleteModul,
} from "../../services/modulService";
import { formatDate } from "../../utils/utils";
import { getRole } from "../../services/authService";

export default function TabModule() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { id } = useParams();
  const [userRole, setUserRole] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [rowsModule, setRowsModule] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty: formDirty },
  } = useForm({
    defaultValues: {
      nama_modul: "",
      jenis_modul: "",
      start_date: new Date(),
      end_date: new Date(new Date().getTime() + 60 * 60 * 1000),
      keterangan: "",
      tipe_file_modul: "PDF",
      sifat_pengumpulan: "Online",
      status_modul: "Perorangan",
    },
  });

  const watchStartDate = watch("start_date");
  const watchEndDate = watch("end_date");

  useEffect(() => {
    setIsDirty(formDirty);
  }, [formDirty]);

  const formatDateTimeLocal = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    const pad = (n) => (n < 10 ? "0" + n : n);
    return (
      d.getFullYear() +
      "-" +
      pad(d.getMonth() + 1) +
      "-" +
      pad(d.getDate()) +
      "T" +
      pad(d.getHours()) +
      ":" +
      pad(d.getMinutes())
    );
  };

  // ================= GET MODULE =================
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllModul(id);
      if (res?.data) {
        const mapped = res.data.map((m) => ({
          id: m.id_modul,
          namaModule: m.nama_modul,
          jenisModule: m.jenis_modul,
          sifat: m.sifat_pengumpulan,
          start_date: m.start_date,
          end_date: m.end_date,
          status: m.status_modul,
          banyakPengumpulan: m.banyak_pengumpulan || "-",
          ...m,
        }));
        setRowsModule(mapped);
      } else {
        setRowsModule([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRoles = async () => {
    const role = await getRole();
    setUserRole(role.role)
  };
  useEffect(() => { getRoles(); }, []);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  // ================= CREATE MODULE =================
  const onSubmit = async (data) => {
    try {
      if (new Date(data.start_date) > new Date(data.end_date)) {
        ToastError.fire({ title: "Start date tidak boleh lebih dari End date" });
        return;
      }

      const body = {
        id_kelas_tahun_ajaran: id,
        nama_modul: data.nama_modul.trim(),
        jenis_modul: data.jenis_modul.trim(),
        start_date: data.start_date,
        end_date: data.end_date,
        keterangan: data.keterangan || "",
        tipe_file_modul: data.tipe_file_modul,
        sifat_pengumpulan: data.sifat_pengumpulan,
        status_modul: data.status_modul,
      };

      await createModul(body);
      ToastSuccess.fire({ title: "Modul berhasil dibuat!" });
      setOpenDialog(false);
      reset();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DELETE MODULE =================
  const handleDelete = async (id_modul) => {
    try {
      const confirm = await PopupDelete.fire({
        title: "Hapus Modul?",
        text: "Data modul akan dihapus secara permanen!",
      });
      if (!confirm.isConfirmed) return;

      await deleteModul(id_modul);
      ToastSuccess.fire({ title: "Modul berhasil dihapus" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = async () => {
    if (isDirty) {
      const confirmClose = await PopupEdit.fire({
        title: "Batalkan?",
        text: "Data sudah diisi sebagian. Yakin ingin membatalkan?",
      });
      if (!confirmClose.isConfirmed) return;
    }
    reset();
    setOpenDialog(false);
  };

  const columnsModule = [
    { field: "namaModule", label: "Nama Modul", width: "250px" },
    { field: "jenisModule", label: "Jenis Modul", width: "120px" },
    { field: "sifat", label: "Sifat", width: "100px" },
    {
      field: "start_date",
      label: "Waktu Mulai",
      width: "300px",
      render: (value) => formatDate(value, "dddd, DD-MMMM-YYYY, HH:mm"),
    },
    {
      field: "end_date",
      label: "Waktu Selesai",
      width: "300px",
      render: (value) => formatDate(value, "dddd, DD-MMMM-YYYY, HH:mm"),
    },
    { field: "status", label: "Status", width: "120px" },
    { field: "tipe_file_modul", label: "Tipe File", width: "120px" },
    {
      field: "banyakPengumpulan",
      label: "Banyak Pengumpulan",
      width: "150px",
    },
    {
      field: "action",
      label: "Action",
      width: "150px",
      align: "center",
      render: (value, row) => (
        <>
          <IconButton
            onClick={() => navigate(`/kelas/detail/${id}/module/${row.id}`)}
          >
            <InfoOutlinedIcon color="primary" />
          </IconButton>
          {userRole == "guru" && 
            <IconButton onClick={() => handleDelete(row.id)}>
              <DeleteOutlineIcon color="error" />
            </IconButton>
          }
        </>
      ),
    },
  ];

  return (
    <>
      <TableTemplate
        key={`modul-${userRole}`} 
        title={"Modul"}
        columns={columnsModule}
        rows={rowsModule}
        initialRowsPerPage={10}
        tableHeight={400}
        isCheckbox={false}
        isUpdate={false}
        isDelete={false}
        isUpload={false}
        isDownload={false}
        isCreate={userRole == "guru"}
        onCreate={() => setOpenDialog(true)}
        loading={loading}
      />

      {/* Dialog Buat Module */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Buat Module</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Controller
                name="nama_modul"
                control={control}
                rules={{ required: "Nama module wajib diisi" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nama Module"
                    fullWidth
                    size="small"
                    error={!!errors.nama_modul}
                    helperText={errors.nama_modul?.message}
                  />
                )}
              />

              <Controller
                name="jenis_modul"
                control={control}
                rules={{ required: "Jenis module wajib diisi" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Jenis Module"
                    fullWidth
                    size="small"
                    error={!!errors.jenis_modul}
                    helperText={errors.jenis_modul?.message}
                  />
                )}
              />

              <Grid container spacing={2}>
                <Grid item size={{ xs: 12, sm: 6}}>
                  <Controller
                    name="start_date"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Start Date"
                        type="datetime-local"
                        value={formatDateTimeLocal(field.value)}
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size="small"
                        error={
                          watchStartDate && watchEndDate
                            ? new Date(watchStartDate) >
                              new Date(watchEndDate)
                            : false
                        }
                        helperText={
                          new Date(watchStartDate) > new Date(watchEndDate)
                            ? "Start date tidak boleh lebih dari End date"
                            : ""
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item size={{ xs: 12, sm: 6}}>
                  <Controller
                    name="end_date"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="End Date"
                        type="datetime-local"
                        value={formatDateTimeLocal(field.value)}
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size="small"
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Controller
                name="keterangan"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Keterangan"
                    fullWidth
                    size="small"
                    multiline
                    rows={3}
                  />
                )}
              />

              <Controller
                name="tipe_file_modul"
                control={control}
                rules={{ required: "Tipe file modul wajib dipilih" }}
                render={({ field }) => (
                  <TextField
                    select
                    {...field}
                    label="Tipe File Modul"
                    fullWidth
                    size="small"
                    error={!!errors.tipe_file_modul}
                    helperText={errors.tipe_file_modul?.message}
                  >
                    <MenuItem value="PDF">PDF</MenuItem>
                    <MenuItem value="PPTX">PPTX</MenuItem>
                    <MenuItem value="Docx">Docx</MenuItem>
                  </TextField>
                )}
              />

              <Controller
                name="sifat_pengumpulan"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Sifat Pengumpulan"
                    fullWidth
                    size="small"
                    disabled
                  />
                )}
              />

              <Controller
                name="status_modul"
                control={control}
                render={({ field }) => (
                  <TextField select {...field} label="Status Module" fullWidth size="small">
                    <MenuItem value="Perorangan">Perorangan</MenuItem>
                    <MenuItem value="Kelompok">Kelompok</MenuItem>
                  </TextField>
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Batal</Button>
            <Button type="submit" variant="contained" color="primary">
              Simpan
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <style>
        {`
          .highlight-row {
            background-color: seagreen !important;
          }
          input[type="datetime-local"]::-webkit-calendar-picker-indicator {
            filter: ${
              theme.palette.mode === "dark" ? "invert(1)" : "invert(0)"
            };
          }
          input[type="datetime-local"] {
            color-scheme: ${theme.palette.mode};
          }
        `}
      </style>
    </>
  );
}
