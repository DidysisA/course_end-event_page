// backend/server.js

require('dotenv').config();              // 1. Load .env before anything else
const express   = require('express');    // 2. Import Express once
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));

// Health check
app.get('/', (_, res) => res.send('It works from the backend!'));

// Mount your API routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
