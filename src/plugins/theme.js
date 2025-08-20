// themes.js
import { createTheme } from '@mui/material/styles';

// Light theme
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#127BC9' },
    secondary: { main: '#6E6E6E' },
    success: { main: '#6BBA1D' },
    info: { main: '#23AEFF' },
    warning: { main: '#F5B400' },
    error: { main: '#FF3F2D' },
    background: { paper: '#fcffff', default: '#edfdff' },
    text: { primary: '#000000', secondary: '#474747' },
  },
  typography: {
    fontFamily: "Verdana, Geneva, sans-serif",
  },
});

// Dark theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4C90D0' },
    secondary: { main: '#BDBDBD' },
    success: { main: '#4FB524' },
    info: { main: '#008FFC' },
    warning: { main: '#FFB616' },
    error: { main: '#FF5238' },
    background: { paper: '#2F3F4F', default: '#263F57' },
    text: { primary: '#FFFFFF', secondary: '#F5F5F5' },
  },
  typography: {
    fontFamily: "Verdana, Geneva, sans-serif",
  },
});
