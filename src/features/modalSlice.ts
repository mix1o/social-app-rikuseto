import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
  isOpen: boolean;
  type: ModalType;
  details: { id: string; userId: string };
};

export enum ModalType {
  DEFAULT,
  LOG_IN,
  POST_ACTIONS,
  POST_SHARE,
}

const initialState: InitialState = {
  isOpen: false,
  type: ModalType.DEFAULT,
  details: {
    id: '',
    userId: '',
  },
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal(
      state,
      action: PayloadAction<{
        type: ModalType;
        details?: { id: string; userId: string };
      }>
    ) {
      console.log('dupa');
      const { details, type } = action.payload;
      state.isOpen = true;
      state.type = type;
      if (details)
        state.details = {
          id: details.id,
          userId: details.userId,
        };
    },
    closeModal(state) {
      state.isOpen = false;
      state.type = ModalType.DEFAULT;
    },
  },
});

export default modalSlice.reducer;
export const { openModal, closeModal } = modalSlice.actions;
