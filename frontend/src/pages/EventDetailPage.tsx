// frontend/src/pages/EventDetailPage.tsx
import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { createBooking } = useBookings();

  useEffect(() => {
    api.get(`/events/${id}`).then(res => setEvent(res.data));
  }, [id]);

  if (!event) return <p>Loading…</p>;

  const isOwner = auth?.user?._id === event.organizer._id;

  const handleDelete = async () => {
    if (!window.confirm('Delete this event?')) return;
    await api.delete(`/events/${id}`);
    navigate('/');
  };

  const handleBook = async () => {
    try {
      await createBooking(event._id);
      navigate('/bookings');
    } catch (error: any) {
      // Display the message sent by your backend (e.g. “already booked”)
      const msg =
        error.response?.data?.message ||
        'Booking failed. Please try again.';
      alert(msg);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>{event.title}</h1>
      <p><em>{new Date(event.date).toLocaleString()}</em></p>
      <p>{event.description}</p>
      <p>Organized by: {event.organizer.name}</p>

      {isOwner ? (
        <>
          <Link to={`/events/${id}/edit`}>Edit</Link>{' '}
          <button onClick={handleDelete}>Delete</button>
        </>
      ) : (
        <button onClick={handleBook}>Book this Event</button>
      )}
    </div>
  );
}
