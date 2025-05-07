const { Schema, model, Types } = require('mongoose');
const CommentSchema = new Schema({
  author:  { type: Types.ObjectId, ref: 'User' },
  event:   { type: Types.ObjectId, ref: 'Event' },
  content: String,
}, { timestamps: true });
module.exports = model('Comment', CommentSchema);
