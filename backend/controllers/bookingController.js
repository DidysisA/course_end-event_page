const Booking = require('../models/Booking');

exports.create = async (req, res) => {
  const { event, seats } = req.body;
  const user = req.userId;

  // 1) Prevent duplicates
  const existing = await Booking.findOne({ user, event });
  if (existing) {
    return res
      .status(400)
      .json({ message: 'You have already booked this event.' });
  }

  // 2) Otherwise create
  const booking = await Booking.create({ user, event, seats });
  res.status(201).json(booking);
};


// GET /api/bookings  (current user’s bookings)
exports.listMy = async (req, res) => {
  const bookings = await Booking.find({ user: req.userId })
    .populate({ path: 'event', populate: 'venue organizer' });
  res.json(bookings);
};

// DELETE /api/bookings/:id
exports.remove = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking || booking.user.toString() !== req.userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  await booking.deleteOne();
  res.status(204).end();
};