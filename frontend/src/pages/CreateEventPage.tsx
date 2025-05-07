import React, { useState, useContext } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth?.token) {
      return navigate('/login');
    }
    try {
      await api.post('/events', { title, description, date });
      navigate('/');
    } catch (err) {
      console.error('Error creating event', err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Create New Event</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label><br/>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label><br/>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date & Time</label><br/>
          <input
            type="datetime-local"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: 12 }}>
          Create Event
        </button>
      </form>
    </div>
  );
}
