import { Action, createStore } from 'react-sweet-state';

type State = {
  isOpenCommentComponent: boolean;
  theme: string;
};

type Actions = typeof actions;

const initialState: State = {
  isOpenCommentComponent: false,
  theme: 'light',
};

const actions = {
  isOpenComment:
    (arg: boolean): Action<State> =>
    ({ getState, setState }) => {
      const { isOpenCommentComponent } = getState();
      setState({
        ...getState,
        isOpenCommentComponent: arg,
      });
    },
  theme:
    (arg: string): Action<State> =>
    ({ getState, setState }) => {
      const { theme } = getState();
      setState({ ...getState, theme: arg });
    },
};

const Store = createStore<State, Actions>({ initialState, actions });

export default Store;
