import { getAPI } from "../plugins/axiosApi";
import { ENDPOINTS } from "./endpoint";

// ================== CREATE ==================
export const createKelasSiswa = async (body) => {
  const res = await getAPI.post(ENDPOINTS.KELAS_SISWA.CREATE, body);
  return res.data;
};

// ================== GET ALL ==================
export const getAllKelasSiswa = async (params = {}) => {
  const res = await getAPI.get(ENDPOINTS.KELAS_SISWA.GET_ALL, { params });
  return res.data;
};

// ================== GET LIST SISWA BY KELAS TAHUN AJARAN ==================
export const getListSiswaByKelasTahunAjaran = async (id_kelas_tahun_ajaran) => {
  const res = await getAPI.get(
    ENDPOINTS.KELAS_SISWA.GET_LIST_SISWA(id_kelas_tahun_ajaran)
  );
  return res.data;
};

// ================== GET BY ID ==================
export const getKelasSiswaById = async (id) => {
  const res = await getAPI.get(ENDPOINTS.KELAS_SISWA.GET_BY_ID(id));
  return res.data;
};

// ================== DELETE ==================
export const deleteKelasSiswa = async (id) => {
  const res = await getAPI.delete(ENDPOINTS.KELAS_SISWA.DELETE(id));
  return res.data;
};

// ================== UPLOAD RAPOR ==================
export const uploadRaporKelasSiswa = async (id, tipe, formData) => {
  const res = await getAPI.put(ENDPOINTS.KELAS_SISWA.UPLOAD_RAPOR(id, tipe),
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
};

// ================== DELETE RAPOR ==================
export const deleteRaporKelasSiswa = async (id, tipe) => {
  const res = await getAPI.delete(ENDPOINTS.KELAS_SISWA.DELETE_RAPOR(id, tipe));
  return res.data;
};

// ================== DOWNLOAD RAPOR BERDASARKAN TAHUN AJARAN ==================
export const downloadRaporByTahunAjaran = async (id_tahun_ajaran, tipe) => {
  const res = await getAPI.get(
    ENDPOINTS.KELAS_SISWA.DOWNLOAD_RAPOR_BY_TAHUN_AJARAN(id_tahun_ajaran, tipe),
    { responseType: "blob" } // penting supaya file bisa didownload
  );
  return res.data;
};
