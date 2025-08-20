import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  TextField,
  IconButton,
  Pagination,
  Grid,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BorderBottom } from "@mui/icons-material";
import useIsMobile from "../plugins/useIsMobile";

export default function HomePage() {
  // States
  const isMobile = useIsMobile();
  const [pengumuman, setPengumuman] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Computed pagination length
  const paginationLength = useMemo(() => {
    return Math.ceil(
      pengumuman.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase())
      ).length / itemsPerPage
    );
  }, [pengumuman, search]);

  // Paginated & filtered data
  const paginatedData = useMemo(() => {
    const filtered = pengumuman.filter((item) =>
      item.toLowerCase().includes(search.toLowerCase())
    );
    const startIndex = (page - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [pengumuman, search, page]);

  // On mount, fill announcements
  useEffect(() => {
    const data = [];
    for (let i = 1; i <= 95; i++) {
      data.push("Ini pengumuman yang ke-" + i);
    }
    setPengumuman(data);
  }, []);

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Grid container spacing={2}>
        {/* Pengumuman */}
        <Grid size={{ xs:12, md:8 }}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              {/* Header with Search */}
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid >
                  <Typography variant="h6">Pengumuman</Typography>
                </Grid>
                <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    variant="outlined"
                    label="Search..."
                    size="small"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" color="primary">
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>

            <Divider />

            {/* Accordion Pengumuman */}
            <Box sx={{ minHeight: "60vh" }}>
              {paginatedData.map((item, idx) => (
                <Accordion
                  key={idx}
                  disableGutters
                  square
                  sx={{ borderBottom: "1px solid", borderColor: 'divider', }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel-${idx}-content`}
                    id={`panel-${idx}-header`}
                  >
                    <Typography variant="subtitle1" fontWeight="500">
                      {item}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      {item} ini adalah detail lengkap pengumuman. Anda bisa
                      menambahkan informasi lebih rinci di sini sesuai kebutuhan.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            {/* Pagination */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 2,
              }}
            >
              <Pagination
                count={paginationLength}
                page={page}
                onChange={(e, value) => setPage(value)}
                size={isMobile ? "small" : "large"}
              />
            </Box>
          </Card>
        </Grid>

        {/* Calendar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6">Calendar</Typography>
              {/* You can add a calendar component here later */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
