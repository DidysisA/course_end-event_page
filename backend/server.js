require('dotenv').config();            
const express   = require('express');
const cors      = require('cors'); 
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));

// Health check
app.get('/', (_, res) => res.send('It works from the backend!'));

// Mount your API routes
app.use('/api', apiRoutes);
app.use('/api/bookings', require('./routes/bookings'));

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));