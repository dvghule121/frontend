import { configureStore } from '@reduxjs/toolkit';
import profileFormReducer from './slices/profileFormSlice';

export const store = configureStore({
  reducer: {
    profileForm: profileFormReducer,
  },
});

export default store;