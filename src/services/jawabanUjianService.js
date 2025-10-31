// src/services/jawabanUjianService.js
import { getAPI } from "../plugins/axiosApi";
import { ToastSuccess } from "../composables/sweetalert";
import { ENDPOINTS } from "./endpoint";

// ================== CREATE (Siswa mengirim jawaban) ==================
export async function createJawabanUjian(body) {
  const res = await getAPI.post(ENDPOINTS.JAWABAN_UJIAN.CREATE, body);
  return res.data;
}

// ================== GET ALL (Guru melihat jawaban siswa) ==================
export async function getAllJawabanUjian(id_soal) {
  const res = await getAPI.get(`${ENDPOINTS.JAWABAN_UJIAN.GET_ALL}?id_soal=${id_soal}`);
  return res.data;
}

// ================== UPDATE NILAI (Guru memeriksa jawaban isian) ==================
export async function updateJawabanUjian(id_jawaban, body) {
  const res = await getAPI.put(ENDPOINTS.JAWABAN_UJIAN.UPDATE(id_jawaban), body);
  return res.data;
}