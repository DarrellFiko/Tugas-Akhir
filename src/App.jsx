// Import libs
import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Box,
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Import Others
import { lightTheme, darkTheme } from "./plugins/theme";
import { applyThemeVariables } from "./plugins/themeVariables";
import routes from "./router/routes.jsx";
import useIsMobile from "./plugins/useIsMobile.js";

// Import Components
import NavigationAppbar from "./components/navigations/NavigationAppBar";
import NavigationSidebar from "./components/navigations/NavigationSidebar";
import NotFoundPage from "../src/pages/NotFoundPage.jsx";

function AppContent({ isDark, setIsDark, isSidebar, setIsSidebar }) {
  const isMobile = useIsMobile();
  const location = useLocation();

  // Check if this is a not found route
  const isNotFound = !routes.some((section) => section.items.some((item) => item.path === location.pathname));
  if (isNotFound) {return (<NotFoundPage />);}

  return (
    <Box display="flex">
      {/* Navigation Sidebar */}
      <NavigationSidebar
        isMobile={isMobile}
        isSidebar={isSidebar}
        handleSidebar={setIsSidebar}
        routes={routes}
        name="Darrell Fiko"
      />

      {/* Main Content */}
      <Box component="main" flexGrow={1} sx={{ mx: isMobile ? 0 : 3 }}>
        {/* App Bar */}
        <NavigationAppbar
          isMobile={isMobile}
          handleSideBar={setIsSidebar}
          isDark={isDark}
          setIsDark={setIsDark}
        />

        {/* Page Content */}
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
            {/* Catch-all route for NotFound */}
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

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("isDarkTheme", JSON.stringify(isDark));
    applyThemeVariables(isDark ? darkTheme : lightTheme);
  }, [isDark]);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <AppContent
          isDark={isDark}
          setIsDark={setIsDark}
          isSidebar={isSidebar}
          setIsSidebar={setIsSidebar}
        />
      </Router>
    </ThemeProvider>
  );
}
