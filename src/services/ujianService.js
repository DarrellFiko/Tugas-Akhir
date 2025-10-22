import { getAPI } from "../plugins/axiosApi";
import { ToastSuccess } from "../composables/sweetalert";
import { ENDPOINTS } from "./endpoint";

// ================== CREATE ==================
export async function createUjian(body) {
  const res = await getAPI.post(ENDPOINTS.UJIAN.CREATE, body);
  ToastSuccess.fire({ title: "Ujian berhasil ditambahkan!" });
  return res.data;
}

// ================== GET ALL ==================
export async function getAllUjian(id_kelas_tahun_ajaran) {
  const res = await getAPI.get(ENDPOINTS.UJIAN.GET_ALL + `?id_kelas_tahun_ajaran=${id_kelas_tahun_ajaran}`);
  return res.data;
}

// ================== GET BY ID ==================
export async function getUjianById(id_ujian) {
  const res = await getAPI.get(ENDPOINTS.UJIAN.GET_BY_ID(id_ujian));
  return res.data;
}

// ================== UPDATE ==================
export async function updateUjian(id_ujian, body) {
  const res = await getAPI.put(ENDPOINTS.UJIAN.UPDATE(id_ujian), body);
  ToastSuccess.fire({ title: "Ujian berhasil diperbarui!" });
  return res.data;
}

// ================== DELETE ==================
export async function deleteUjian(id_ujian) {
  const res = await getAPI.delete(ENDPOINTS.UJIAN.DELETE(id_ujian));
  ToastSuccess.fire({ title: "Ujian berhasil dihapus!" });
  return res.data;
}
