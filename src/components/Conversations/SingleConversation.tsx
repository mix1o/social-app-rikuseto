import { MouseEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CustomTextarea from '../../helpers/CustomTextarea';

const socket = io(`${process.env.REACT_APP_SOCKET}`);

const SingleConversation = () => {
  const { id, name } = useParams<{ id: string; name: string }>();

  const [cookies] = useCookies();
  const { user } = cookies;
  const [chat, setChat] = useState<{ avatar: string; text: string }[]>([]);
  const [message, setMessage] = useState('');
  const getMessages = () => {
    axios
      .get(`${process.env.REACT_APP_API}/user/get-conversation?roomId=${id}`)
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

  const renderChat = () => {
    return chat.map(({ avatar, text }, idx) => {
      return (
        <div className="conversation__message-wrapper" key={idx}>
          {avatar !== user.avatar && (
            <img
              className="conversation__author-message"
              style={{ alignSelf: 'flex-start' }}
              src={avatar}
              alt="user"
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
    if (id !== '') {
      socket.emit('join-room', id);
    }
  }, [id]);

  const onMessageSend = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const avatar = user.avatar;
    const room = id;
    socket.emit('message', { avatar, text: message, room });
    setChat([...chat, { avatar, text: message }]);
    setMessage('');
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
      <CustomTextarea
        textValue={message}
        setTextValue={setMessage}
        handleAction={onMessageSend}
      />
    </div>
  );
};

export default SingleConversation;

// TODO Mozliwosc usuwania pojedynczej wiadomosci
// TODO Zapisywanie wiadomoscie w localstorage ostatnie 10
// TODO Wysyłanie wiadomości gdy user polonczy sie z netem
