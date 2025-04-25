// src/pages/api/profiles/signin.js

import dbConnect from '../../../lib/mongodb';
import Profile from '../../../models/Profile';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  try {
    const profile = await Profile.findOne({ username });

    if (!profile || profile.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}