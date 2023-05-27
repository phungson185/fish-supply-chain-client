import { createTheme, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

export const appTheme = createTheme({
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: 'xl',
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          body1: 'div',
          body2: 'div',
          inherit: 'div',
        },
      },
      styleOverrides: {
        h1: { fontSize: 32, fontWeight: 700 },
        h2: { fontSize: 24, fontWeight: 700 },
        h3: { fontSize: 20, fontWeight: 700 },
        h4: { fontSize: 18, fontWeight: 700 },
        h5: { fontSize: 16, fontWeight: 700 },
        h6: { fontSize: 14, fontWeight: 700 },
        subtitle1: { fontSize: 16, fontWeight: 500, lineHeight: 1.5 },
        subtitle2: { fontSize: 14, fontWeight: 500, lineHeight: 1.43 },
        body1: { fontSize: 16 },
        body2: { fontSize: 14 },
        caption: { fontSize: 12 },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        color: 'primary',
        size: 'large',
        disableElevation: true,
      },
      styleOverrides: {
        sizeLarge: { minHeight: 48, minWidth: 48 },
        sizeMedium: { minHeight: 40, minWidth: 40 },
        sizeSmall: { minHeight: 32, minWidth: 32 },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
    },
    MuiPagination: {
      defaultProps: {
        variant: 'outlined',
        shape: 'rounded',
        size: 'large',
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
        color: 'primary',
        // InputLabelProps: { shrink: true },
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
        color: 'primary',
      },
    },
  },
  typography: {
    fontFamily: `Open Sans, Roboto`,
  },
  palette: {
    primary: {
      light: '#8bc34a',
      main: '#8bc34a',
      dark: '#9ccc65',
    },
    secondary: {
      light: '#9575cd',
      main: '#7e57c2',
      dark: '#673ab7',
    },
  },
});

const Theme = ({ children }: any) => {
  return (
    <ThemeProvider theme={appTheme}>
      <LocalizationProvider dateAdapter={AdapterLuxon}>{children}</LocalizationProvider>
    </ThemeProvider>
  );
};

export default Theme;
