import {
  screen,
  act,
  render,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Comment from './Comment';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

const refreshComments = jest.fn();
const fetchTopComment = jest.fn();

const fakeComment = {
  _id: '1',
  userId: '1',
  text: 'Likes comment',
  date: '12-12-12',
  likes: ['first', 'second'],
  refreshComments,
  fetchTopComment,
};

beforeEach(() => {
  const history = createMemoryHistory();

  render(
    <Router history={history}>
      <Comment
        _id={fakeComment._id}
        userId={fakeComment.userId}
        text={fakeComment.text}
        date={fakeComment.date}
        likes={fakeComment.likes}
        refreshComments={fakeComment.refreshComments}
        fetchTopComment={fakeComment.fetchTopComment}
      />
    </Router>
  );
});

test('Comment component receives and shows correct props', () => {
  expect(screen.getByText('Likes comment')).toBeInTheDocument();
  expect(screen.getByText(/ago/i)).toBeInTheDocument();

  expect(screen.getByTestId('comment-likes-count').textContent).toBe('2');
});

test('Show login popup on click', async () => {
  fireEvent.click(screen.getByTestId('btn-like'));

  expect(screen.getByTestId('blurred')).toBeInTheDocument();
  expect(screen.getByText('Login')).toBeInTheDocument();

  act(() => {
    fireEvent.click(screen.getByText('Sign Up'));
  });

  await waitFor(() =>
    expect(screen.getByTestId('heading')).toBeInTheDocument()
  );
});
