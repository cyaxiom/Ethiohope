import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  clearAuthStorage,
  isRememberedSession,
  loadAuthFromStorage,
  patchAuthStorage,
  persistAuth,
} from './authStorage';

export interface User {
  id: string;
  _id?: string;
  firstname?: string;
  lastname?: string;
  name?: string;
  email?: string;
  username?: string;
  type?: 'adult' | 'child';
  status?: string;
  isEmailVerified?: boolean;
  isProfileComplete?: boolean;
  [key: string]: any;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  roles: string[];
  activeRole: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  loading: boolean;
  rememberMe: boolean;
}

const stored = loadAuthFromStorage();

const initialState: AuthState = {
  user: stored.user,
  token: stored.token,
  roles: stored.roles,
  activeRole: stored.activeRole,
  permissions: stored.permissions,
  isAuthenticated: !!stored.token,
  loading: false,
  rememberMe: stored.rememberMe,
};

const determineActiveRole = (roles: string[], preferred?: string | null): string | null => {
  const meaningfulRoles = roles.filter((r) => r !== 'user');

  if (
    preferred &&
    roles.includes(preferred) &&
    !(preferred === 'user' && meaningfulRoles.length > 0)
  ) {
    return preferred;
  }
  return meaningfulRoles.length > 0 ? meaningfulRoles[0] : roles.length > 0 ? roles[0] : null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        roles?: string[];
        permissions?: string[];
        /** When omitted, keep the current remember preference (e.g. token refresh). */
        rememberMe?: boolean;
      }>
    ) => {
      const { user, token, roles, permissions } = action.payload;
      const rememberMe =
        typeof action.payload.rememberMe === 'boolean'
          ? action.payload.rememberMe
          : state.rememberMe ?? isRememberedSession();

      state.user = user;
      state.token = token;
      state.roles = roles ?? [];
      state.activeRole = determineActiveRole(state.roles, state.activeRole);
      state.permissions = permissions ?? [];
      state.isAuthenticated = true;
      state.rememberMe = rememberMe;

      persistAuth(
        {
          user,
          token,
          roles: state.roles,
          activeRole: state.activeRole,
          permissions: state.permissions,
        },
        rememberMe
      );
    },
    updateUser: (
      state,
      action: PayloadAction<{ user?: Partial<User>; roles?: string[] }>
    ) => {
      const { user, roles } = action.payload;
      if (user && state.user) {
        state.user = { ...state.user, ...user };
        patchAuthStorage({ user: JSON.stringify(state.user) });
      }
      if (roles) {
        state.roles = roles;
        const newActiveRole = determineActiveRole(roles, state.activeRole);
        state.activeRole = newActiveRole;
        patchAuthStorage({
          roles: JSON.stringify(roles),
          activeRole: newActiveRole,
        });
      }
    },
    setActiveRole: (state, action: PayloadAction<string>) => {
      if (state.roles.includes(action.payload)) {
        state.activeRole = action.payload;
        patchAuthStorage({ activeRole: action.payload });
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.roles = [];
      state.activeRole = null;
      state.permissions = [];
      state.isAuthenticated = false;
      state.rememberMe = true;
      clearAuthStorage();
    },
  },
});

export const { setCredentials, updateUser, setActiveRole, logout } = authSlice.actions;

export default authSlice.reducer;
