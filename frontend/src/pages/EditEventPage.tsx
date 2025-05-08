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
  CircularProgress,
  IconButton,
  CardMedia,
  GridLegacy as Grid,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Close as CloseIcon } from '@mui/icons-material';
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
    title: '', description: '', date: ''
  });
  const [images,  setImages ] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError  ] = useState<string | null>(null);

  // 1) Load event and its images
  useEffect(() => {
    api.get<EventData>(`/events/${id}`)
      .then(res => {
        const data = res.data;
        // convert date for input
        const dt = new Date(data.date);
        const local = dt.toISOString().slice(0,16);
        setForm({ title: data.title, description: data.description, date: local });
        setImages(data.images || []);
      })
      .catch(() => setError('Could not load event'))
      .finally(() => setLoading(false));
  }, [id]);

  // 2) Handle text changes
  const handleChange = (field: keyof EventData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(f => ({ ...f, [field]: e.target.value }));
    };

  // 3) Save text changes
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(null);
    try {
      await api.put(`/events/${id}`, {
        title:       form.title,
        description: form.description,
        date:        new Date(form.date).toISOString(),
        // images are managed separately
      });
      navigate(`/events/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  // 4) Delete an existing image
  const handleDeleteImage = async (url: string) => {
    const filename = url.split('/uploads/')[1];
    try {
      const res = await api.delete<{ images: string[] }>(`/events/${id}/images/${filename}`);
      setImages(res.data.images);
    } catch {
      alert('Failed to delete image');
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
        <Typography variant="h4" gutterBottom>
          Edit Event
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Title" required fullWidth
            value={form.title}
            onChange={handleChange('title')}
          />
          <TextField
            label="Description" required fullWidth multiline minRows={3}
            value={form.description}
            onChange={handleChange('description')}
          />
          <TextField
            label="Date & Time" type="datetime-local" required fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.date}
            onChange={handleChange('date')}
          />
          {error && <Typography color="error">{error}</Typography>}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained">
              Save Changes
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </Box>
        </Box>

        {/* 5) Existing images preview + delete */}
        {images.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Attached Images
            </Typography>
            <Grid container spacing={1}>
              {images.map((url, idx) => (
                <Grid item key={idx}>
                  <Box sx={{ position: 'relative', width: 80, height: 80 }}>
                    <CardMedia
                      component="img"
                      src={`${IMG_BASE}${url}`}
                      alt={`img ${idx}`}
                      sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteImage(url)}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bgcolor: 'rgba(0,0,0,0.5)'
                      }}
                    >
                      <CloseIcon fontSize="small" sx={{ color: 'white' }} />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* 6) File upload UI */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Upload New Images</Typography>
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
                  headers: { 'Content-Type': 'multipart/form-data' }
                });
                // refresh images
                const updated = await api.get<EventData>(`/events/${id}`);
                setImages(updated.data.images || []);
              } catch {
                alert('Upload failed');
              }
            }}
          />
        </Box>
      </Paper>
    </Container>
  );
}
