import axios from 'axios';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { CookieUser } from '../../../interfaces/auth/authInterface';
import Header from '../../Header/Header';
import Toggle from '../../Animations/Toggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import BlurredContent from '../../Animations/Popup';
import { DetailsValidation } from '../../../Formik/ValidationSchemas';
import { AnimatePresence as Presence } from 'framer-motion';

type ToUpdate = 'firstName' | 'lastName' | 'email' | 'password';

const Details = () => {
  const [cookies, setCookie] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;
  const [toggle, setToggle] = useState(user?.pushNotification);
  dayjs.extend(relativeTime);
  const handleToggle = () => {
    axios
      .put(
        `${process.env.REACT_APP_API}/user/update-notification?userId=${user._id}`
      )
      .then(res => {
        setCookie('user', res.data.user, { path: '/' });
        setToggle(prev => !prev);
      });
  };

  const PersonalDetail: FC<{
    value?: string;
    description: string;
    type: ToUpdate;
  }> = ({ value, description, type }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [newValue, setNewValue] = useState(value);
    const [oldPassword, setOldPassword] = useState<string>('');
    const [errors, setErrors] = useState<string[]>([]);

    const [message, setMessage] = useState<string>('');

    useEffect(() => {
      setNewValue(value);
      setOldPassword('');
      setErrors([]);
      setMessage('');
    }, [open]);

    const updateData = () => {
      axios
        .put(`${process.env.REACT_APP_API}/user/update-details`, {
          userId: user._id,
          type,
          newValue,
          oldPassword,
        })
        .then(res => {
          console.log(res.data);
          if (res.data.valid) {
            setCookie('user', res.data.user, { path: '/' });
          }
          setMessage(res.data.message);
        });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setNewValue(e.target.value);
      setMessage('');

      const validated = DetailsValidation(type, e.target.value);
      validated
        ?.then(() => {
          setErrors([]);
        })
        .catch(err => {
          setErrors(err.errors);
        });
    };

    const typeCheck = () => {
      if (type !== 'firstName' && type !== 'lastName') {
        return type;
      }

      return 'text';
    };

    const checkIsNewValueCorrect = (): boolean => {
      if (errors.length > 0 || message.length > 0) return true;

      if (newValue === value) return true;

      if (type === 'password') {
        if (oldPassword.length === 0 && newValue?.length !== 0) return true;
      }

      return false;
    };

    return (
      <div className="details__personal-section">
        <p className="details__description">{description}:</p>

        <p className="details__value">
          {type === 'password' ? '*********' : value}
        </p>

        <Presence>
          {open && (
            <BlurredContent closeHandler={() => setOpen(false)}>
              <section className="details__popup">
                <p className="details__description">{description}:</p>
                {type !== 'password' && (
                  <input
                    type={typeCheck()}
                    value={newValue}
                    onChange={handleChange}
                    className="details__input"
                  />
                )}
                {type === 'password' && (
                  <>
                    <input
                      type={typeCheck()}
                      value={oldPassword}
                      className="details__input d"
                      placeholder="Enter your old password"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setOldPassword(e.target.value);
                        setMessage('');
                      }}
                    />
                    <input
                      type="password"
                      className="details__input"
                      placeholder="Enter a new password"
                      value={newValue}
                      onChange={handleChange}
                    />
                  </>
                )}

                <p className="details__error">{errors[0]}</p>
                <p className="details__error">{message}</p>
                <button
                  disabled={checkIsNewValueCorrect()}
                  className="details__update-btn"
                  onClick={() => {
                    updateData();
                  }}
                >
                  Update
                </button>
                <button
                  className="details__btn--close details__btn"
                  onClick={() => setOpen(prevState => !prevState)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </section>
            </BlurredContent>
          )}
        </Presence>

        <button
          className="details__btn"
          onClick={() => setOpen(prevState => !prevState)}
        >
          <FontAwesomeIcon icon={faPen} />
        </button>
      </div>
    );
  };

  return (
    <div>
      <Header />
      <main className="details">
        <h2 className="details__header">Account Details</h2>
        <section className="details__date">
          <h3 style={{ textAlign: 'center' }}>
            You joined{' '}
            <span className="details__date-marked">
              {dayjs(user.createdAt).fromNow()}
            </span>
          </h3>
        </section>
        <section className="details__section">
          <PersonalDetail
            value={`${user.firstName}`}
            description="First name"
            type="firstName"
          />
          <PersonalDetail
            value={user.lastName}
            description="Last name"
            type="lastName"
          />
          <PersonalDetail value={user.email} description="Email" type="email" />
          <PersonalDetail description="Password" type="password" />
        </section>

        <section className="details__preferences">
          <h3 className="details__heading">Set your preferences</h3>
          <div className="details__single-option">
            <p className="details__single-description">
              Receive Push notifications
            </p>
            <Toggle
              className={`${
                toggle ? 'container-theme--active' : 'container-theme-disabled'
              }`}
              toggleHandler={() => {
                handleToggle();
              }}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Details;
