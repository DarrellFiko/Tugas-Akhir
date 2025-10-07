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

// ================== GET BY ID ==================
export const getKelasSiswaById = async (id) => {
  const res = await getAPI.get(ENDPOINTS.KELAS_SISWA.GET_BY_ID(id));
  return res.data;
};

// // ================== UPLOAD RAPOR ==================
// export const uploadRapor = async (id, tipe, file) => {
//   const formData = new FormData();
//   formData.append("rapor", file);

//   const res = await getAPI.put(
//     ENDPOINTS.KELAS_SISWA.UPLOAD_RAPOR(id, tipe),
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     }
//   );

//   return res.data;
// };

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
