import axios from 'axios';
import { Endpoints } from '@/constants/endpoints';

// ── Tipagens ────────────────────────────────────────────

export interface EquipaDT {
  id: number;
  nome: string;
  modalidade: string;
  escalao: string;
  treinadorPrincipal: string | null;
  numAtletas: number;
  inaptos: number;
  bloqueados: number;
  // Parâmetros do escalão
  idadeMin: number | null;
  idadeMax: number | null;
  tetoConvocatoria: number;
  quotaAnual: number;
  mensalidadeBase: number;
  mensalidadeSocio: number;
}

export interface AtletaDT {
  id: number;
  nome: string;
  numero: number | null;
  idade: number;
  escalao: string;
  posicao: string;
  semaforo: string; // 'APTO', 'CONDICIONADO', 'INAPTO_LESAO', 'INAPTO_EMD'
  estadoAdmin: 'VALIDO' | 'DOCUMENTAL_PENDENTE' | 'EMD_CADUCADO' | 'FINANCEIRO_BLOQUEADO';
}

export interface StaffDT {
  id: number;
  nome: string;
  funcao: string;
  isExclusivo: boolean;
  outrasEquipas: string[];
}

export interface QuadroCompetitivo {
  id: number;
  nome: string;
  escalao: string;
  equipas: string[];
  estado: 'AGENDADO' | 'EM_CURSO' | 'ENCERRADO';
}

export interface EventoCalendario {
  id: number;
  tipo: 'TREINO' | 'JOGO' | 'MANUTENCAO';
  titulo: string;
  dataHora: string;
  dataFim?: string;
  instalacao: string;
  quadroCompetitivo?: string;
  // Flags para UI
  fichaFalta?: boolean;
  semConvocatoria?: boolean;
}

export interface KPIStats {
  vitorias: number;
  empates: number;
  derrotas: number;
  golosMarcados: number;
  golosSofridos: number;
  fichasSubmetidas: number;
  fichasTotal: number;
}

export interface Incumprimento {
  id: number;
  jogo: string;
  escalao: string;
  treinador: string;
  dataExpiracao: string;
  estado: 'NAO_LIDO' | 'RECONHECIDO' | 'ARQUIVADO';
}

// ── Cliente HTTP ────────────────────────────────────────

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

api.interceptors.request.use((config) => {
  // Simulador de token e requests mockados
  return config;
});

// ── Mocks Base ──────────────────────────────────────────

const mockEquipas: EquipaDT[] = [
  { id: 1, nome: 'Sub-15 A', modalidade: 'Futebol', escalao: 'Sub-15', treinadorPrincipal: 'João Silva', numAtletas: 18, inaptos: 2, bloqueados: 1, idadeMin: 13, idadeMax: 15, tetoConvocatoria: 18, quotaAnual: 120, mensalidadeBase: 35, mensalidadeSocio: 28 },
  { id: 2, nome: 'Sub-17 B', modalidade: 'Futebol', escalao: 'Sub-17', treinadorPrincipal: null, numAtletas: 0, inaptos: 0, bloqueados: 0, idadeMin: 15, idadeMax: 17, tetoConvocatoria: 20, quotaAnual: 120, mensalidadeBase: 35, mensalidadeSocio: 28 },
  { id: 3, nome: 'Seniores', modalidade: 'Futsal', escalao: 'Seniores', treinadorPrincipal: 'Carlos Mendes', numAtletas: 14, inaptos: 0, bloqueados: 0, idadeMin: null, idadeMax: null, tetoConvocatoria: 14, quotaAnual: 0, mensalidadeBase: 0, mensalidadeSocio: 0 },
];

const mockAtletas: AtletaDT[] = [
  { id: 101, nome: 'Tomás Ribeiro', numero: 10, idade: 14, escalao: 'Sub-15', posicao: 'Médio', semaforo: 'APTO', estadoAdmin: 'VALIDO' },
  { id: 102, nome: 'Miguel Costa', numero: 9, idade: 15, escalao: 'Sub-15', posicao: 'Avançado', semaforo: 'CONDICIONADO', estadoAdmin: 'VALIDO' },
  { id: 103, nome: 'Rui Pedro', numero: null, idade: 13, escalao: 'Sub-15', posicao: 'Defesa', semaforo: 'INAPTO_EMD', estadoAdmin: 'EMD_CADUCADO' },
  { id: 104, nome: 'Tiago Silva', numero: 1, idade: 14, escalao: 'Sub-15', posicao: 'Guarda-Redes', semaforo: 'APTO', estadoAdmin: 'FINANCEIRO_BLOQUEADO' },
];

