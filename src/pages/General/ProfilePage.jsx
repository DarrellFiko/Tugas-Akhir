import React, { useState, useEffect, useRef } from "react";
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
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { PopupEdit, ToastError, ToastSuccess } from "../../composables/sweetalert";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

// Import service
import { getProfile, requestOtp, resetPassword, updateUser } from "../../services/authService.js";

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [avatar, setAvatar] = useState("/broken-image.jpg");
  const [openPreview, setOpenPreview] = useState(false);
  const [profile, setProfile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [stepPassword, setStepPassword] = useState(1); // 1 = password, 2 = OTP
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const otpRefs = useRef([]);

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      ToastError.fire({ title: "Hanya bisa upload file gambar!" });
      return;
    }

    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatar(url);
  };

  const handleToggleEdit = async () => {
    if (editMode) {
      const check = await PopupEdit.fire();
      if (check.isConfirmed) {
        try {
          const body = { ...profile };
          if (avatarFile) body.profile_picture = avatarFile;

          await updateUser(profile.id_user, body);

          ToastSuccess.fire({ title: "Edit Profile Success" });

          setAvatarFile(null);
        } catch (err) {
          console.error(err);
          ToastError.fire({ title: "Gagal update profile!" });
        }
      } else return;
    }
    setEditMode(!editMode);
  };

  const handleSavePassword = async () => {
    if (!password || !confirmPassword) {
      ToastError.fire({ title: "Field tidak boleh kosong!" });
      return;
    }
    if (password !== confirmPassword) {
      ToastError.fire({ title: "Password tidak sama!" });
      return;
    }

    try {
      setOtp(Array(6).fill(""));
      setLoading(true);
      await requestOtp();
      ToastSuccess.fire({ title: "OTP telah dikirim ke email!" });
      setStepPassword(2);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (otp.some((d) => d === "")) {
      ToastError.fire({ title: "OTP harus 6 digit!" });
      return;
    }

    try {
      setLoading(true);
      const body = {
        otp_code: otp.join(""),
        new_password: password,
      };
      await resetPassword(body);
      ToastSuccess.fire({ title: "Password berhasil diganti!" });
      handleClosePasswordDialog();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      const user = res.user;

      user.statusText = user.status === 1 ? "Aktif" : "Non-Aktif";
      user.genderText = user.gender === 0 ? "Laki-laki" : "Perempuan";

      setProfile(user);
      if (user.profile_picture) setAvatar(user.profile_picture);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const renderField = (label, field, disabled = true) => {
    if (!profile) return null;

    const displayValue =
      profile[field] === null ||
      profile[field] === "" ||
      profile[field] === undefined ||
      profile[field] === "null"
        ? "-"
        : profile[field];

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
            value={displayValue}
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
            {displayValue}
          </Typography>
        )}
      </Box>
    );
  };

  if (!profile) return <Typography>Loading profile...</Typography>;

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
    setPassword("");
    setConfirmPassword("");
    setOtp(Array(6).fill(""));
    setStepPassword(1);
  };

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
            sx={{
              width: 100,
              height: 100,
              mx: "auto",
              mb: 2,
              cursor: "pointer",
            }}
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
        <Typography variant="body2">
          {profile.nis === null ||
          profile.nis === "" ||
          profile.nis === undefined ||
          profile.nis === "null"
            ? profile.username
            : profile.nis}
        </Typography>

        <Box sx={{ mt: 2, display: "flex", gap: 1, justifyContent: "center" }}>
          <Button
            variant="contained"
            color={editMode ? "success" : "warning"}
            onClick={handleToggleEdit}
          >
            {editMode ? "Save" : "Edit"}
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              setStepPassword(1);
              setOpenPasswordDialog(true);
            }}
          >
            Ganti Password
          </Button>
        </Box>
      </Paper>

      {/* Avatar Preview Dialog */}
      <Dialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        maxWidth="sm"
      >
        <DialogContent sx={{ p: 0 }}>
          <img
            src={avatar}
            alt="avatar preview"
            style={{ width: "100%", height: "auto" }}
          />
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog
        open={openPasswordDialog}
        onClose={handleClosePasswordDialog}
        fullWidth
        maxWidth="sm"
      >
        {stepPassword === 1 ? (
          <>
            <DialogTitle>Ubah Password</DialogTitle>
            <DialogContent dividers>
              <TextField
                fullWidth
                label="Password Baru"
                type="password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                fullWidth
                label="Konfirmasi Password Baru"
                type="password"
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3 }}>
              <Button onClick={handleClosePasswordDialog} color="primary">
                Batal
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSavePassword}
                loading={loading}
              >
                Save
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Verifikasi OTP</DialogTitle>
            <DialogContent dividers>
              <Typography variant="body2" gutterBottom>
                Masukkan 6 digit kode OTP
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 1 }}>
                {otpRefs.current === undefined && (otpRefs.current = Array(6).fill(null))}
                {Array.from({ length: 6 }).map((_, i) => (
                  <TextField
                    key={i}
                    id={`otp-${i}`}
                    value={otp[i] || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      if (!val) return;

                      const newOtp = [...otp];
                      newOtp[i] = val[0]; // hanya 1 digit
                      setOtp(newOtp);

                      if (i < 5 && otpRefs.current[i + 1]) otpRefs.current[i + 1].focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") {
                        const newOtp = [...otp];
                        if (newOtp[i]) {
                          newOtp[i] = "";
                          setOtp(newOtp);
                        } else if (i > 0 && otpRefs.current[i - 1]) {
                          otpRefs.current[i - 1].focus();
                        }
                      }
                    }}
                    inputRef={(el) => (otpRefs.current[i] = el)}
                    inputProps={{
                      maxLength: 1,
                      style: { textAlign: "center", fontSize: "20px" },
                    }}
                    sx={{ width: 45 }}
                  />
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setStepPassword(1)}
                color="warning"
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendOtp}
                loading={loading}
              >
                Send
              </Button>
            </DialogActions>
          </>
        )}
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
