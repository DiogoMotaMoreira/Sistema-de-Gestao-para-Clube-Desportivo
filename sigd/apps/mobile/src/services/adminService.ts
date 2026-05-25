import axios from 'axios';
import { Endpoints } from '@/constants/endpoints';
import { useAuthStore } from '@/stores/authStore';
import { Role } from '../constants/roles';

// ── Tipos ──────────────────────────────────────────────
export interface AdminUser {
  id: string;
  nome: string;
  email: string;
  roles: Role[];
  ultimoLogin: string;
  estado: 'Ativo' | 'Bloqueado';
}

interface BackendAdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

function mapToAdminUser(b: BackendAdminUser): AdminUser {
  return {
    id: b.id.toString(),
    nome: b.username,
    email: b.email,
    roles: [b.role as Role],
    ultimoLogin: b.atualizadoEm ? new Date(b.atualizadoEm).toLocaleString() : 'Nunca',
    estado: b.ativo ? 'Ativo' : 'Bloqueado',
  };
}

export interface AdminUserRequest {
  username: string;
  email: string;
  role: string;
  passwordHash?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

// Para manter compatibilidade com UI atual de auditoria
export interface AuditoriaEvent {
  id: string;
  dataHora: string;
  atorId: string;
  atorNome: string;
  atorRole: string;
  acao: string;
  modulo: string;
  ip: string;
  entidadeAfetada: string;
  detalheJson: string;
}

export interface NotificacaoFalhada {
  id: string;
  tipo: string;
  modulo: string;
  destinatarioNome: string;
  destinatarioEmail: string;
  tentativas: number;
  dataPrimeiraTentativa: string;
  ultimoErro: string;
  estado: 'Falha Permanente' | 'Reenvio em Curso' | 'Arquivado';
}

export interface LocalTreino {
  id: string;
  nome: string;
  tipo: 'Campo de Futebol' | 'Ginásio' | 'Piscina' | 'Sala de Reuniões' | 'Outro';
  capacidade?: number;
  estado: 'Ativo' | 'Inativo';
}

// ── Axios Instance ────────────────────────────────────
function getAuthHeaders(): Record<string, string> {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1/admin',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

api.interceptors.request.use((config) => {
  const headers = getAuthHeaders();
  Object.assign(config.headers, headers);
  return config;
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ── Service ────────────────────────────────────────────
export const adminService = {
  getUsers: async (pesquisa?: string, page = 0, size = 10): Promise<PageResponse<AdminUser>> => {
    const params: Record<string, string | number> = { page, size };
    if (pesquisa) params.pesquisa = pesquisa;
    const { data } = await api.get<PageResponse<BackendAdminUser>>('/utilizadores', { params });
    return {
      ...data,
      content: data.content.map(mapToAdminUser)
    };
  },

  createUser: async (payload: AdminUserRequest): Promise<AdminUser> => {
    const { data } = await api.post<BackendAdminUser>('/utilizadores', payload);
    return mapToAdminUser(data);
  },

  bloquearUser: async (id: string): Promise<AdminUser> => {
    const { data } = await api.put<BackendAdminUser>(`/utilizadores/${id}/bloquear`);
    return mapToAdminUser(data);
  },

  reativarUser: async (id: string): Promise<AdminUser> => {
    const { data } = await api.put<BackendAdminUser>(`/utilizadores/${id}/reativar`);
    return mapToAdminUser(data);
  },

  getAuditLog: async (page = 0, size = 20): Promise<PageResponse<AuditoriaEvent>> => {
    const params: Record<string, string | number> = { page, size };
    const { data } = await api.get<PageResponse<AuditoriaEvent>>('/audit-log', { params });
    return data;
  },

  getAuditoria: async (): Promise<AuditoriaEvent[]> => {
    await delay(300);
    return [];
  },

  getNotificacoesFalhadas: async (): Promise<NotificacaoFalhada[]> => {
    await delay(300);
    return [];
  },

  getLocaisTreino: async (): Promise<LocalTreino[]> => {
    await delay(200);
    return [];
  }
};
