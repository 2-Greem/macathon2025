// src/pages/api/profiles/index.js

import dbConnect from '../../../lib/mongodb';
import Profile from '../../../models/Profile';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const profile = await Profile.create(req.body);
    res.status(201).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}