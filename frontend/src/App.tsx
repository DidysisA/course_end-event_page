import { type JSX } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link as RouterLink,
} from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { useContext } from 'react';

import { AuthContext }   from './context/AuthContext';
import EventListPage     from './pages/EventListPage';
import EventDetailPage   from './pages/EventDetailPage';
import CreateEventPage   from './pages/CreateEventPage';
import EditEventPage     from './pages/EditEventPage';
import MyBookingsPage    from './pages/MyBookingsPage';
import RegisterPage      from './pages/RegisterPage';
import LoginPage         from './pages/LoginPage';

function App() {
  const auth = useContext(AuthContext);

  const ProtectedRoute = ({ children }: { children: JSX.Element }) =>
    auth?.token ? children : <Navigate to="/login" replace />;

  const handleLogout = () => {
    auth?.logout();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ color: 'inherit', textDecoration: 'none' }}
          >
            Eventify
          </Typography>

          <Box>
            {auth?.token ? (
              <>
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ mr: 2 }}
                >
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
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/bookings"
                  sx={{ ml: 1 }}
                >
                  My Bookings
                </Button>
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
          </Box>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<EventListPage />} />
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
            path="/events/new"
            element={
              <ProtectedRoute>
                <CreateEventPage />
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

          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login"    element={<LoginPage />} />
        </Routes>
      </Container>
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
