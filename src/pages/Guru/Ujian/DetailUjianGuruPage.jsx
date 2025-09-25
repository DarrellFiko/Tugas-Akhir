import React, { useState } from "react";
import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import TableTemplate from "../../../components/tables/TableTemplate";

// dummy data awal
const initialData = [
  {
    id: 1,
    jenisUjian: "UTS",
    totalSiswa: 30,
    totalMengumpulkan: 28,
    waktu: "2025-09-20T09:00",
    durasi: 90,
  },
  {
    id: 2,
    jenisUjian: "UAS",
    totalSiswa: 30,
    totalMengumpulkan: 30,
    waktu: "2025-12-15T13:00",
    durasi: 120,
  },
];

export default function DetailUjianGuruPage() {
  const { id } = useParams(); // id ujian detail
  const navigate = useNavigate();
  const [rows, setRows] = useState(initialData);

  const columns = [
    { field: "jenisUjian", label: "Jenis Ujian", width: "150px" },
    { field: "totalSiswa", label: "Total Siswa", width: "120px" },
    { field: "totalMengumpulkan", label: "Total Mengumpulkan", width: "180px" },
    {
      field: "waktu",
      label: "Waktu Pelaksanaan",
      width: "220px",
      render: (val) => {
        const date = new Date(val);
        return date.toLocaleString("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
        });
      },
    },
    { field: "durasi", label: "Durasi (menit)", width: "150px" },
  ];

  const handleCreate = () => {
    navigate(`/ujian/detail/${id}/create`);
  };

  const handleEdit = (row) => {
    navigate(`/ujian/detail/${id}/edit/${row.id}`);
  };

  const handleDelete = (row) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  return (
    <Box>
      <TableTemplate
        title="Daftar Ujian"
        columns={columns}
        rows={rows}
        initialRowsPerPage={5}
        isUpload={false}
        isDownload={false}
        onCreate={handleCreate}
        onUpdate={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
}
