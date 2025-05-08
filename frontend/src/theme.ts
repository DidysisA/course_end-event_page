import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#1976d2' },
  },
  components: {
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          borderRadius: 4,
        },
        input: {
          color: '#000',
        },
      },
    },
  },
});

export default theme;
