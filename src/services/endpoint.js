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
    GET_PELAJARAN_BY_ROLE: (id_tahun_ajaran) => `/kelas-tahun-ajaran/pelajaran/${id_tahun_ajaran}`,
  },

  JADWAL_PELAJARAN: {
    CREATE: "/jadwal-pelajaran",
    GET_ALL: "/jadwal-pelajaran",
    GET_SIMPLE: "/jadwal-pelajaran/simple",
    GET_BY_STUDENT: (id_tahun_ajaran) => `/jadwal-pelajaran/siswa/${id_tahun_ajaran}`,
    GET_BY_TEACHER: (id_tahun_ajaran) => `/jadwal-pelajaran/guru/${id_tahun_ajaran}`,
    GET_BY_ID: (id) => `/jadwal-pelajaran/${id}`,
    UPDATE: (id) => `/jadwal-pelajaran/${id}`,
    DELETE: (id) => `/jadwal-pelajaran/${id}`,
  },

  KELAS_SISWA: {
    CREATE: "/kelas-siswa",
    GET_ALL: "/kelas-siswa",
    GET_LIST_SISWA: (id_kelas_tahun_ajaran) => `/kelas-siswa/list-siswa?id_kelas_tahun_ajaran=${id_kelas_tahun_ajaran}`,
    GET_BY_ID: (id) => `/kelas-siswa/${id}`,
    UPLOAD_RAPOR: (id, tipe) => `/kelas-siswa/upload-rapor/${id}/${tipe}`,
    DELETE_RAPOR: (id, tipe) => `/kelas-siswa/delete-rapor/${id}/${tipe}`,
    DELETE: (id) => `/kelas-siswa/${id}`,
    DOWNLOAD_RAPOR_BY_TAHUN_AJARAN: (id_tahun_ajaran, tipe) => `/kelas-siswa/download-rapor-tahun-ajaran/${id_tahun_ajaran}/${tipe}`,
  },

  MATERI: {
    CREATE: "/materi",
    GET_ALL: "/materi",
    GET_BY_ID: (id_materi) => `/materi/${id_materi}`,
    UPDATE: (id_materi) => `/materi/${id_materi}`,
    DELETE: (id_materi) => `/materi/${id_materi}`,
    DOWNLOAD: (id_materi) => `/materi/download/${id_materi}`,
  },

  BERITA_ACARA: {
    CREATE: "/berita-acara",
    GET_ALL: "/berita-acara",
    GET_BY_ID: (id_berita_acara) => `/berita-acara/${id_berita_acara}`,
    UPDATE: (id_berita_acara) => `/berita-acara/${id_berita_acara}`,
    DELETE: (id_berita_acara) => `/berita-acara/${id_berita_acara}`,
  },

   MODUL: {
    CREATE: "/modul",
    GET_ALL: "/modul",
    GET_BY_ID: (id_modul) => `/modul/${id_modul}`,
    UPDATE: (id_modul) => `/modul/${id_modul}`,
    DELETE: (id_modul) => `/modul/${id_modul}`,
    DOWNLOAD: (id_modul) => `/modul/download/${id_modul}`,
    DOWNLOAD_ZIP: (id_modul) => `/pengumpulan-modul/download-zip/${id_modul}`,
  },

  PENGUMPULAN_MODUL: {
    CREATE: "/pengumpulan-modul",
    GET_ALL: "/pengumpulan-modul",
    GET_BY_ID: (id_pengumpulan_modul) => `/pengumpulan-modul/${id_pengumpulan_modul}`,
    DELETE: (id_pengumpulan_modul) => `/pengumpulan-modul/${id_pengumpulan_modul}`,
    DOWNLOAD: (id_pengumpulan_modul) => `/pengumpulan-modul/download/${id_pengumpulan_modul}`,
    DOWNLOAD_ZIP: (id_modul) => `/pengumpulan-modul/download-zip/${id_modul}`,
  },

  NILAI: {
    CREATE: "/nilai",
    GET_ALL: "/nilai",
    GET_BY_ID: (id_nilai) => `/nilai/${id_nilai}`,
    UPDATE: "/nilai",
    DELETE: (id_nilai) => `/nilai/${id_nilai}`,
    GET_BY_MODUL: (id_modul) => `/nilai?id_modul=${id_modul}`,
    GET_BY_UJIAN: (id_ujian) => `/nilai?id_ujian=${id_ujian}`,
    GET_BY_KELAS_GURU: (id_kelas_tahun_ajaran) => `/nilai/guru/${id_kelas_tahun_ajaran}`,
    GET_BY_SISWA: (id_tahun_ajaran) => `/nilai/siswa/${id_tahun_ajaran}`,
  },

  UJIAN: {
    CREATE: "/ujian",
    GET_ALL: "/ujian",
    GET_BY_ID: (id_ujian) => `/ujian/${id_ujian}`,
    GET_PERIKSA_UJIAN: (id_ujian) => `/ujian/${id_ujian}/periksa`,
    GET_DETAIL_PERIKSA_UJIAN: (id_ujian) => `/ujian/${id_ujian}/jawaban-siswa`,
    UPDATE: (id_ujian) => `/ujian/${id_ujian}`,
    DELETE: (id_ujian) => `/ujian/${id_ujian}`,
  },

  SOAL: {
    CREATE: "/soal",
    GET_ALL_GURU: (id_ujian) => `/soal/guru${id_ujian ? `?id_kelas_tahun_ajaran=${id_ujian}` : ""}`,
    GET_ALL_SISWA: (id_ujian) => `/soal/siswa${id_ujian ? `?id_ujian=${id_ujian}` : ""}`,
    GET_BY_ID: (id_soal) => `/soal/${id_soal}`,
    UPDATE: (id_soal) => `/soal/${id_soal}`,
    DELETE: (id_soal) => `/soal/${id_soal}`,
    DOWNLOAD_GAMBAR: (id_soal) => `/soal/download/${id_soal}`,
    GET_RANDOM: (id_ujian) => `/soal/random/${id_ujian}`,
  },

  JAWABAN_UJIAN: {
    CREATE: "/jawaban-ujian",
    GET_ALL: "/jawaban-ujian",
  },
};
