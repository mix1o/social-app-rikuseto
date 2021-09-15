import axios from 'axios';
import { ChangeEvent, FC, useState } from 'react';
import { useCookies } from 'react-cookie';
import { CookieUser } from '../../../interfaces/auth/authInterface';
import Header from '../../Header/Header';
import Toggle from '../Animations/Toggle';

type ToUpdate = 'firstName' | 'lastName' | 'email' | 'password';

const Details = () => {
  const [cookies, setCookie] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;
  const [toggle, setToggle] = useState(user?.pushNotification);

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
    const [newValue, setNewValue] = useState('');
    const [oldPassword, setOldPassword] = useState('');

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
    };

    const typeCheck = () => {
      if (type !== 'firstName' && type !== 'lastName') {
        return type;
      }

      return 'text';
    };

    return (
      <div className="details__personal-section">
        <p className="details__description">{description}</p>
        <p className="details__value">
          {type === 'password' ? '*********' : value}
        </p>
        <button onClick={() => setOpen(prevState => !prevState)}>
          {open ? 'Cancel' : 'Edit'}
        </button>
        {open && type !== 'password' && (
          <>
            <input
              type={typeCheck()}
              value={newValue}
              onChange={handleChange}
            />
            <button onClick={() => updateData()}>Update</button>
          </>
        )}
        {open && type === 'password' && (
          <>
            <input
              type={typeCheck()}
              value={oldPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setOldPassword(e.target.value)
              }
            />
            <input type="password" value={newValue} onChange={handleChange} />
            <button onClick={() => updateData()}>Update</button>
          </>
        )}
      </div>
    );
  };

  return (
    <div>
      <Header />
      <main>
        <section>
          <h4>Personal details</h4>
          <div>
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
            <PersonalDetail
              value={user.email}
              description="Email"
              type="email"
            />
            <PersonalDetail description="Password" type="password" />
          </div>
        </section>
        <section>
          <h3>
            You joined <span>19.20.22</span>
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
