import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box
} from '@mui/material';
import api from '../api/api';

export default function CreateEventPage() {
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [date,        setDate]        = useState('');
  const [error,       setError]       = useState<string | null>(null);
  const [createdId,   setCreatedId]   = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // create new event and grab its ID
      const res = await api.post('/events', { title, description, date });
      const newId = res.data._id;
      setCreatedId(newId);
      // optionally navigate away instead:
      // navigate(`/events/${newId}/edit`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not create event');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        New Event
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
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <TextField
          label="Description"
          required
          fullWidth
          multiline
          minRows={3}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <TextField
          label="Date & Time"
          type="datetime-local"
          required
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        {error && (
          <Typography color="error" role="alert">
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" size="large">
          Create Event
        </Button>
      </Box>

      {/* ——— image upload UI, only functional once createdId is set ——— */}
      {createdId && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Upload Images</Typography>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={async e => {
              if (!e.target.files?.length) return;
              const formData = new FormData();
              Array.from(e.target.files).forEach(f =>
                formData.append('images', f)
              );
              try {
                await api.post(
                  `/events/${createdId}/images`,
                  formData,
                  { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                window.location.reload();
              } catch {
                alert('Upload failed');
              }
            }}
          />
        </Box>
      )}
    </Container>
  );
}
