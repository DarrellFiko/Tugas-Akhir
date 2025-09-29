// src/services/endpoints.js
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
    REQUEST_OTP: "/users/request-otp",
    RESET_PASSWORD: "/users/reset-password",
    REQUEST_OTP_FORGOT_PASSWORD: "/users/forgot-password/request-otp",
    CHANGE_PASSWORD: "/users/forgot-password/change",
  },

  // Example
  ORDER: {
    GET_ALL: "/orders",
    CREATE: "/orders",
    DELETE: (id) => `/orders/${id}`,
  },

  BARANG: {
    GET_ALL: "/barang",
    LOAD: "/loadBarang",
    CREATE: "/barang",
    DELETE: (id) => `/barang/${id}`,
  },
};
