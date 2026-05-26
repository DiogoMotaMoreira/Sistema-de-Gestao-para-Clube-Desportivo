import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
export interface AlertaEstrategico {
  id: string;
  texto: string;
  severidade: 'Crítico' | 'Aviso' | 'Info';
}

export interface KpiCardData {
  valorFormatado: string;
  variacaoTexto?: string;
  variacaoPositiva?: boolean;
  variacaoNeutra?: boolean;
  subtexto: string;
  valorOriginal: number;
}

export interface DemografiaEscalao {
  escalao: string;
  atletasAtivos: number;
  socios: number;
  percDocsDia: number;
  percFinanDia: number;
}

export interface RubricaFinanceira {
  id: string;
  nome: string;
  escalao: string;
  debitos: number;
  valorTotal: number;
  liquidado: number;
  emDivida: number;
  taxaLiq: number;
}

export interface DetalheDivida {
  id: string;
  escalao: string;
  numEeEmDivida: number;
  valorTotalEmDivida: number;
  dividaMediaPorEe: number;
  entidade: 'Clube' | 'SAD';
  antiguidadeMedia: number;
}

export interface FluxoCaixa {
  canal: string;
  valorClube: number;
  valorSad: number;
  total: number;
}

export interface AuditoriaEvento {
  id: string;
  dataHora: string;
  ator: string;
  role: string;
  acao: string;
  modulo: string;
  ip: string;
  rawJson: string;
}

export interface CeoKpisDTO {
  totalAtletas: number;
  totalEquipas: number;
  totalSocios: number;
  receitaTotal: number;
  dividaTotal: number;
  atletasAptos: number;
  atletasCondicionados: number;
  atletasInaptos: number;
}

export interface CeoKpisDesportivosDTO {
  totalJogos: number;
  jogosConcluidos: number;
  jogosAgendados: number;
  totalSessoesTreino: number;
}

const mockAlertas: AlertaEstrategico[] = [
  { id: '1', texto: '3 escalões com fichas de jogo em incumprimento', severidade: 'Crítico' },
  { id: '2', texto: 'Taxa de regularidade de sócios desceu 8% este mês', severidade: 'Aviso' },
  { id: '3', texto: '23 atletas com documentação a expirar nos próximos 30 dias', severidade: 'Aviso' },
];

