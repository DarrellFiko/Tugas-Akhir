// src/services/barangService.js
import { getAPI } from "../plugins/axios-api";
import { ToastSuccess } from "../composables/sweetalert";
import { ENDPOINTS } from "./endpoint";

// Get all barang
export async function getAllBarang() {
  const res = await getAPI.get(ENDPOINTS.BARANG.GET_ALL);
  return res.data.reverse();
}

// Load barang with params
export async function loadBarang(params) {
  const res = await getAPI.get(ENDPOINTS.BARANG.LOAD, { params });
  return res.data;
}

// Upload barang
export async function uploadBarang(items) {
  const res = await getAPI.post(ENDPOINTS.BARANG.CREATE, items);
  ToastSuccess.fire({ title: "Upload Success!" });
  return res.data;
}

// Delete barang
export async function deleteBarang(id) {
  const res = await getAPI.delete(ENDPOINTS.BARANG.DELETE(id));
  ToastSuccess.fire({ title: "Delete Success!" });
  return res.data;
}
