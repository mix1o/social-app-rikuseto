import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';

const Messages = () => {
  // const [cookies] = useCookies();
  // const { user } = cookies;

  const [cookies] = useCookies();
  const { user } = cookies;
  // const [id, setId] = useState('');

  console.log(user.friends);
  // useEffect(() => {
  //   socket.on('connect', () => {
  //     setId(socket.id);
  //   });

  //   socket.on('message', ({ name, text }) => {
  //     setChat([...chat, { name, text }]);
  //   });
  // });

  // const [message, setMessage] = useState({
  //   name: `${user?.first_name} ${user?.last_name}`,
  //   text: '',
  //   room: '',
  // });

  // const [chat, setChat] = useState<{ name: string; text: string }[]>([]);

  // const renderChat = () => {
  //   return chat.map(({ name, text }, idx) => {
  //     return (
  //       <div style={{ color: '#fff', fontSize: '23px' }} key={idx}>
  //         {name} {text}
  //       </div>
  //     );
  //   });
  // };

  // const onMessageSend = (e: any) => {
  //   e.preventDefault();
  //   const { name, text, room } = message;
  //   socket.emit('message', { name, text, room });
  //   setChat([...chat, { name, text }]);
  //   setMessage({ ...message, text: '' });
  // };

  return (
    <div>
      {/* <h1>{id}</h1>
      {user.friends.map((element: string) => {
        return <h2>{element}</h2>;
      })}
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
        <br />
        <input
          style={{ width: '80%', padding: '1rem' }}
          type="text"
          value={message.room}
          onChange={e => setMessage({ ...message, room: e.target.value })}
        />
        <button
          onClick={onMessageSend}
          type="submit"
          style={{ padding: '1rem' }}
        >
          Send
        </button>
      </div> */}
      {user.friends.map(({ friendId, roomId }: any) => (
        <h3>
          <Link to={`/messages/${friendId}`}>{friendId}</Link>
          <br />
          This is roomId {roomId}
        </h3>
      ))}
    </div>
  );
};

export default Messages;
