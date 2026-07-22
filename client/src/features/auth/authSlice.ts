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
  activeRole: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  loading: boolean;
}

const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
const token = localStorage.getItem('token') || null;
const roles = localStorage.getItem('roles') ? JSON.parse(localStorage.getItem('roles')!) : [];
const activeRole = localStorage.getItem('activeRole') || null;
const permissions = localStorage.getItem('permissions') ? JSON.parse(localStorage.getItem('permissions')!) : [];

const initialState: AuthState = {
  user,
  token,
  roles,
  activeRole,
  permissions,
  isAuthenticated: !!token,
  loading: false,
};

const determineActiveRole = (roles: string[]): string | null => {
  const storedActiveRole = localStorage.getItem('activeRole');
  const meaningfulRoles = roles.filter(r => r !== 'user');
  
  if (storedActiveRole && roles.includes(storedActiveRole) && !(storedActiveRole === 'user' && meaningfulRoles.length > 0)) {
    return storedActiveRole;
  }
  return meaningfulRoles.length > 0 ? meaningfulRoles[0] : (roles.length > 0 ? roles[0] : null);
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string; roles?: string[]; permissions?: string[] }>
    ) => {
      const { user, token, roles, permissions } = action.payload;
      state.user = user;
      state.token = token;
      state.roles = roles ?? [];
      state.activeRole = determineActiveRole(state.roles);
      
      state.permissions = permissions ?? [];
      state.isAuthenticated = true;

      // Persist to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('roles', JSON.stringify(roles ?? []));
      if (state.activeRole) {
        localStorage.setItem('activeRole', state.activeRole);
      } else {
        localStorage.removeItem('activeRole');
      }
      localStorage.setItem('permissions', JSON.stringify(permissions ?? []));
    },
    updateUser: (
      state,
      action: PayloadAction<{ user?: Partial<User>; roles?: string[] }>
    ) => {
      const { user, roles } = action.payload;
      if (user && state.user) {
        state.user = { ...state.user, ...user };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
      if (roles) {
        state.roles = roles;
        localStorage.setItem('roles', JSON.stringify(roles));
        
        // Re-evaluate active role when roles are updated (e.g. during child registration)
        const newActiveRole = determineActiveRole(roles);
        if (newActiveRole !== state.activeRole) {
          state.activeRole = newActiveRole;
          if (newActiveRole) localStorage.setItem('activeRole', newActiveRole);
          else localStorage.removeItem('activeRole');
        }
      }
    },
    setActiveRole: (state, action: PayloadAction<string>) => {
      if (state.roles.includes(action.payload)) {
        state.activeRole = action.payload;
        localStorage.setItem('activeRole', action.payload);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.roles = [];
      state.activeRole = null;
      state.permissions = [];
      state.isAuthenticated = false;

      // Clear from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('roles');
      localStorage.removeItem('activeRole');
      localStorage.removeItem('permissions');
    },
  },
});

export const { setCredentials, updateUser, setActiveRole, logout } = authSlice.actions;

export default authSlice.reducer;
