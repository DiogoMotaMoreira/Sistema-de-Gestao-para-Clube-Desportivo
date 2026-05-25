import axios from 'axios';
import { Endpoints } from '@/constants/endpoints';
import { useAuthStore } from '@/stores/authStore';

// ── Tipos ──────────────────────────────────────────────

export type SemaforoClinico = 'APTO' | 'CONDICIONADO' | 'INAPTO_LESAO' | 'INAPTO_EMD';

export interface EquipaTreinador {
  id: number;
  nome: string;
  escalao: string;
}

export interface AtletaPlantel {
  id: number;
  nome: string;
  posicao: string;
  idade: number;
  semaforo: SemaforoClinico;
  assiduidade: number | null;
  mediaAvaliacao: number | null;
  minutosEpoca: number | null;
  convocatoriasEpoca: number | null;
}

export type TipoEvento = 'TREINO' | 'JOGO';
export type SubEstadoTreino = 'CHAMADA_PENDENTE' | 'CHAMADA_CURSO' | 'CHAMADA_SUBMETIDA' | 'AVALIACAO_PENDENTE' | 'AVALIACAO_SUBMETIDA';
export type SubEstadoJogo = 'FUTURO_SEM_CONVOCATORIA' | 'FUTURO_RASCUNHO' | 'FUTURO_PUBLICADA' | 'PASSADO_FICHA_PENDENTE' | 'PASSADO_FICHA_SUBMETIDA' | 'PASSADO_EXPIRADO';

export interface EventoTreinador {
  id: number;
  tipo: TipoEvento;
  dataHora: string;
  local: string;
  equipaNome: string;
  
  // Específico de Treino
  subEstadoTreino?: SubEstadoTreino;
  marcados?: number;
  total?: number;
  expiraEmHoras?: number;
  
  // Específico de Jogo
  subEstadoJogo?: SubEstadoJogo;
  adversario?: string;
  quadroCompetitivo?: string;
  casaFora?: 'Casa' | 'Fora' | 'Neutro';
  convocados?: number;
}

export interface RegistoChamada {
  atletaId: number;
  estado: 'PRESENTE' | 'ATRASADO' | 'AUSENTE' | 'POR_MARCAR';
}

export interface RegistoAvaliacao {
  atletaId: number;
  nota: number | null;
}

// ── Axios Instance ────────────────────────────────────

function getAuthHeaders(): Record<string, string> {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

api.interceptors.request.use((config) => {
  const headers = getAuthHeaders();
  Object.assign(config.headers, headers);
  return config;
});

// ── Service ────────────────────────────────────────────

export const treinadorService = {
  /**
   * Obtém as equipas alocadas ao treinador.
   * Utiliza o endpoint real do backend (quando existir) ou mock.
   */
  async getEquipas(): Promise<EquipaTreinador[]> {
    // Mock robusto temporário
    return [
      { id: 1, nome: 'Sub-15 A', escalao: 'Sub-15' },
      { id: 2, nome: 'Sub-17 B', escalao: 'Sub-17' },
    ];
  },

  /**
   * Obtém o plantel de uma equipa com dados consolidados.
   */
  async getPlantel(equipaId: number): Promise<AtletaPlantel[]> {
    // Mock
    return [
      { id: 1, nome: 'João Silva', posicao: 'Avançado', idade: 15, semaforo: 'APTO', assiduidade: 95, mediaAvaliacao: 4.2, minutosEpoca: 1284, convocatoriasEpoca: 18 },
      { id: 2, nome: 'Tomás Costa', posicao: 'Médio', idade: 15, semaforo: 'CONDICIONADO', assiduidade: 80, mediaAvaliacao: 3.5, minutosEpoca: 800, convocatoriasEpoca: 12 },
      { id: 3, nome: 'Ricardo Oliveira', posicao: 'Defesa', idade: 14, semaforo: 'INAPTO_LESAO', assiduidade: 50, mediaAvaliacao: null, minutosEpoca: 300, convocatoriasEpoca: 5 },
      { id: 4, nome: 'Manuel Santos', posicao: 'Guarda-Redes', idade: 15, semaforo: 'INAPTO_EMD', assiduidade: 100, mediaAvaliacao: 4.0, minutosEpoca: 900, convocatoriasEpoca: 10 },
    ];
  },

  /**
   * Obtém os eventos do dia (treinos, jogos urgentes).
   */
  async getEventosHoje(equipaId: number): Promise<EventoTreinador[]> {
    return [
      {
        id: 101,
        tipo: 'TREINO',
        dataHora: '2026-06-15T17:00:00',
        local: 'Campo Sintético 2',
        equipaNome: 'Sub-15 A',
        subEstadoTreino: 'CHAMADA_PENDENTE',
        total: 22
      },
      {
        id: 102,
        tipo: 'JOGO',
        dataHora: '2026-06-17T15:00:00',
        local: 'Estádio Municipal',
        equipaNome: 'Sub-15 A',
        subEstadoJogo: 'FUTURO_SEM_CONVOCATORIA',
        adversario: 'FC Rival',
        quadroCompetitivo: 'Liga Regional',
        casaFora: 'Casa'
      }
    ];
  },

  /**
   * Obtém todos os jogos.
   */
  async getJogos(equipaId: number): Promise<EventoTreinador[]> {
    return [
      {
        id: 102,
        tipo: 'JOGO',
        dataHora: '2026-06-17T15:00:00',
        local: 'Estádio Municipal',
        equipaNome: 'Sub-15 A',
        subEstadoJogo: 'FUTURO_SEM_CONVOCATORIA',
        adversario: 'FC Rival',
        quadroCompetitivo: 'Liga Regional',
        casaFora: 'Casa'
      },
      {
        id: 103,
        tipo: 'JOGO',
        dataHora: '2026-06-10T10:00:00',
        local: 'Campo Sintético 1',
        equipaNome: 'Sub-15 A',
        subEstadoJogo: 'PASSADO_FICHA_PENDENTE',
        adversario: 'GD Vizinho',
        quadroCompetitivo: 'Liga Regional',
        casaFora: 'Fora',
        expiraEmHoras: 4
      }
    ];
  },

  // ── Ações Transacionais (Mocks) ──────────────────────

  async submeterChamada(eventoId: number, registos: RegistoChamada[]): Promise<boolean> {
    console.log(`Chamada submetida para evento ${eventoId}`, registos);
    return true;
  },

  async submeterAvaliacao(eventoId: number, avaliacoes: RegistoAvaliacao[]): Promise<boolean> {
    console.log(`Avaliação submetida para evento ${eventoId}`, avaliacoes);
    return true;
  },

  async guardarConvocatoria(eventoId: number, atletasIds: number[], publicar: boolean, local: string, hora: string): Promise<boolean> {
    console.log(`Convocatória (publicar: ${publicar}) para evento ${eventoId}`, atletasIds, local, hora);
    return true;
  },

  async submeterFichaJogo(eventoId: number, titulares: number[], suplentes: number[], eventosMatch: any[]): Promise<boolean> {
    console.log(`Ficha de Jogo submetida para evento ${eventoId}`, titulares, suplentes, eventosMatch);
    return true;
  }
};
