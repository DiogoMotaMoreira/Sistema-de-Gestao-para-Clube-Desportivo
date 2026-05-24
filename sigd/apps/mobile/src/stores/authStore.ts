/**
 * Auth Store — Zustand (uma store por domínio)
 *
 * Gere o estado de autenticação JWT:
 * - Tokens (access + refresh) persistidos via expo-secure-store
 * - Dados do utilizador decodificados do JWT payload
 * - Role ativo (para multi-role)
 * - Hidratação ao arrancar a app
 */

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { Role, resolveActiveRole } from '../constants/roles';

// ── Tipos ──────────────────────────────────────────────

interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  activeRole: Role | null;
  isHydrated: boolean;

  // Computed
  isAuthenticated: boolean;

  // Actions
  setAuth: (token: string, refreshToken: string, user: User) => void;
  setActiveRole: (role: Role) => void;
  logout: () => void;
  hydrate: () => Promise<void>;
}

// ── Helpers de persistência (SecureStore não funciona na web) ─

const TOKEN_KEY = 'sigd_access_token';
const REFRESH_KEY = 'sigd_refresh_token';
const USER_KEY = 'sigd_user';

async function persistToken(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function getPersistedToken(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function deletePersistedToken(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

// ── Store ──────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  user: null,
  activeRole: null,
  isHydrated: false,
  isAuthenticated: false,

  setAuth: (token, refreshToken, user) => {
    const activeRole = resolveActiveRole(user.roles);

    // Persistir de forma assíncrona (fire-and-forget)
    void persistToken(TOKEN_KEY, token);
    void persistToken(REFRESH_KEY, refreshToken);
    void persistToken(USER_KEY, JSON.stringify(user));

    set({
      token,
      refreshToken,
      user,
      activeRole,
      isAuthenticated: true,
    });
  },

  setActiveRole: (role) => {
    set({ activeRole: role });
  },

  logout: () => {
    void deletePersistedToken(TOKEN_KEY);
    void deletePersistedToken(REFRESH_KEY);
    void deletePersistedToken(USER_KEY);

    set({
      token: null,
      refreshToken: null,
      user: null,
      activeRole: null,
      isAuthenticated: false,
    });
  },

  hydrate: async () => {
    try {
      const [token, refreshToken, userJson] = await Promise.all([
        getPersistedToken(TOKEN_KEY),
        getPersistedToken(REFRESH_KEY),
        getPersistedToken(USER_KEY),
      ]);

      if (token && refreshToken && userJson) {
        const user = JSON.parse(userJson) as User;
        const activeRole = resolveActiveRole(user.roles);

        set({
          token,
          refreshToken,
          user,
          activeRole,
          isAuthenticated: true,
          isHydrated: true,
        });
      } else {
        set({ isHydrated: true });
      }
    } catch {
      // Falha na hidratação — limpar tudo por segurança
      set({ isHydrated: true });
    }
  },
}));
