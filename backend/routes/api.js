const express  = require('express');
const router   = express.Router();
const auth     = require('../middleware/auth');
const ec       = require('../controllers/eventController');
const multer   = require('multer');
const path     = require('path');
const Event    = require('../models/Event');
const fs       = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.params.id}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

router.get('/events',     ec.list);
router.get('/events/:id', ec.get);

router.post('/events',       auth, ec.create);
router.put('/events/:id',    auth, ec.update);
router.delete('/events/:id', auth, ec.remove);

router.post(
  '/events/:id/images',
  auth,
  upload.array('images', 10),
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

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

router.delete(
    '/events/:id/images/:filename',
    auth,
    async (req, res) => {
      try {
        const { id, filename } = req.params;
        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
  
        const url = `/uploads/${filename}`;
        event.images = (event.images || []).filter(img => img !== url);
        await event.save();
  
        const filePath = path.join(__dirname, '../uploads', filename);
        fs.unlink(filePath, err => {
          if (err) console.warn('Failed to delete file:', filePath, err);
        });
  
        return res.json({ images: event.images });
      } catch (err) {
        console.error('Error deleting image:', err);
        return res.status(500).json({ message: 'Could not delete image' });
      }
    }
  );

module.exports = router;
