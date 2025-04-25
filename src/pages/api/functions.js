let username;
const innerMessageRadius = 400;
const outerMessageRadius = 1000;

function checkLocalStorageForLogin(){
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('username') !== null){
      username = localStorage.getItem('username');
      return username;
    }
  }
  return;
}

function isLoggedIn(){
  checkLocalStorageForLogin()
  if (!!username){
    return true;
  } else {
    return false;
  }
}

async function sendMessage( username, content, latitude, longitude) {
    const payload = {
      username: username,
      content: content,
      location: {
        lat: latitude,
        long: longitude
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
  
      return result; // the created message
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

async function deleteMessage(message_id){
  try {
    const res = await fetch('/api/messages', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messageId: message_id,
      }),
    });

    const result = await res.json();
    return result;
  } catch (err) {
    console.error('Failed to delete message:', err);
  }
}

async function rateMessage(message_id, type){
  try {
    const res = await fetch('/api/messages/rate', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messageId: message_id,
        type: type, // 'positive' or 'negative'
      }),
    });

    const result = await res.json();
    return result;
  } catch (err) {
    console.error('Failed to rate message:', err);
  }
}

async function signUp(username, password){
  const payload = {
    username: username,
    password: password
  }
  try {
    const response = await fetch('/api/profiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return false;
    } else {
      return true;
	  }
  } catch (error) {
    console.error('Error signing up:', error.message);
    throw error;
  }
}

async function login(username, password){
  const payload = {
    username: username,
    password: password
  }
  try {
    const response = await fetch('/api/profiles/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return false;
    } else {
      return true;
	  }
    
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw error;
  }
}

async function logout(){
  // clear out the username data
  if (typeof window !== 'undefined') {
    localStorage.removeItem('username');
  }
  username;
}

async function getUserMessages(username) {
  try {
    // TODO make new endpoint for this
    const response = await getAllMessages();
    if (!response.success) {
      throw new Error('Failed to fetch messages');
    }
    
    // Filter messages for the specific user
    const userMessages = response.data.filter(message => message.username === username);
    return {
      success: true,
      data: userMessages
    };
  } catch (error) {
    console.error('Error getting user messages:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

export { 
  sendMessage, 
  getAllMessages, 
  getUserMessages,
  deleteMessage,
  rateMessage, 
  login, 
  signUp, 
  logout, 
  isLoggedIn, 
  deleteMessage,
  username, 
  innerMessageRadius, 
  outerMessageRadius 
};
