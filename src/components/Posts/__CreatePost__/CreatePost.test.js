import React from 'react';
import CreatePost from '../CreatePost';
import { fireEvent, render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

let getByTestId;

beforeEach(() => {
  const component = render(<CreatePost />);
  getByTestId = component.getByTestId;
});

afterEach(() => {
  cleanup();
});

test('header renders with correct text', () => {
  const header = getByTestId('create-post-header');

  expect(header.textContent).toBe('Create new post');
});

test('button renders with disabled', () => {
  const button = getByTestId('button');

  expect(button.hasAttribute('disabled'));
});

test('input correctly change value', () => {
  const headline = getByTestId('headline');

  expect(headline.value).toBe('');

  fireEvent.change(headline, {
    target: {
      value: 'New post',
    },
  });

  expect(headline.value).toBe('New post');
});

test('message displaying correctly', async () => {
  const headline = getByTestId('headline');

  fireEvent.change(headline, {
    target: {
      value: 'Something',
    },
  });

  const message = getByTestId('message');

  await waitFor(() => expect(message).toBeInTheDocument());
});
