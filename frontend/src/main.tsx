import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import './index.css';
import App from './App';
import theme from './theme';
import { AuthProvider }    from './context/AuthContext';
import { EventProvider }   from './context/EventContext';
import { FilterProvider }  from './context/FilterContext';
import { BookingProvider } from './context/BookingContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />       
      <AuthProvider>
        <EventProvider>
          <FilterProvider>
            <BookingProvider>
              <App />
            </BookingProvider>
          </FilterProvider>
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
