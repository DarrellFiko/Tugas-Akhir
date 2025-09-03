import { Box, Button, Typography, Select, MenuItem, FormControl, InputLabel, Grid } from "@mui/material";
import TableTemplate from "../../components/tables/TableTemplate";
import { useRef, useState } from "react";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";

export default function NilaiSiswaPage() {
  const printRef = useRef();

  // Data kelas
  const kelasList = [
    { id: 1, value: "X-IPA-1 Semester Gasal" },
    { id: 2, value: "X-IPA-2 Semester Gasal" },
    { id: 3, value: "X-IPS-1 Semester Genap" },
    { id: 4, value: "X-IPS-2 Semester Genap" },
  ];

  // Default pilih data terakhir
  const [selectedKelas, setSelectedKelas] = useState(kelasList[kelasList.length - 1].id);

  const columns = [
    { field: "pelajaran", label: "Pelajaran", width: "200px" },
    { field: "pengajar", label: "Pengajar", width: "200px" },
    { field: "uh1", label: "UH 1", width: "100px" },
    { field: "uh2", label: "UH 2", width: "100px" },
    { field: "pretest1", label: "Pretest 1", width: "120px" },
    { field: "posttest1", label: "Posttest 1", width: "120px" },
    { field: "uts", label: "UTS", width: "100px" },
    { field: "uh3", label: "UH 3", width: "100px" },
    { field: "uh4", label: "UH 4", width: "100px" },
    { field: "uas", label: "UAS", width: "100px" },
    { field: "nilaiAkhir", label: "Nilai Akhir", width: "120px" },
    { field: "grade", label: "Grade", width: "80px" },
  ];

  const rows = [
    { pelajaran: "Matematika", pengajar: "Darrell Fiko", uh1: 80, uh2: 75, pretest1: 70, posttest1: 85, uts: 78, uh3: 82, uh4: 88, uas: 90, nilaiAkhir: 83, grade: "A" },
    { pelajaran: "Bahasa Indonesia", pengajar: "Alexander Putra", uh1: 85, uh2: 80, pretest1: 72, posttest1: 88, uts: 82, uh3: 84, uh4: 86, uas: 89, nilaiAkhir: 84, grade: "A" },
  ];

  const handlePrintRapor = () => {
    const kelas = kelasList.find((k) => k.id === selectedKelas);
    console.log("Cetak rapor kelas:", kelas.id, kelas.value);
  };

  const handleChangeKelas = (e) => {
    const kelasId = e.target.value;
    const kelas = kelasList.find((k) => k.id === kelasId);
    setSelectedKelas(kelasId);
    console.log("Selected Kelas -> ID:", kelas.id, "Value:", kelas.value);
  };

  return (
    <>
      {/* Header */}
      <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        {/* Judul */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h4">Nilai Akademik</Typography>
        </Grid>

        {/* Dropdown + Button */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, justifyContent: "flex-end" }}>
            {/* Dropdown Kelas */}
            <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
              <InputLabel id="kelas-select-label">Pilih Kelas</InputLabel>
              <Select
                labelId="kelas-select-label"
                value={selectedKelas}
                onChange={handleChangeKelas}
                label="Pilih Kelas"
              >
                {kelasList.map((kelas) => (
                  <MenuItem key={kelas.id} value={kelas.id}>
                    {kelas.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Print Button */}
            <Button
              variant="contained"
              color="primary"
              endIcon={<PrintOutlinedIcon />}
              onClick={handlePrintRapor}
              fullWidth
            >
              Cetak Rapor
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Table */}
      <Box ref={printRef} sx={{ width: "100%", maxWidth: "100%" }}>
        <TableTemplate
          key={"nilai"}
          title="Nilai Akademik"
          columns={columns}
          rows={rows}
          initialRowsPerPage={999}
          tableHeight="auto"
          isCheckbox={false}
          isUpdate={false}
          isDelete={false}
          isUpload={false}
          isCreate={false}
          isDownload={false}
          isPagination={false}
        />
      </Box>
    </>
  );
}
