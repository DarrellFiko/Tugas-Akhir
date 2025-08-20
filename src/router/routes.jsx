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

const routes = [
  {
    section: "Pages",
    items: [
      { path: "/", element: <HomePage />, label: "Dashboard", icon: <DashboardCustomizeOutlinedIcon /> },
      { path: "/login", element: <LoginPage />, label: "Login", icon: <ExitToAppOutlinedIcon /> },
      { path: "/backend", element: <BackendPage />, label: "Connect Backend", icon: <StorageOutlinedIcon /> },
      { path: "/not-found", element: <NotFoundPage />, label: "Not Found", icon: <DoNotTouchOutlinedIcon /> },
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
      { path: "*", element: <NotFoundPage />, },
    ],
  },
];

export default routes;
