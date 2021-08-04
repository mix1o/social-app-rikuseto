import React from 'react';
import Comments from '../Comments';
import { fireEvent, render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react-dom/test-utils';

let getByTestId: any;

beforeEach(() => {
  const component = render(
    <Comments
      setOpenComments={() => {}}
      fetchTopComment={() => {}}
      postId={'123'}
    />
  );

  getByTestId = component.getByTestId;
});

afterEach(() => {
  cleanup();
});

test('Header comments has correct text filter', () => {
  const filter = getByTestId('filter-text');
  expect(filter.textContent).toBe('Filter by');
});

test('Input correctly change value and at render is empty', () => {
  const input = getByTestId('input-comments');

  expect(input).toBeInTheDocument();
  expect(input.value).toBe('');

  fireEvent.change(input, {
    target: {
      value: 'Great post!',
    },
  });
  expect(input.value).toBe('Great post!');
});

test('Button add new comment functionality', async () => {
  const btn = getByTestId('publish');

  expect(btn.textContent).toBe('Publish');

  act(() => {
    fireEvent.click(btn);
  });

  await waitFor(() => {
    const popup = getByTestId('blurred');
    expect(popup).toBeInTheDocument();
  });
});
