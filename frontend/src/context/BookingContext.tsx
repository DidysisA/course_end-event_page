import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../api/api';

export interface Booking {
  _id:      string;
  event:    { _id: string; title: string; date: string };
  seats:    number;
  createdAt:string;
}

type BookingContextType = {
  bookings: Booking[];
  fetchBookings: () => Promise<void>;
  createBooking: (eventId: string, seats?: number) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchBookings = async () => {
    const res = await api.get<Booking[]>('/bookings');
    setBookings(res.data);
  };

  const createBooking = async (eventId: string, seats = 1) => {
    const res = await api.post<Booking>('/bookings', { event: eventId, seats });
    setBookings(prev => [...prev, res.data]);
  };

  const cancelBooking = async (id: string) => {
    await api.delete(`/bookings/${id}`);
    setBookings(prev => prev.filter(b => b._id !== id));
  };

  return (
    <BookingContext.Provider value={{ bookings, fetchBookings, createBooking, cancelBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBookings must be inside BookingProvider');
  return ctx;
};
