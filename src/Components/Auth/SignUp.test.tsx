import SignUp from './SignUp';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

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
