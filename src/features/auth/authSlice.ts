import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  _id?: string;
  firstname?: string;
  lastname?: string;
  name?: string;
  email?: string;
  username?: string;
  type?: "adult" | "child";
  status?: string;
  isEmailVerified?: boolean;
  isProfileComplete?: boolean;
  [key: string]: any;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  roles: string[];
  permissions: string[];
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  roles: [],
  permissions: [],
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string; roles?: string[]; permissions?: string[] }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.roles = action.payload.roles ?? [];
      state.permissions = action.payload.permissions ?? [];
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.roles = [];
      state.permissions = [];
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
