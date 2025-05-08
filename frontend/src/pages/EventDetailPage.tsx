import { useEffect, useState, useContext } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  GridLegacy as Grid,
  CardMedia,
} from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import api, { IMG_BASE } from '../api/api';
import { AuthContext }   from '../context/AuthContext';
import { useBookings }   from '../context/BookingContext';

interface Event {
  _id:        string;
  title:      string;
  description:string;
  date:       string;
  organizer:  { name: string; _id: string };
  images?:    string[];
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { createBooking } = useBookings();

  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    api.get<Event>(`/events/${id}`).then(res => setEvent(res.data));
  }, [id]);

  if (!event) {
    return (
      <Container sx={{ mt: 8 }}>
        <Typography>Loading…</Typography>
      </Container>
    );
  }

  const isOwner = auth?.user?._id === event.organizer._id;

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {event.title}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {new Date(event.date).toLocaleString()}
        </Typography>
        <Typography variant="body1" paragraph>
          {event.description}
        </Typography>

        {event.images?.[0] && (
          <Box mb={3}>
            <CardMedia
              component="img"
              src={`${IMG_BASE}${event.images[0]}`}
              alt="Preview"
              sx={{ borderRadius: 1, maxHeight: 300, objectFit: 'cover' }}
            />
          </Box>
        )}

        {event.images && event.images.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Photo Gallery
            </Typography>
            <Grid container spacing={2} mb={3}>
              {event.images.map((src, idx) => (
                <Grid item xs={6} sm={4} key={idx}>
                  <CardMedia
                    component="img"
                    src={`${IMG_BASE}${src}`}
                    alt={`Gallery ${idx + 1}`}
                    sx={{ borderRadius: 1, height: 120, objectFit: 'cover' }}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        <Box sx={{ display: 'flex', gap: 2 }}>
          {isOwner ? (
            <>
              <Button
                variant="contained"
                component={RouterLink}
                to={`/events/${id}/edit`}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={async () => {
                  if (!window.confirm('Delete this event?')) return;
                  await api.delete(`/events/${id}`);
                  navigate('/');
                }}
              >
                Delete
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={async () => {
                await createBooking(event._id);
                navigate('/bookings');
              }}
            >
              Book this Event
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
