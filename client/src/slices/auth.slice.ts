import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getAccessToken } from 'src/utils/auth';

interface AuthState {
  isAuth: boolean;
}

const initialState: AuthState = {
  isAuth: !!getAccessToken(),
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
  },
});
export const { setIsAuth } = authSlice.actions;

export default authSlice.reducer;
