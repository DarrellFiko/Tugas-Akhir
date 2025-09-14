import React, { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import {
  IconButton,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import TableTemplate from "../../tables/TableTemplate";

export default function TabMateriSiswa() {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleInfoClick = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const columns = [
    { field: "namaFile", label: "Nama File", width: "150px" },
    { field: "pertemuan", label: "Pertemuan", width: "100px" },
    { field: "deskripsi", label: "Deskripsi", width: "500px" },
    { 
      field: "action", 
      label: "Action", 
      width: "100px",
      render: (value, row) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Detail Info">
            <IconButton size="small" color="primary" onClick={() => handleInfoClick(row)}>
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download File">
            <IconButton size="small" color="primary" onClick={() => console.log("Download:", row.namaFile)}>
              <DownloadOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    },
  ];

  const rows = [
    {
      id: 1,
      namaFile: "Maleficent",
      pertemuan: 11,
      deskripsi: "The lesson for next week will be about watching the movie The Maleficent 2014...",
    },
    {
      id: 2,
      namaFile: "Spooky story",
      pertemuan: 10,
      deskripsi: "We'll have a Trick or Treat, a Halloween Storytelling activity...",
    },
    {
      id: 3,
      namaFile: "Speaking Project I",
      pertemuan: 7,
      deskripsi: "Speaking project I is to promote or sell a product...",
    },
  ];

  return (
    <>
      <TableTemplate
        key={"Materi"}
        title={"Materi"}
        columns={columns}
        rows={rows}
        initialRowsPerPage={10}
        tableHeight={400}
        isCheckbox={false}
        isUpdate={false}
        isDelete={false}
        isUpload={false}
        isCreate={false}
        isDownload={false}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Detail Materi</DialogTitle>
        <DialogContent dividers>
          {selectedRow && (
            <>
              <Typography variant="subtitle1" fontWeight="bold">
                {selectedRow.namaFile}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Pertemuan: {selectedRow.pertemuan}
              </Typography>
              <DialogContentText sx={{ mt: 2 }}>
                {selectedRow.deskripsi}
              </DialogContentText>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="primary">
            Lihat File Materi
          </Button>
          <Button onClick={handleClose} variant="contained" color="primary">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
