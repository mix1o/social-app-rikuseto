import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useCookies } from 'react-cookie';
import SignIn from '../Auth/SignIn';
import SignUp from '../Auth/SignUp';

const UserAuthContainer = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  background: #fff;
  width: 100%;
  min-height: 300px;
  text-align: center;
`;

const Header: FC = () => {
  const [openAuth, setOpenAuth] = useState<boolean>(false);
  const [cookies, , removeCookie] = useCookies();
  const { user } = cookies;
  const [userOption, setUserOption] = useState<number>(0);

  const handleUserChoose = (option: number) => {
    setUserOption(option);
  };

  useEffect(() => {
    setUserOption(0);
    setOpenAuth(false);
  }, [user]);

  return (
    <div className="header">
      {user && <p>{user.first_name}</p>}
      {!user && <p>You are not logged in</p>}
      <button
        style={{ background: 'transparent', border: 'none' }}
        onClick={() => setOpenAuth(true)}
      >
        <i className="fas fa-user"></i>
      </button>
      {openAuth && (
        <UserAuthContainer>
          <div onClick={() => setOpenAuth(false)}>x</div>
          {!user && (
            <>
              <button onClick={() => handleUserChoose(1)}>Log In</button>
              <button onClick={() => handleUserChoose(2)}>Sign In</button>
              {userOption === 1 && <SignIn />}
              {userOption === 2 && <SignUp />}
            </>
          )}
          {user && (
            <div>
              <button onClick={() => removeCookie('user')}>Log out</button>
              <button>Account</button>
            </div>
          )}
        </UserAuthContainer>
      )}
    </div>
  );
};

export default Header;
