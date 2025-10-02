import { getAPI } from "../plugins/axiosApi";
import { ENDPOINTS } from "./endpoint";

// ================== CREATE ==================
export const createTahunAjaran = async (body) => {
  const res = await getAPI.post(ENDPOINTS.TAHUN_AJARAN.CREATE, body);
  return res.data;
};

// ================== BULK CREATE ==================
export const bulkCreateTahunAjaran = async (list) => {
  const res = await getAPI.post(ENDPOINTS.TAHUN_AJARAN.BULK_CREATE, { tahunAjaranList: list });
  return res.data;
};

// ================== GET ALL ==================
export const getAllTahunAjaran = async () => {
  const res = await getAPI.get(ENDPOINTS.TAHUN_AJARAN.GET_ALL);
  return res.data;
};

// ================== GET BY ID ==================
export const getTahunAjaranById = async (id_tahun_ajaran) => {
  const res = await getAPI.get(ENDPOINTS.TAHUN_AJARAN.GET_BY_ID(id_tahun_ajaran));
  return res.data;
};

// ================== UPDATE ==================
export const updateTahunAjaran = async (id_tahun_ajaran, body) => {
  const res = await getAPI.put(ENDPOINTS.TAHUN_AJARAN.UPDATE(id_tahun_ajaran), body);
  return res.data;
};

// ================== DELETE ==================
export const deleteTahunAjaran = async (id_tahun_ajaran) => {
  const res = await getAPI.delete(ENDPOINTS.TAHUN_AJARAN.DELETE(id_tahun_ajaran));
  return res.data;
};
