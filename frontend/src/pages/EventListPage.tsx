// frontend/src/pages/EventListPage.tsx
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { GridLegacy as Grid, Container, Typography, Card, CardContent, CardMedia} from '@mui/material';
import api from '../api/api';

interface Event {
  _id:       string;
  title:     string;
  description:string;
  date:      string;
  imageUrl?: string;   // optional preview image
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
          // 2 columns on sm+ (600px+), 1 column on xs
          <Grid item key={ev._id} xs={12} sm={6}>
            <Card
              component={RouterLink}
              to={`/events/${ev._id}`}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                textDecoration: 'none',      // remove link underline
                color: 'inherit',            // preserve text color
                '&:hover': {
                  boxShadow: 6,              // hover effect
                },
              }}
            >
              {ev.imageUrl && (
                <CardMedia
                  component="img"
                  height="140"
                  image={ev.imageUrl}
                  alt={ev.title}
                />
              )}

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ wordBreak: 'break-word' }}
                >
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
                <Typography
                  variant="body2"
                  sx={{ wordBreak: 'break-word' }}
                >
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
