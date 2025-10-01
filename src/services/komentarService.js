import { getAPI } from "../plugins/axiosApi";
import { ENDPOINTS } from "./endpoint";

// ================== CREATE ==================
export const createKomentar = async (body) => {
  const res = await getAPI.post(ENDPOINTS.KOMENTAR.CREATE, body);
  return res.data;
};

// ================== UPDATE ==================
export const updateKomentar = async (id_komentar, body) => {
  const res = await getAPI.put(ENDPOINTS.KOMENTAR.UPDATE(id_komentar), body);
  return res.data;
};

// ================== DELETE ==================
export const deleteKomentar = async (id_komentar) => {
  const res = await getAPI.delete(ENDPOINTS.KOMENTAR.DELETE(id_komentar));
  return res.data;
};
