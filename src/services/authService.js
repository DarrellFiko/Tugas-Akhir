// src/services/userService.js
import { getAPI } from "../plugins/axiosApi";
import { ENDPOINTS } from "./endpoint";

export const login = async (body) => {
  const res = await getAPI.post(ENDPOINTS.USER.LOGIN, body);
  return res.data;
};

export const getProfile = async () => {
  const res = await getAPI.get(ENDPOINTS.USER.GET_PROFILE);
  return res.data;
};

export const logout = async () => {
  const res = await getAPI.post(ENDPOINTS.USER.LOGOUT);
  return res.data;
};

export const registerUser = async (body) => {
  const formData = new FormData();
  for (let key in body) {
    formData.append(key, body[key]);
  }

  const res = await getAPI.post(ENDPOINTS.USER.REGISTER, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const bulkRegister = async (body) => {
  const res = await getAPI.post(ENDPOINTS.USER.BULK_REGISTER, body);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await getAPI.get(ENDPOINTS.USER.GET_ALL);
  return res.data;
};

export const getUserById = async (id_user) => {
  const res = await getAPI.get(ENDPOINTS.USER.GET_BY_ID(id_user));
  return res.data;
};

export const updateUser = async (id_user, body) => {
  const formData = new FormData();
  for (let key in body) {
    formData.append(key, body[key]);
  }

  const res = await getAPI.put(ENDPOINTS.USER.UPDATE(id_user), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const requestOtp = async () => {
  const res = await getAPI.post(ENDPOINTS.USER.REQUEST_OTP);
  return res.data;
};

export const resetPassword = async (body) => {
  const res = await getAPI.post(ENDPOINTS.USER.RESET_PASSWORD, body);
  return res.data;
};
