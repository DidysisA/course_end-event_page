import { useEffect, useState } from 'react';
import api from '../api/api';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
}

export default function EventListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Event[]>('/events')
      .then(res => setEvents(res.data))
      .catch(err => {
        console.error('Failed to fetch events', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading events…</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Upcoming Events</h1>
      {events.length === 0 ? (
        <p>No events yet.</p>
      ) : (
        <ul>
          {events.map(ev => (
            <li key={ev._id} style={{ marginBottom: 12 }}>
              <strong>{ev.title}</strong> —{' '}
              {new Date(ev.date).toLocaleDateString()}
              <p>{ev.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
