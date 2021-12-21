import { useEffect, useReducer } from 'react';
import { fetchType } from '../interfaces/posts/postInterfaces';

interface IAction {
  type: fetchType;
  payload: string;
}

interface IState {
  type: fetchType;
  url: string;
}

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case 'all-posts':
      return { type: 'all-posts', url: '/posts/get' };
    case 'user-posts': {
      if (action.payload.length >= 2) {
        return {
          type: 'user-posts',
          url: `/posts/get-categories?id=${action.payload}`,
        };
      } else {
        return {
          type: 'all-posts',
          url: '/posts/get',
        };
      }
    }
    default:
      return state;
  }
};

export const useFetchRoute = (
  type: fetchType,
  userId: string
): { type: fetchType; url: string } => {
  const [state, dispatch] = useReducer(reducer, {
    type: 'all-posts',
    url: '/posts/get',
  });

  useEffect(() => {
    dispatch({ type, payload: userId });
  }, [userId, type]);
  console.log(state);
  return state;
};
