import Posts from './Posts';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import * as axios from 'axios';
import Cookies from 'universal-cookie';
import { CookiesProvider } from 'react-cookie';
import { act } from 'react-dom/test-utils';

const history = createMemoryHistory();

jest.mock('axios');
test('fetching posts', async () => {
  axios.get.mockImplementation(() =>
    Promise.resolve({
      data: [
        {
          _id: '0832',
          headline: 'Test post',
          category: 'Test category',
          file: '',
          userId: '1',
          likes: [],
          date: new Date(),
        },
      ],
    })
  );

  render(
    <Router history={history}>
      <Posts />
    </Router>
  );

  await waitFor(() => {
    expect(screen.getByText('Test post')).toBeInTheDocument();
    expect(screen.getByText('Test category')).toBeInTheDocument();
    expect(screen.getByTestId('likes').textContent).toBe('0');
  });
});
