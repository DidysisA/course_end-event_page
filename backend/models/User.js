const { Schema, model } = require('mongoose');
const UserSchema = new Schema({
  name:    String,
  email:   { type: String, unique: true },
  password:String,
}, { timestamps: true });
module.exports = model('User', UserSchema);
