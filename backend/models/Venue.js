const { Schema, model } = require('mongoose');
const VenueSchema = new Schema({
  name:    String,
  address: String,
  capacity:Number,
}, { timestamps: true });
module.exports = model('Venue', VenueSchema);
