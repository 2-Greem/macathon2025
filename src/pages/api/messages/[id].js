import dbConnect from '../../../lib/mongodb';
import Message from '../../../models/Message';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  if (method !== 'DELETE') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const deletedMessage = await Message.findByIdAndDelete(id);
    if (!deletedMessage) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}