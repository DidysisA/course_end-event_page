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
import api, { IMG_BASE } from '../api/api';

interface EventData {
  title:       string;
  description: string;
  date:        string;
  images?:     string[];
}

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form,    setForm   ] = useState<EventData>({
    title: '', description: '', date: '', images: []
  });
  const [loading, setLoading] = useState(true);
  const [error,   setError  ] = useState<string | null>(null);

  useEffect(() => {
    api.get<EventData>(`/events/${id}`)
      .then(res => {
        const dt = new Date(res.data.date);
        const local = dt.toISOString().slice(0,16);
        setForm({ ...res.data, date: local });
      })
      .catch(() => setError('Could not load event'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (field: keyof EventData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(f => ({ ...f, [field]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(null);
    try {
      await api.put(`/events/${id}`, {
        ...form, date: new Date(form.date).toISOString()
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
        <Typography variant="h4" gutterBottom>Edit Event</Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Title"
            required fullWidth
            value={form.title}
            onChange={handleChange('title')}
          />
          <TextField
            label="Description"
            required fullWidth multiline minRows={3}
            value={form.description}
            onChange={handleChange('description')}
          />
          <TextField
            label="Date & Time"
            type="datetime-local"
            required fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.date}
            onChange={handleChange('date')}
          />
          {error && <Typography color="error">{error}</Typography>}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained">Save Changes</Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>Cancel</Button>
          </Box>

          {/* ——— image upload UI ——— */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Upload Images</Typography>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={async e => {
                if (!e.target.files?.length) return;
                const fd = new FormData();
                Array.from(e.target.files).forEach(f => fd.append('images', f));
                try {
                  await api.post(`/events/${id}/images`, fd, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                  });
                  window.location.reload();
                } catch {
                  alert('Upload failed');
                }
              }}
            />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
