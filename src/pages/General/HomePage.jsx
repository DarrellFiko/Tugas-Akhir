// Import Libs
import { useState, useMemo, useEffect, useRef } from "react";
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

// Import Icons
import SearchIcon from "@mui/icons-material/Search";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

// Import Utils
import useIsMobile from "../../plugins/useIsMobile";

export default function HomePage() {
  // States
  const isMobile = useIsMobile();
  const [pengumuman, setPengumuman] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [commentInputs, setCommentInputs] = useState({});
  const commentRefs = useRef({});

  const paginationLength = useMemo(() => {
    return Math.ceil(
      pengumuman.filter((item) =>
        item.detail.toLowerCase().includes(search.toLowerCase())
      ).length / itemsPerPage
    );
  }, [pengumuman, search]);

  const paginatedData = useMemo(() => {
    const filtered = pengumuman.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
    const startIndex = (page - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [pengumuman, search, page]);

  // Methods
  const sendComment = (id, text, setText) => {
    if (!text.trim()) return; // ignore empty comments
    console.log("Pengumuman ID:", id, "Comment:", text);
    setText(""); // clear input after sending
  };

  // Use Effect
  useEffect(() => {
    const data = [];
    for (let i = 1; i <= 95; i++) {
      const hasComments = Math.random() > 0.5;

      const comments = hasComments
        ? Array.from({ length: 12 }, (_, idx) => ({
            from: idx % 2 === 0 ? "Fiko" : "No Name",
            text: `Komentar ${String.fromCharCode(65 + idx)} untuk pengumuman aaaaaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaa aaa aaa ${i}`,
          }))
        : [];

      data.push({
        id: i,
        title: `Pengumuman ${i}`,
        detail: `Ini detail pengumuman yang ke-${i}`,
        comments,
        file: Math.random() > 0.5,
        from: "admin",
      });
    }
    setPengumuman(data);
  }, []);

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Pengumuman
      </Typography>

      <Grid container spacing={2}>
        <Grid item size={{ xs:12, md:8 }}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>

              {/* Header with Search */}
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid>
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
                  sx={{ borderBottom: "1px solid", borderColor: "divider" }}
                  onChange={(event, isExpanded) => {
                    if (isExpanded && commentRefs.current[item.id]) {
                      setTimeout(() => {
                        commentRefs.current[item.id].scrollTop =
                          commentRefs.current[item.id].scrollHeight;
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
                      <Grid item size={{ xs: 9, md: 11 }}>
                        <Typography variant="body2" color="text.secondary">
                          { item.detail }
                        </Typography>
                      </Grid>
                      <Grid item size={{ xs: 3, md: 1 }} gap={1} sx={{ display: "flex", justifyContent: "flex-end" }}>
                        {/* View */}
                        <IconButton
                          size="small"
                          variant="outlined"
                          color="info"
                          onClick={() => {}}
                          sx={{
                            backgroundColor: "primary.main",
                            color: "white",
                            borderRadius: 2,
                            padding: "3px",
                            "&:hover": {
                              backgroundColor: "primary.main",
                              color: "white",
                            },
                          }}
                        >
                          <VisibilityOutlinedIcon size="small" />
                        </IconButton>

                        {/* Download */}
                        <IconButton
                          size="small"
                          variant="outlined"
                          color="info"
                          onClick={() => {}}
                          sx={{
                            backgroundColor: "primary.main",
                            color: "white",
                            borderRadius: 2,
                            padding: "3px",
                            "&:hover": {
                              backgroundColor: "primary.main",
                              color: "white",
                            },
                          }}
                        >
                          <DownloadOutlinedIcon size="small" />
                        </IconButton>
                      </Grid>
                    </Grid>

                    {/* Comment */}
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
                            <Box
                              key={index}
                              sx={{ display: "flex", gap: 1, mt: 1, alignItems: "flex-start" }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ width: "80px", fontWeight: 500 }}
                              >
                                {comment.from}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                : 
                              </Typography>
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
                          sx: { mt: 2, padding: "1px", fontSize: "0.875rem" },
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
            </Box>

            {/* Pagination */}
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
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
        <Grid item size={{ xs:12, md:4 }}>
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
