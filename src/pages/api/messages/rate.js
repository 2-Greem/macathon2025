// src/pages/api/messages/rate.js

import dbConnect from '../../../lib/mongodb';
import Message from '../../../models/Message';

export default async function handler(req, res) {
  await dbConnect();

  const { method, body } = req;

  if (method !== 'PATCH') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { messageId, type } = body;

    if (!messageId || !['positive', 'negative'].includes(type)) {
      return res.status(400).json({ success: false, error: 'Invalid request body' });
    }

    const updateField = {};
    updateField[`rating.${type}`] = 1;

    const updated = await Message.findOneAndUpdate(
      { message_id: messageId },
      { $inc: updateField },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}