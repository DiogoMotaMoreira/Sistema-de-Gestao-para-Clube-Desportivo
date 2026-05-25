import axios from 'axios';
import { Endpoints } from '@/constants/endpoints';
import { useAuthStore } from '@/stores/authStore';

// ── Tipagens ────────────────────────────────────────────

export interface Dependente {
  id: number;
  nome: string;
  escalao: string;
  equipa: string;
  elegibilidade: 'APTO' | 'BLOQUEADO' | 'VINCULO_ENCERRADO';
  idade: number;
}

export interface AlertaPortal {
  id: number;
  tipo: 'JUSTIFICACAO_PENDENTE' | 'EMD_EXPIRA' | 'DOCUMENTO_REJEITADO' | 'PROXIMO_TREINO' | 'PROXIMO_JOGO';
  titulo: string;
  subtitulo: string;
  urgencia?: 'CRITICA' | 'ALTA' | 'NORMAL';
  dataAlvo?: string; // Para countdown
  extraData?: any; // Informações específicas dependendo do tipo (ex: id da sessão)
}

export interface NotificacaoPortal {
  id: number;
  tipo: 'CONVOCATORIA' | 'ALERTA_EMD' | 'DOC_APROVADO' | 'DOC_REJEITADO' | 'JUSTIFICACAO_ACEITE';
  texto: string;
  dataHora: string;
  lida: boolean;
}

export interface EventoPortal {
  id: number;
  tipo: 'TREINO' | 'JOGO';
  dataHora: string;
  instalacao: string;
  // Específico de Treino
  estadoPresenca?: 'PRESENTE' | 'AUSENTE_NAO_JUSTIFICADO' | 'AUSENTE_JUSTIFICADO_PENDENTE' | 'AUSENTE_JUSTIFICADO_ACEITE' | 'AUSENTE_EXPIRADO';
  tempoParaJustificarMs?: number; // Se > 0 mostra countdown
  // Específico de Jogo
  adversario?: string;
  quadro?: string;
  condicao?: 'CASA' | 'FORA' | 'NEUTRO';
  horaConcentracao?: string;
  localConcentracao?: string;
  isConvocado?: boolean;
}

export interface DocumentoPortal {
  id: number;
  tipo: string;
  dataSubmissao: string;
  estado: 'EM_ANALISE' | 'APROVADO' | 'REJEITADO' | 'EM_FALTA';
  dataValidade?: string;
  motivoRejeicao?: string;
  ficheiroNome?: string;
  ficheiroTamanho?: string;
}

export interface ObrigacaoFinanceira {
  id: number;
  nome: string;
  entidade: string;
  valor: number;
  dataVencimento: string;
  estado: 'PAGO' | 'PENDENTE' | 'VENCIDO';
  dataPagamento?: string;
}

export interface ResumoFinanceiro {
  valorEmDivida: number;
  valorPagoEsteMes: number;
  iban: string;
  refSocio: string;
}

export interface PerfilEE {
  eeId: number;
  nome: string;
  email: string;
  telemovel: string | null;
  dependentes: Dependente[];
}

export interface SituacaoFinanceira {
  totalDivida: number;
  totalPago: number;
  obrigacoes: ObrigacaoFinanceira[];
}

// ── Cliente HTTP ────────────────────────────────────────

