import React, { useState, useContext } from 'react';
import type { FormEvent } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Link as MuiLink,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!auth) throw new Error('No auth context');
      await auth.login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome Back
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          label="Email"
          type="email"
          required
          fullWidth
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          required
          fullWidth
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && (
          <Typography color="error" role="alert">
            {error}
          </Typography>
        )}

        <Button type="submit" variant="contained" size="large">
          Log In
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Don’t have an account?{' '}
        <MuiLink component={RouterLink} to="/register">
          Sign up
        </MuiLink>
      </Typography>
    </Container>
  );
}
