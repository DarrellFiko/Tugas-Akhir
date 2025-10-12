import { getAPI } from "../plugins/axiosApi";
import { ENDPOINTS } from "./endpoint";
import { ToastSuccess } from "../composables/sweetalert";

// ================== CREATE ==================
export const createBeritaAcara = async (body) => {
  const res = await getAPI.post(ENDPOINTS.BERITA_ACARA.CREATE, body);
  return res.data;
};

// ================== GET ALL ==================
export const getAllBeritaAcara = async (id_kelas_tahun_ajaran = null) => {
  const url = id_kelas_tahun_ajaran
    ? `${ENDPOINTS.BERITA_ACARA.GET_ALL}?id_kelas_tahun_ajaran=${id_kelas_tahun_ajaran}`
    : ENDPOINTS.BERITA_ACARA.GET_ALL;

  const res = await getAPI.get(url);
  return res.data;
};

// ================== GET BY ID ==================
export const getBeritaAcaraById = async (id_berita_acara) => {
  const res = await getAPI.get(ENDPOINTS.BERITA_ACARA.GET_BY_ID(id_berita_acara));
  return res.data;
};

// ================== UPDATE ==================
export const updateBeritaAcara = async (id_berita_acara, body) => {
  const res = await getAPI.put(ENDPOINTS.BERITA_ACARA.UPDATE(id_berita_acara), body);
  return res.data;
};

// ================== DELETE ==================
export const deleteBeritaAcara = async (id_berita_acara) => {
  const res = await getAPI.delete(ENDPOINTS.BERITA_ACARA.DELETE(id_berita_acara));
  ToastSuccess.fire({ title: "Berita acara berhasil dihapus!" });
  return res.data;
};
