// themeVariables.js
export const applyThemeVariables = (muiTheme) => {
    const root = document.documentElement;
    const palette = muiTheme.palette;
  
    const setVar = (name, hex) => {
      if (!hex) return;
      root.style.setProperty(name, hexToRgb(hex));
    };
  
    setVar('--v-theme-surface', palette.background.paper);
    setVar('--v-theme-surface-shade', palette.background.default);
    setVar('--v-theme-on-surface', palette.text.secondary);
    setVar('--v-theme-primary', palette.primary.main);
    setVar('--v-theme-success', palette.success.main);
    setVar('--v-theme-info', palette.info.main);
    setVar('--v-theme-warning', palette.warning.main);
    setVar('--v-theme-error', palette.error.main);
  };
  
  // Converts "#rrggbb" → "r, g, b"
  function hexToRgb(hex) {
    if (!hex.startsWith('#')) return hex; // already rgb
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  }
  