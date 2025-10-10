import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { getListSiswaByKelasTahunAjaran } from "../../services/kelasSiswaService";
import TableTemplate from "../tables/TableTemplate";

export default function TabDaftarSiswa({ idKelasTahunAjaran }) {
  const [columnsListSiswa] = useState([
    { field: "nis", label: "NIS", width: "180px" },
    { field: "nisn", label: "NISN", width: "180px" },
    { field: "nama", label: "Nama Siswa", width: "400px" },
  ]);

  const [rowsListSiswa, setRowsListSiswa] = useState([]);
  const [loadingSiswa, setLoadingSiswa] = useState(false);

  const fetchListSiswa = async () => {
    if (!idKelasTahunAjaran) return;
    try {
      setLoadingSiswa(true);
      const res = await getListSiswaByKelasTahunAjaran(idKelasTahunAjaran);
      setRowsListSiswa(res?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSiswa(false);
    }
  };

  useEffect(() => {
    fetchListSiswa();
  }, [idKelasTahunAjaran]);

  return (
    <Box>
      <TableTemplate
        isLoading={loadingSiswa}
        key={"siswa"}
        title={"Daftar Siswa"}
        columns={columnsListSiswa}
        rows={rowsListSiswa}
        initialRowsPerPage={10}
        tableHeight={400}
        isCheckbox={false}
        isUpdate={false}
        isDelete={false}
        isUpload={false}
        isCreate={false}
        isDownload={false}
      />
    </Box>
  );
}
