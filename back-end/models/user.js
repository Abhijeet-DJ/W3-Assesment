const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: String,
  avatar: String,
  points: { type: Number, default: 0 }
});

module.exports = mongoose.model('UserPoint', userSchema);
