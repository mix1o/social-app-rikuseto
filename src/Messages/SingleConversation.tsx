import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const socket = io('http://localhost:4000');

const SingleConversation = () => {
  const { id } = useParams<{ id: string }>();

  const [cookies] = useCookies();
  const { user } = cookies;

  useEffect(() => {
    axios.post(`${process.env.REACT_APP_API}/message/test`, {
      friendId: id,
      userId: user._id,
    });
  }, []);

  useEffect(() => {
    socket.on('connect', () => {});

    socket.on('message', ({ name, text }) => {
      setChat([...chat, { name, text }]);
    });
  });

  const [room, setRoomId] = useState();
  const getRoomId = () => {
    user.friends.forEach((element: any) => {
      if (element.friendId === id) {
        setMessage({ ...message, room: element.roomId });
      }
    });
  };
  useEffect(() => {
    getRoomId();
  }, []);
  const [message, setMessage] = useState({
    name: `${user?.first_name} ${user?.last_name}`,
    text: 'TESTOWA WIADOMOSC',
    room: '',
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

  useEffect(() => {
    if (message.room !== '') {
      socket.emit('join-room', message.room);
    }
  }, [message.room]);
  const onMessageSend = (e: any) => {
    e.preventDefault();
    const { name, text, room } = message;
    socket.emit('message', { name, text, room });
    setChat([...chat, { name, text }]);
    setMessage({ ...message, text: 'STILL MUST BE DATA' });
  };

  return (
    <div>
      <h1>{user.first_name}</h1>
      <h3>Your: {user._id}</h3>
      <h3>Friend: {id}</h3>
      <h4>ROOM ID : {message.room}</h4>
      <button onClick={onMessageSend}>CLICK ME</button>
      <div>{renderChat()}</div>
    </div>
  );
};

export default SingleConversation;
