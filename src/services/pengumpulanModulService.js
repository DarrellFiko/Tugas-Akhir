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
export const downloadPengumpulanModulZip = async (
  id_modul,
  setIsDownloading = null
) => {
  try {
    if (setIsDownloading) setIsDownloading(true);

    const token = localStorage.getItem("authToken");
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const url =
      baseURL + `/pengumpulan-modul/download-zip/${id_modul}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      try {
        const json = JSON.parse(text);
        throw new Error(json.message);
      } catch {
        throw new Error("Gagal mendownload ZIP");
      }
    }

    const blob = await response.blob();

    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `modul_${id_modul}_pengumpulan.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(downloadUrl);
  } catch (err) {
    console.error(err);
    alert(err.message || "Download gagal");
  } finally {
    if (setIsDownloading) setIsDownloading(false);
  }
};



