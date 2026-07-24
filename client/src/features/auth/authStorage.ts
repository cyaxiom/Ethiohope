const AUTH_KEYS = ['user', 'token', 'roles', 'activeRole', 'permissions', 'rememberMe'] as const;

export type AuthPersistPayload = {
  user: unknown;
  token: string;
  roles: string[];
  activeRole: string | null;
  permissions: string[];
};

const clearStorage = (storage: Storage) => {
  AUTH_KEYS.forEach((key) => storage.removeItem(key));
};

/** Prefer localStorage (remembered) when both somehow exist. */
export const getActiveAuthStorage = (): Storage => {
  if (localStorage.getItem('token')) return localStorage;
  if (sessionStorage.getItem('token')) return sessionStorage;
  return localStorage;
};

export const isRememberedSession = (): boolean => {
  if (localStorage.getItem('token')) return true;
  if (sessionStorage.getItem('token')) return false;
  return localStorage.getItem('rememberMe') === 'true';
};

export const loadAuthFromStorage = (): {
  user: any | null;
  token: string | null;
  roles: string[];
  activeRole: string | null;
  permissions: string[];
  rememberMe: boolean;
} => {
  const storage = getActiveAuthStorage();
  const token = storage.getItem('token');
  if (!token) {
    return {
      user: null,
      token: null,
      roles: [],
      activeRole: null,
      permissions: [],
      rememberMe: true,
    };
  }

  let user = null;
  try {
    user = storage.getItem('user') ? JSON.parse(storage.getItem('user')!) : null;
  } catch {
    user = null;
  }

  let roles: string[] = [];
  try {
    roles = storage.getItem('roles') ? JSON.parse(storage.getItem('roles')!) : [];
  } catch {
    roles = [];
  }

  let permissions: string[] = [];
  try {
    permissions = storage.getItem('permissions') ? JSON.parse(storage.getItem('permissions')!) : [];
  } catch {
    permissions = [];
  }

  return {
    user,
    token,
    roles,
    activeRole: storage.getItem('activeRole'),
    permissions,
    rememberMe: storage === localStorage,
  };
};

export const persistAuth = (payload: AuthPersistPayload, rememberMe: boolean) => {
  const primary = rememberMe ? localStorage : sessionStorage;
  const secondary = rememberMe ? sessionStorage : localStorage;

  // Avoid duplicate sessions across storages
  clearStorage(secondary);

  primary.setItem('user', JSON.stringify(payload.user));
  primary.setItem('token', payload.token);
  primary.setItem('roles', JSON.stringify(payload.roles));
  primary.setItem('permissions', JSON.stringify(payload.permissions));
  primary.setItem('rememberMe', rememberMe ? 'true' : 'false');

  if (payload.activeRole) {
    primary.setItem('activeRole', payload.activeRole);
  } else {
    primary.removeItem('activeRole');
  }
};

export const patchAuthStorage = (
  patch: Partial<Record<(typeof AUTH_KEYS)[number], string | null>>
) => {
  const storage = getActiveAuthStorage();
  Object.entries(patch).forEach(([key, value]) => {
    if (value == null) storage.removeItem(key);
    else storage.setItem(key, value);
  });
};

export const clearAuthStorage = () => {
  clearStorage(localStorage);
  clearStorage(sessionStorage);
};
