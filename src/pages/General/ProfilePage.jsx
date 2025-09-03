import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  Button,
  TextField,
  Divider,
  IconButton,
  Dialog,
  DialogContent,
} from "@mui/material";
import { PopupEdit, ToastSuccess } from "../../composables/sweetalert";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [avatar, setAvatar] = useState("/broken-image.jpg");
  const [openPreview, setOpenPreview] = useState(false);

  const [profile, setProfile] = useState({
    name: "DARRELL FIKO ALEXANDER",
    nim: "221116947",
    jurusan: "S1-INFORMATIKA",
    totalSKS: 138,
    ipk: 3.73,
    alamat: "PONDOK MASPION C-15 RT.003 RW.007 KEL.PEPELEGI KEC.WARU",
    email: "darrellfiko2003@gmail.com",
    emailIsts: "darrell.f21@mhs.istts.ac.id",
    telepon: "081392261419",
    tglLahir: "SIDOARJO, 04 Juli 2003",
    agama: "KATHOLIK",
    gender: "Laki-laki",
    statusNikah: "Belum Menikah",
    ortuNama: "ONGKO WARSITO",
    ortuAlamat: "SIDOARJO",
    ortuTelepon: "087770008975",
    dosenWali: "Yuliana Melita Pranoto, S.Kom. M.Kom.",
    major: "-",
    status: "Aktif",
  });

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleToggleEdit = async () => {
    if (editMode) {
      const check = await PopupEdit.fire();
      if (check.isConfirmed) {
        console.log("Saved Profile Data:", profile);
        ToastSuccess.fire({ title: "Edit Profile Success" });
      } else return;
    }
    setEditMode(!editMode);
  };

  // Upload handler
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  const renderField = (label, field, readonly = false) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: { xs: "flex-start", sm: "space-between" },
        alignItems: { xs: "flex-start", sm: "start" },
        mb: 1.5,
      }}
    >
      <Typography
        variant="body2"
        fontWeight="bold"
        sx={{ pr: { sm: 2 }, minWidth: { sm: "120px" } }}
      >
        {label}
      </Typography>
      {editMode ? (
        <TextField
          size="small"
          fullWidth
          value={profile[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          sx={{ mt: { xs: 0.5, sm: 0 }, flex: 1 }}
          InputProps={{
            readOnly: readonly,
          }}
        />
      ) : (
        <Typography
          variant="body2"
          sx={{
            mt: { xs: 0.5, sm: 0 },
            flex: 1,
            textAlign: { xs: "left", sm: "right" },
            wordBreak: "break-word",
          }}
        >
          {profile[field]}
        </Typography>
      )}
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 1.5, md: 2 } }}>
      {/* Header */}
      <Paper
        sx={{
          p: 3,
          mb: 2,
          textAlign: "center",
          bgcolor: "primary.dark",
          color: "white",
        }}
      >
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Avatar
            src={avatar}
            sx={{ width: 100, height: 100, mx: "auto", mb: 2, cursor: "pointer" }}
            onClick={() => !editMode && setOpenPreview(true)} // only open preview when not edit
          />
          {editMode && (
            <>
              <input
                accept="image/*"
                type="file"
                id="avatar-upload"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar-upload">
                <IconButton
                  component="span"
                  sx={{
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "white",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                  }}
                >
                  <PhotoCameraIcon />
                </IconButton>
              </label>
            </>
          )}
        </Box>

        <Typography variant="h6">{profile.name}</Typography>
        <Typography variant="body2">{profile.nim}</Typography>
        <Grid container size={{ xs: 12 }} justifyContent="center" sx={{ mt: 1 }}>
          <Grid item size={{ xs: "auto" }}>
            <Typography variant="body2">{profile.jurusan}</Typography>
          </Grid>
          <Grid item size={{ xs: "auto" }} sx={{ px: 2 }}>
            <Typography variant="body2">
              Total SKS: {profile.totalSKS}
            </Typography>
          </Grid>
          <Grid item size={{ xs: "auto" }}>
            <Typography variant="body2">IPK: {profile.ipk}</Typography>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color={editMode ? "success" : "warning"}
          sx={{ mt: 2 }}
          onClick={handleToggleEdit}
        >
          {editMode ? "Save" : "Edit"}
        </Button>
      </Paper>

      {/* Avatar Preview Dialog */}
      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="sm">
        <DialogContent sx={{ p: 0 }}>
          <img src={avatar} alt="avatar preview" style={{ width: "100%", height: "auto" }} />
        </DialogContent>
      </Dialog>

      {/* Content */}
      <Grid container spacing={2} alignItems="stretch">
        {/* Biodata */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Biodata
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {renderField("Alamat", "alamat")}
            {renderField("Email", "email")}
            {renderField("Email ISTTS", "emailIsts")}
            {renderField("Telepon/HP", "telepon")}
            {renderField("Tanggal lahir", "tglLahir")}
            {renderField("Agama", "agama")}
            {renderField("Jenis kelamin", "gender")}
            {renderField("Status nikah", "statusNikah")}
          </Paper>
        </Grid>

        {/* Orang Tua + Status Akademis */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Orang tua
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {renderField("Nama", "ortuNama", true)}
              {renderField("Alamat", "ortuAlamat", true)}
              {renderField("Telepon/HP", "ortuTelepon", true)}
            </Paper>

            <Paper sx={{ p: 2, flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                Status akademis
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {renderField("Dosen wali", "dosenWali")}
              {renderField("Major", "major")}
              {renderField("Status", "status")}
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
