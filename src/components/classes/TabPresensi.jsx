import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chip } from "@mui/material";
import { deleteBeritaAcara, getAllBeritaAcara } from "../../services/beritaAcaraService";
import TableTemplate from "../tables/TableTemplate";
import { formatDate } from "../../utils/utils";
import { ToastError, ToastSuccess } from "../../composables/sweetalert";

export default function TabPresensi({ idKelasTahunAjaran }) {
  const navigate = useNavigate();
  const [rowsPresensi, setRowsPresensi] = useState([]);
  const userRole = localStorage.getItem("role");

  const fetchPresensi = async () => {
    try {
      const res = await getAllBeritaAcara(idKelasTahunAjaran);
      const data = Array.isArray(res.data) ? res.data : res;

      const mapped = data.map((item) => ({
        id_berita_acara: item.id_berita_acara,
        tanggal: item.tanggal,
        judul: item.judul,
        deskripsi: item.deskripsi,
        status: item.status_presensi || "-",
      }));

      setRowsPresensi(mapped);
    } catch (err) {
      console.error(err);
      ToastError.fire({ title: "Gagal memuat data presensi" });
    }
  };

  useEffect(() => {
    fetchPresensi();
  }, [idKelasTahunAjaran]);

  const renderStatusChip = (status) => {
    let color = "default";
    let label = status;

    switch (status?.toLowerCase()) {
      case "hadir":
        color = "success";
        break;
      case "sakit":
        color = "error";
        break;
      case "izin":
        color = "warning";
        break;
      case "alpha":
        color = "default";
        break;
      default:
        color = "default";
        label = "-";
        break;
    }

    return (
      <Chip
        label={label}
        color={color}
        size="small"
        sx={{
          color: color === "default" ? "white" : "inherit",
          backgroundColor:
            color === "default"
              ? "black"
              : undefined,
          fontWeight: 500,
          textTransform: "capitalize",
        }}
      />
    );
  };

  const baseColumns = [
    {
      field: "tanggal",
      label: "Hari / Tanggal",
      width: "300px",
      render: (value) => formatDate(value),
    },
    { field: "judul", label: "Judul", width: "400px" },
    { field: "deskripsi", label: "Deskripsi", width: "400px" },
  ];

  const columnsPresensi =
    userRole === "siswa"
      ? [
          ...baseColumns,
          {
            field: "status",
            label: "Status",
            width: "150px",
            render: (value) => renderStatusChip(value),
          },
        ]
      : baseColumns;

  const handleDelete = async (row) => {
    try {
      await deleteBeritaAcara(row.id_berita_acara);
      await fetchPresensi();
      ToastSuccess.fire({ title: "Presensi berhasil dihapus" });
    } catch (err) {
      ToastError.fire({ title: "Gagal menghapus presensi" });
    }
  };

  return (
    <TableTemplate
      key={"presensi"}
      title={"Presensi"}
      columns={columnsPresensi}
      rows={rowsPresensi}
      initialRowsPerPage={10}
      tableHeight={400}
      isCheckbox={false}
      isUpload={false}
      isDownload={false}
      isCreate={userRole === "guru"}
      isUpdate={userRole === "guru"}
      isDelete={userRole === "guru"}
      onCreate={
        userRole === "guru"
          ? () => navigate(`/kelas/detail/${idKelasTahunAjaran}/presensi/new`)
          : undefined
      }
      onUpdate={
        userRole === "guru"
          ? (row) => {
              navigate(
                `/kelas/detail/${idKelasTahunAjaran}/presensi/${row.id_berita_acara}`
              );
            }
          : undefined
      }
      onDelete={userRole === "guru" ? handleDelete : undefined}
    />
  );
}
