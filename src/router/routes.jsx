// Page import
import ChartPage from "../pages/ChartPage";
import HomePage from "../pages/HomePage";
import SweetAlertPage from "../pages/SweetAlertPage";
import TablePage from "../pages/TablePage";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/LoginPage";
import BackendPage from "../pages/BackendPage";

// Icon import
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import DoNotTouchOutlinedIcon from '@mui/icons-material/DoNotTouchOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';

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
    section: "Pages",
    items: [
      { path: "/dashboard", element: <HomePage />, label: "Dashboard", icon: <DashboardCustomizeOutlinedIcon /> },
      { path: "/backend", element: <BackendPage />, label: "Connect Backend", icon: <StorageOutlinedIcon /> },
    ],
  },
  {
    section: "Components",
    items: [
      { path: "/sweet-alert", element: <SweetAlertPage />, label: "Popup & Toast", icon: <NotificationsOutlinedIcon /> },
      { path: "/chart", element: <ChartPage />, label: "Charts", icon: <InsertChartOutlinedIcon /> },
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


