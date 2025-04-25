import { useState, useEffect } from 'react';
import { sendMessage, getAllMessages, rateMessage, login, signUp } from './api/functions';

export default function Home() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [messages, setMessages] = useState([]);
  const [messageForm, setMessageForm] = useState({
    username: '',
    content: '',
    location: {
      lat: 38.0323,
      long: 145.2678
    },
    rating: {
      positive: 0,
      negative: 4
    }
  })
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  })

  useEffect(() => {
    fetchItems();
    fetchMessages();
  }, []);

  const fetchItems = async () => {
    const res = await fetch('/api/items');
    const data = await res.json();
    setItems(data.data);
  };

  const fetchMessages =  async () => {
    const data = await getAllMessages();
    setMessages(data.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangeMessage = (e) => {
    setMessageForm({ ...messageForm, [e.target.name]: e.target.value });
  };

  const handleChangeLogin = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      fetchItems();
      setForm({ name: '', description: '' });
    } catch (error) {
      console.log(error);
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    try {
      sendMessage(
        messageForm.username, 
        messageForm.content, 
        messageForm.location.lat,
        messageForm.location.long);
      fetchMessages();
      setMessageForm({
        username: '',
        content: '',
        location: {
          lat: 38.0323,
          long: 145.2678
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const pressToLogin = async (e) => {
    e.preventDefault();
    await login(loginForm.username, loginForm.password);
  }

  const pressTosignUp = async (e) => {
    e.preventDefault();
    await signUp(loginForm.username, loginForm.password);
  }

  const voteYes = async (e) => {
    rateMessage("0", 'positive');
    fetchMessages();
  }

  const voteNo = async (e) => {
    rateMessage("0", 'negative');
    fetchMessages();
  }

  const pressForLocation = async(e) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
    
  function success(position) {
    console.log("Latitude: " + position.coords.latitude +
    " Longitude: " + position.coords.longitude);
  }
    
  function error() {
    alert("Sorry, no position available.");
  }
  

  return (
    <div>
      <div>
        <h1>Items</h1>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Item name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="description"
            placeholder="Item description"
            value={form.description}
            onChange={handleChange}
          />
          <button type="submit">Add Item</button>
        </form>

        <ul>
          {items.map((item) => (
            <li key={item._id}>
              {item.name} - {item.description}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h1>Messages</h1>
        <form onSubmit={handleMessageSubmit}>
          <input
          name="username"
          placeholder="username"
          value={messageForm.username}
          onChange={handleChangeMessage}
          />
          <input
          name="content"
          placeholder="content"
          value={messageForm.content}
          onChange={handleChangeMessage}
          />
          <button type="submit">Add Message</button>
        </form>
        <ul>
          {messages.map((message) => (
            <li key={message._id}>
              {message.username} - {message.content} - Good: {message.rating.positive} Bad: {message.rating.negative}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>
          Vote on a random ass comment
        </h2>
        <button onClick={voteYes}>Helpful</button>
        <button onClick={voteNo}>Unhelpful</button>
        <h2>
          Geolocation
        </h2>
        <button onClick={pressForLocation}>Get Location</button>
      </div>
      <div>
        <h2>Login/SignIn</h2>
        <form>
          <input
            name="username"
            placeholder="username"
            value={loginForm.username}
            onChange={handleChangeLogin}/>
          <input
            name="password"
            placeholder="password"
            value={loginForm.password}
            onChange={handleChangeLogin}/>
          <button onClick={pressToLogin}>Log In</button>
          <button onClick={pressTosignUp}>Sign Up</button>
        </form>
      </div>
    </div>
  );
}