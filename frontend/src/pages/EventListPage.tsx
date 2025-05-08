import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  GridLegacy as Grid,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import api, { IMG_BASE } from '../api/api';

interface Event {
  _id:        string;
  title:      string;
  description:string;
  date:       string;
  images?:    string[];
}

export default function EventListPage() {
  const [events,  setEvents]  = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Event[]>('/events')
      .then(res => setEvents(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h6">Loading events…</Typography>
      </Container>
    );
  }

  if (!events.length) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h6">No events found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Upcoming Events
      </Typography>

      <Grid container spacing={4}>
        {events.map(ev => (
          <Grid item key={ev._id} xs={12} sm={6}>
            <Card
              component={RouterLink}
              to={`/events/${ev._id}`}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': { boxShadow: 6 },
              }}
            >
              {ev.images?.[0] && (
                <CardMedia
                  component="img"
                  height="140"
                  image={`${IMG_BASE}${ev.images[0]}`}
                  alt={ev.title}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ wordBreak: 'break-word' }}>
                  {ev.title}
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  display="block"
                  gutterBottom
                >
                  {new Date(ev.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                  {ev.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
