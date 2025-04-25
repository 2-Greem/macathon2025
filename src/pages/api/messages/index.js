// src/pages/api/messages/index.js

import dbConnect from '../../../lib/mongodb';
import Message from '../../../models/Message';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    // Get Messages ( retrieve from database )
    case 'GET':
      try {
        const messages = await Message.find({});
        res.status(200).json({ success: true, data: messages });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    // Post a Message to the database
    case 'POST':
      try {
        const message = await Message.create(req.body);
        res.status(201).json({ success: true, data: message });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
          const deletedMessage = await Message.findOneAndDelete({ message_id });

          if (!deletedMessage) {
              return res.status(404).json({ success: false, message: 'Message not found' });
          }

          res.status(200).json({ success: true, message: 'Message deleted' });
      } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, message: 'Server error' });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}
