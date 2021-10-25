import SignUp from './SignUp';
import {
  fireEvent,
  render,
  waitFor,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { server, rest } from '../../testServer';

test('SignUp renders with correct elements', () => {
  render(<SignUp />);

  expect(screen.getByText(/please sign in to continue/i)).toBeInTheDocument();

  expect(screen.getByText(/already a member/i)).toBeInTheDocument();

  expect(screen.getByTestId('btn-sign-up').textContent).toBe('Sign Up');

  expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();

  expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();

  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
});

test('Inputs change value correctly', () => {
  render(<SignUp />);

  const email = screen.getByPlaceholderText(
    'Email address'
  ) as HTMLInputElement;
  const password = screen.getByPlaceholderText('Password') as HTMLInputElement;
  const firstName = screen.getByPlaceholderText(
    'First Name'
  ) as HTMLInputElement;

  act(() => {
    fireEvent.change(email, {
      target: { value: 'sample@gmail.com' },
    });

    fireEvent.change(password, {
      target: { value: 'qwerty' },
    });

    fireEvent.change(firstName, {
      target: { value: 'John' },
    });
  });

  expect(email.value).toBe('sample@gmail.com');
  expect(password.value).toBe('qwerty');
  expect(firstName.value).toBe('John');
});

test('Inputs show message after click button with empty value of input', async () => {
  render(<SignUp />);

  userEvent.click(screen.getByTestId('btn-sign-up'));

  const checkMessages = () => {
    expect(screen.getAllByTestId('message')[0].textContent).toBe(
      'Email is required'
    );
    expect(screen.getAllByTestId('message')[1].textContent).toBe(
      'First Name is required'
    );
    expect(screen.getAllByTestId('message')[2].textContent).toBe(
      'Last Name is required'
    );
    expect(screen.getAllByTestId('message')[3].textContent).toBe(
      'Password is required'
    );
    expect(screen.getAllByTestId('message')[4].textContent).toBe(
      'Confirm password is required'
    );
  };

  await waitFor(() => checkMessages());
});

test('Successfully registered user response from server', async () => {
  server.use(
    rest.post(
      `${process.env.REACT_APP_API}/auth/create-account`,
      (req, res, ctx) => {
        return res(
          ctx.status(203),
          ctx.json({
            message: 'Email already exists please login or reset your password',
          })
        );
      }
    )
  );

  render(<SignUp />);

  act(() => {
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'John@gmail.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'qweQWE123!@#' },
    });

    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'qweQWE123!@#' },
    });
    fireEvent.change(screen.getByPlaceholderText('First Name'), {
      target: { value: 'Johny' },
    });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), {
      target: { value: 'John' },
    });
  });

  userEvent.click(screen.getByTestId('btn-sign-up'));

  expect(
    await screen.findByText(
      /Email already exists please login or reset your password/i
    )
  ).toHaveClass('auth__message--refused');
});
