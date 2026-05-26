import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

// ── Tipos ──────────────────────────────────────────────

export type SemaforoClinico = 'APTO' | 'CONDICIONADO' | 'INAPTO_LESAO' | 'INAPTO_EMD';

export interface SemaforoAtletaDTO {
  atletaId: number;
  atletaNome: string;
  semaforo: 'VERDE' | 'AMARELO' | 'VERMELHO' | 'BLOQUEADO';
  motivo: string;
}

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
  tipo: TipoEvento | string;
  dataHora: string;
  local: string;
  equipaNome: string;
  
  // Novos campos para HojeScreen
  data?: string;
  hora?: string;
  equipaId?: number;
  estado?: string;
  isSessao?: boolean;
  
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
  convocatoriaId?: number;
}

export interface FichaJogoResponse {
  id: number;
  eventoId: number;
  golosMarcados: number;
  golosSofridos: number;
  resultado: string;
  observacoes: string | null;
  estadoSubmissao: string;
  criadoEm: string;
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
   */
  async getEquipas(): Promise<EquipaTreinador[]> {
    const { data } = await api.get<any[]>('/tesouraria/equipas');
    return data.map((e: any) => ({
      id: e.id,
      nome: e.nome,
      escalao: e.escalaoDesignacao || '-',
    }));
  },

