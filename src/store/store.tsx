import { createStore } from 'react-sweet-state';

const initialState = {
  isOpenCommentComponent: false,
};

const actions = {
  isOpenComment:
    (arg: boolean) =>
    ({ getState, setState }: any) => {
      const { isOpenCommentComponent } = getState();
      setState({
        isOpenCommentComponent: arg,
      });
    },
};

const Store = createStore({ initialState, actions });

export default Store;