function getAuthHeaders(): Record<string, string> {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

api.interceptors.request.use((config) => {
  const headers = getAuthHeaders();
  Object.assign(config.headers, headers);
  return config;
});

// ── Mocks Base ──────────────────────────────────────────

const mockDependentes: Dependente[] = [
  { id: 101, nome: 'Tomás Ribeiro', escalao: 'Sub-15', equipa: 'Sub-15 A', elegibilidade: 'APTO', idade: 14 },
  { id: 102, nome: 'João Ribeiro', escalao: 'Sub-13', equipa: 'Sub-13 B', elegibilidade: 'BLOQUEADO', idade: 12 },
];

const mockNotificacoes: NotificacaoPortal[] = [
  { id: 1, tipo: 'CONVOCATORIA', texto: 'Tomás Ribeiro foi convocado para o jogo vs FC Rival.', dataHora: new Date().toISOString(), lida: false },
  { id: 2, tipo: 'DOC_APROVADO', texto: 'O documento Exame Médico-Desportivo de Tomás Ribeiro foi aprovado.', dataHora: new Date(Date.now() - 86400000).toISOString(), lida: true },
];

const mockEventos: EventoPortal[] = [
  { id: 1, tipo: 'TREINO', dataHora: new Date(Date.now() + 86400000).toISOString(), instalacao: 'Campo 1' },
  { id: 2, tipo: 'TREINO', dataHora: new Date(Date.now() - 10000000).toISOString(), instalacao: 'Campo 2', estadoPresenca: 'AUSENTE_NAO_JUSTIFICADO', tempoParaJustificarMs: 14000000 },
  { id: 3, tipo: 'JOGO', dataHora: new Date(Date.now() + 259200000).toISOString(), instalacao: 'Estádio Municipal', adversario: 'FC Rival', quadro: 'Campeonato Distrital', condicao: 'CASA', horaConcentracao: '14:00', localConcentracao: 'Balneário 1', isConvocado: true },
];

const mockDocumentos: DocumentoPortal[] = [
  { id: 1, tipo: 'Exame Médico-Desportivo', dataSubmissao: '2026-05-10T10:00:00Z', estado: 'APROVADO', dataValidade: '2027-05-10T00:00:00Z' },
  { id: 2, tipo: 'Bilhete de Identidade', dataSubmissao: '2026-05-20T10:00:00Z', estado: 'EM_ANALISE' },
  { id: 3, tipo: 'Outro Documento Civil', dataSubmissao: '2026-05-01T10:00:00Z', estado: 'REJEITADO', motivoRejeicao: 'Documento ilegível — fotografia desfocada' },
];

const mockObrigacoes: ObrigacaoFinanceira[] = [
  { id: 1, nome: 'Mensalidade Maio 2026', entidade: 'SAD/Formação', valor: 35.0, dataVencimento: '2026-05-08T00:00:00Z', estado: 'VENCIDO' },
  { id: 2, nome: 'Mensalidade Junho 2026', entidade: 'SAD/Formação', valor: 35.0, dataVencimento: '2026-06-08T00:00:00Z', estado: 'PENDENTE' },
  { id: 3, nome: 'Mensalidade Abril 2026', entidade: 'SAD/Formação', valor: 35.0, dataVencimento: '2026-04-08T00:00:00Z', estado: 'PAGO', dataPagamento: '2026-04-05T10:00:00Z' },
];

// ── Serviço Exportado ───────────────────────────────────

export const portalService = {
  getDependentes: async (): Promise<Dependente[]> => {
    try {
      const perfil = await portalService.getPerfilEE();
      return perfil.dependentes;
    } catch (e) {
      return mockDependentes;
    }
  },
  
  getNotificacoes: async (): Promise<NotificacaoPortal[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockNotificacoes), 200));
  },

  marcarNotificacoesComoLidas: async (): Promise<void> => {
    return new Promise(resolve => setTimeout(() => resolve(), 200));
  },

  getAlertas: async (dependenteId: number): Promise<AlertaPortal[]> => {
    return new Promise(resolve => setTimeout(() => resolve([]), 400));
  },

  getEventos: async (dependenteId: number, passados: boolean): Promise<EventoPortal[]> => {
    return new Promise(resolve => setTimeout(() => {
      const now = new Date();
      if (passados) {
        resolve(mockEventos.filter(e => new Date(e.dataHora) < now));
      } else {
        resolve(mockEventos.filter(e => new Date(e.dataHora) >= now));
      }
    }, 300));
  },

  submeterJustificacao: async (eventoId: number, motivo: string): Promise<boolean> => {
    return new Promise(resolve => setTimeout(() => resolve(true), 600));
  },

  getDocumentos: async (dependenteId: number): Promise<DocumentoPortal[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockDocumentos), 300));
  },

  submeterDocumento: async (dependenteId: number, tipo: string): Promise<boolean> => {
    return new Promise(resolve => setTimeout(() => resolve(true), 800));
  },

  getResumoFinanceiro: async (): Promise<ResumoFinanceiro> => {
    return new Promise(resolve => setTimeout(() => resolve({
      valorEmDivida: 35.0,
      valorPagoEsteMes: 0.0,
      iban: 'PT50 0000 1111 2222 3333 4444 5',
      refSocio: '012345678'
    }), 200));
  },

  getPerfilEE: async (): Promise<PerfilEE> => {
    const { data } = await api.get<PerfilEE>('/portal/me');
    return data;
  },

  getSituacaoFinanceira: async (): Promise<SituacaoFinanceira> => {
    const { data } = await api.get<any>('/portal/situacao-financeira');
    return {
      totalDivida: data.totalDivida,
      totalPago: data.totalPago,
      obrigacoes: (data.obrigacoes || []).map((ob: any) => ({
        id: ob.id,
        nome: ob.tipo || 'Obrigação',
        entidade: ob.entidadeJuridica || 'SAD',
        valor: ob.valor,
        dataVencimento: ob.dataVencimento,
        estado: ob.estado === 'EM_ATRASO' ? 'VENCIDO' : ob.estado,
        dataPagamento: ob.dataPagamento || undefined,
      }))
    };
  },

  getObrigacoes: async (dependenteId: number): Promise<ObrigacaoFinanceira[]> => {
    const { data } = await api.get<any[]>('/portal/obrigacoes');
    return data
      .filter((ob: any) => ob.atletaId === dependenteId)
      .map((ob: any) => ({
        id: ob.id,
        nome: ob.tipo || 'Obrigação',
        entidade: ob.entidadeJuridica || 'SAD',
        valor: ob.valor,
        dataVencimento: ob.dataVencimento,
        estado: ob.estado === 'EM_ATRASO' ? 'VENCIDO' : (ob.estado as 'PAGO' | 'PENDENTE' | 'VENCIDO'),
        dataPagamento: ob.dataPagamento || undefined,
      }));
  }
};
