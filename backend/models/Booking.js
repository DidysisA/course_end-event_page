const { Schema, model, Types } = require('mongoose');

const BookingSchema = new Schema({
  user:  { type: Types.ObjectId, ref: 'User', required: true },
  event: { type: Types.ObjectId, ref: 'Event', required: true },
  seats: { type: Number, default: 1 },
}, { timestamps: true });

BookingSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = model('Booking', BookingSchema);
