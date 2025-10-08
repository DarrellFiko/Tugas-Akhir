import { getAPI } from "../plugins/axiosApi";
import { ENDPOINTS } from "./endpoint";

// ================== CREATE ==================
export const createKelasTahunAjaran = async (body) => {
  const res = await getAPI.post(ENDPOINTS.KELAS_TAHUN_AJARAN.CREATE, body);
  return res.data;
};

// ================== GET ALL ==================
export const getAllKelasTahunAjaran = async () => {
  const res = await getAPI.get(ENDPOINTS.KELAS_TAHUN_AJARAN.GET_ALL);
  return res.data;
};

// ================== GET BY ID ==================
export const getKelasTahunAjaranById = async (id) => {
  const res = await getAPI.get(ENDPOINTS.KELAS_TAHUN_AJARAN.GET_BY_ID(id));
  return res.data;
};

// ================== UPDATE ==================
export const updateKelasTahunAjaran = async (id, body) => {
  const res = await getAPI.put(ENDPOINTS.KELAS_TAHUN_AJARAN.UPDATE(id), body);
  return res.data;
};

// ================== DELETE ==================
export const deleteKelasTahunAjaran = async (id) => {
  const res = await getAPI.delete(ENDPOINTS.KELAS_TAHUN_AJARAN.DELETE(id));
  return res.data;
};

// ================== GET PELAJARAN BY ROLE (Guru/Siswa Otomatis dari JWT) ==================
export const getPelajaranByRole = async (id_tahun_ajaran) => {
  const res = await getAPI.get(
    ENDPOINTS.KELAS_TAHUN_AJARAN.GET_PELAJARAN_BY_ROLE(id_tahun_ajaran)
  );
  return res.data;
};
