import { getAPI } from "../plugins/axiosApi";
import { ENDPOINTS } from "./endpoint";

// ================== CREATE ==================
export const createPelajaran = async (body) => {
  const res = await getAPI.post(ENDPOINTS.PELAJARAN.CREATE, body);
  return res.data;
};

// ================== GET ALL ==================
export const getAllPelajaran = async () => {
  const res = await getAPI.get(ENDPOINTS.PELAJARAN.GET_ALL);
  return res.data;
};

// ================== GET SIMPLE PELAJARAN ==================
export const getSimplePelajaran = async (params = {}) => {
  return await getAPI(ENDPOINTS.PELAJARAN.GET_SIMPLE, { params });
};

// ================== GET BY ID ==================
export const getPelajaranById = async (id_pelajaran) => {
  const res = await getAPI.get(ENDPOINTS.PELAJARAN.GET_BY_ID(id_pelajaran));
  return res.data;
};

// ================== UPDATE ==================
export const updatePelajaran = async (id_pelajaran, body) => {
  const res = await getAPI.put(ENDPOINTS.PELAJARAN.UPDATE(id_pelajaran), body);
  return res.data;
};

// ================== DELETE ==================
export const deletePelajaran = async (id_pelajaran) => {
  const res = await getAPI.delete(ENDPOINTS.PELAJARAN.DELETE(id_pelajaran));
  return res.data;
};
