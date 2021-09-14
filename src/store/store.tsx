import { Action, createStore } from 'react-sweet-state';

type State = {
  isOpenCommentComponent: boolean;
  theme: string;
  open: boolean;
};

type Actions = typeof actions;

const initialState: State = {
  isOpenCommentComponent: false,
  theme: 'light',
  open: false,
};

const actions = {
  isOpenComment:
    (arg: boolean): Action<State> =>
    ({ getState, setState }) => {
      setState({
        ...getState,
        isOpenCommentComponent: arg,
      });
    },
  theme:
    (arg: string): Action<State> =>
    ({ getState, setState }) => {
      setState({ ...getState, theme: arg });
    },
  openCreatePost:
    (arg: boolean): Action<State> =>
    ({ getState, setState }) => {
      setState({ open: arg });
    },
};

const Store = createStore<State, Actions>({ initialState, actions });

export default Store;
