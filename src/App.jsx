// Import Libs
import { useEffect, useState } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Box,
} from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  matchPath,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "./stores/userSlice.js";
import { setUjianMode, resetUjianMode } from "./stores/ujianSlice.js"; 

// Import Others
import { lightTheme, darkTheme } from "./plugins/theme";
import { applyThemeVariables } from "./plugins/themeVariables";
import { getRoutes } from "./router/routes.jsx";
import useIsMobile from "./plugins/useIsMobile.js";
import "./App.css";

// Import Components
import NavigationAppbar from "./components/navigations/NavigationAppbar";
import NavigationSidebar from "./components/navigations/NavigationSidebar";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import LoginPage from "./pages/General/LoginPage.jsx";

// Import Services
import * as userService from "./services/authService.js";

function AppContent({
  isDark,
  setIsDark,
  isSidebar,
  setIsSidebar,
  routes,
  routesLoading,
  onLogin,
  onLogout,
  isUjian,
}) {
  const { nama, profilePicture } = useSelector((state) => state.user); // Ambil dari Redux
  const isMobile = useIsMobile();
  const location = useLocation();

  const token = localStorage.getItem("authToken");
  const isLoginPage = location.pathname === "/";

  // --- Proteksi route ---
  if (!token && !isLoginPage) {
    return <Navigate to="/" replace />;
  }
  if (token && isLoginPage) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!routes || routes.length === 0) {
    return null;
  }

  if (routesLoading) {
    return null; 
  }
  // --- Cek NotFound ---
  const isNotFound =
    !routes.some((section) =>
      section.items.some((item) =>
        matchPath({ path: item.path, end: true }, location.pathname)
      )
    ) && !["/", "/notfound"].includes(location.pathname);

  // --- Fullscreen NotFound ---
  if (isNotFound) {
    return <NotFoundPage />;
  }

  // --- Halaman login (full screen) ---
  if (isLoginPage) {
    return (
      <Box width="100%" height="100vh">
        <Routes>
          <Route path="/" element={<LoginPage onLogin={onLogin} />} />
        </Routes>
      </Box>
    );
  }

  // --- Layout normal (sudah login) ---
  return (
    <Box display="flex">
      {/* Sidebar akan hilang saat sedang ujian */}
      {(!isUjian || isUjian === false) && (
        <NavigationSidebar
          isMobile={isMobile}
          isSidebar={isSidebar}
          handleSidebar={setIsSidebar}
          routes={routes}
          nama={nama}
          profilePicture={profilePicture}
        />
      )}

      <Box
        component="main"
        flexGrow={1}
        sx={{ mx: isMobile ? 0 : 3, minWidth: 0 }}
      >
        <NavigationAppbar
          isMobile={isMobile}
          handleSideBar={setIsSidebar}
          isDark={isDark}
          setIsDark={setIsDark}
          onLogout={onLogout}
        />

        <Box
          width="100%"
          sx={{
            py: 2,
            px: isMobile ? 3 : 0,
            display: "block",
            flex: "none",
            minWidth: 0,
          }}
        >
          <Routes>
            {routes.flatMap((section) =>
              section.items.map((item) => (
                <Route key={item.path} path={item.path} element={item.element} />
              ))
            )}
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

export default function App() {
  const dispatch = useDispatch();
  const [isSidebar, setIsSidebar] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("isDarkTheme");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  const [routes, setRoutes] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(true);
  const isUjian = useSelector((state) => state.ujian.isUjian);

  // handler login
  const handleLogin = async (data) => {
    try {
      const response = await userService.login({
        username: data.username,
        password: data.password,
      });

      const token = response.token;

      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", response.nama);
      localStorage.setItem("profilePicture", response.profile_picture);
      loadRoutes()
      // Simpan user ke Redux
      dispatch(
        setUser({
          nama: response.nama,
          profilePicture: response.profile_picture,
        })
      );
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // handler logout
  const handleLogout = async () => {
    await userService.logout();

    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("profilePicture");

    dispatch(clearUser());
    dispatch(resetUjianMode());

    // Reset Redux state
    dispatch(clearUser());
  };

  const loadRoutes = async () => {
    setRoutesLoading(true);
    try {
      const tempRoutes = await getRoutes();
      setRoutes(Array.isArray(tempRoutes) ? tempRoutes : []);
    } finally {
      setRoutesLoading(false);
    }
  };

  useEffect(() => { loadRoutes() }, []);

  // theme persistence
  useEffect(() => {
    localStorage.setItem("isDarkTheme", JSON.stringify(isDark));
    applyThemeVariables(isDark ? darkTheme : lightTheme);
  }, [isDark]);

  // Saat reload, ambil user dari localStorage ke Redux
  useEffect(() => {
    const nama = localStorage.getItem("authUser");
    const profilePicture = localStorage.getItem("profilePicture");

    if (nama) {
      dispatch(
        setUser({
          nama,
          profilePicture,
        })
      );
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <AppContent
          isDark={isDark}
          setIsDark={setIsDark}
          isSidebar={isSidebar}
          setIsSidebar={setIsSidebar}
          routes={routes}
          routesLoading={routesLoading}
          onLogin={handleLogin}
          onLogout={handleLogout}
          isUjian={isUjian}
        />
      </Router>
    </ThemeProvider>
  );
}
