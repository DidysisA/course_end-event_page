import React, { type JSX } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link as RouterLink,
  useNavigate,
} from 'react-router-dom';
import { useContext } from 'react';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';

import { AuthContext } from './context/AuthContext';
import EventListPage from './pages/EventListPage';
import CreateEventPage from './pages/CreateEventPage';
import EventDetailPage from './pages/EventDetailPage';
import EditEventPage from './pages/EditEventPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
// import MyBookingsPage from './pages/MyBookingsPage'; // later

function App() {
  const auth = useContext(AuthContext);
  const nav = useNavigate();

  const ProtectedRoute = ({ children }: { children: JSX.Element }) =>
    auth?.token ? children : <Navigate to="/login" replace />;

  const handleLogout = () => {
    auth?.logout();
    nav('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Eventify
          </Typography>

          {auth?.token ? (
            <>
              <Typography sx={{ mr: 2 }}>
                Hi, {auth.user?.name}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/events/new"
                sx={{ ml: 1 }}
              >
                New Event
              </Button>
              {/* <Button
                color="inherit"
                component={RouterLink}
                to="/bookings"
                sx={{ ml: 1 }}
              >
                My Bookings
              </Button> */}
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/register"
                sx={{ ml: 1 }}
              >
                Register
              </Button>
            </>
          )}
          <Button
            color="inherit"
            component={RouterLink}
            to="/bookings"
            sx={{ ml: 1 }}
          >
            My Bookings
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ mt: 4, px: 2 }}>
        <Routes>
          <Route path="/" element={<EventListPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/events/new"
            element={
              <ProtectedRoute>
                <CreateEventPage />
              </ProtectedRoute>
            }
          />

          {/* -- Step 4.3: Detail & Edit routes -- */}
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route
            path="/events/:id/edit"
            element={
              <ProtectedRoute>
                <EditEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />  
        </Routes>
      </Box>
    </>
  );
}

export default function WrappedApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