export const ceoService = {
  getKpis: async (): Promise<CeoKpisDTO> => {
    // We add the authorization headers
    const token = useAuthStore.getState().token;
    const { data } = await axios.get<CeoKpisDTO>('http://localhost:8080/api/v1/ceo/kpis', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return data;
  },

  getKpisDesportivos: async (): Promise<CeoKpisDesportivosDTO> => {
    const token = useAuthStore.getState().token;
    const { data } = await axios.get<CeoKpisDesportivosDTO>('http://localhost:8080/api/v1/ceo/kpis-desportivos', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return data;
  },

  getAlertas: async (periodo: string): Promise<AlertaEstrategico[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockAlertas), 300));
  },
  
  getKpiReceitaTotal: async (periodo: string): Promise<KpiCardData> => {
    try {
      const data = await ceoService.getKpis();
      return {
        valorOriginal: data.receitaTotal,
        valorFormatado: new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(data.receitaTotal),
        variacaoTexto: '+12,3% vs. época anterior',
        variacaoPositiva: true,
        subtexto: 'Época 2025/2026'
      };
    } catch {
      return {
        valorOriginal: 1240500,
        valorFormatado: '1.240.500,00 €',
        variacaoTexto: '+12,3% vs. época anterior',
        variacaoPositiva: true,
        subtexto: 'Época 2025/2026'
      };
    }
  },

  getKpiPassivoPendente: async (periodo: string): Promise<KpiCardData> => {
    try {
      const data = await ceoService.getKpis();
      return {
        valorOriginal: data.dividaTotal,
        valorFormatado: new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(data.dividaTotal),
        variacaoTexto: '-8,2% vs. mês anterior',
        variacaoPositiva: true,
        subtexto: 'Pagamentos em atraso'
      };
    } catch {
      return {
        valorOriginal: 45200,
        valorFormatado: '45.200,00 €',
        variacaoTexto: '-8,2% vs. mês anterior',
        variacaoPositiva: true,
        subtexto: '230 mensalidades em atraso'
      };
    }
  },

  getDemografia: async (escalaoFiltro?: string): Promise<DemografiaEscalao[]> => {
    return new Promise(resolve => setTimeout(() => resolve([
      { escalao: 'Sub-13', atletasAtivos: 62, socios: 45, percDocsDia: 94.8, percFinanDia: 91.2 },
      { escalao: 'Sub-15', atletasAtivos: 87, socios: 71, percDocsDia: 78.2, percFinanDia: 85.1 },
      { escalao: 'Sub-17', atletasAtivos: 74, socios: 58, percDocsDia: 82.4, percFinanDia: 88.7 },
      { escalao: 'Sub-19', atletasAtivos: 58, socios: 40, percDocsDia: 91.4, percFinanDia: 79.3 },
      { escalao: 'Seniores', atletasAtivos: 169, socios: 98, percDocsDia: 85.2, percFinanDia: 92.0 },
    ]), 400));
  },

  getRubricasFinanceiras: async (entidade: 'Clube' | 'SAD'): Promise<RubricaFinanceira[]> => {
    return new Promise(resolve => setTimeout(() => resolve([
      { id: '1', nome: 'Mensalidade Sócio Sub-15', escalao: 'Sub-15', debitos: 245, valorTotal: 8575, liquidado: 7906, emDivida: 669, taxaLiq: 92.2 },
      { id: '2', nome: 'Taxa Inscrição Sub-17', escalao: 'Sub-17', debitos: 74, valorTotal: 3700, liquidado: 3000, emDivida: 700, taxaLiq: 81.0 },
    ]), 300));
  },

  getDetalheDivida: async (): Promise<DetalheDivida[]> => {
    return new Promise(resolve => setTimeout(() => resolve([
      { id: '1', escalao: 'Sub-15', numEeEmDivida: 45, valorTotalEmDivida: 1575, dividaMediaPorEe: 35, entidade: 'SAD', antiguidadeMedia: 42 },
      { id: '2', escalao: 'Sub-17', numEeEmDivida: 38, valorTotalEmDivida: 1330, dividaMediaPorEe: 35, entidade: 'SAD', antiguidadeMedia: 28 },
      { id: '3', escalao: 'Seniores', numEeEmDivida: 22, valorTotalEmDivida: 1100, dividaMediaPorEe: 50, entidade: 'Clube', antiguidadeMedia: 61 },
    ]), 300));
  },

  getFluxosCaixa: async (): Promise<FluxoCaixa[]> => {
    return new Promise(resolve => setTimeout(() => resolve([
      { canal: 'Numerário', valorClube: 1200, valorSad: 320, total: 1520 },
      { canal: 'Multibanco', valorClube: 4800, valorSad: 1100, total: 5900 },
      { canal: 'MBWay', valorClube: 1800, valorSad: 540, total: 2340 },
    ]), 300));
  },

  getAuditoria: async (): Promise<AuditoriaEvento[]> => {
    return new Promise(resolve => setTimeout(() => resolve([
      { id: '1', dataHora: '13 Mai 2026, 14:32:05', ator: 'João Silva', role: 'Secretaria', acao: 'LIQUIDAÇÃO_FINANCEIRA', modulo: 'Tesouraria', ip: '192.168.1.45', rawJson: '{ "action": "LIQUIDAÇÃO" }' },
      { id: '2', dataHora: '13 Mai 2026, 15:12:00', ator: 'Admin', role: 'Admin', acao: 'AÇÃO DE SEGURANÇA', modulo: 'Gestão de Acessos', ip: '10.0.0.1', rawJson: '{ "action": "BLOQUEAR" }' },
      { id: '3', dataHora: '13 Mai 2026, 16:00:22', ator: 'Dr. Santos', role: 'Médico', acao: 'VALIDAÇÃO_DOCUMENTAL', modulo: 'Clínica', ip: '192.168.1.100', rawJson: '{ "action": "APROVAR_EMD" }' },
    ]), 300));
  }
};
