import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const studentClasses = [
  { id: 1, title: "ECC Level 4", subtitle: "Dr. Jenny Ngo, M.Sc.Ed." },
  { id: 2, title: "Web Programming Framework", subtitle: "Evan Kusuma Susanto, S.Kom., M.Kom." },
  { id: 3, title: "Artificial Intelligence", subtitle: "Dr. Ir. Joan Santoso, S.Kom., M.Kom." },
  { id: 4, title: "Rekayasa Perangkat Lunak", subtitle: "Yuliana Melita Pranoto, S.Kom. M.Kom." },
  { id: 5, title: "Software Testing", subtitle: "Reddy Alexandro Harianto, S.Kom., M.Kom." },
  { id: 6, title: "Arsitektur dan Organisasi Komputer", subtitle: "Ir. Khinardi Gunawan" },
  { id: 7, title: "Software Development Project", subtitle: "Grace Levina Dewi, S.Kom., M.Kom." },
  { id: 8, title: "Kewirausahaan", subtitle: "Dr. Ir. Hj. Endang Setyati, M.T." },
];

const teacherClasses = [
  { id: 1, title: "ECC Level 4", subtitle: "X-IPA-1" },
  { id: 2, title: "Web Programming Framework", subtitle: "X-IPA-1" },
  { id: 3, title: "Artificial Intelligence", subtitle: "X-IPA-1" },
  { id: 4, title: "Rekayasa Perangkat Lunak", subtitle: "X-IPA-1" },
  { id: 5, title: "Software Testing", subtitle: "X-IPA-1" },
  { id: 6, title: "Arsitektur dan Organisasi Komputer", subtitle: "X-IPA-1" },
  { id: 7, title: "Software Development Project", subtitle: "X-IPA-1" },
  { id: 8, title: "Kewirausahaan", subtitle: "X-IPA-1" },
];

export default function UjianGuruPage() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const classes = role === "student" ? studentClasses : teacherClasses;

  const handleCardClick = (kelas) => {
    console.log(kelas);
    localStorage.setItem("detailKelasSiswaTab", 0);
    navigate(`/ujian/detail/${kelas.id}`, { state: { kelas } });
  };

  return (
    <>
      {/* Header */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h4">Ujian Online</Typography>
        </Grid>
      </Grid>

      {/* List Card Kelas */}
      <Grid container spacing={3} alignItems="stretch">
        {classes.map((c, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
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
                  title={c.subtitle}
                >
                  {c.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
