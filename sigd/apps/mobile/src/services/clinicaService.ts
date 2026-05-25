/**
 * ClinicaService — API client para o módulo Clínica (RF-16).
 *
 * Comunica com os endpoints /api/v1/clinica/*.
 * Usa Axios com o token JWT do authStore.
 */

import axios from 'axios';
import { Endpoints } from '@/constants/endpoints';
import { useAuthStore } from '@/stores/authStore';

// ── Tipos ──────────────────────────────────────────────

export type TipoOcorrencia = 'LESAO' | 'DOENCA' | 'TRAUMA' | 'CONTUSAO' | 'FRATURA' | 'OUTRAS';
export type GrauRestricaoDesportiva = 'VERDE' | 'AMARELO' | 'VERMELHO';
export type EstadoEMD = 'EM_AVALIACAO' | 'DELIBERADO' | 'ARQUIVADO';
export type EstadoOcorrencia = 'ATIVA' | 'RESOLVIDA' | 'CANCELADA';

export const TIPO_OCORRENCIA_LABELS: Record<TipoOcorrencia, string> = {
  LESAO: 'Lesão',
  DOENCA: 'Doença',
  TRAUMA: 'Trauma',
  CONTUSAO: 'Contusão',
  FRATURA: 'Fratura',
  OUTRAS: 'Outras',
};

export const GRAU_LABELS: Record<GrauRestricaoDesportiva, string> = {
  VERDE: 'Sem Restrição',
  AMARELO: 'Parcial',
  VERMELHO: 'Total',
};

export const ESTADO_EMD_LABELS: Record<EstadoEMD, string> = {
  EM_AVALIACAO: 'Em Avaliação',
  DELIBERADO: 'Deliberado',
  ARQUIVADO: 'Arquivado',
};

export interface OcorrenciaRequest {
  atletaId: number;
  dataOcorrencia: string;
  tipo: TipoOcorrencia;
  diagnostico: string;
  grauRestricao: GrauRestricaoDesportiva;
  dataReavaliacao?: string | null;
}

export interface OcorrenciaResponse {
  id: number;
  atletaId: number;
  atletaNome: string;
  dataOcorrencia: string;
  tipo: TipoOcorrencia;
  diagnostico: string;
  grauRestricao: GrauRestricaoDesportiva;
  dataReavaliacao: string | null;
  estadoEMD: EstadoEMD;
  estado: EstadoOcorrencia;
  medicoCriadorNome: string | null;
  medicoDeliberacaoNome: string | null;
  dataDeliberacao: string | null;
  obsDeliberacao: string | null;
  criadoEm: string;
}

export interface FilaEMDResponse {
  id: number;
  atletaNome: string;
  dataOcorrencia: string;
  tipo: TipoOcorrencia;
  grauRestricao: GrauRestricaoDesportiva;
  dataReavaliacao: string | null;
  diasPendente: number;
}

export interface DeliberacaoRequest {
  grauFinal: GrauRestricaoDesportiva;
  obsDeliberacao: string;
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

export interface AltaMedicaRequest {
  parecer: string;
  dataEncerramento: string; // ISO format: YYYY-MM-DD
}

// ── Axios Instance ────────────────────────────────────

function getAuthHeaders(): Record<string, string> {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const api = axios.create({
  baseURL: Endpoints.CLINICA,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

api.interceptors.request.use((config) => {
  const headers = getAuthHeaders();
  Object.assign(config.headers, headers);
  return config;
});

// ── Service ────────────────────────────────────────────

export const clinicaService = {
  /**
   * Lista a fila EMD (ocorrências pendentes), paginada.
   */
  async getFilaEMD(page = 0, size = 20): Promise<PageResponse<FilaEMDResponse>> {
    const { data } = await api.get<PageResponse<FilaEMDResponse>>('/fila-emd', {
      params: { page, size, sort: 'criadoEm,asc' },
    });
    return data;
  },

  /**
   * Lista todas as ocorrências de um atleta.
   */
  async getOcorrenciasPorAtleta(atletaId: number): Promise<OcorrenciaResponse[]> {
    const { data } = await api.get<OcorrenciaResponse[]>(`/ocorrencias/atleta/${atletaId}`);
    return data;
  },

  /**
   * Obtém o detalhe de uma ocorrência.
   */
  async getOcorrencia(id: number): Promise<OcorrenciaResponse> {
    const { data } = await api.get<OcorrenciaResponse>(`/ocorrencias/${id}`);
    return data;
  },

  /**
   * Regista uma nova ocorrência clínica.
   */
  async registarOcorrencia(payload: OcorrenciaRequest): Promise<OcorrenciaResponse> {
    const { data } = await api.post<OcorrenciaResponse>('/ocorrencias', payload);
    return data;
  },

  /**
   * Regista a deliberação EMD sobre uma ocorrência.
   */
  async deliberar(ocorrenciaId: number, deliberacao: DeliberacaoRequest): Promise<OcorrenciaResponse> {
    const { data } = await api.post<OcorrenciaResponse>(
      `/ocorrencias/${ocorrenciaId}/deliberar`,
      deliberacao,
    );
    return data;
  },

  /**
   * Emite alta médica para uma ocorrência clínica (RF-19).
   */
  async emitirAlta(ocorrenciaId: number, alta: AltaMedicaRequest): Promise<OcorrenciaResponse> {
    const { data } = await api.post<OcorrenciaResponse>(
      `/ocorrencias/${ocorrenciaId}/alta`,
      alta,
    );
    return data;
  },
};

