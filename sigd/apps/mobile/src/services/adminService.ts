import { Role } from '../constants/roles';

export interface AdminUser {
  id: string;
  nome: string;
  email: string;
  roles: Role[];
  ultimoLogin: string;
  estado: 'Ativo' | 'Bloqueado';
}

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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const adminService = {
  getUsers: async (): Promise<AdminUser[]> => {
    await delay(400);
    return [
      { id: '1', nome: 'João Silva', email: 'joao.silva@boavistafc.pt', roles: [Role.ADMIN], ultimoLogin: '13 Mai 2026, 09:34', estado: 'Ativo' },
      { id: '2', nome: 'Maria Santos', email: 'maria.santos@boavistafc.pt', roles: [Role.SECRETARIA], ultimoLogin: '13 Mai 2026, 08:15', estado: 'Ativo' },
      { id: '3', nome: 'Carlos Neves', email: 'carlos.neves@boavistafc.pt', roles: [Role.TREINADOR], ultimoLogin: '12 Mai 2026, 17:45', estado: 'Ativo' },
      { id: '4', nome: 'Ana Rita', email: 'ana.rita@boavistafc.pt', roles: [Role.MEDICO, Role.ADMIN], ultimoLogin: 'Nunca', estado: 'Bloqueado' },
      { id: '5', nome: 'Miguel Costa', email: 'miguel.costa@boavistafc.pt', roles: [Role.DIRETOR_TECNICO], ultimoLogin: '10 Mai 2026, 14:20', estado: 'Ativo' },
    ];
  },

  getAuditoria: async (): Promise<AuditoriaEvent[]> => {
    await delay(300);
    return [
      {
        id: 'evt_a1b2', dataHora: '13 Mai 2026, 09:34:12', atorId: '1', atorNome: 'João Silva', atorRole: 'Administrador de Sistema',
        acao: 'LOGIN', modulo: 'Autenticação', ip: '192.168.1.45', entidadeAfetada: 'Sessão',
        detalheJson: JSON.stringify({ event_id: "evt_a1b2", timestamp: "2026-05-13T09:34:12Z", actor_id: "1", action_type: "LOGIN", ip_address: "192.168.1.45", changes: { status: { before: "OFFLINE", after: "ONLINE" } } }, null, 2)
      },
      {
        id: 'evt_c3d4', dataHora: '12 Mai 2026, 16:20:00', atorId: '2', atorNome: 'Maria Santos', atorRole: 'Secretaria',
        acao: 'CREATE_ATLETA', modulo: 'Secretaria', ip: '192.168.1.50', entidadeAfetada: 'Atleta (Diogo Marques)',
        detalheJson: JSON.stringify({ event_id: "evt_c3d4", timestamp: "2026-05-12T16:20:00Z", actor_id: "2", action_type: "CREATE_ATLETA", entity_type: "ATLETA", entity_id: "20", ip_address: "192.168.1.50" }, null, 2)
      },
      {
        id: 'evt_e5f6', dataHora: '12 Mai 2026, 14:15:33', atorId: '1', atorNome: 'João Silva', atorRole: 'Administrador de Sistema',
        acao: 'BLOQUEAR_ACESSO', modulo: 'Gestão de Acessos', ip: '192.168.1.45', entidadeAfetada: 'Conta (Ana Rita)',
        detalheJson: JSON.stringify({ event_id: "evt_e5f6", timestamp: "2026-05-12T14:15:33Z", actor_id: "1", action_type: "BLOQUEAR_ACESSO", entity_type: "USER", entity_id: "4", ip_address: "192.168.1.45" }, null, 2)
      }
    ];
  },

  getNotificacoesFalhadas: async (): Promise<NotificacaoFalhada[]> => {
    await delay(300);
    return [
      { id: 'not_1', tipo: 'Convocatória Publicada', modulo: 'Direção Técnica', destinatarioNome: 'Rui Fernandes', destinatarioEmail: 'rui.f@erro.com', tentativas: 3, dataPrimeiraTentativa: '12 Mai 2026, 10:00', ultimoErro: '550 — Mailbox not found', estado: 'Falha Permanente' },
      { id: 'not_2', tipo: 'Alerta EMD', modulo: 'Secretaria', destinatarioNome: 'Filipe Silva', destinatarioEmail: 'filipe.silva@boavistafc.pt', tentativas: 1, dataPrimeiraTentativa: '13 Mai 2026, 09:00', ultimoErro: '421 — Service not available', estado: 'Reenvio em Curso' },
    ];
  },

  getLocaisTreino: async (): Promise<LocalTreino[]> => {
    await delay(200);
    return [
      { id: '1', nome: 'Campo Principal João Cardoso', tipo: 'Campo de Futebol', capacidade: 200, estado: 'Ativo' },
      { id: '2', nome: 'Campo Sintético 1', tipo: 'Campo de Futebol', estado: 'Ativo' },
      { id: '3', nome: 'Ginásio Alta Performance', tipo: 'Ginásio', capacidade: 40, estado: 'Ativo' },
      { id: '4', nome: 'Piscina Municipal', tipo: 'Piscina', estado: 'Inativo' },
    ];
  }
};
