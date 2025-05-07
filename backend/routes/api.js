const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const ec      = require('../controllers/eventController');

// Public routes
router.get('/events',     ec.list);
router.get('/events/:id', ec.get);

// Protected routes (requires Bearer <token>)
router.post('/events',        auth, ec.create);
router.put('/events/:id',     auth, ec.update);
router.delete('/events/:id',  auth, ec.remove);

module.exports = router;
