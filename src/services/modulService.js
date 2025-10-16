import { getAPI } from "../plugins/axiosApi";
import { ENDPOINTS } from "./endpoint";
import { ToastError, ToastSuccess } from "../composables/sweetalert";

// ================== CREATE ==================
export const createModul = async (body) => {
  const res = await getAPI.post(ENDPOINTS.MODUL.CREATE, body);
  return res.data;
};

// ================== GET ALL ==================
export const getAllModul = async (id_kelas_tahun_ajaran = null) => {
  const url = id_kelas_tahun_ajaran
    ? `${ENDPOINTS.MODUL.GET_ALL}?id_kelas_tahun_ajaran=${id_kelas_tahun_ajaran}`
    : ENDPOINTS.MODUL.GET_ALL;

  const res = await getAPI.get(url);
  return res.data;
};

// ================== GET BY ID ==================
export const getModulById = async (id_modul) => {
  const res = await getAPI.get(ENDPOINTS.MODUL.GET_BY_ID(id_modul));
  return res.data;
};

// ================== UPDATE ==================
export const updateModul = async (id_modul, body) => {
  const res = await getAPI.put(ENDPOINTS.MODUL.UPDATE(id_modul), body);
  return res.data;
};

// ================== DELETE ==================
export const deleteModul = async (id_modul) => {
  const res = await getAPI.delete(ENDPOINTS.MODUL.DELETE(id_modul));
  ToastSuccess.fire({ title: "Modul berhasil dihapus!" });
  return res.data;
};

// ================== DOWNLOAD ==================
export const downloadModul = async (id_modul) => {
  const res = await getAPI.get(ENDPOINTS.MODUL.DOWNLOAD(id_modul), { responseType: "blob" });
  return res.data;
};

// ================== DOWNLOAD ZIP SEMUA PENGUMPULAN ==================
// export const downloadPengumpulanZip = async (id_modul) => {
//   try {
//     const res = await getAPI.get(ENDPOINTS.MODUL.DOWNLOAD_ZIP(id_modul), {
//       responseType: "blob",
//     });

//     const contentType = res.headers["content-type"];
//     if (contentType && contentType.includes("application/json")) {
//       const text = await res.data.text();
//       const json = JSON.parse(text);
//       ToastError.fire({
//         title: json.message || "Gagal mendownload ZIP!",
//       });
//       return;
//     }

//     const blob = new Blob([res.data], { type: "application/zip" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `pengumpulan_modul_${id_modul}.zip`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();

//     ToastSuccess.fire({
//       title: "File ZIP berhasil didownload!",
//     });
//   } catch (err) {
//     if (err.response) {
//       try {
//         const reader = new FileReader();
//         reader.onload = () => {
//           const json = JSON.parse(reader.result);
//           ToastError.fire({
//             title: json.message || "Gagal mendownload ZIP!",
//           });
//         };
//         reader.readAsText(err.response.data);
//       } catch {
//         ToastError.fire({
//           title: "Gagal mendownload ZIP!",
//         });
//       }
//     } else {
//       ToastError.fire({
//         title: "Terjadi kesalahan koneksi.",
//       });
//     }
//     console.error(err);
//   }
// };