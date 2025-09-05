import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
} from "@mui/material";
import TableTemplate from "../../../components/tables/TableTemplate";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

export default function DetailModulePage() {
  const navigate = useNavigate();
  const theme = useTheme();

  // Helper: konversi Date ke format "YYYY-MM-DDTHH:mm"
  const formatDateTimeLocal = (date) => {
    const pad = (n) => (n < 10 ? "0" + n : n);
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  };

  // Default = hari ini jam sekarang
  const now = new Date();
  const [startTime, setStartTime] = useState(now);
  const [endTime, setEndTime] = useState(new Date(now.getTime() + 60 * 60 * 1000));

  // File state
  const [selectedFile, setSelectedFile] = useState(null);

  // State countdown
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      if (now < startTime) {
        const diff = startTime - now;
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(
          `Belum mulai, akan dimulai dalam ${hours > 0 ? hours + " jam " : ""}${minutes} menit ${seconds} detik`
        );
      } else if (now >= startTime && now < endTime) {
        const diff = endTime - now;
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(
          `${hours > 0 ? hours + " jam " : ""}${minutes} menit ${seconds} detik tersisa`
        );
      } else {
        setTimeLeft("Waktu pengerjaan telah habis");
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  // Format deadline
  const formatterDateTime = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedWorkTime = `${formatterDateTime.format(
    startTime
  )} - ${formatterDateTime.format(endTime)} WIB`;

  // Data Module
  const moduleInfo = [
    { label: "Nama Module", value: "Regresi Linier Sederhana" },
    { label: "Jenis Module", value: "TUGAS" },
    { label: "Deadline", value: formattedWorkTime },
    {
      label: "Keterangan",
      value:
        "Kerjakan 2 soal regresi linier sederhana dg masing-masing 4 pertanyaan",
    },
    { label: "Sifat Pengumpulan", value: "Online" },
    { label: "Sifat Module", value: "Perorangan" },
    { label: "Jenis File Module", value: "pdf" },
    { label: "Status Module", value: "Aktif" },
    { label: "Total Module Terkumpul", value: "26 / 31" },
  ];

  const columnsPengumpulan = [
    { field: "nrp", label: "NRP", width: "150px" },
    { field: "nama", label: "Nama", width: "350px" },
    { field: "waktu", label: "Waktu kumpul", width: "250px" },
  ];

  const rowsPengumpulan = [
    { id: 1, no: 1, nrp: "218116674", nama: "ALEXANDER GABRIEL EVAN", waktu: "-", statusKumpul: false },
    { id: 2, no: 2, nrp: "220116897", nama: "WILLIAM TJANDRA", waktu: "-", statusKumpul: false },
    { id: 3, no: 3, nrp: "221116935", nama: "ALDI AFENDIYANTO", waktu: "14 May 2023 21:30:10", statusKumpul: true },
    { id: 4, no: 4, nrp: "221116936", nama: "ALVIN BERNARD WIYONO", waktu: "14 May 2023 22:09:31", statusKumpul: true },
    { id: 5, no: 5, nrp: "221116937", nama: "ARIEL EZRA", waktu: "-", statusKumpul: false },
    { id: 6, no: 6, nrp: "221116940", nama: "CHRISTIAN GARY TRISANTO", waktu: "14 May 2023 22:15:47", statusKumpul: true },
    { id: 7, no: 7, nrp: "221116941", nama: "CHRISTOPHER ALFONSIUS CALVIN HARSONO", waktu: "14 May 2023 21:50:50", statusKumpul: true },
    { id: 8, no: 8, nrp: "221116942", nama: "CHRISTOPHER AMADEUS", waktu: "15 May 2023 06:07:54", statusKumpul: true },
    { id: 9, no: 9, nrp: "221116943", nama: "DANIEL NIKO NURTAJHO", waktu: "14 May 2023 18:29:15", statusKumpul: true },
    { id: 10, no: 10, nrp: "221116945", nama: "DANIELLO LUCTHER SOEDJONO", waktu: "-", statusKumpul: false },
    { id: 11, no: 11, nrp: "221116947", nama: "DARRELL FIKO ALEXANDER", waktu: "14 May 2023 21:21:11", statusKumpul: true },
    { id: 12, no: 12, nrp: "221116948", nama: "DAVID RIZKY ANDONO", waktu: "14 May 2023 22:42:27", statusKumpul: true },
    { id: 13, no: 13, nrp: "221116949", nama: "DIONISIUS MIKHA PASKUAVITO UTAMA", waktu: "15 May 2023 07:33:00", statusKumpul: true },
    { id: 14, no: 14, nrp: "221116950", nama: "EVAN RICHARD SETIAWINATA", waktu: "14 May 2023 22:29:29", statusKumpul: true },
    { id: 15, no: 15, nrp: "221116952", nama: "FEBRIAN ALEXANDRO", waktu: "15 May 2023 00:08:19", statusKumpul: true },
    { id: 16, no: 16, nrp: "221116953", nama: "FELICIA PANGESTU", waktu: "14 May 2023 23:10:16", statusKumpul: true },
    { id: 17, no: 17, nrp: "221116954", nama: "FELIX", waktu: "14 May 2023 17:15:41", statusKumpul: true },
    { id: 18, no: 18, nrp: "221116955", nama: "FRANSISCUS XAVERIUS", waktu: "14 May 2023 20:22:49", statusKumpul: true },
  ];

  const userStatusKumpul = rowsPengumpulan[0].statusKumpul;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Detail Module
        </Typography>

        <Button
          variant="contained"
          color="warning"
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Kembali
        </Button>
      </Box>

      {/* Input Start & End Date */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Start Date"
          type="datetime-local"
          value={formatDateTimeLocal(startTime)}
          onChange={(e) => {
            const newStart = new Date(e.target.value);
            setStartTime(newStart);
            setEndTime(new Date(newStart.getTime() + 60 * 60 * 1000)); // otomatis +1 jam
          }}
          InputLabelProps={{ shrink: true }}
          inputProps={{
            onFocus: (e) => e.target.showPicker?.(),
          }}
        />
        <TextField
          label="End Date"
          type="datetime-local"
          value={formatDateTimeLocal(endTime)}
          onChange={(e) => setEndTime(new Date(e.target.value))}
          InputLabelProps={{ shrink: true }}
          inputProps={{
            onFocus: (e) => e.target.showPicker?.(),
          }}
        />
      </Box>

      {/* === Banner Status === */}
      <Box
        sx={{
          bgcolor: userStatusKumpul ? "seagreen" : "firebrick",
          color: "white",
          borderRadius: 2,
          textAlign: "center",
          p: 4,
          mb: 3,
          boxShadow: 2,
        }}
      >
        <Typography variant="body1" fontWeight={500}>
          Status
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {userStatusKumpul ? "Sudah Mengumpulkan Nilai" : "Belum Mengumpulkan"}
        </Typography>

        {/* Countdown */}
        <Typography variant="body2" sx={{ mt: 2 }}>
          {timeLeft}
        </Typography>

        {/* Upload File */}
        {(() => {
          const now = new Date();
          const isWithinTime = now >= startTime && now < endTime;

          return (
            <Box sx={{ mt: 2 }}>
              {isWithinTime && (
                <Box>
                  <Button
                    variant="contained"
                    component="label"
                    disabled={!isWithinTime}
                    sx={{ bgcolor: "white", color: "black", "&:hover": { bgcolor: "lightgray" } }}
                  >
                    Pilih File
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          const file = e.target.files[0];
                          setSelectedFile(file);
                        }
                      }}
                    />
                  </Button>
                  <Button
                    variant="outlined"
                    color="warning"
                    sx={{ ml: 2 }}
                    disabled={!isWithinTime || !selectedFile}
                    onClick={() => {
                      alert(`File "${selectedFile?.name}" berhasil diupload!`);
                    }}
                  >
                    Upload
                  </Button>

                  {selectedFile && (
                    <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic" }}>
                      File dipilih: {selectedFile.name}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          );
        })()}
      </Box>

      <Grid container spacing={2}>
        {/* Info Module */}
        <Grid item size={{ xs: 12, md: 5 }}>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informasi Module
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
                {moduleInfo.map((row, idx) => (
                  <Box
                    key={idx}
                    sx={{ display: "flex", gap: 1, my: 1, alignItems: "flex-start" }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ width: "45%", fontWeight: 500 }}
                    >
                      {row.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ width: "5%" }}>
                      :
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ width: "55%" }}>
                      {row.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Table Pengumpulan */}
        <Grid item size={{ xs: 12, md: 7 }}>
          <TableTemplate
            key={"pengumpulan"}
            title={"Batas waktu pengumpulan telah habis."}
            columns={columnsPengumpulan}
            rows={rowsPengumpulan}
            initialRowsPerPage={999}
            tableHeight={"auto"}
            isCheckbox={false}
            isUpdate={false}
            isDelete={false}
            isUpload={false}
            isCreate={false}
            isDownload={false}
            isPagination={false}
            getRowClassName={(row) => (row.statusKumpul ? "highlight-row" : "")}
          />
        </Grid>
      </Grid>

      <style>
        {`
          .highlight-row {
            background-color: seagreen !important;
          }
          /* Kalender popup bawaan datetime-local */
          input[type="datetime-local"]::-webkit-calendar-picker-indicator {
            filter: ${theme.palette.mode === "dark" ? "invert(1)" : "invert(0)"};
          }

          /* Bagian dalam date/time biar ngikut theme */
          input[type="datetime-local"] {
            color-scheme: ${theme.palette.mode};
          }
        `}
      </style>
    </>
  );
}
