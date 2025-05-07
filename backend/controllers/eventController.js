const Event = require('../models/Event');

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
  const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(ev);
};
exports.remove = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
