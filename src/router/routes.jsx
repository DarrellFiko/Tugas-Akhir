// Page import
import HomePage from "../pages/General/HomePage";
import TablePage from "../pages/TablePage";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/General/LoginPage";
import JadwalPage from "../pages/General/JadwalPage";
import ProfilePage from "../pages/General/ProfilePage";
import NilaiSiswaPage from "../pages/Siswa/NilaiSiswaPage";

// Icon import
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import DoNotTouchOutlinedIcon from '@mui/icons-material/DoNotTouchOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';

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
      { path: "/dashboard", element: <HomePage />, label: "Dashboard", icon: <DashboardCustomizeOutlinedIcon /> },
    ],
  },
  {
    section: "Akademik",
    items: [
      { path: "/jadwal", element: <JadwalPage />, label: "Jadwal Pelajaran", icon: <CalendarMonthOutlinedIcon /> },
      { path: "/nilai", element: <NilaiSiswaPage />, label: "Nilai Akademik", icon: <SchoolOutlinedIcon /> },
      // { path: "/table", element: <TablePage />, label: "table", icon: <CalendarMonthOutlinedIcon /> },
    ],
  },
  {
    section: "dont-show",
    items: [
      { path: "/profile", element: <ProfilePage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];

const teacherRoutes = [
  {
    section: "Pages",
    items: [
      { path: "/dashboard", element: <HomePage />, label: "Dashboard", icon: <DashboardCustomizeOutlinedIcon /> },
      { path: "/not-found", element: <NotFoundPage />, label: "Not Found", icon: <DoNotTouchOutlinedIcon /> },
    ],
  },
  {
    section: "Components",
    items: [
      { path: "/table", element: <TablePage />, label: "Table", icon: <TableChartOutlinedIcon /> },
    ],
  },
  {
    section: "notfound",
    items: [
      { path: "*", element: <NotFoundPage /> },
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


