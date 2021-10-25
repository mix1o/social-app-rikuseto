import SignIn from './SignIn';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { useAuth } from '../../hooks/useAuth';

const server = setupServer(
  rest.post(`${process.env.REACT_APP_API}/auth/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _id: '61729931f735b30023cd6504',
        email: 'john@gmail.com',
        avatar: 'https://i.imgur.com/uhaRENv.png',
        categories: [],
        firstName: 'John',
        lastName: 'John',
        friends: [],
        password:
          '$2b$10$DSCMq9ObNQa2.miymyJ.LuhZ3AqTIQg/E8PCC7zLpLu4qSVel1zja',
        pushNotification: true,
        requests: [],
        savedPosts: [],
        sentRequests: [],
        serviceWorkers: [],
        status: true,
      })
    );
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test('Receive user data after successfully login', async () => {
  render(<SignIn />);
  const signIn = jest.fn();
  act(() => {
    userEvent.type(
      screen.getByPlaceholderText(/monke@gmail.com/i),
      'John@gmail.com'
    );
    userEvent.type(screen.getByPlaceholderText(/password/i), 'qweQWE123!@#');

    userEvent.click(screen.getByRole('button', { name: /sign in/i }));
  });
  expect(signIn).toHaveBeenCalledWith({
    email: 'John@gmail.com',
    password: 'qweQWE123!@#',
  });

  //   await waitFor(async () => {});
});