  /**
   * Obtém o plantel de uma equipa com dados consolidados.
   */
  async getPlantel(equipaId: number): Promise<AtletaPlantel[]> {
    const [atletasRes, semaforoRes] = await Promise.all([
      api.get<any>('/tesouraria/atletas', { params: { equipaId, size: 1000 } }),
      api.get<SemaforoAtletaDTO[]>(`/treinador/plantel/${equipaId}/semaforo`).catch(() => ({ data: [] }))
    ]);
    
    const atletas = atletasRes.data.content || [];
    const semaforos = semaforoRes.data || [];
    const semaforoMap = new Map(semaforos.map(s => [s.atletaId, s]));

    return atletas.map((a: any) => {
      let idade = 0;
      if (a.dataNascimento) {
        const hoje = new Date();
        const nasc = new Date(a.dataNascimento);
        idade = hoje.getFullYear() - nasc.getFullYear();
        const m = hoje.getMonth() - nasc.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
          idade--;
        }
      }
      
      let mappedSemaforo = 'APTO';
      const s = semaforoMap.get(a.id);
      if (s) {
          if (s.semaforo === 'VERMELHO' || s.semaforo === 'BLOQUEADO') {
              mappedSemaforo = (s.motivo || '').includes('EMD') ? 'INAPTO_EMD' : 'INAPTO_LESAO';
          } else if (s.semaforo === 'AMARELO') {
              mappedSemaforo = 'CONDICIONADO';
          }
      }

      return {
        id: a.id,
        nome: a.nomeCompleto,
        posicao: a.posicao || '-',
        idade,
        semaforo: mappedSemaforo as SemaforoClinico,
        assiduidade: null,
        mediaAvaliacao: null,
        minutosEpoca: null,
        convocatoriasEpoca: null,
      };
    });
  },

  /**
   * Obtém os semáforos de prontidão clínica do plantel de uma equipa (RF-16).
   */
  async getSemaforoPlantel(equipaId: number): Promise<SemaforoAtletaDTO[]> {
    const { data } = await api.get<SemaforoAtletaDTO[]>(`/treinador/plantel/${equipaId}/semaforo`);
    return data;
  },

  /**
   * Obtém os eventos do dia (treinos, jogos urgentes).
   * Filtra os eventos e as sessões da equipa para a data de hoje.
   */
  async getEventosHoje(equipaId: number): Promise<EventoTreinador[]> {
    const agora = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const hoje = `${agora.getFullYear()}-${pad(agora.getMonth() + 1)}-${pad(agora.getDate())}`;
    
    // Fazer as chamadas em paralelo
    const [eventosRes, sessoesRes] = await Promise.all([
      api.get<any[]>(`/treinador/eventos?equipaId=${equipaId}`),
      api.get<any[]>(`/treinador/sessoes?equipaId=${equipaId}`)
    ]);
    
    const eventosHoje = eventosRes.data
      .filter((e) => e.data === hoje)
      .map((e) => ({
        id: e.id,
        tipo: 'JOGO' as TipoEvento,
        dataHora: `${e.data}T${e.horaInicio}`,
        data: e.data,
        hora: e.horaInicio.substring(0, 5),
        local: e.local,
        equipaId: e.equipaId,
        equipaNome: e.equipaNome,
        adversario: e.adversario,
        estado: e.estado,
        subEstadoJogo: (e.temConvocatoria ? 'FUTURO_PUBLICADA' : 'FUTURO_SEM_CONVOCATORIA') as SubEstadoJogo,
        convocatoriaId: e.convocatoriaId,
      }));
      
    const sessoesHoje = sessoesRes.data
      .filter((s) => s.data === hoje)
      .map((sessao) => ({
        id: sessao.id,
        tipo: sessao.tipo,
        data: sessao.data,
        hora: sessao.horaInicio.substring(0, 5),
        local: 'Campo de Treinos',
        equipaId: sessao.equipaId,
        equipaNome: sessao.equipaNome,
        estado: sessao.estado,
        isSessao: true,
        // Compatibilidade com EventoTreinador existente
        dataHora: `${sessao.data}T${sessao.horaInicio}`,
        subEstadoTreino: (sessao.estado === 'EM_CURSO' ? 'CHAMADA_CURSO' : sessao.estado === 'CONCLUIDA' ? 'AVALIACAO_SUBMETIDA' : 'CHAMADA_PENDENTE') as SubEstadoTreino,
        total: sessao.totalAtletas
      }));

    return [...eventosHoje, ...sessoesHoje].sort((a, b) => a.dataHora.localeCompare(b.dataHora));
  },

  /**
   * Obtém todos os jogos.
   */
  async getJogos(equipaId: number): Promise<EventoTreinador[]> {
    const { data } = await api.get<any[]>(`/treinador/eventos?equipaId=${equipaId}`);
    
    return data
      .filter((e) => e.tipo === 'JOGO_OFICIAL' || e.tipo === 'JOGO_PARTICULAR')
      .map((e) => {
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const localNowStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        const isPast = `${e.data}T${e.horaInicio}` < localNowStr;
        
        let subEstado: SubEstadoJogo = isPast ? 'PASSADO_FICHA_PENDENTE' : (e.temConvocatoria ? 'FUTURO_PUBLICADA' : 'FUTURO_SEM_CONVOCATORIA');
        if (e.estado === 'CONCLUIDO') {
          subEstado = 'PASSADO_FICHA_SUBMETIDA';
        }

        return {
          id: e.id,
          tipo: 'JOGO' as TipoEvento,
          dataHora: `${e.data}T${e.horaInicio}`,
          data: e.data,
          hora: e.horaInicio.substring(0, 5),
          local: e.local,
          equipaId: e.equipaId,
          equipaNome: e.equipaNome,
          adversario: e.adversario,
          estado: e.estado,
          subEstadoJogo: subEstado,
          convocatoriaId: e.convocatoriaId,
        };
      });
  },

  // ── Ações Transacionais ───────────────────────────────

  async criarSessao(equipaId: number, data: string, horaInicio: string, horaFim: string, tipo: string): Promise<any> {
    const { data: response } = await api.post('/treinador/sessoes', {
      equipaId, data, horaInicio, horaFim, tipo
    });
    return response;
  },

  async getSessao(id: number): Promise<any> {
    const { data } = await api.get(`/treinador/sessoes/${id}`);
    return data;
  },

  async getSessoesDaEquipa(equipaId: number): Promise<any[]> {
    const { data } = await api.get(`/treinador/sessoes?equipaId=${equipaId}`);
    return data;
  },

  async submeterChamada(sessaoId: number, registos: RegistoChamada[]): Promise<boolean> {
    await api.post(`/treinador/sessoes/${sessaoId}/chamada`, {
      registos: registos.map(r => ({ atletaId: r.atletaId, estado: r.estado }))
    });
    return true;
  },

  async submeterAvaliacao(sessaoId: number, avaliacoes: RegistoAvaliacao[]): Promise<boolean> {
    await api.post(`/treinador/sessoes/${sessaoId}/avaliacao`, {
      avaliacoes: avaliacoes.map(a => ({ atletaId: a.atletaId, nota: a.nota }))
    });
    return true;
  },

  async criarEvento(equipaId: number, tipo: string, data: string, horaInicio: string, adversario: string, local: string): Promise<any> {
    const { data: response } = await api.post('/treinador/eventos', {
      equipaId, tipo, data, horaInicio, adversario, local
    });
    return response;
  },

  async guardarConvocatoria(eventoId: number, atletaIds: number[], publicar: boolean, localConcentracao: string, horaConcentracao: string): Promise<boolean> {
    // publicar is not used directly in backend since all submitted are PUBLICADA
    await api.post('/treinador/convocatorias', {
      eventoId, atletaIds, horaConcentracao, localConcentracao
    });
    return true;
  },

  async getConvocatoria(id: number): Promise<any> {
    const { data } = await api.get(`/treinador/convocatorias/${id}`);
    return data;
  },

  async submeterFichaJogo(eventoId: number, golosMarcados: number, golosSofridos: number, observacoes: string): Promise<FichaJogoResponse> {
    const { data } = await api.post<FichaJogoResponse>(`/treinador/eventos/${eventoId}/ficha-jogo`, {
      eventoId,
      golosMarcados,
      golosSofridos,
      observacoes
    });
    return data;
  },

  async getFichaJogo(eventoId: number): Promise<FichaJogoResponse> {
    const { data } = await api.get<FichaJogoResponse>(`/treinador/eventos/${eventoId}/ficha-jogo`);
    return data;
  },

  downloadConvocatoriaPdf(convocatoriaId: number) {
    window.open(`http://localhost:8080/api/v1/treinador/convocatorias/${convocatoriaId}/pdf`, '_blank');
  }
};
