async function sendMessage( username, content, latitude, longitude) {
    const payload = {
      username: username,
      content: content,
      location: {
        latitude: latitude,
        longitude: longitude
      },
      rating: {
        positive: 0,
        negative: 0
      }
    };
  
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }
  
      return result.data; // the created message
    } catch (error) {
      console.error('Error sending message:', error.message);
      throw error;
    }
}

async function getAllMessages(){
  try {
    const response = await fetch('/api/messages');
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to get messages');
    }

    return result;
  } catch (error) {
    console.error('Error retrieving messages:', error.message);
    throw error;
  }
  
}
export { sendMessage, getAllMessages };