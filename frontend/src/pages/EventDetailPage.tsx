import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const auth = useContext(AuthContext);
  const nav  = useNavigate();

  useEffect(() => {
    api.get(`/events/${id}`).then(res => setEvent(res.data));
  }, [id]);

  if (!event) return <p>Loading…</p>;

  const isOwner = auth?.user?._id === event.organizer._id;

  const handleDelete = async () => {
    if (!confirm('Delete this event?')) return;
    await api.delete(`/events/${id}`);
    nav('/');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>{event.title}</h1>
      <p><em>{new Date(event.date).toLocaleString()}</em></p>
      <p>{event.description}</p>
      <p>Organized by: {event.organizer.name}</p>

      {isOwner && (
        <>
          <Link to={`/events/${id}/edit`}>Edit</Link>{' '}
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </div>
  );
}
