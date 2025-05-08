// frontend/src/pages/CreateEventPage.tsx
import React, { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { addEvent } = useEvents();

  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [date,        setDate]        = useState('');
  const [error,       setError]       = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await addEvent({ title, description, date });
      navigate('/');
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
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
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
          // strip seconds for convenience
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
    </Container>
  );
}
