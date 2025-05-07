import React, { useEffect } from 'react';
import { useBookings } from '../context/BookingContext';
import { Link }          from 'react-router-dom';

const MyBookingsPage: React.FC = () => {
  const { bookings, fetchBookings, cancelBooking } = useBookings();

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul>
          {bookings.map(b => (
            <li key={b._id} style={{ marginBottom: 12 }}>
              <Link to={`/events/${b.event._id}`}>
                {b.event.title} on{' '}
                {new Date(b.event.date).toLocaleDateString()}
              </Link>
              <button onClick={() => cancelBooking(b._id)} style={{ marginLeft: 8 }}>
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBookingsPage;
