import { getAPI } from "../plugins/axiosApi";
import { ENDPOINTS } from "./endpoint";
import { ToastSuccess } from "../composables/sweetalert";

// ================== CREATE (Single or Multiple) ==================
export async function createNilai(body) {
  const res = await getAPI.post(ENDPOINTS.NILAI.CREATE, body);
  ToastSuccess.fire({ title: "Nilai berhasil ditambahkan!" });
  return res.data;
}

// ================== GET ALL ==================
// Dapat filter berdasarkan id_kelas_tahun_ajaran, id_modul, atau id_ujian
export async function getAllNilai({
  id_kelas_tahun_ajaran = null,
  id_modul = null,
  id_ujian = null,
} = {}) {
  let queryParams = [];

  if (id_kelas_tahun_ajaran)
    queryParams.push(`id_kelas_tahun_ajaran=${id_kelas_tahun_ajaran}`);
  if (id_modul) queryParams.push(`id_modul=${id_modul}`);
  if (id_ujian) queryParams.push(`id_ujian=${id_ujian}`);

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
  const url = `${ENDPOINTS.NILAI.GET_ALL}${queryString}`;

  const res = await getAPI.get(url);
  return res.data;
}

// ================== GET BY ID ==================
export async function getNilaiById(id_nilai) {
  const res = await getAPI.get(ENDPOINTS.NILAI.GET_BY_ID(id_nilai));
  return res.data;
}

// ================== GET NILAI GURU BY KELAS ==================
export async function getNilaiGuruByKelas(id_kelas_tahun_ajaran) {
  const res = await getAPI.get(
    ENDPOINTS.NILAI.GET_BY_KELAS_GURU(id_kelas_tahun_ajaran)
  );
  return res.data;
}

// ================== GET NILAI SISWA BY TAHUN AJARAN ==================
export async function getNilaiSiswaByTahunAjaran(id_tahun_ajaran) {
  const res = await getAPI.get(ENDPOINTS.NILAI.GET_BY_SISWA(id_tahun_ajaran));
  return res.data;
}

// ================== GET BY MODUL ==================
export async function getNilaiByModul(id_modul) {
  const res = await getAPI.get(ENDPOINTS.NILAI.GET_BY_MODUL(id_modul));
  return res.data;
}

// ================== GET BY UJIAN ==================
export async function getNilaiByUjian(id_ujian) {
  const res = await getAPI.get(ENDPOINTS.NILAI.GET_BY_UJIAN(id_ujian));
  return res.data;
}

// ================== UPDATE (Single or Multiple) ==================
export async function updateNilai(body) {
  const res = await getAPI.put(ENDPOINTS.NILAI.UPDATE, body);
  return res.data;
}

// ================== DELETE ==================
export async function deleteNilai(id_nilai) {
  const res = await getAPI.delete(ENDPOINTS.NILAI.DELETE(id_nilai));
  ToastSuccess.fire({ title: "Nilai berhasil dihapus!" });
  return res.data;
}
