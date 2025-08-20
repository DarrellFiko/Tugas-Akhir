// Import Libs
import { AppBar, Toolbar, IconButton, Tooltip, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Import Icons
import MenuIcon from "@mui/icons-material/Menu";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";

// Import Others
import { PopupDelete } from "../../composables/sweetalert";

export default function NavigationAppbar({ isMobile, handleSideBar, onToggleSidebar, isDark, setIsDark }) {
  // Utils
  const navigate = useNavigate();

  // Methods
  const handleToggleTheme = () => setIsDark((prev) => !prev);
  const handleBurgerMenu = () => handleSideBar((prev) => !prev);

  const handleLogout = async () => {
    const confirm = await PopupDelete.fire({ title: "Logout" });
    
    if (confirm.isConfirmed) {
      localStorage.removeItem("auth");
      navigate("/");
    }
  };

  return (
    <AppBar 
      position="sticky" 
      sx={(theme) => ({
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderRadius: "0 0 12px 12px",
        boxShadow: 3,
      })}
    >
      <Toolbar>
        <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
          {isMobile && (
            <IconButton color="inherit" onClick={ handleBurgerMenu }>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6">Website</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title={ isDark ? "Light Mode" : "Dark Mode" }>
            <IconButton onClick={ handleToggleTheme } color="inherit">
              { isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon /> }
            </IconButton>
          </Tooltip>

          <Tooltip title="Logout">
            <IconButton color="error" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
