import { getAPI } from "../plugins/axiosApi";
import { ENDPOINTS } from "./endpoint";

// ================== CREATE ==================
export const createKelas = async (body) => {
  const res = await getAPI.post(ENDPOINTS.KELAS.CREATE, body);
  return res.data;
};

// ================== GET ALL ==================
export const getAllKelas = async () => {
  const res = await getAPI.get(ENDPOINTS.KELAS.GET_ALL);
  return res.data;
};

// ================== GET SIMPLE KELAS ==================
export const getSimpleKelas = async (params = {}) => {
  return await getAPI(ENDPOINTS.KELAS.GET_SIMPLE, { params });
};

// ================== GET BY ID ==================
export const getKelasById = async (id_kelas) => {
  const res = await getAPI.get(ENDPOINTS.KELAS.GET_BY_ID(id_kelas));
  return res.data;
};

// ================== UPDATE ==================
export const updateKelas = async (id_kelas, body) => {
  const res = await getAPI.put(ENDPOINTS.KELAS.UPDATE(id_kelas), body);
  return res.data;
};

// ================== DELETE ==================
export const deleteKelas = async (id_kelas) => {
  const res = await getAPI.delete(ENDPOINTS.KELAS.DELETE(id_kelas));
  return res.data;
};
