const Event = require('../models/Event');
const User  = require('../models/User');

exports.list  = async (_, res) => {
  const events = await Event.find().populate('venue organizer');
  res.json(events);
};
exports.get   = async (req, res) => {
  const ev = await Event.findById(req.params.id).populate('venue organizer');
  res.json(ev);
};
exports.create = async (req, res) => {
  const data = { ...req.body, organizer: req.userId };
  const ev   = await Event.create(data);
  res.status(201).json(ev);
};
exports.update = async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) {
    return res.status(404).json({ message: 'Event not found' });
  }

  const user = await User.findById(req.userId);

  if (ev.organizer.toString() !== req.userId && !user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  Object.assign(ev, req.body);
  await ev.save();
  res.json(ev);
};
exports.remove = async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) {
    return res.status(404).json({ message: 'Event not found' });
  }

  const user = await User.findById(req.userId);

  if (ev.organizer.toString() !== req.userId && !user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await ev.deleteOne();
  res.status(204).end();
};
