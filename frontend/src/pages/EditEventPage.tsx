// frontend/src/pages/EditEventPage.tsx
import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';

interface EventData {
  title:       string;
  description: string;
  date:        string;
}

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<EventData>({
    title: '',
    description: '',
    date: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // 1) Fetch existing event
  useEffect(() => {
    api
      .get<EventData>(`/events/${id}`)
      .then(res => {
        // convert ISO → local datetime-local value
        const dt = new Date(res.data.date);
        const local = dt.toISOString().slice(0,16);
        setForm({ ...res.data, date: local });
      })
      .catch(err => {
        console.error(err);
        setError('Could not load event');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (field: keyof EventData) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(f => ({ ...f, [field]: e.target.value }));
    };

  // 2) Submit update
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.put(`/events/${id}`, {
        ...form,
        date: new Date(form.date).toISOString(),
      });
      navigate(`/events/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Event
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Title"
            required
            fullWidth
            value={form.title}
            onChange={handleChange('title')}
          />

          <TextField
            label="Description"
            required
            fullWidth
            multiline
            minRows={3}
            value={form.description}
            onChange={handleChange('description')}
          />

          <TextField
            label="Date & Time"
            type="datetime-local"
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.date}
            onChange={handleChange('date')}
          />

          {error && (
            <Typography color="error" role="alert">
              {error}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" size="large">
              Save Changes
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
