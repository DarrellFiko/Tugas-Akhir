// src/App.jsx

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
} from "react-router-dom";

// Import Others
import { lightTheme, darkTheme } from "./plugins/theme";
import { applyThemeVariables } from "./plugins/themeVariables";
import { getRoutes } from "./router/routes.jsx";
import useIsMobile from "./plugins/useIsMobile.js";

// Import Components
import NavigationAppbar from "./components/navigations/NavigationAppBar";
import NavigationSidebar from "./components/navigations/NavigationSidebar";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

function AppContent({
  isDark,
  setIsDark,
  isSidebar,
  setIsSidebar,
  routes,
  onLogin,
  onLogout 
}) {
  const isMobile = useIsMobile();
  const location = useLocation();

  const token = localStorage.getItem("authToken");
  const isLoginPage = location.pathname === "/";

  // Proteksi route
  if (!token && !isLoginPage) {
    return <Navigate to="/" replace />;
  }
  if (token && isLoginPage) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!routes || routes.length === 0) {
    return null;
  }

  // cek NotFound tapi exclude login & notfound
  const isNotFound =
    !routes.some((section) =>
      section.items.some((item) => item.path === location.pathname)
    ) && !["/", "/notfound"].includes(location.pathname);

  if (isNotFound) return <NotFoundPage />;

  // Halaman login
  if (isLoginPage) {
    return (
      <Box width="100%" height="100vh">
        <Routes>
          <Route path="/" element={<LoginPage onLogin={onLogin} />} />
        </Routes>
      </Box>
    );
  }

  // Layout normal (sudah login)
  return (
    <Box display={isMobile ? "" : "flex"}>
      <NavigationSidebar
        isMobile={isMobile}
        isSidebar={isSidebar}
        handleSidebar={setIsSidebar}
        routes={routes}
        name="Darrell Fiko"
      />

      <Box component="main" flexGrow={1} sx={{ mx: isMobile ? 0 : 3 }}>
        <NavigationAppbar
          isMobile={isMobile}
          handleSideBar={setIsSidebar}
          isDark={isDark}
          setIsDark={setIsDark}
          onLogout={onLogout}
        />

        <Box width="100%" sx={{ py: 2, px: isMobile ? 3 : 0 }}>
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
            <Route path="*" element={<NotFoundPage />} />
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
  const handleLogin = (data) => {
    localStorage.setItem("authToken", "dummy-token");
    localStorage.setItem("authUser", data.username);
    localStorage.setItem("role", "student"); 
    setRole("student");
  };

  // handler logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("role");
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
