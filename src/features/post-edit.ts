import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  isEdit: false,
  newHeadline: '',
  postId: '',
};

export const postEditSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    displayEditedPost: (
      state,
      action: PayloadAction<{
        isEdit: boolean;
        newHeadline: string;
        postId: string;
      }>
    ) => {
      state.isEdit = action.payload.isEdit;
      state.newHeadline = action.payload.newHeadline;
      state.postId = action.payload.postId;
    },
  },
});

export const { displayEditedPost } = postEditSlice.actions;
export default postEditSlice.reducer;
