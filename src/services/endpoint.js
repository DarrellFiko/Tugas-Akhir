export const ENDPOINTS = {
  USER: {
    LOGIN: "/users/login",
    LOGOUT: "/users/logout",
    REGISTER: "/users/register",
    BULK_REGISTER: "/users/bulk-register",
    GET_ALL: "/users",
    GET_BY_ID: (id) => `/users/${id}`,
    GET_PROFILE: "/users/profile",
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    REQUEST_OTP: "/users/request-otp",
    RESET_PASSWORD: "/users/reset-password",
    REQUEST_OTP_FORGOT_PASSWORD: "/users/forgot-password/request-otp",
    CHANGE_PASSWORD: "/users/forgot-password/change",
  },

  PENGUMUMAN: {
    CREATE: "/pengumuman",
    GET_ALL: "/pengumuman",
    GET_BY_ID: (id_pengumuman) => `/pengumuman/${id_pengumuman}`,
    UPDATE: (id_pengumuman) => `/pengumuman/${id_pengumuman}`,
    DELETE: (id_pengumuman) => `/pengumuman/${id_pengumuman}`,
    DOWNLOAD: (id_pengumuman) => `/pengumuman/download/${id_pengumuman}`,
  },

  KOMENTAR: {
    CREATE: "/komentar",
    UPDATE: (id_komentar) => `/komentar/${id_komentar}`,
    DELETE: (id_komentar) => `/komentar/${id_komentar}`,
  },
};
