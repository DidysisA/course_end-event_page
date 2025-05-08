const { Schema, model, Types } = require('mongoose');

const EventSchema = new Schema({
  title:       String,
  description: String,
  date:        Date,
  organizer:   { type: Types.ObjectId, ref: 'User' },
  venue:       { type: Types.ObjectId, ref: 'Venue' },
  images:      [{ type: String }],
}, { timestamps: true });

module.exports = model('Event', EventSchema);
