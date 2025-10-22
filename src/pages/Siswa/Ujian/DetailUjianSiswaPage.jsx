import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import TableTemplate from "../../../components/tables/TableTemplate";
import { ToastError } from "../../../composables/sweetalert";
import { getAllUjian } from "../../../services/ujianService";
import { formatDate } from "../../../utils/utils";
import { getKelasTahunAjaranById } from "../../../services/kelasTahunAjaranService";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

export default function DetailUjianSiswaPage() {
  const { idKelasTahunAjaran } = useParams();
  const navigate = useNavigate();
  const [kelas, setKelas] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================== FETCH DATA ==================
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllUjian(idKelasTahunAjaran);
      if (res?.data) {
        setRows(res.data);
      } else {
        setRows([]);
      }
    } catch (err) {
      console.error(err);
      ToastError.fire({ title: "Gagal memuat data ujian!" });
    } finally {
      setLoading(false);
    }
  };

  // Fetch detail kelas
  const fetchKelasTahunAjaran = async () => {
    const res = await getKelasTahunAjaranById(idKelasTahunAjaran);
    setKelas(res.data);
  };

  useEffect(() => {
    fetchKelasTahunAjaran();
  }, []);

  useEffect(() => {
    if (idKelasTahunAjaran) fetchData();
  }, [idKelasTahunAjaran]);

  // ================== VALIDASI WAKTU ==================
  const getUjianStatus = (start, end) => {
    const now = new Date();
    const startTime = new Date(start);
    const endTime = new Date(end);

    if (now < startTime) return "belum";
    if (now > endTime) return "selesai";
    return "aktif";
  };

  // ================== TABLE COLUMNS ==================
  const columns = [
    { field: "jenis_ujian", label: "Jenis Ujian", width: "200px" },
    {
      field: "start_date",
      label: "Waktu Mulai",
      width: "300px",
      render: (value) => formatDate(value, "dddd, DD MMMM YYYY, HH:mm"),
    },
    {
      field: "end_date",
      label: "Waktu Selesai",
      width: "300px",
      render: (value) => formatDate(value, "dddd, DD MMMM YYYY, HH:mm"),
    },
    {
      field: "action",
      label: "Aksi",
      width: "200px",
      render: (value, row) => {
        const status = getUjianStatus(row.start_date, row.end_date);

        let buttonLabel = "Kerjakan";
        let buttonColor = "primary";
        let disabled = false;

        if (status === "belum") {
          buttonLabel = "Belum Dimulai";
          buttonColor = "inherit";
          disabled = true;
        } else if (status === "selesai") {
          buttonLabel = "Sudah Berakhir";
          buttonColor = "inherit";
          disabled = true;
        }

        return (
          <Button
            variant="contained"
            color={buttonColor}
            disabled={disabled}
            onClick={() =>
              navigate(`/ujian/detail/${idKelasTahunAjaran}/form/${row.id_ujian}`)
            }
          >
            {buttonLabel}
          </Button>
        );
      },
    },
  ];

  // ================== RENDER ==================
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          {`${kelas?.Pelajaran?.nama_pelajaran || "-"} - ${
            kelas?.Kelas?.nama_kelas || "-"
          }`}
        </Typography>

        <Button
          variant="contained"
          color="warning"
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigate("/ujian")}
          sx={{ mb: 2 }}
        >
          Kembali
        </Button>
      </Box>

      <TableTemplate
        isLoading={loading}
        title="Daftar Ujian"
        columns={columns}
        rows={rows}
        initialRowsPerPage={10}
        isUpload={false}
        isDownload={false}
        isUpdate={false}
        isDelete={false}
        isCreate={false}
      />
    </Box>
  );
}