const mockStaff: StaffDT[] = [
  { id: 1, nome: 'João Silva', funcao: 'Treinador Principal', isExclusivo: true, outrasEquipas: [] },
  { id: 2, nome: 'Marco António', funcao: 'Preparador Físico', isExclusivo: false, outrasEquipas: ['Sub-17 B'] },
];

const mockQuadros: QuadroCompetitivo[] = [
  { id: 1, nome: 'Campeonato Distrital 1ª Divisão', escalao: 'Sub-15', equipas: ['Sub-15 A'], estado: 'EM_CURSO' },
  { id: 2, nome: 'Taça AF Porto', escalao: 'Seniores', equipas: ['Seniores'], estado: 'AGENDADO' },
];

const mockEventos: EventoCalendario[] = [
  { id: 1, tipo: 'TREINO', titulo: 'Treino · Sub-15 A', instalacao: 'Campo Principal', dataHora: '2026-05-15T18:00:00Z', dataFim: '2026-05-15T19:30:00Z' },
  { id: 2, tipo: 'JOGO', titulo: 'Sub-15 A vs FC Porto B', instalacao: 'Campo Principal', dataHora: '2026-05-17T15:00:00Z', quadroCompetitivo: 'Campeonato Distrital', fichaFalta: true, semConvocatoria: false },
  { id: 3, tipo: 'MANUTENCAO', titulo: 'Manutenção Relvado', instalacao: 'Campo B', dataHora: '2026-05-16T08:00:00Z', dataFim: '2026-05-16T12:00:00Z' },
];

const mockIncumprimentos: Incumprimento[] = [
  { id: 1, jogo: 'vs Boavista FC · 03 Mai', escalao: 'Sub-15', treinador: 'João Silva', dataExpiracao: '2026-05-04T12:00:00Z', estado: 'NAO_LIDO' },
  { id: 2, jogo: 'vs Padroense · 26 Abr', escalao: 'Sub-17', treinador: 'Sem Treinador', dataExpiracao: '2026-04-27T12:00:00Z', estado: 'RECONHECIDO' },
];

// ── Serviço Exportado ───────────────────────────────────

export const diretorDesportivoService = {
  // GESTÃO DE PLANTÉIS (ABA 2)
  getEquipas: async (): Promise<EquipaDT[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockEquipas), 400));
  },
  getEquipaDetalhe: async (id: number): Promise<EquipaDT | undefined> => {
    return new Promise(resolve => setTimeout(() => resolve(mockEquipas.find(e => e.id === id)), 200));
  },
  getPlantel: async (equipaId: number): Promise<AtletaDT[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockAtletas), 300));
  },
  getStaff: async (equipaId: number): Promise<StaffDT[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockStaff), 300));
  },
  
  // QUADROS COMPETITIVOS (ABA 3)
  getQuadros: async (): Promise<QuadroCompetitivo[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockQuadros), 300));
  },

  // CALENDÁRIO (ABA 1)
  getEventos: async (mes: number, ano: number): Promise<EventoCalendario[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockEventos), 300));
  },

  // RENDIMENTO E AUDITORIA (ABA 4)
  getKPIsColetivos: async (equipaId?: number): Promise<KPIStats> => {
    return new Promise(resolve => setTimeout(() => resolve({
      vitorias: 12, empates: 4, derrotas: 6,
      golosMarcados: 45, golosSofridos: 22,
      fichasSubmetidas: 20, fichasTotal: 22
    }), 400));
  },
  getIncumprimentos: async (): Promise<Incumprimento[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockIncumprimentos), 300));
  },
  reconhecerIncumprimento: async (id: number): Promise<boolean> => {
    return new Promise(resolve => setTimeout(() => resolve(true), 300));
  }
};
