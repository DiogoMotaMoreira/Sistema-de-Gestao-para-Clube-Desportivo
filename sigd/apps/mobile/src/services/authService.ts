/**
 * AuthService — Serviço de autenticação do SIGD
 *
 * Responsável pela comunicação com o backend de autenticação.
 * Endpoint: POST /api/v1/auth/login
 */

import axios, { AxiosError } from 'axios';
import { Endpoints } from '@/constants/endpoints';

// ── Tipos de Request / Response ────────────────────────

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
  username: string;
  expiresIn: number;
}

// ── Erros tipados ──────────────────────────────────────

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// ── Service ────────────────────────────────────────────

export const authService = {
  /**
   * Autentica o utilizador com username/password.
   * @throws {AuthError} com statusCode 401 (credenciais inválidas) ou 500 (erro servidor).
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        Endpoints.AUTH.LOGIN,
        credentials,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15_000,
        },
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status ?? 0;

        if (status === 401) {
          throw new AuthError('Utilizador ou password incorretos', 401);
        }

        if (status >= 500) {
          throw new AuthError('Erro no servidor. Tenta novamente mais tarde.', status);
        }

        // Outros erros HTTP (ex: 400, 403, 404…)
        throw new AuthError(
          error.response?.data?.message ?? 'Erro de autenticação',
          status,
        );
      }

      // Erro de rede (sem resposta do servidor)
      throw new AuthError('Não foi possível contactar o servidor', 0);
    }
  },
};
