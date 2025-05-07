import React from 'react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import { FilterProvider } from './context/FilterContext';
import { BookingProvider } from './context/BookingContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <EventProvider>
        <FilterProvider>
          <BookingProvider>
            <App />
          </BookingProvider>
        </FilterProvider>
      </EventProvider>
    </AuthProvider>
  </StrictMode>
);
