/**
 * Endpoints da API — SIGD
 *
 * NUNCA hardcodar URLs nos componentes ou services.
 * Importar SEMPRE deste ficheiro.
 */

const API_BASE = 'http://localhost:8080/api/v1';

export const Endpoints = {
  // ── Auth ──────────────────────────────────────────────
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    REFRESH: `${API_BASE}/auth/refresh`,
    LOGOUT: `${API_BASE}/auth/logout`,
  },

  // ── Domínios (placeholders — expandir à medida) ──────
  CORE: `${API_BASE}/core`,
  CLINICA: `${API_BASE}/clinica`,
  RELVADO: `${API_BASE}/relvado`,
  DESPORTO: `${API_BASE}/desporto`,
  TESOURARIA: `${API_BASE}/tesouraria`,
  PORTAL: `${API_BASE}/portal`,
  AUDIT: `${API_BASE}/audit`,
} as const;
