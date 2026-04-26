/**
 * gapp.so SDK Type Definitions
 */

export interface GappUser {
  id: string | null;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
}

export interface GappState {
  set: (key: string, value: any) => Promise<void>;
  get: (key: string) => Promise<any>;
  delete: (key: string) => Promise<void>;
  list: () => Promise<string[]>;
  user: {
    set: (key: string, value: any) => Promise<void>;
    get: (key: string) => Promise<any>;
    delete: (key: string) => Promise<void>;
    list: () => Promise<string[]>;
  };
  session: {
    set: (key: string, value: any) => Promise<void>;
    get: (key: string) => Promise<any>;
    delete: (key: string) => Promise<void>;
    list: () => Promise<string[]>;
  };
  global: {
    set: (key: string, value: any) => Promise<void>;
    get: (key: string) => Promise<any>;
    delete: (key: string) => Promise<void>;
    list: () => Promise<string[]>;
  };
  isAuthenticated: () => boolean;
  getCurrentUserId: () => string | null;
  migrateSessionToUser: () => Promise<void>;
}

export interface GappSDK {
  state: GappState;
  user: {
    isAuthenticated: () => boolean;
    getId: () => string | null;
    getName: () => string | null;
    getUsername: () => string | null;
    getAvatarUrl: () => string | null;
    getProfile: () => GappUser | null;
  };
}

declare global {
  interface Window {
    gapp: GappSDK;
  }
  const gapp: GappSDK;
}
