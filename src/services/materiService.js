// src/services/materiService.js
import { getAPI } from "../plugins/axiosApi";
import { ENDPOINTS } from "./endpoint";
import { ToastSuccess } from "../composables/sweetalert";

// ================== CREATE ==================
export const createMateri = async (body) => {
  const res = await getAPI.post(ENDPOINTS.MATERI.CREATE, body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  ToastSuccess.fire({ title: "Materi berhasil ditambahkan!" });
  return res.data;
};

// ================== GET ALL ==================
export const getAllMateri = async (id_kelas_tahun_ajaran = null) => {
  const url = id_kelas_tahun_ajaran
    ? `${ENDPOINTS.MATERI.GET_ALL}?id_kelas_tahun_ajaran=${id_kelas_tahun_ajaran}`
    : ENDPOINTS.MATERI.GET_ALL;

  const res = await getAPI.get(url);
  return res.data;
};

// ================== GET BY ID ==================
export const getMateriById = async (id_materi) => {
  const res = await getAPI.get(ENDPOINTS.MATERI.GET_BY_ID(id_materi));
  return res.data;
};

// ================== UPDATE ==================
export const updateMateri = async (id_materi, body) => {
  const res = await getAPI.put(ENDPOINTS.MATERI.UPDATE(id_materi), body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  ToastSuccess.fire({ title: "Materi berhasil diperbarui!" });
  return res.data;
};

// ================== DELETE ==================
export const deleteMateri = async (id_materi) => {
  const res = await getAPI.delete(ENDPOINTS.MATERI.DELETE(id_materi));
  ToastSuccess.fire({ title: "Materi berhasil dihapus!" });
  return res.data;
};

// ================== DOWNLOAD ==================
export const downloadMateri = async (id_materi) => {
  const res = await getAPI.get(ENDPOINTS.MATERI.DOWNLOAD(id_materi), {
    responseType: "blob",
  });
  return res.data;
};
