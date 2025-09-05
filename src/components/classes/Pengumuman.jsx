import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Pagination,
  Card,
  CardContent,
  CircularProgress
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SearchIcon from "@mui/icons-material/Search";

export default function Pengumuman({
  title = "Pengumuman",
  data = [],
  loading = false,
  commentInputs,
  setCommentInputs,
  sendComment,
  itemsPerPage = 10
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const commentRefs = useRef({});

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const paginationLength = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, page, itemsPerPage]);

  // Scroll komentar otomatis ke bawah
  useEffect(() => {
    paginatedData.forEach((item) => {
      const ref = commentRefs.current[item.id];
      if (ref) {
        ref.scrollTop = ref.scrollHeight;
      }
    });
  }, [paginatedData, data]);

  return (
    <Box sx={{ minHeight: "60vh" }}>
      <Card elevation={3} sx={{ borderRadius: 2 }}>
        <CardContent>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid>
              <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                {title}
              </Typography>
            </Grid>
            <Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search pengumuman..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
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

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {/* No Data */}
        {!loading && filteredData.length === 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <Typography variant="body1" color="text.secondary">
              No Data
            </Typography>
          </Box>
        )}

        {/* Accordion List */}
        {!loading && filteredData.length > 0 &&
          paginatedData.map((item) => (
            <Accordion
              key={item.id}
              disableGutters
              square
              sx={{ borderBottom: "1px solid", borderColor: "divider" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${item.id}-content`}
                id={`panel-${item.id}-header`}
              >
                <Typography sx={{ fontSize: 17, fontWeight: 500 }}>
                  {item.title}
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Grid container sx={{ alignItems: "start" }}>
                  <Grid item size={{ xs: 9 }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.detail}
                    </Typography>
                  </Grid>
                  <Grid item size={{ xs: 3 }} sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Tooltip title="Lihat File Pengumuman">
                      <IconButton
                        size="small"
                        sx={{ backgroundColor: "primary.main", color: "white" }}
                        onClick={() => console.log("View ID:", item.id)}
                      >
                        <VisibilityOutlinedIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Download File Pengumuman">
                      <IconButton
                        size="small"
                        sx={{ backgroundColor: "primary.main", color: "white" }}
                        onClick={() => console.log("Download ID:", item.id)}
                      >
                        <DownloadOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>

                {/* Comments */}
                <Box sx={{ border: "solid 1px", borderRadius: 2, mt: 2, p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Komentar
                  </Typography>

                  <hr />

                  {item.comments.length > 0 ? (
                    <Box
                      ref={(el) => (commentRefs.current[item.id] = el)}
                      sx={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        px: 2
                      }}
                    >
                      {item.comments.map((comment, index) => (
                        <Box key={index} sx={{ display: "flex", gap: 1, my: 1, alignItems: "flex-start" }}>
                          <Typography variant="body2" color="text.secondary" sx={{ width: "80px", fontWeight: 500 }}>
                            {comment.from}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">:</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {comment.text}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Tidak Ada Komentar...
                    </Typography>
                  )}

                  <TextField
                    fullWidth
                    size="small"
                    margin="dense"
                    variant="outlined"
                    placeholder="Tulis Komentar..."
                    value={commentInputs[item.id] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({ ...prev, [item.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendComment(item.id, commentInputs[item.id], (val) =>
                          setCommentInputs((prev) => ({ ...prev, [item.id]: val }))
                        );
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              sendComment(item.id, commentInputs[item.id], (val) =>
                                setCommentInputs((prev) => ({ ...prev, [item.id]: val }))
                              )
                            }
                          >
                            <SendOutlinedIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}

        {/* Pagination */}
        {!loading && filteredData.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <Pagination
              count={paginationLength}
              page={page}
              onChange={(e, value) => setPage(value)}
              size="medium"
            />
          </Box>
        )}
      </Card>
    </Box>
  );
}
