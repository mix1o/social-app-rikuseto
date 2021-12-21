import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import CustomTextarea from '../FormFields/CustomTextarea';
import { CookieUser } from '../../interfaces/auth/authInterface';

const socket = io(`${process.env.REACT_APP_SOCKET}`);

const SingleConversation = () => {
  const { id, name } = useParams<{ id: string; name: string }>();

  const history = useHistory();
  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;

  const [chat, setChat] = useState<
    {
      avatar: string;
      text: string;
      userId: string;
      _id?: string;
      date?: string;
    }[]
  >([]);
  const [message, setMessage] = useState('');

  const getMessages = () => {
    axios
      .get(`${process.env.REACT_APP_API}/user/get-conversation?roomId=${id}`)
      .then(res => {
        setChat(res.data.conversation);
      });
  };

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    const isFriend = user.friends?.findIndex(friend => friend.roomId === id);

    if (isFriend === -1) history.push('/not-found');

    if (id !== '') {
      socket.emit('join-room', id);
    }
  }, [id]);

  const onMessageSend = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const avatar = user.avatar;
    const room = id;

    socket.emit('message', { avatar, text: message, room, userId: user._id });
    setChat([...chat, { avatar, text: message, userId: user._id }]);
    setMessage('');
  };

  const lastMessage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on('connect', () => {});

    socket.on('message', ({ avatar, text, userId }) => {
      setChat([...chat, { avatar, text, userId }]);
    });

    socket.on('delete', ({ idx, userId, avatar }) => {
      changeChat(idx, userId, avatar);
    });

    if (lastMessage.current !== null) {
      lastMessage?.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat]);

  const deleteMessage = (
    idx: number,
    userId: string,
    avatar: string,
    room: string,
    messageId: string | undefined
  ) => {
    socket.emit('delete', { idx, userId, avatar, room, messageId });
    changeChat(idx, userId, avatar);
  };

  const changeChat = async (idx: number, userId: string, avatar: string) => {
    const newChat = [...chat];
    newChat.splice(idx, 1);
    setChat(newChat);
  };
  console.log(user.friends);
  const renderChat = useCallback(() => {
    return chat.map(({ avatar, text, userId, _id }, idx) => {
      return (
        <div
          onClick={() => {
            if (userId === user._id)
              deleteMessage(idx, userId, avatar, id, _id);
          }}
          className="conversation__message-wrapper"
          key={idx}
          ref={chat.length - 1 === idx ? lastMessage : null}
        >
          {userId !== user._id && (
            <img
              className="conversation__author-message"
              style={{ alignSelf: 'flex-start' }}
              src={avatar}
              alt="user"
            />
          )}

          <p
            className={`conversation__single-message ${
              userId === user._id ? 'conversation__author' : ''
            }`}
          >
            {text}
          </p>
        </div>
      );
    });
  }, [chat, user._id]);

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
        name="converastion"
        textValue={message}
        setTextValue={setMessage}
        handleAction={onMessageSend}
        loading={false}
      />
    </div>
  );
};

export default SingleConversation;

// TODO Mozliwosc usuwania pojedynczej wiadomosci
// TODO Zapisywanie wiadomoscie w localstorage ostatnie 10
// TODO Wysyłanie wiadomości gdy user polonczy sie z netem
