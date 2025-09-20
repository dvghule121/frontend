import { configureStore } from '@reduxjs/toolkit';
import profileFormReducer from './slices/profileFormSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    profileForm: profileFormReducer,
    auth: authReducer,
  },
});

export default store;