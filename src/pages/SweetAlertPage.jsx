// Import Libs
import React from "react";
import { 
  PopupCreate,
  PopupEdit,
  PopupDelete,
  PopupRestore,
  PopupRefresh,
  PopupConfirm,
  PopupError,
  ToastSuccess,
  ToastWarning,
  ToastError,
  ToastInfo, 
} from "../composables/sweetalert";
import { Button, Stack, Typography, Paper, Divider, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function SweetAlertPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handlePopupCreate = () => PopupCreate.fire();
  const handlePopupEdit = () => PopupEdit.fire();
  const handlePopupDelete = () => PopupDelete.fire();
  const handlePopupRestore = () => PopupRestore.fire();
  const handlePopupRefresh = () => PopupRefresh.fire();
  const handlePopupConfirm = () => PopupConfirm.fire();
  const handlePopupError = () => PopupError.fire();

  const handleToastSuccess = () => ToastSuccess.fire({ title: "Toast Successfully Fired" });
  const handleToastWarning = () => ToastWarning.fire({ title: "Toast has Something Wrong" });
  const handleToastError = () => ToastError.fire({ title: "Toast Cannot be Fired" });
  const handleToastInfo = () => ToastInfo.fire({ title: "Toast has Info" });

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Popup & Toast
      </Typography>

      {/* Popups */}
      <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Popups
        </Typography>
        <Divider />
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={1}
          sx={{ mt: 1.5 }}
          flexWrap="wrap"
        >
          <Button fullWidth={isMobile} variant="contained" color="primary" onClick={handlePopupCreate}>
            Create
          </Button>
          <Button fullWidth={isMobile} variant="contained" color="warning" onClick={handlePopupEdit}>
            Edit
          </Button>
          <Button fullWidth={isMobile} variant="contained" color="error" onClick={handlePopupDelete}>
            Delete
          </Button>
          <Button fullWidth={isMobile} variant="contained" color="success" onClick={handlePopupRestore}>
            Restore
          </Button>
          <Button fullWidth={isMobile} variant="contained" color="info" onClick={handlePopupRefresh}>
            Refresh
          </Button>
          <Button fullWidth={isMobile} variant="contained" color="warning" onClick={handlePopupConfirm}>
            Confirm
          </Button>
          <Button fullWidth={isMobile} variant="contained" color="error" onClick={handlePopupError}>
            Error
          </Button>
        </Stack>
      </Paper>

      {/* Toasts */}
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Toasts
        </Typography>
        <Divider />
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={1}
          sx={{ mt: 1.5 }}
          flexWrap="wrap"
        >
          <Button fullWidth={isMobile} variant="outlined" color="success" onClick={handleToastSuccess}>
            Success
          </Button>
          <Button fullWidth={isMobile} variant="outlined" color="warning" onClick={handleToastWarning}>
            Warning
          </Button>
          <Button fullWidth={isMobile} variant="outlined" color="error" onClick={handleToastError}>
            Error
          </Button>
          <Button fullWidth={isMobile} variant="outlined" color="info" onClick={handleToastInfo}>
            Info
          </Button>
        </Stack>
      </Paper>
    </div>
  );
}
