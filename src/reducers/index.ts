import { configureStore } from '@reduxjs/toolkit';
import profile from './profile';
import system from './system';
import notification from './notification';

export const store = configureStore({
  reducer: {
    profile,
    system,
    notification,
  },
});

export type RootState = ReturnType<typeof store.getState>;
