// Page import
// General
import HomePage from "../pages/General/HomePage";
import TablePage from "../pages/TablePage";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/General/LoginPage";
import JadwalPage from "../pages/General/JadwalPage";
import ProfilePage from "../pages/General/ProfilePage";
import KelasPage from "../pages/General/KelasPage";
import ChartPage from "../pages/ChartPage";
import SweetAlertPage from "../pages/SweetAlertPage";
import BackendPage from "../pages/BackendPage";

// Siswa
import NilaiSiswaPage from "../pages/Siswa/NilaiSiswaPage";
import UjianSiswaPage from "../pages/Siswa/Ujian/UjianSiswaPage";

// Icon import
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DetailKelasSiswaPage from "../pages/Siswa/Kelas/DetailKelasSiswaPage";

import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import DetailModuleSiswaPage from "../pages/Siswa/Kelas/DetailModuleSiswaPage";
import DetailKelasGuruPage from "../pages/Guru/Kelas/DetailKelasGuruPage";
import DetailModuleGuruPage from "../pages/Guru/Kelas/DetailModuleGuruPage";

const loginRoutes = [
  {
    section: "login",
    items: [
      { path: "/", element: <LoginPage />, label: "Login", icon: <ExitToAppOutlinedIcon /> },
    ],
  },
];

const studentRoutes = [
  {
    section: "General",
    items: [
      { path: "/dashboard", element: <HomePage />, label: "Pengumuman", icon: <AnnouncementOutlinedIcon /> },
    ],
  },
  {
    section: "Akademik",
    items: [
      { path: "/jadwal", element: <JadwalPage />, label: "Jadwal Pelajaran", icon: <CalendarMonthOutlinedIcon /> },
      { path: "/kelas", element: <KelasPage />, label: "Kelas Online", icon: <MenuBookOutlinedIcon /> },
      { path: "/nilai", element: <NilaiSiswaPage />, label: "Nilai Akademik", icon: <SchoolOutlinedIcon /> },
      { path: "/ujian", element: <UjianSiswaPage />, label: "Ujian Online", icon: <BorderColorOutlinedIcon /> },
    ],
  },
  {
    section: "dont-show",
    items: [
      { path: "/profile", element: <ProfilePage /> },
      { path: "/kelas/detail/:id", element: <DetailKelasSiswaPage /> },
      { path: "/kelas/detail/:id/module/:modulId", element: <DetailModuleSiswaPage /> },
      // { path: "*", element: <NotFoundPage /> },
    ],
  },
];

const teacherRoutes = [
  {
    section: "General",
    items: [
      { path: "/dashboard", element: <HomePage />, label: "Pengumuman", icon: <AnnouncementOutlinedIcon /> },
    ],
  },
  {
    section: "Akademik",
    items: [
      { path: "/jadwal", element: <JadwalPage />, label: "Jadwal Mengajar", icon: <CalendarMonthOutlinedIcon /> },
      { path: "/kelas", element: <KelasPage />, label: "Kelas Online", icon: <MenuBookOutlinedIcon /> },
      { path: "/ujian", element: <UjianSiswaPage />, label: "Ujian Online", icon: <BorderColorOutlinedIcon /> },
    ],
  },
  // {
  //   section: "Template",
  //   items: [
  //     { path: "/sweet-alert", element: <SweetAlertPage />, label: "Popup & Toast", icon: <NotificationsOutlinedIcon /> },
  //     { path: "/chart", element: <ChartPage />, label: "Charts", icon: <InsertChartOutlinedIcon /> },
  //     { path: "/table", element: <TablePage />, label: "Table", icon: <TableChartOutlinedIcon /> },
  //     { path: "/backend", element: <BackendPage />, label: "Connect Backend", icon: <StorageOutlinedIcon /> },
  //   ],
  // },
  {
    section: "dont-show",
    items: [
      { path: "/profile", element: <ProfilePage /> },
      { path: "/kelas/detail/:id", element: <DetailKelasGuruPage /> },
      { path: "/kelas/detail/:id/module/:modulId", element: <DetailModuleGuruPage /> },
      // { path: "*", element: <NotFoundPage /> },
    ],
  },
];

// Function to get routes by role
export function getRoutes(role) {
  switch (role) {
    case "student":
      return [...studentRoutes];
    case "teacher":
      return [...teacherRoutes];
    default:
      return [...loginRoutes];
  }
}


