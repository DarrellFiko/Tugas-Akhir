import { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Avatar, Box, Paper, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;
const mobileDrawerWidth = 220;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(1),
  ...theme.mixins.toolbar,
  transition: "justify-content 0.3s ease",
}));

const PermanentDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function NavigationSidebar({
  isMobile = false,
  isSidebar = false,
  handleSidebar,
  routes = [],
  name = ""
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [pinSidebar, setPinSidebar] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("");

  // Load pin state from localStorage on mount
  useEffect(() => {
    const savedPin = localStorage.getItem("pinSidebar");
    if (savedPin === "true") {
      setPinSidebar(true);
      setOpen(true); // Keep open if pinned
    }
  }, []);

  // Detect active route for sidebar highlight
  useEffect(() => {
    routes.forEach((section, sectionIndex) => {
      section.items.forEach((item, index) => {
        if (item.path === location.pathname) {
          setSelectedIndex(`${sectionIndex}-${index}`);
        }
      });
    });
  }, [location.pathname, routes]);

  const handlePinSidebar = () => {
    const newPinState = !pinSidebar;
    setPinSidebar(newPinState);
    localStorage.setItem("pinSidebar", newPinState); // Save to localStorage
    if (newPinState) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleHoverSidebar = (value) => {
    if (!pinSidebar) setOpen(value);
  };

  const handleListItemClick = (index, path) => {
    setSelectedIndex(index);
    navigate(path);
  };

  const activeGradient = 'linear-gradient(90deg, rgba(6,130,217,1) 0%, rgba(33,159,247,1) 74%, rgba(114,193,246,1) 100%)';
  const DrawerComponent = isMobile ? SwipeableDrawer : PermanentDrawer;

  return (
    <DrawerComponent
      anchor="left"
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? isSidebar : open}
      onClose={isMobile ? () => handleSidebar(false) : undefined}
      onOpen={isMobile ? () => handleSidebar(true) : undefined}
      onMouseEnter={!isMobile ? () => handleHoverSidebar(true) : undefined}
      onMouseLeave={!isMobile ? () => handleHoverSidebar(false) : undefined}
      sx={{
        '& .MuiDrawer-paper': {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: 0,
          boxShadow: 3,
          width: isMobile ? mobileDrawerWidth : undefined,
          overflow: (!open && !isMobile) && "hidden"
        }
      }}
    >
      {/* Header */}
      <Paper sx={{ position: 'sticky', top: 0, zIndex: 1, bgcolor: theme.palette.background.paper, borderRadius: 0 }}>
        <DrawerHeader sx={{ justifyContent: isMobile ? "center" : "start", pl: isMobile ? 1.5 : 2, borderBottom: theme => `1px solid ${theme.palette.divider}` }}>
          <Avatar src="/broken-image.jpg" sx={{ width: 35, height: 35, bgcolor: "primary.main" }} />
          {(!isMobile && open) && (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pl: 2, pr: 1, width: "87%" }}>
              <Box sx={{ width: "70%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {name}
              </Box>
              <IconButton size="small" onClick={handlePinSidebar} sx={{ color: theme.palette.text.primary }}>
                <PushPinOutlinedIcon
                  color="primary"
                  fontSize="small"
                  sx={{
                    transform: pinSidebar ? 'rotate(0deg)' : 'rotate(45deg)',
                    transition: 'transform 0.2s ease-in-out'
                  }}
                />
              </IconButton>
            </Box>
          )}
          {isMobile && (
            <Box sx={{ pl: 2, pr: 1, width: "78%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {name}
            </Box>
          )}
        </DrawerHeader>
      </Paper>

      {/* Menu */}
      {routes
      .filter((section) => section.section !== "notfound")
      .map((section, sectionIndex) => (
        <Box key={section.section}>
          {(sectionIndex < routes.length && section?.section) &&
            <Divider sx={{ my: open ? 0.8 : 2, '&::before, &::after': { borderColor: 'grey.500' } }}>
              {((!isMobile && open) || isMobile) && (
                <Typography variant="body2" color="text.secondary">
                  {section?.section}
                </Typography>
              )}
            </Divider>
          }
          <List sx={{ py: 0 }}>
            {section.items.map((item, index) => {
              const globalIndex = `${sectionIndex}-${index}`;
              return (
                <ListItem key={item.label} disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    selected={selectedIndex === globalIndex}
                    onClick={() => {
                      handleListItemClick(globalIndex, item.path);
                      if (isMobile) handleSidebar(false);
                    }}
                    sx={{
                      minHeight: 48,
                      justifyContent: (!isMobile && !open) ? 'center' : 'initial',
                      px: 2.5,
                      ...(selectedIndex === globalIndex && {
                        background: activeGradient,
                        color: 'white !important',
                        '& .MuiListItemIcon-root': { color: 'white !important' },
                      }),
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: (!isMobile && open) ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{
                        opacity: (!isMobile && !open) ? 0 : 1,
                        px: isMobile ? 3 : 0,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      ))}

    </DrawerComponent>
  );
}
