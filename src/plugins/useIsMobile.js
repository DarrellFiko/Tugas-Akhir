import { useTheme, useMediaQuery } from "@mui/material";

/**
 * Custom hook to detect if the screen is mobile size
 * @returns {boolean} true if screen is small (mobile), false otherwise
 */
export default function useIsMobile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return isMobile;
}
