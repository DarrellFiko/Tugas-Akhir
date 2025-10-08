export const ENDPOINTS = {
  USER: {
    LOGIN: "/users/login",
    LOGOUT: "/users/logout",
    REGISTER: "/users/register",
    BULK_REGISTER: "/users/bulk-register",
    GET_ALL: "/users",
    GET_SIMPLE: "/users/simple",
    GET_BY_ID: (id) => `/users/${id}`,
    GET_PROFILE: "/users/profile",
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    REQUEST_OTP: "/users/request-otp",
    RESET_PASSWORD: "/users/reset-password",
    REQUEST_OTP_FORGOT_PASSWORD: "/users/forgot-password/request-otp",
    CHANGE_PASSWORD: "/users/forgot-password/change",
  },

  PENGUMUMAN: {
    CREATE: "/pengumuman",
    GET_ALL: "/pengumuman",
    GET_BY_ID: (id_pengumuman) => `/pengumuman/${id_pengumuman}`,
    UPDATE: (id_pengumuman) => `/pengumuman/${id_pengumuman}`,
    DELETE: (id_pengumuman) => `/pengumuman/${id_pengumuman}`,
    DOWNLOAD: (id_pengumuman) => `/pengumuman/download/${id_pengumuman}`,
  },

  KOMENTAR: {
    CREATE: "/komentar",
    UPDATE: (id_komentar) => `/komentar/${id_komentar}`,
    DELETE: (id_komentar) => `/komentar/${id_komentar}`,
  },

  TAHUN_AJARAN: {
    CREATE: "/tahun-ajaran",
    BULK_CREATE: "/tahun-ajaran/bulk",
    GET_ALL: "/tahun-ajaran",
    GET_SIMPLE: "/tahun-ajaran/simple",
    GET_BY_ID: (id_tahun_ajaran) => `/tahun-ajaran/${id_tahun_ajaran}`,
    UPDATE: (id_tahun_ajaran) => `/tahun-ajaran/${id_tahun_ajaran}`,
    DELETE: (id_tahun_ajaran) => `/tahun-ajaran/${id_tahun_ajaran}`,
  },

  KELAS: {
    CREATE: "/kelas",
    GET_ALL: "/kelas",
    GET_SIMPLE: "/kelas/simple",
    GET_BY_ID: (id_kelas) => `/kelas/${id_kelas}`,
    UPDATE: (id_kelas) => `/kelas/${id_kelas}`,
    DELETE: (id_kelas) => `/kelas/${id_kelas}`,
  },

  PELAJARAN: {
    CREATE: "/pelajaran",
    GET_ALL: "/pelajaran",
    GET_SIMPLE: "/pelajaran/simple",
    GET_BY_ID: (id_pelajaran) => `/pelajaran/${id_pelajaran}`,
    UPDATE: (id_pelajaran) => `/pelajaran/${id_pelajaran}`,
    DELETE: (id_pelajaran) => `/pelajaran/${id_pelajaran}`,
  },

  KELAS_TAHUN_AJARAN: {
    CREATE: "/kelas-tahun-ajaran",
    GET_ALL: "/kelas-tahun-ajaran",
    GET_BY_ID: (id) => `/kelas-tahun-ajaran/${id}`,
    UPDATE: (id) => `/kelas-tahun-ajaran/${id}`,
    DELETE: (id) => `/kelas-tahun-ajaran/${id}`,
    GET_PELAJARAN_BY_ROLE: (id_tahun_ajaran) =>
      `/kelas-tahun-ajaran/pelajaran/${id_tahun_ajaran}`,
  },

  JADWAL_PELAJARAN: {
    CREATE: "/jadwal-pelajaran",
    GET_ALL: "/jadwal-pelajaran",
    GET_SIMPLE: "/jadwal-pelajaran/simple",
    GET_BY_ID: (id) => `/jadwal-pelajaran/${id}`,
    UPDATE: (id) => `/jadwal-pelajaran/${id}`,
    DELETE: (id) => `/jadwal-pelajaran/${id}`,
    GET_BY_STUDENT: (id_tahun_ajaran) =>
      `/jadwal-pelajaran/siswa/${id_tahun_ajaran}`,
    GET_BY_TEACHER: (id_tahun_ajaran) =>
      `/jadwal-pelajaran/guru/${id_tahun_ajaran}`,
  },

  KELAS_SISWA: {
    CREATE: "/kelas-siswa",
    GET_ALL: "/kelas-siswa",
    GET_BY_ID: (id) => `/kelas-siswa/${id}`,
    UPLOAD_RAPOR: (id, tipe) => `/kelas-siswa/upload-rapor/${id}/${tipe}`,
    DELETE_RAPOR: (id, tipe) => `/kelas-siswa/delete-rapor/${id}/${tipe}`,
    DELETE: (id) => `/kelas-siswa/${id}`,
  },
};
