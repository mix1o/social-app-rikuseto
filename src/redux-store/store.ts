import { configureStore } from '@reduxjs/toolkit';
import postEditReducer from '../features/post-edit';
import modalReducer from '../features/modalSlice';

export const store = configureStore({
  reducer: {
    edit: postEditReducer,
    modal: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
