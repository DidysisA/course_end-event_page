const { Schema, model, Types } = require('mongoose');
const BookingSchema = new Schema({
  user:  { type: Types.ObjectId, ref: 'User' },
  event: { type: Types.ObjectId, ref: 'Event' },
  seats: Number,
}, { timestamps: true });
module.exports = model('Booking', BookingSchema);
