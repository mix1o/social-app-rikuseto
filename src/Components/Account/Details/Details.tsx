import axios from 'axios';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { CookieUser } from '../../../Interfaces/auth/authInterface';
import Header from '../../Header/Header';
import Toggle from '../../Animations/Toggle';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ToUpdate } from '../../../Validations/UserDetailsSchema';
import PersonalDetail from './DetailsItem';
import BlurredContent from '../../Animations/Popup';
import { AnimatePresence as Presence } from 'framer-motion';

import RemoveAccount from './RemoveAccount';

const Details = () => {
  const [cookies, setCookie] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;

  const [toggle, setToggle] = useState(user?.pushNotification);
  const [open, setOpen] = useState(false);

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
            type={ToUpdate.FIRST_NAME}
          />
          <PersonalDetail
            value={user.lastName}
            description="Last name"
            type={ToUpdate.LAST_NAME}
          />
          <PersonalDetail
            value={user.email}
            description="Email"
            type={ToUpdate.EMAIL}
          />
          <PersonalDetail description="Password" type={ToUpdate.PASSWORD} />
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
          <button
            className="details__btn--remove"
            onClick={() => setOpen(true)}
            type="button"
          >
            Delete your Account
          </button>
          <Presence>
            {open && (
              <BlurredContent closeHandler={() => setOpen(false)}>
                <RemoveAccount />
              </BlurredContent>
            )}
          </Presence>
        </section>
      </main>
    </div>
  );
};

export default Details;
