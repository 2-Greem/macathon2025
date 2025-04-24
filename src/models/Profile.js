// src/models/Profile.js
import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);