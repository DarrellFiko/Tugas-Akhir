import React, { useState, useEffect } from "react";
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

// Import service
import { getProfile } from "../../services/authService.js";

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [avatar, setAvatar] = useState("/broken-image.jpg");
  const [openPreview, setOpenPreview] = useState(false);
  const [profile, setProfile] = useState(null); // start as null

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        const user = res.user;

        // Mapping status & gender
        user.statusText = user.status === 1 ? "Aktif" : "Non-Aktif";
        user.genderText = user.gender === 0 ? "Laki-laki" : "Perempuan";

        setProfile(user);
        if (user.profile_picture) setAvatar(user.profile_picture);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  const renderField = (label, field, disabled = true) => {
    if (!profile) return null;
    return (
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
          sx={{ pr: { sm: 2 }, minWidth: { sm: "140px" } }}
        >
          {label}
        </Typography>
        {editMode ? (
          <TextField
            size="small"
            fullWidth
            value={profile[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            sx={{ mt: { xs: 0.5, sm: 0 }, flex: 1 }}
            InputProps={{
              disabled: disabled,
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
  };

  if (!profile) return <Typography>Loading profile...</Typography>;

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
            onClick={() => !editMode && setOpenPreview(true)}
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

        <Typography variant="h6">{profile.nama}</Typography>
        <Typography variant="body2">{profile.nis || profile.username}</Typography>
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
            {renderField("Username", "username")}
            {renderField("Nama", "nama")}
            {renderField("Email", "email")}
            {renderField("Alamat", "alamat")}
            {renderField("Tanggal Lahir", "tgl_lahir")}
            {renderField("Tempat Lahir", "tempat_lahir")}
            {renderField("Agama", "agama")}
            {renderField("Telepon/HP", "telp")}
            {renderField("Jenis Kelamin", "genderText")}
          </Paper>
        </Grid>

        {/* Orang Tua + Akademis */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Orang Tua
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {renderField("Nama Ayah     ", "nama_ayah")}
              {renderField("Nama Ibu      ", "nama_ibu")}
              {renderField("HP Orang Tua", "telp_ortu")}
            </Paper>

            <Paper sx={{ p: 2, flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                Akademis
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {renderField("NIS", "nis")}
              {renderField("NISN", "nisn")}
              {renderField("Role", "role")}
              {renderField("Status", "statusText")}
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
