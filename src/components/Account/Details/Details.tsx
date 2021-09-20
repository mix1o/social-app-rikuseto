import axios from 'axios';
import { ChangeEvent, FC, useState } from 'react';
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
    const updateData = () => {
      axios
        .put(`${process.env.REACT_APP_API}/user/update-details`, {
          userId: user._id,
          type,
          newValue,
          oldPassword,
        })
        .then(res => console.log(res.data));
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setNewValue(e.target.value);
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

    return (
      <div className="details__personal-section">
        <p className="details__description">{description}:</p>

        <p className="details__value">
          {type === 'password' ? '*********' : value}
        </p>

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
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setOldPassword(e.target.value)
                    }
                  />
                  <input
                    type="password"
                    className="details__input"
                    value={newValue}
                    onChange={handleChange}
                  />
                </>
              )}

              <button
                className="details__update-btn"
                onClick={() => updateData()}
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
        <section>
          <h3>
            You joined <span>{dayjs(user.createdAt).fromNow()}</span>
          </h3>
        </section>
        <section>
          Receive Push notifications
          <Toggle
            className={`${
              toggle ? 'container-theme--active' : 'container-theme-disabled'
            }`}
            toggleHandler={() => {
              handleToggle();
            }}
          />
        </section>
      </main>
    </div>
  );
};

export default Details;
