/**
 * SecretariaService — API client para o módulo Tesouraria/Secretaria.
 *
 * Comunica com os endpoints /api/v1/tesouraria/*.
 * Usa Axios com o token JWT do authStore.
 */

import axios, { AxiosError } from 'axios';
import { Endpoints } from '@/constants/endpoints';
import { useAuthStore } from '@/stores/authStore';
import { clinicaService, FilaEMDResponse, DeliberacaoRequest } from './clinicaService';

// ── Tipos ──────────────────────────────────────────────

export interface EncarregadoRequest {
  nome: string;
  nif?: string;
  email?: string;
  telemovel?: string;
  morada?: string;
}

export interface EncarregadoResponse {
  id: number;
  nome: string;
  nif: string | null;
  email: string | null;
  telemovel: string | null;
  morada: string | null;
  criadoEm: string;
}

export interface AtletaRequest {
  nomeCompleto: string;
  dataNascimento: string;
  nif?: string;
  numeroSocio?: string;
  posicao?: string;
  encarregadoId: number;
  equipaId?: number;
}

export interface AtletaResponse {
  id: number;
  nomeCompleto: string;
  dataNascimento: string;
  nif: string | null;
  numeroSocio: string | null;
  posicao: string | null;
  estadoElegibilidade: string;
  equipaId: number | null;
  equipaNome: string | null;
  encarregadoId: number;
  encarregadoNome: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface EquipaRequest {
  nome: string;
  escalaoId: number;
  modalidadeId: number;
}

export interface EquipaResponse {
  id: number;
  nome: string;
  escalaoDesignacao: string | null;
  modalidadeNome: string | null;
  ativa: boolean;
  totalAtletas: number;
}

export interface ObrigacaoResponse {
  id: number;
  valor: number;
  dataVencimento: string;
  tipo: string;
  estado: string;
  entidadeJuridica: string | null;
  dataPagamento: string | null;
  encarregadoId: number;
  encarregadoNome: string;
  atletaId: number | null;
  atletaNome: string | null;
}

export interface SituacaoFinanceiraResponse {
  totalDivida: number;
  totalPago: number;
  obrigacoes: ObrigacaoResponse[];
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

// ── Axios Instance ────────────────────────────────────

function getAuthHeaders(): Record<string, string> {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const api = axios.create({
  baseURL: Endpoints.TESOURARIA,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

api.interceptors.request.use((config) => {
  const headers = getAuthHeaders();
  Object.assign(config.headers, headers);
  return config;
});

// ── Service ────────────────────────────────────────────

export const secretariaService = {
  // ── Encarregados ────────────────────────────────────

  async getEncarregados(
    pesquisa?: string,
    page = 0,
    size = 10,
  ): Promise<PageResponse<EncarregadoResponse>> {
    const params: Record<string, string | number> = { page, size };
    if (pesquisa) params.pesquisa = pesquisa;
    const { data } = await api.get<PageResponse<EncarregadoResponse>>('/ee', { params });
    return data;
  },

  async getEncarregado(id: number): Promise<EncarregadoResponse> {
    const { data } = await api.get<EncarregadoResponse>(`/ee/${id}`);
    return data;
  },

  async createEncarregado(payload: EncarregadoRequest): Promise<EncarregadoResponse> {
    const { data } = await api.post<EncarregadoResponse>('/ee', payload);
    return data;
  },

  async updateEncarregado(id: number, payload: EncarregadoRequest): Promise<EncarregadoResponse> {
    const { data } = await api.put<EncarregadoResponse>(`/ee/${id}`, payload);
    return data;
  },

  async getEncarregadoSituacaoFinanceira(id: number): Promise<SituacaoFinanceiraResponse> {
    const { data } = await api.get<SituacaoFinanceiraResponse>(`/ee/${id}/situacao-financeira`);
    return data;
  },

  async getObrigacoesEncarregado(id: number): Promise<ObrigacaoResponse[]> {
    const { data } = await api.get<ObrigacaoResponse[]>(`/ee/${id}/obrigacoes`);
    return data;
  },

  async registarPagamento(obrigacaoId: number): Promise<ObrigacaoResponse> {
    const { data } = await api.post<ObrigacaoResponse>(`/pagamentos/${obrigacaoId}/registar`);
    return data;
  },

  async gerarProvisoes(epocaId: number): Promise<void> {
    await api.post(`/provisoes/gerar?epocaId=${epocaId}`);
  },

  // ── Clínica ─────────────────────────────────────────

  async getDocumentosPendentes(page = 0, size = 20) {
    return clinicaService.getFilaEMD(page, size);
  },

  async deliberarDocumento(id: number, payload: DeliberacaoRequest) {
    return clinicaService.deliberar(id, payload);
  },

  // ── Atletas ─────────────────────────────────────────

  async getAtletas(
    pesquisa?: string,
    equipaId?: number,
    page = 0,
    size = 10,
  ): Promise<PageResponse<AtletaResponse>> {
    const params: Record<string, string | number> = { page, size };
    if (pesquisa) params.pesquisa = pesquisa;
    if (equipaId) params.equipaId = equipaId;
    const { data } = await api.get<PageResponse<AtletaResponse>>('/atletas', { params });
    return data;
  },

  async getAtleta(id: number): Promise<AtletaResponse> {
    const { data } = await api.get<AtletaResponse>(`/atletas/${id}`);
    return data;
  },

  async createAtleta(payload: AtletaRequest): Promise<AtletaResponse> {
    const { data } = await api.post<AtletaResponse>('/atletas', payload);
    return data;
  },

  async updateAtleta(id: number, payload: AtletaRequest): Promise<AtletaResponse> {
    const { data } = await api.put<AtletaResponse>(`/atletas/${id}`, payload);
    return data;
  },

  async transferirAtleta(atletaId: number, novaEquipaId: number): Promise<AtletaResponse> {
    const { data } = await api.patch<AtletaResponse>(`/atletas/${atletaId}/transferir`, {
      novaEquipaId,
    });
    return data;
  },

  // ── Equipas ─────────────────────────────────────────

  async getEquipas(): Promise<EquipaResponse[]> {
    const { data } = await api.get<EquipaResponse[]>('/equipas');
    return data;
  },

  async createEquipa(payload: EquipaRequest): Promise<EquipaResponse> {
    const { data } = await api.post<EquipaResponse>('/equipas', payload);
    return data;
  },
};
