import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    api.get(`/events/${id}`).then(res => {
      const ev = res.data;
      setTitle(ev.title);
      setDescription(ev.description);
      setDate(ev.date.slice(0,16)); // for datetime-local
    });
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await api.put(`/events/${id}`, { title, description, date });
    nav(`/events/${id}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Edit Event</h1>
      <form onSubmit={handleSubmit}>
        <div><label>Title</label><br/>
          <input value={title} onChange={e=>setTitle(e.target.value)} required/>
        </div>
        <div><label>Description</label><br/>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} required/>
        </div>
        <div><label>Date & Time</label><br/>
          <input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} required/>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
