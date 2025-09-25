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

// Import Others
import { lightTheme, darkTheme } from "./plugins/theme";
import { applyThemeVariables } from "./plugins/themeVariables";
import { getRoutes } from "./router/routes.jsx";
import useIsMobile from "./plugins/useIsMobile.js";
import './App.css';

// Import Components
import NavigationAppbar from "./components/navigations/NavigationAppBar";
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
  onLogin,
  onLogout,
}) {
  
  const nama = localStorage.getItem("authUser");
  const profilePicture = localStorage.getItem("profilePicture");

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
      <NavigationSidebar
        isMobile={isMobile}
        isSidebar={isSidebar}
        handleSidebar={setIsSidebar}
        routes={routes}
        nama={nama}
        profilePicture={profilePicture}
      />

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
                <Route
                  key={item.path}
                  path={item.path}
                  element={item.element}
                />
              ))
            )}
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

export default function App() {
  const [isSidebar, setIsSidebar] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("isDarkTheme");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  const [role, setRole] = useState(localStorage.getItem("role"));
  const routes = getRoutes(role);

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
      localStorage.setItem("role", response.role);

      let userRole = response.role; 
      setRole(userRole);
    } catch (err) {
      console.error("Login failed:", err);
      // Optionally show a popup error
    }
  };

  // handler logout
  const handleLogout = async () => {
    await userService.logout()
       
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("role");
    localStorage.removeItem("profilePicture");
    setRole(null);
  };

  // listen role changes
  useEffect(() => {
    const checkRole = () => setRole(localStorage.getItem("role"));
    window.addEventListener("storage", checkRole);
    return () => window.removeEventListener("storage", checkRole);
  }, []);

  // theme persistence
  useEffect(() => {
    localStorage.setItem("isDarkTheme", JSON.stringify(isDark));
    applyThemeVariables(isDark ? darkTheme : lightTheme);
  }, [isDark]);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <AppContent
          key={role}
          isDark={isDark}
          setIsDark={setIsDark}
          isSidebar={isSidebar}
          setIsSidebar={setIsSidebar}
          routes={routes}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      </Router>
    </ThemeProvider>
  );
}
