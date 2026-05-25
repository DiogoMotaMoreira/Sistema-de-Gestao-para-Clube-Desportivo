/**
 * Auth Store — Zustand (uma store por domínio)
 *
 * Gere o estado de autenticação JWT:
 * - Tokens (access + refresh) persistidos via expo-secure-store
 * - Dados do utilizador decodificados do JWT payload
 * - Role ativo (para multi-role)
 * - Hidratação ao arrancar a app
 * - login(username, password) — chama o authService real
 * - logout() — limpa tokens e estado
 */

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import { Role, resolveActiveRole } from '../constants/roles';
import { authService, AuthError } from '../services/authService';

// ── Tipos ──────────────────────────────────────────────

interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
}

/** Payload esperado dentro do JWT (claims do backend Spring) */
interface JwtPayload {
  sub: string;                    // username
  roles?: string[];               // ex: ["ROLE_MEDICO"]
  role?: string;                  // fallback para um único role
  userId?: number;
  name?: string;
  email?: string;
  exp?: number;
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
  login: (username: string, password: string) => Promise<void>;
  setAuth: (token: string, refreshToken: string, user: User) => void;
  setActiveRole: (role: Role) => void;
  logout: () => Promise<void>;
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

// ── Helpers JWT ────────────────────────────────────────

/**
 * Extrai os roles do JWT payload.
 * O backend pode enviar "roles" (array) ou "role" (string),
 * ou o role pode vir na response diretamente. Cobre todos os cenários.
 */
function extractRolesFromJwt(token: string, responseRole?: string): Role[] {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // 1. Tenta array "roles" no JWT
    if (decoded.roles && decoded.roles.length > 0) {
      return decoded.roles as Role[];
    }

    // 2. Tenta campo singular "role" no JWT
    if (decoded.role) {
      return [decoded.role as Role];
    }
  } catch {
    // JWT decode falhou — usar fallback
  }

  // 3. Fallback: usar o role devolvido na response da API
  if (responseRole) {
    return [responseRole as Role];
  }

  return [];
}

// ── Store ──────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  user: null,
  activeRole: null,
  isHydrated: false,
  isAuthenticated: false,

  login: async (username, password) => {
    // Chama o authService real — erros propagam para o caller
    const response = await authService.login({ username, password });

    const roles = extractRolesFromJwt(response.accessToken, response.role);

    const user: User = {
      id: 0,
      name: response.username,
      email: '',
      roles,
    };

    const activeRole = resolveActiveRole(roles);

    // Persistir tokens e user
    await Promise.all([
      persistToken(TOKEN_KEY, response.accessToken),
      persistToken(REFRESH_KEY, response.refreshToken),
      persistToken(USER_KEY, JSON.stringify(user)),
    ]);

    set({
      token: response.accessToken,
      refreshToken: response.refreshToken,
      user,
      activeRole,
      isAuthenticated: true,
    });
  },

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

  logout: async () => {
    await Promise.all([
      deletePersistedToken(TOKEN_KEY),
      deletePersistedToken(REFRESH_KEY),
      deletePersistedToken(USER_KEY),
    ]);

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
        let isExpired = false;
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          if (decoded.exp && decoded.exp < Date.now() / 1000) {
            isExpired = true;
          }
        } catch {
          isExpired = true;
        }

        if (isExpired) {
          await Promise.all([
            deletePersistedToken(TOKEN_KEY),
            deletePersistedToken(REFRESH_KEY),
            deletePersistedToken(USER_KEY),
          ]);
          set({
            token: null,
            refreshToken: null,
            user: null,
            activeRole: null,
            isAuthenticated: false,
            isHydrated: true,
          });
          return;
        }

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

// Re-exportar o tipo AuthError para uso no LoginScreen
export { AuthError } from '../services/authService';
