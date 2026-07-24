import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { api } from './api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add the generated reducer from the central API slice
    [api.reducerPath]: api.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
