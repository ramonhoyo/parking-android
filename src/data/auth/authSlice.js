import { createSlice } from '@reduxjs/toolkit';

const defaultState = {
  authId: '',
  isLoading: true,
};

const slice = createSlice({
  name: 'auth',
  initialState: defaultState,
  reducers: {
    logout: state => {
      state.authId = '';
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setAuthId: (state, action) => {
      state.authId = action.payload;
    },
  },
});

export const { setAuthId, setIsLoading, logout } = slice.actions;
export default slice.reducer;
