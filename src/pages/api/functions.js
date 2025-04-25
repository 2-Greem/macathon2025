let username;

function checkLocalStorageForLogin(){
  username = localStorage.getItem('username');
  return username;
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

    const result = await response.json();

    if (!response.ok) {
      //throw new Error(result.error || 'Failed to sign up');
    }
    username = result.data.username;
    return result; // the created message
  } catch (error) {
    console.error('Error signing up:', error.message);
    //throw error;
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

    const result = await response.json();

    if (!response.ok) {
      //throw new Error(result.error || 'Failed to login');
    }
    username = result.data.username;
    return result; // the created message
  } catch (error) {
    console.error('Error logging in:', error.message);
    //throw error;
  }
}

async function logout(){
  // clear out the username data
  localStorage.removeItem('username');
  username;
}

// if there's a user in local storage it logs them in
checkLocalStorageForLogin()

export { sendMessage, getAllMessages, rateMessage, login, signUp, logout };