// src/composables/sweetalert.js
import Swal from "sweetalert2";
import "../styles/swal.scss";

// Popup variants
export const PopupCreate = Swal.mixin({
  title: "Create New Data",
  text: "Are you sure?",
  icon: "question",
  reverseButtons: true,
  showCancelButton: true,
  cancelButtonText: "I'M NOT SURE",
  confirmButtonText: "YES, OF COURSE!",
  scrollbarPadding: false,
  customClass: {
    container: "custom-swal--popup popup-primary",
    confirmButton: "custom-swal--button-confirm",
    cancelButton: "custom-swal--button-cancel",
  },
});

export const PopupEdit = Swal.mixin({
  title: "Submit Edited Data",
  text: "Are you sure?",
  icon: "question",
  reverseButtons: true,
  showCancelButton: true,
  cancelButtonText: "I'M NOT SURE",
  confirmButtonText: "YES, OF COURSE!",
  scrollbarPadding: false,
  customClass: {
    container: "custom-swal--popup popup-warning",
    confirmButton: "custom-swal--button-confirm",
    cancelButton: "custom-swal--button-cancel",
  },
});

export const PopupDelete = Swal.mixin({
  title: "Delete Data",
  text: "Are you sure?",
  icon: "warning",
  reverseButtons: true,
  showCancelButton: true,
  cancelButtonText: "I'M NOT SURE",
  confirmButtonText: "YES, OF COURSE!",
  scrollbarPadding: false,
  customClass: {
    container: "custom-swal--popup popup-error",
    confirmButton: "custom-swal--button-confirm",
    cancelButton: "custom-swal--button-cancel",
  },
});

export const PopupRestore = Swal.mixin({
  title: "Restore Data",
  text: "Are you sure?",
  icon: "question",
  reverseButtons: true,
  showCancelButton: true,
  cancelButtonText: "I'M NOT SURE",
  confirmButtonText: "YES, OF COURSE!",
  scrollbarPadding: false,
  customClass: {
    container: "custom-swal--popup popup-success",
    confirmButton: "custom-swal--button-confirm",
    cancelButton: "custom-swal--button-cancel",
  },
});

export const PopupRefresh = Swal.mixin({
  title: "Refresh Data",
  text: "Are you sure?",
  icon: "question",
  reverseButtons: true,
  showCancelButton: true,
  cancelButtonText: "I'M NOT SURE",
  confirmButtonText: "YES, OF COURSE!",
  scrollbarPadding: false,
  customClass: {
    container: "custom-swal--popup popup-primary",
    confirmButton: "custom-swal--button-confirm",
    cancelButton: "custom-swal--button-cancel",
  },
});

export const PopupConfirm = Swal.mixin({
  title: "Confirmation",
  text: "Are you sure?",
  icon: "question",
  input: "textarea",
  inputLabel: "Reason",
  reverseButtons: true,
  showCancelButton: true,
  cancelButtonText: "I'M NOT SURE",
  confirmButtonText: "YES, OF COURSE!",
  scrollbarPadding: false,
  customClass: {
    container: "custom-swal--popup popup-primary",
    confirmButton: "custom-swal--button-confirm",
    cancelButton: "custom-swal--button-cancel",
  },
  preConfirm: (value) => {
    if (!value) {
      Swal.showValidationMessage("Please fill the reason");
    }
  },
});

export const PopupError = Swal.mixin({
  icon: "error",
  title: "Unknown Error",
  html: `
    <div>Please try again later. If problem persists, please contact system administrator</div>
  `,
  scrollbarPadding: false,
  customClass: {
    container: "custom-swal--popup popup-error",
    confirmButton: "custom-swal--button-confirm",
  },
});

export const PopupInfo = Swal.mixin({
  icon: "info",
  title: "Info",
  html: `
    <div>This status has no Annotations</div>
  `,
  scrollbarPadding: false,
  customClass: {
    container: "custom-swal--popup popup-info",
    confirmButton: "custom-swal--button-confirm",
  },
});

// Toast variants
export const ToastSuccess = Swal.mixin({
  toast: true,
  width: "30em",
  icon: "success",
  position: "bottom",
  showCloseButton: true,
  showConfirmButton: false,
  timer: 10000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
  customClass: {
    container: "custom-swal--toast toast-success",
  },
});

export const ToastWarning = Swal.mixin({
  toast: true,
  width: "30em",
  icon: "warning",
  position: "bottom",
  showCloseButton: true,
  showConfirmButton: false,
  timer: 10000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
  customClass: {
    container: "custom-swal--toast toast-warning",
  },
});

export const ToastError = Swal.mixin({
  toast: true,
  width: "30em",
  icon: "error",
  position: "bottom",
  showCloseButton: true,
  showConfirmButton: false,
  timer: 10000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
  customClass: {
    container: "custom-swal--toast toast-error",
  },
});

export const ToastInfo = Swal.mixin({
  toast: true,
  width: "30em",
  icon: "info",
  position: "bottom",
  showCloseButton: true,
  showConfirmButton: false,
  timer: 10000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
  customClass: {
    container: "custom-swal--toast toast-info",
  },
});
