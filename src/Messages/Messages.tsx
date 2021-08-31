import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

const Messages = () => {
  const [cookies] = useCookies();
  const { user } = cookies;

  useEffect(() => {
    socket.on('connect', () => {
      console.log(socket.id);
    });

    socket.on('message', ({ name, text }) => {
      setChat([...chat, { name, text }]);
    });
  });

  const [message, setMessage] = useState({
    name: `${user?.first_name} ${user?.last_name}`,
    text: '',
  });

  const [chat, setChat] = useState<{ name: string; text: string }[]>([]);

  const renderChat = () => {
    return chat.map(({ name, text }, idx) => {
      return (
        <div style={{ color: '#fff', fontSize: '23px' }} key={idx}>
          {name} {text}
        </div>
      );
    });
  };

  const onMessageSend = (e: any) => {
    e.preventDefault();
    const { name, text } = message;
    socket.emit('message', { name, text });
    setMessage({ ...message, text: '' });
  };

  return (
    <div>
      <div style={{ marginBottom: '10rem' }}>
        <h1>Messages</h1>
        {renderChat()}
      </div>
      <div>
        <input
          style={{ width: '80%', padding: '1rem' }}
          type="text"
          value={message.text}
          onChange={e => setMessage({ ...message, text: e.target.value })}
        />
        <button
          onClick={onMessageSend}
          type="submit"
          style={{ padding: '1rem' }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Messages;
