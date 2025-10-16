import { getAPI } from "../plugins/axiosApi";
import { ENDPOINTS } from "./endpoint";
import { ToastError, ToastSuccess } from "../composables/sweetalert";

// ================== CREATE / UPDATE ==================
export const createPengumpulanModul = async (body) => {
  const res = await getAPI.post(ENDPOINTS.PENGUMPULAN_MODUL.CREATE, body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ================== GET ALL ==================
export const getAllPengumpulanModul = async (id_modul = null) => {
  const url = id_modul
    ? `${ENDPOINTS.PENGUMPULAN_MODUL.GET_ALL}?id_modul=${id_modul}`
    : ENDPOINTS.PENGUMPULAN_MODUL.GET_ALL;

  const res = await getAPI.get(url);
  return res.data;
};

// ================== GET BY ID ==================
export const getPengumpulanModulById = async (id_pengumpulan_modul) => {
  const res = await getAPI.get(
    ENDPOINTS.PENGUMPULAN_MODUL.GET_BY_ID(id_pengumpulan_modul)
  );
  return res.data;
};

// ================== DELETE ==================
export const deletePengumpulanModul = async (id_pengumpulan_modul) => {
  const res = await getAPI.delete(
    ENDPOINTS.PENGUMPULAN_MODUL.DELETE(id_pengumpulan_modul)
  );
  ToastSuccess.fire({ title: "Pengumpulan modul berhasil dihapus!" });
  return res.data;
};

// ================== DOWNLOAD ==================
export const downloadPengumpulanModul = async (id_pengumpulan_modul) => {
  const res = await getAPI.get(
    ENDPOINTS.PENGUMPULAN_MODUL.DOWNLOAD(id_pengumpulan_modul),
    { responseType: "blob" }
  );
  return res.data;
};

// ================== DOWNLOAD ZIP SEMUA PENGUMPULAN ==================
export const downloadPengumpulanModulZip = async (id_modul) => {
  try {
    const res = await getAPI.get(
      ENDPOINTS.PENGUMPULAN_MODUL.DOWNLOAD_ZIP(id_modul),
      { responseType: "blob" }
    );

    const contentType = res.headers["content-type"];
    if (contentType && contentType.includes("application/json")) {
      const text = await res.data.text();
      const json = JSON.parse(text);
      ToastError.fire({
        title: json.message || "Gagal mendownload ZIP!",
      });
      return;
    }

    const blob = new Blob([res.data], { type: "application/zip" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `modul_${id_modul}_pengumpulan.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    ToastSuccess.fire({
      title: "File ZIP berhasil didownload!",
    });
  } catch (err) {
    if (err.response) {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          const json = JSON.parse(reader.result);
          ToastError.fire({
            title: json.message || "Gagal mendownload ZIP!",
          });
        };
        reader.readAsText(err.response.data);
      } catch {
        ToastError.fire({
          title: "Gagal mendownload ZIP!",
        });
      }
    } else {
      ToastError.fire({
        title: "Terjadi kesalahan koneksi.",
      });
    }
    console.error(err);
  }
};
