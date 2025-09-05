import { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const classes = [
  { id: 1, title: "ECC Level 4", lecturer: "Dr. Jenny Ngo, M.Sc.Ed." },
  { id: 2, title: "Web Programming Framework", lecturer: "Evan Kusuma Susanto, S.Kom., M.Kom." },
  { id: 3, title: "Artificial Intelligence", lecturer: "Dr. Ir. Joan Santoso, S.Kom., M.Kom." },
  { id: 4, title: "Rekayasa Perangkat Lunak", lecturer: "Yuliana Melita Pranoto, S.Kom. M.Kom." },
  { id: 5, title: "Software Testing", lecturer: "Reddy Alexandro Harianto, S.Kom., M.Kom." },
  { id: 6, title: "Arsitektur dan Organisasi Komputer", lecturer: "Ir. Khinardi Gunawan" },
  { id: 7, title: "Software Development Project", lecturer: "Grace Levina Dewi, S.Kom., M.Kom." },
  { id: 8, title: "Kewirausahaan", lecturer: "Dr. Ir. Hj. Endang Setyati, M.T." },
];

export default function KelasPage() {
  const navigate = useNavigate();

  // Data kelas
  const kelasList = [
    { id: 1, value: "X-IPA-1 Semester Gasal" },
    { id: 2, value: "X-IPA-2 Semester Gasal" },
    { id: 3, value: "X-IPS-1 Semester Genap" },
    { id: 4, value: "X-IPS-2 Semester Genap" },
  ];

  // default ke data terakhir
  const [selectedKelas, setSelectedKelas] = useState(kelasList[kelasList.length - 1].id);

  const handleCardClick = (kelas) => {
    console.log(kelas)
    navigate(`/kelas/detail/${kelas.id}`, { state: { kelas } });;
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
          <Typography variant="h4">Kelas Online</Typography>
        </Grid>

        {/* Dropdown + Button */}
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "flex-end",
            }}
          >
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
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3} alignItems="stretch">
        {classes.map((c, index) => (
          <Grid item key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              onClick={() => handleCardClick(c)}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                boxShadow: 1,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardContent sx={{ flex: 1, textAlign: "center" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {c.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ wordBreak: "break-word", whiteSpace: "normal" }}
                  title={c.lecturer}
                >
                  {c.lecturer}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
