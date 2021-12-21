import { createContext, FC, useContext, useReducer } from 'react';
import { useCookies } from 'react-cookie';
import { CookieUser } from '../interfaces/auth/authInterface';
import {
  CreatePostI,
  Action,
  ActionEnum,
} from '../interfaces/posts/postInterfaces';

const createReducer = (state: CreatePostI, action: Action) => {
  switch (action.type) {
    case ActionEnum.SET_HEADLINE: {
      return {
        ...state,
        headline: action.payload,
      };
    }
    case ActionEnum.SET_NOTIFICATION: {
      return {
        ...state,
        notification: !state.notification,
      };
    }
    case ActionEnum.SET_FILE: {
      return {
        ...state,
        file: action.payload,
      };
    }
    case ActionEnum.SET_CATEGORY: {
      return {
        ...state,
        category: action.payload,
      };
    }
    case ActionEnum.CLEAR: {
      return {
        ...state,
        headline: '',
        file: '',
        category: '',
        notification: false,
      };
    }
  }
};

const useCreatePost = () => {
  const [cookies] = useCookies();
  const user: CookieUser = cookies['user'] ? { ...cookies['user'] } : undefined;

  const [state, dispatch] = useReducer(createReducer, {
    headline: '',
    file: '',
    category: '',
    userId: user._id,
    notification: false,
  });

  return {
    state,
    dispatch,
  };
};

const CreatePostCtx = createContext<ReturnType<typeof useCreatePost> | null>(
  null
);

export const useCreatePostCtx = () => useContext(CreatePostCtx)!;

export const CreatePostProvider: FC = ({ children }) => {
  return (
    <CreatePostCtx.Provider value={useCreatePost()}>
      {children}
    </CreatePostCtx.Provider>
  );
};
