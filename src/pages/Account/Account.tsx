import { FC, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { CookieUser } from '../../interfaces/auth/authInterface';
import BlurredContent from '../../components/Animations/Popup';
import Header from '../../components/Header/Header';
import EditProfilePicture from '../../components/Details/EditProfilePicture';
import { AnimatePresence as Presence } from 'framer-motion';
import Floater from 'react-floater';
import { useFiles } from '../../hooks/useFiles';

const Account: FC = () => {
  const [openFloater, setOpenFloater] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState('');

  const [cookies, , removeCookie] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;
  const { validateFile } = useFiles();

  const closeHandler = () => setOpenEdit(prevState => !prevState);

  const convertToBase = (image: FileList) => {
    setOpenFloater(false);
    const validate = validateFile(image[0], 1000000);
    setMessage(validate.message);
    if (validate.accepted) {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(image[0]);

      fileReader.addEventListener(
        'load',
        () => {
          setImage(fileReader!.result!?.toString());
          setMessage('');
          closeHandler();
        },
        false
      );
    }
  };

  return (
    <>
      <Header />
      {user && (
        <div className="account">
          <div className="account__container-avatar">
            <div className="account__avatar">
              <p>{message}</p>
              <img
                className="account__image"
                src={user.avatar}
                alt="User profile"
              />

              <Floater
                styles={{
                  floater: {
                    filter: 'none',
                  },
                  container: {
                    backgroundColor: 'var(--light-bg-700)',
                    minWidth: 0,
                    color: 'var(--font-dark-600)',
                    filter: 'none',
                    minHeight: 'none',
                    padding: '10px 0',
                    borderRadius: 3,
                    border: '1px solid var(--secondary-bg-100)',
                  },
                  arrow: {
                    color: 'var(--light-bg-700)',
                    length: 8,
                    spread: 10,
                  },
                }}
                open={openFloater}
                content={
                  <label className="account__upload-label">
                    <input
                      type="file"
                      className="account__upload-input"
                      accept="image/jpeg, image/jpg, image/png, image/gif"
                      multiple={false}
                      onChange={e => {
                        if (e.target.files) convertToBase(e.target.files);
                      }}
                    />
                    Upload a photo...
                  </label>
                }
                target=".account__image"
                placement="bottom"
              ></Floater>
              <button
                className="account__edit-profile"
                onClick={() => setOpenFloater(prevState => !prevState)}
              >
                <i className="far fa-edit"></i> Edit
              </button>
            </div>
            <Presence>
              {openEdit && (
                <BlurredContent closeHandler={closeHandler}>
                  <EditProfilePicture image={image} closeModal={closeHandler} />
                </BlurredContent>
              )}
            </Presence>
          </div>
          <div className="account__user-information">
            <h3 className="account__name">
              {user.firstName} {user.lastName}
            </h3>
          </div>
          <div className="account__actions">
            <Link to="/account/details" className="account__section">
              <i className="fas fa-user"></i>
              <div>
                <p className="account__heading">Login details</p>
                <p className="account__description">Check or edit your data</p>
              </div>
              <i className="fas fa-chevron-right"></i>
            </Link>
            <Link to="/account/saved-posts" className="account__section">
              <i className="fas fa-flag"></i>
              <div>
                <p className="account__heading">Saved posts</p>
                <p className="account__description">See your saved posts</p>
              </div>
              <i className="fas fa-chevron-right"></i>
            </Link>
            <Link to="/account/your-posts" className="account__section">
              <i className="fas fa-pen"></i>
              <div>
                <p className="account__heading">Your posts</p>
                <p className="account__description">Browse all your posts</p>
              </div>
              <i className="fas fa-chevron-right"></i>
            </Link>
            <Link to="/categories" className="account__section">
              <i className="fas fa-book"></i>
              <div>
                <p className="account__heading">Categories</p>
                <p className="account__description">
                  Personalize your favorite categories
                </p>
              </div>
              <i className="fas fa-chevron-right"></i>
            </Link>
            <div className="account__section">
              <i className="fas fa-headphones"></i>
              <div>
                <p className="account__heading">Help</p>
                <p className="account__description">Get help any time</p>
              </div>
              <i className="fas fa-chevron-right"></i>
            </div>
            <div className="account__section">
              <i className="fas fa-sign-out-alt"></i>
              <div>
                <p className="account__heading">
                  <button
                    onClick={() => {
                      removeCookie('user');
                      window.location.href = '/';
                    }}
                    className="account__logout"
                  >
                    Log out
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Account;
