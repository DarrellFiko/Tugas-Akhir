import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import TableTemplate from "../../../components/tables/TableTemplate";
import { deleteSoal } from "../../../services/soalService";
import { ToastError, ToastSuccess, PopupDelete } from "../../../composables/sweetalert";
import { deleteUjian, getAllUjian } from "../../../services/ujianService";
import { formatDate } from "../../../utils/utils";
import { getKelasTahunAjaranById } from "../../../services/kelasTahunAjaranService";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

export default function DetailUjianGuruPage() {
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
      ToastError.fire({ title: "Gagal memuat data soal!" });
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
    fetchKelasTahunAjaran()
  }, []);

  useEffect(() => {
    if (idKelasTahunAjaran) fetchData();
  }, [idKelasTahunAjaran]);

  const columns = [
    { field: "jenis_ujian", label: "Jenis Ujian", width: "300px" },
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
  ];

  // ================== HANDLER ==================
  const handleCreate = () => {
    navigate(`/ujian/detail/${idKelasTahunAjaran}/create`);
  };

  const handleEdit = (row) => {
    navigate(`/ujian/detail/${idKelasTahunAjaran}/edit/${row.id_ujian}`);
  };

  const handleDelete = async (row) => {
    const confirm = await PopupDelete.fire({
      title: "Yakin ingin menghapus ujian ini?",
    });
    if (confirm.isConfirmed) {
      try {
        await deleteUjian(row.id_ujian);
        ToastSuccess.fire({ title: "Ujian berhasil dihapus!" });
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

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
        onCreate={handleCreate}
        onUpdate={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
}
