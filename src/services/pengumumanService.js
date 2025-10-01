import { getAPI } from "../plugins/axiosApi";
import { ENDPOINTS } from "./endpoint";

// ================== CREATE ==================
export const createPengumuman = async (formData) => {
  const res = await getAPI.post(ENDPOINTS.PENGUMUMAN.CREATE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ================== GET ALL ==================
export const getAllPengumuman = async (id_kelas_tahun_ajaran = null) => {
  let url = ENDPOINTS.PENGUMUMAN.GET_ALL;
  if (id_kelas_tahun_ajaran) {
    url += `?id_kelas_tahun_ajaran=${id_kelas_tahun_ajaran}`;
  }
  const res = await getAPI.get(url);
  return res.data;
};

// ================== GET BY ID ==================
export const getPengumumanById = async (id_pengumuman) => {
  const res = await getAPI.get(ENDPOINTS.PENGUMUMAN.GET_BY_ID(id_pengumuman));
  return res.data;
};

// ================== UPDATE ==================
export const updatePengumuman = async (id_pengumuman, formData) => {
  const res = await getAPI.put(
    ENDPOINTS.PENGUMUMAN.UPDATE(id_pengumuman),
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
};

// ================== DELETE ==================
export const deletePengumuman = async (id_pengumuman) => {
  const res = await getAPI.delete(ENDPOINTS.PENGUMUMAN.DELETE(id_pengumuman));
  return res.data;
};

// ================== VIEW (Open in New Tab) ==================
export const viewPengumumanFile = (fileUrl) => {
  if (fileUrl) {
    window.open(fileUrl, "_blank");
  }
};

// ================== DOWNLOAD FILE ==================
export const downloadPengumumanFile = async (id_pengumuman) => {
  const res = await getAPI.get(ENDPOINTS.PENGUMUMAN.DOWNLOAD(id_pengumuman), {
    responseType: "blob",
  });

  // Buat blob link untuk download
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `pengumuman_${id_pengumuman}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
