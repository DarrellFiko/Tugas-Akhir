// src/pages/ujian/PeriksaUjianGuruPage.jsx
import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { getPeriksaUjian } from "../../../services/ujianService";
import TableTemplate from "../../../components/tables/TableTemplate";

export default function PeriksaUjianGuruPage() {
  const navigate = useNavigate();
  const { idKelasTahunAjaran, idUjian } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const column = [
    { field: "nis", label: "NIS", width: "180px" },
    { field: "nisn", label: "NISN", width: "180px" },
    { field: "nama", label: "Nama Siswa", width: "400px" },
    { field: "nilai", label: "nilai", width: "400px" },
    {
      field: "action",
      label: "Action",
      width: "150px",
      align: "center",
      render: (value, row) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/ujian/detail/${idKelasTahunAjaran}/periksa/${idUjian}/${row.id_user}`)}
          >
            Periksa
          </Button>
        </>
      ),
    },
  ]

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await getPeriksaUjian(idUjian);
        console.log(res.data)
        setData(res.data);
      } catch (err) {
        console.error("Gagal mengambil data periksa ujian:", err);
      }
      setLoading(false);
    }

    if (idUjian) fetchData();
  }, [idUjian]);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ }}>
          {data?.ujian?.jenis_ujian || "-"} - {data?.ujian?.kelas_tahun_ajaran?.pelajaran?.nama_pelajaran || "-"}
        </Typography>

        <Button
          variant="contained"
          color="warning"
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigate(-1)}
        >
          Kembali
        </Button>
      </Box>

      <TableTemplate
        isLoading={loading}
        key={"siswa"}
        title={"Daftar Siswa"}
        columns={column}
        rows={data?.siswa}
        initialRowsPerPage={10}
        tableHeight={400}
        isCheckbox={false}
        isUpdate={false}
        isDelete={false}
        isUpload={false}
        isCreate={false}
        isDownload={false}
      />
    </>
  );
}
