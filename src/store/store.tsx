import { Action, createStore } from 'react-sweet-state';

type State = {
  isOpenCommentComponent: boolean;
  theme: string;
  open: boolean;
  disabledModal: boolean;
};

type Actions = typeof actions;

const initialState: State = {
  isOpenCommentComponent: false,
  theme: 'light',
  open: false,
  disabledModal: false,
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
  setDisabledModal:
    (arg: boolean): Action<State> =>
    ({ getState, setState }) => {
      setState({
        ...getState,
        disabledModal: arg,
      });
    },
};

const Store = createStore<State, Actions>({ initialState, actions });

export default Store;
