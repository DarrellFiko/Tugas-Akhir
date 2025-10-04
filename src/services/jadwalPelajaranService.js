// src/services/jadwalService.js
import { getAPI } from "../plugins/axiosApi";
import { ToastSuccess } from "../composables/sweetalert";
import { ENDPOINTS } from "./endpoint";

// ================== CREATE ==================
export async function createJadwal(body) {
  const res = await getAPI.post(ENDPOINTS.JADWAL_PELAJARAN.CREATE, body);
  ToastSuccess.fire({ title: "Jadwal berhasil ditambahkan!" });
  return res.data;
}

// ================== GET ALL ==================
export async function getAllJadwal() {
  console.log(ENDPOINTS.JADWAL_PELAJARAN.GET_ALL)
  const res = await getAPI.get(ENDPOINTS.JADWAL_PELAJARAN.GET_ALL);
  console.log(res)
  return res.data;
}

// ================== GET SIMPLE ==================
export async function getSimpleJadwal() {
  const res = await getAPI.get(ENDPOINTS.JADWAL_PELAJARAN.GET_SIMPLE);
  return res.data;
}

// ================== GET BY ID ==================
export async function getJadwalById(id) {
  const res = await getAPI.get(ENDPOINTS.JADWAL_PELAJARAN.GET_BY_ID(id));
  return res.data;
}

// ================== UPDATE ==================
export async function updateJadwal(id, body) {
  const res = await getAPI.put(ENDPOINTS.JADWAL_PELAJARAN.UPDATE(id), body);
  ToastSuccess.fire({ title: "Jadwal berhasil diperbarui!" });
  return res.data;
}

// ================== DELETE ==================
export async function deleteJadwal(id) {
  const res = await getAPI.delete(ENDPOINTS.JADWAL_PELAJARAN.DELETE(id));
  ToastSuccess.fire({ title: "Jadwal berhasil dihapus!" });
  return res.data;
}
