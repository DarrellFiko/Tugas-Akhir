import { getAPI } from "../plugins/axiosApi";
import { ToastSuccess } from "../composables/sweetalert";
import { ENDPOINTS } from "./endpoint";

// ================== CREATE ==================
export async function createSoal(formData) {
  const res = await getAPI.post(ENDPOINTS.SOAL.CREATE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  ToastSuccess.fire({ title: "Soal berhasil ditambahkan!" });
  return res.data;
}

// ================== GET ALL (Guru - tampilkan jawaban benar) ==================
export async function getAllSoalGuru(id_kelas_tahun_ajaran) {
  const res = await getAPI.get(ENDPOINTS.SOAL.GET_ALL_GURU(id_kelas_tahun_ajaran));
  return res.data;
}

// ================== GET ALL (Siswa - sembunyikan jawaban benar) ==================
export async function getAllSoalSiswa(id_ujian) {
  const res = await getAPI.get(ENDPOINTS.SOAL.GET_ALL_SISWA(id_ujian));
  return res.data;
}

// ================== GET BY ID ==================
export async function getSoalById(id_soal) {
  const res = await getAPI.get(ENDPOINTS.SOAL.GET_BY_ID(id_soal));
  return res.data;
}

// ================== UPDATE ==================
export async function updateSoal(id_soal, formData) {
  const res = await getAPI.put(ENDPOINTS.SOAL.UPDATE(id_soal), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  ToastSuccess.fire({ title: "Soal berhasil diperbarui!" });
  return res.data;
}

// ================== DELETE ==================
export async function deleteSoal(id_soal) {
  const res = await getAPI.delete(ENDPOINTS.SOAL.DELETE(id_soal));
  ToastSuccess.fire({ title: "Soal berhasil dihapus!" });
  return res.data;
}

// ================== DOWNLOAD GAMBAR ==================
export async function downloadSoalImage(id_soal) {
  const res = await getAPI.get(ENDPOINTS.SOAL.DOWNLOAD_GAMBAR(id_soal), {
    responseType: "blob",
  });
  return res;
}
