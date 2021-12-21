import CreatePost from './CreatePost';
import { render, screen } from '@testing-library/react';

const mockFetch = jest.fn();

test('Renders correctly', () => {
  render(<CreatePost handleFetchPosts={mockFetch} />);

  expect(screen.getByText('Create new post')).toBeInTheDocument();

  expect(
    screen.getByPlaceholderText('Write something interesting')
  ).toBeInTheDocument();

  expect(screen.getByPlaceholderText('Choose category')).toBeInTheDocument();

  expect(screen.getByText(/Drag and Drop or/i)).toBeInTheDocument();

  expect(
    screen.getByRole('checkbox', { name: /Receive notification/i })
  ).toBeInTheDocument();

  expect(screen.getByRole('button', { name: /create post/i })).toBeDisabled();
});
