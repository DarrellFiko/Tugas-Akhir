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
  Button,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useIsMobile from "../../plugins/useIsMobile";
import { formatRelativeTime } from "../../utils/utils";
import EmojiPickerInput from "../inputs/EmojiPickerInput";

export default function Pengumuman({
  title = "Pengumuman",
  data = [],
  loading = false,
  commentInputs,
  setCommentInputs,
  sendComment,
  itemsPerPage = 10,
  isCreate = false,
  isUpdate = false,
  isDelete = false,
  onCreate = () => {},
  onUpdate = () => {},
  onDelete = () => {},
  onDownload = () => {},
  onUpdateComment = () => {},
  onDeleteComment = () => {},
}) {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const [stableData, setStableData] = useState(data); // simpan data lama
  const commentRefs = useRef({});
  const [editingComment, setEditingComment] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);

  const id_user = localStorage.getItem("id");

  // update stableData hanya saat ada data baru
  useEffect(() => {
    if (data && data.length > 0) {
      setStableData(data);
    }
  }, [data]);

  const filteredData = useMemo(() => {
    return stableData.filter((item) =>
      item.judul.toLowerCase().includes(search.toLowerCase())
    );
  }, [stableData, search]);

  const paginationLength = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, page, itemsPerPage]);

  useEffect(() => {
    paginatedData.forEach((item) => {
      const ref = commentRefs.current[item.id_pengumuman];
      if (ref) {
        ref.scrollTop = ref.scrollHeight;
      }
    });
  }, [paginatedData, stableData]);

  useEffect(() => {
    if (expandedId && !stableData.some((d) => d.id_pengumuman === expandedId)) {
      setExpandedId(null);
    }
  }, [stableData, expandedId]);

  return (
    <Box sx={{ minHeight: "60vh", position: "relative" }}>
      <Card elevation={3} sx={{ borderRadius: 2 }}>
        <CardContent>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={12} sm={6}>
              <Typography
                sx={{ fontSize: 18, fontWeight: 600, mb: isMobile ? 1 : 0 }}
              >
                {title}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: { xs: "flex-start", sm: "flex-end" },
              }}
            >
              {isCreate && (
                <Button variant="outlined" color="info" onClick={onCreate}>
                  Create
                </Button>
              )}
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

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {(!loading && filteredData.length === 0) && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <Typography variant="body1" color="text.secondary">
              Belum Ada Pengumuman
            </Typography>
          </Box>
        )}

        <Box sx={{ minHeight: "55vh" }}>
          {filteredData.length > 0 &&
            paginatedData.map((item) => {
              const isExpanded = expandedId === item.id_pengumuman;
              return (
                <Accordion
                  key={item.id_pengumuman}
                  disableGutters
                  square
                  expanded={isExpanded}
                  onChange={() =>
                    setExpandedId(isExpanded ? null : item.id_pengumuman)
                  }
                  sx={{ borderTop: "1px solid", borderColor: "divider" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel-${item.id_pengumuman}-content`}
                    id={`panel-${item.id_pengumuman}-header`}
                  >
                    <Typography sx={{ fontSize: 17, fontWeight: 500 }}>
                      {item.judul}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Grid
                      container
                      spacing={2}
                      sx={{
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        flexDirection: { xs: "column-reverse", sm: "row" },
                      }}
                    >
                      <Grid item xs={12} sm={9}>
                        <Typography variant="body2" color="text.secondary">
                          {item.isi}
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={3}
                        sx={{ display: "flex", gap: 1, mb: { xs: 2, sm: 0 } }}
                      >
                        {isUpdate && (
                          <Tooltip title="Edit File Pengumuman">
                            <IconButton
                              size="small"
                              sx={{
                                backgroundColor: "warning.main",
                                color: "white",
                                "&:hover": { backgroundColor: "warning.main" },
                              }}
                              onClick={() => onUpdate(item)}
                            >
                              <EditOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                        {isDelete && (
                          <Tooltip title="Hapus File Pengumuman">
                            <IconButton
                              size="small"
                              sx={{
                                backgroundColor: "error.main",
                                color: "white",
                                "&:hover": { backgroundColor: "error.main" },
                              }}
                              onClick={() => onDelete(item.id_pengumuman)}
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                        {item.file_url && (
                          <>
                            <Tooltip title="Lihat File Pengumuman">
                              <IconButton
                                size="small"
                                sx={{
                                  backgroundColor: "primary.main",
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "primary.main",
                                  },
                                }}
                                onClick={() =>
                                  window.open(item.file_url, "_blank")
                                }
                              >
                                <VisibilityOutlinedIcon />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Download File Pengumuman">
                              <IconButton
                                size="small"
                                sx={{
                                  backgroundColor: "primary.main",
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "primary.main",
                                  },
                                }}
                                onClick={() => onDownload(item.id_pengumuman)}
                              >
                                <DownloadOutlinedIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Grid>
                    </Grid>

                    <Box
                      sx={{
                        border: "solid 1px",
                        borderRadius: 2,
                        mt: 2,
                        p: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Komentar
                      </Typography>
                      <hr />

                      {item?.komentar?.length > 0 ? (
                        <Box
                          ref={(el) =>
                            (commentRefs.current[item.id_pengumuman] = el)
                          }
                          sx={{
                            maxHeight: "300px",
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                            px: 2,
                          }}
                        >
                          {item.komentar.map((comment, index) => {
                            const isEditing =
                              editingComment?.id_komentar ===
                                comment.id_komentar &&
                              editingComment?.id_pengumuman ===
                                item.id_pengumuman;

                            return (
                              <Box
                                key={index}
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  my: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box sx={{ display: "flex", gap: 1 }}>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 600,
                                        fontSize: "0.9rem",
                                      }}
                                    >
                                      {comment.created_by}
                                    </Typography>

                                    {isEditing ? (
                                      <>
                                        <TextField
                                          size="small"
                                          value={editingComment.text}
                                          onChange={(e) =>
                                            setEditingComment((prev) => ({
                                              ...prev,
                                              text: e.target.value,
                                            }))
                                          }
                                          sx={{ flex: 1 }}
                                        />
                                        <Button
                                          size="small"
                                          color="success"
                                          onClick={() => {
                                            onUpdateComment(
                                              comment.id_komentar,
                                              editingComment.text
                                            );
                                            setEditingComment(null);
                                          }}
                                        >
                                          Save
                                        </Button>
                                        <Button
                                          size="small"
                                          color="inherit"
                                          onClick={() => setEditingComment(null)}
                                        >
                                          Cancel
                                        </Button>
                                      </>
                                    ) : (
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        {comment.komentar}
                                      </Typography>
                                    )}
                                  </Box>

                                  {comment.canAction && !isEditing && (
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        setMenuAnchor(e.currentTarget);
                                        setSelectedComment({
                                          id_pengumuman: item.id_pengumuman,
                                          ...comment,
                                        });
                                      }}
                                    >
                                      <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                  )}
                                </Box>

                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ ml: 0.5, mt: 0.2 }}
                                >
                                  {formatRelativeTime(comment.updated_at)}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 2 }}
                        >
                          Tidak Ada Komentar...
                        </Typography>
                      )}

                      <EmojiPickerInput
                        value={commentInputs[item.id_pengumuman] || ""}
                        onChange={(val) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [item.id_pengumuman]: val,
                          }))
                        }
                        onSend={() =>
                          sendComment(
                            item.id_pengumuman,
                            commentInputs[item.id_pengumuman],
                            (val) =>
                              setCommentInputs((prev) => ({
                                ...prev,
                                [item.id_pengumuman]: val,
                              }))
                          )
                        }
                      />
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            })}
        </Box>

        {filteredData.length > 0 && (
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

      {/* Menu titik tiga */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setEditingComment({
              id_komentar: selectedComment.id_komentar,
              id_pengumuman: selectedComment.id_pengumuman,
              text: selectedComment.komentar,
            });
            setMenuAnchor(null);
          }}
        >
          <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDeleteComment(selectedComment.id_komentar);
            setMenuAnchor(null);
          }}
        >
          <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}
