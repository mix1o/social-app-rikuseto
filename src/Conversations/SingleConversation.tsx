import { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Link } from 'react-router-dom';

const socket = io('http://localhost:4000');

const SingleConversation = () => {
  const { id, name } = useParams<{ id: string; name: string }>();

  const [cookies] = useCookies();
  const { user } = cookies;
  const [chat, setChat] = useState<{ avatar: string; text: string }[]>([]);

  const getMessages = () => {
    axios
      .get(
        `${process.env.REACT_APP_API}/conversations/get-conversation?roomId=${id}`
      )
      .then(res => setChat(res.data.conversation));
  };

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    socket.on('connect', () => {});

    socket.on('message', ({ avatar, text }) => {
      setChat([...chat, { avatar, text }]);
    });
  }, [chat]);

  const [room, setRoomId] = useState();

  const [message, setMessage] = useState({
    avatar: `${user?.avatar}`,
    text: '',
    room: id,
  });

  const renderChat = () => {
    return chat.map(({ avatar, text }, idx) => {
      return (
        <div
          style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}
          key={idx}
        >
          {avatar !== user.avatar && (
            <img
              className="conversation__author-message"
              style={{ alignSelf: 'flex-start' }}
              src={avatar}
            />
          )}

          <p
            className={`conversation__single-message ${
              avatar === user.avatar ? 'conversation__author' : ''
            }`}
          >
            {text}
          </p>
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
    const { avatar, text, room } = message;
    socket.emit('message', { avatar, text, room });
    setChat([...chat, { avatar, text }]);
    setMessage({ ...message, text: '' });
  };

  return (
    <div className="conversation">
      <div className="conversation__header">
        <Link to="/conversations">
          <i className="fas fa-arrow-left conversation__actions"></i>
        </Link>
        <h3 className="conversation__friend-name">{name}</h3>
        <i className="fas fa-ellipsis-v conversation__actions"></i>
      </div>
      <div className="conversation__messages">{renderChat()}</div>
      <div className="conversation__container-text">
        <textarea
          value={message.text}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setMessage({ ...message, text: e.target.value })
          }
          className="conversation__text"
        ></textarea>
        <button onClick={onMessageSend} className="conversation__btn">
          SEND
        </button>
      </div>
    </div>
  );
};

export default SingleConversation;

// TODO Mozliwosc usuwania pojedynczej wiadomosci
// TODO Zapisywanie wiadomoscie w localstorage ostatnie 10
// TODO Wysyłanie wiadomości gdy user polonczy sie z netem
