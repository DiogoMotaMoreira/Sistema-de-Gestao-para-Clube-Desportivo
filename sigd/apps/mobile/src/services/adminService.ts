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

export interface EpocaDesportiva {
  id: number;
  nome: string;
  dataInicio: string;
  dataFim: string;
  estado: string;
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

export interface AuditLogEntry {
  id: number;
  ator: string;
  acao: string;
  entidade: string;
  entidadeId: string;
  detalhes: string;
  timestamp: string;
  ipAddress: string;
}

interface BackendAuditLog {
  id: number;
  timestamp: string;
  usuarioId?: number;
  usuarioRole?: string;
  acao: string;
  entidade: string;
  entidadeId?: number;
  payloadAntes?: string;
  payloadDepois?: string;
}

function mapToAuditLogEntry(b: BackendAuditLog): AuditLogEntry {
  const roleName = b.usuarioRole ? b.usuarioRole.replace('ROLE_', '') : 'SISTEMA';
  const ator = b.usuarioId ? `${roleName} (ID: ${b.usuarioId})` : roleName;
  const timestamp = b.timestamp ? new Date(b.timestamp).toLocaleString() : '';
  return {
    id: b.id,
    ator,
    acao: b.acao,
    entidade: b.entidade,
    entidadeId: b.entidadeId ? b.entidadeId.toString() : '',
    detalhes: b.payloadDepois || '',
    timestamp,
    ipAddress: '127.0.0.1',
  };
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

  createUser: async (req: AdminUserRequest): Promise<AdminUser> => {
    const token = useAuthStore.getState().token;
    const { data } = await axios.post<BackendAdminUser>(`http://localhost:8080/api/v1/admin/utilizadores`, req, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return mapToAdminUser(data);
  },

  getEpocas: async (): Promise<EpocaDesportiva[]> => {
    const token = useAuthStore.getState().token;
    const { data } = await axios.get<EpocaDesportiva[]>(`http://localhost:8080/api/v1/admin/epocas`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    
    // Deduplicar épocas pelo nome para remover dados de mock ou seeds duplicados
    const seen = new Set();
    return data.filter(e => {
       if (seen.has(e.nome)) return false;
       seen.add(e.nome);
       return true;
    });
  },

  criarEpoca: async (nome: string, dataInicio: string, dataFim: string): Promise<EpocaDesportiva> => {
    const token = useAuthStore.getState().token;
    const { data } = await axios.post<EpocaDesportiva>(`http://localhost:8080/api/v1/admin/epocas`, { nome, dataInicio, dataFim }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return data;
  },

  ativarEpoca: async (id: number): Promise<EpocaDesportiva> => {
    const token = useAuthStore.getState().token;
    const { data } = await axios.put<EpocaDesportiva>(`http://localhost:8080/api/v1/admin/epocas/${id}/ativar`, {}, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return data;
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

  getAuditoria: async (
    page = 0,
    size = 20,
    modulo?: string,
    tipo?: string
  ): Promise<PageResponse<AuditLogEntry>> => {
    const params: Record<string, any> = { page, size };
    if (modulo) params.modulo = modulo;
    if (tipo) params.tipo = tipo;
    const { data } = await api.get<PageResponse<BackendAuditLog>>('/audit-log', { params });
    return {
      ...data,
      content: data.content.map(mapToAuditLogEntry),
    };
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
