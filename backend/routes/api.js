// backend/routes/api.js

const express  = require('express');
const router   = express.Router();
const auth     = require('../middleware/auth');
const ec       = require('../controllers/eventController');
const multer   = require('multer');
const path     = require('path');
const Event    = require('../models/Event');

// Multer setup: store uploads into the backend/uploads/ folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => {
    // e.g. "<eventId>-<timestamp><ext>"
    const ext = path.extname(file.originalname);
    cb(null, `${req.params.id}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

/** Public routes **/
router.get('/events',     ec.list);      // list all events
router.get('/events/:id', ec.get);       // get a single event by ID

/** Protected routes (requires Bearer <token>) **/
router.post('/events',       auth, ec.create);
router.put('/events/:id',    auth, ec.update);
router.delete('/events/:id', auth, ec.remove);

/** Image upload **/
router.post(
  '/events/:id/images',
  auth,                         // only for logged-in users
  upload.array('images', 10),   // accept up to 10 files under field name "images"
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Build public URLs and append to the Event.images array
      const urls = req.files.map(f => `/uploads/${f.filename}`);
      event.images = (event.images || []).concat(urls);
      await event.save();

      return res.status(201).json({ images: event.images });
    } catch (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ message: 'Upload failed', error: err.message });
    }
  }
);

module.exports = router;
