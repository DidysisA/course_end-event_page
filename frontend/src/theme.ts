// frontend/src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',           // you already have a dark background
    primary: { main: '#1976d2' },
  },
  components: {
    // Override styles for all filled inputs:
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',    // white bg
          borderRadius: 4,            // rounded corners
        },
        input: {
          color: '#000',              // dark text
        },
      },
    },
  },
});

export default theme;
