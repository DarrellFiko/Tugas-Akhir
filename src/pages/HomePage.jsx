import React, { useState, useMemo, useEffect, useRef } from "react";
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
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useIsMobile from "../plugins/useIsMobile";
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';

export default function HomePage() {
  // States
  const boxRef = useRef(null);
  const isMobile = useIsMobile();
  const [pengumuman, setPengumuman] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Computed pagination length
  const paginationLength = useMemo(() => {
    return Math.ceil(
      pengumuman.filter((item) =>
        item.detail.toLowerCase().includes(search.toLowerCase())
      ).length / itemsPerPage
    );
  }, [pengumuman, search]);

  // Paginated & filtered data
  const paginatedData = useMemo(() => {
    const filtered = pengumuman.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
    const startIndex = (page - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [pengumuman, search, page]);

  // Dummy Data
  useEffect(() => {
    const data = [];
    for (let i = 1; i <= 95; i++) {
      // Random apakah ada komentar atau tidak
      const hasComments = Math.random() > 0.5;

      const comments = hasComments
        ? [
            {
              from: "Fiko",
              text: `Komentar A untuk pengumuman ${i}`
            },{
              from: "No Name",
              text: `Komentar B untuk pengumuman ${i}`
            },{
              from: "No Name",
              text: `Komentar C untuk pengumuman ${i}`
            },{
              from: "No Name",
              text: `Komentar C untuk pengumuman ${i}`
            },{
              from: "No Name",
              text: `Komentar C untuk pengumuman ${i}`
            },{
              from: "No Name",
              text: `Komentar C untuk pengumuman ${i}`
            },{
              from: "No Name",
              text: `Komentar C untuk pengumuman ${i}`
            },{
              from: "No Name",
              text: `Komentar C untuk pengumuman ${i}`
            },{
              from: "No Name",
              text: `Komentar C untuk pengumuman ${i}`
            },{
              from: "No Name",
              text: `Komentar C untuk pengumuman ${i}`
            },{
              from: "No Name",
              text: `Komentar C untuk pengumuman ${i}`
            },{
              from: "No Name",
              text: `Komentar C untuk pengumuman ${i}`
            },
          ]
        : [];

      data.push({
        id: i,
        title: `Pengumuman ${i}`,
        detail: `Ini detail pengumuman yang ke-${i}`,
        comments: comments,
        file: Math.random() > 0.5, // random true / false
        from: "admin"
      });
    }
    setPengumuman(data);
  }, []);

  useEffect(() => { if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight; }, []);

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
              {paginatedData.map((item) => (
                <Accordion
                  key={item.id}
                  disableGutters
                  square
                  sx={{ borderBottom: "1px solid", borderColor: 'divider', }}
                  onChange={(event, isExpanded) => {
                    if (isExpanded && boxRef.current) {
                      setTimeout(() => {
                        boxRef.current.scrollTop = boxRef.current.scrollHeight;
                      }, 0);
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel-${item.id}-content`}
                    id={`panel-${item.id}-header`}
                  >
                    <Typography sx={{ fontSize: 17, fontWeight: 500 }}>
                      { item.title }
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container sx={{ alignItems: "start" }}>
                      <Grid size={{ xs: 11 }}>
                        <Typography variant="body2" color="text.secondary">
                          { item.detail }
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 1 }} sx={{ display: "flex", justifyContent: "flex-end"}}>
                        <IconButton
                          size="small"
                          variant="outlined"
                          color="info"
                          onClick={ () => {} }
                          sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            borderRadius: 2,
                            padding: '3px',
                            '&:hover': {
                              backgroundColor: 'primary.main',
                              color: 'white',
                            },
                          }}
                        >
                          <DownloadOutlinedIcon size="small" />
                        </IconButton>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ border: "solid 1px", borderRadius: 2, mt: 2, p: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Komentar
                      </Typography>

                      <hr />
                      
                      {item.comments.length > 0 ? (
                        <Box
                          ref={boxRef}
                          sx={{
                            maxHeight: "300px",
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {item.comments.map((comment) => (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                              { comment.from } : {comment.text}
                            </Typography>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                          Tidak Ada Komentar...  
                        </Typography>
                      )}
                    </Box>

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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
