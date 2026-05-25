import { PresetPeriodo } from '../screens/ceo/components/CeoFilters';

// ── Tipagens ──────────────────────────────────────────

export interface FluxoCaixaCFO {
  id: string;
  hora: string;
  metodo: 'Numerário' | 'Multibanco' | 'MBWay';
  pagador: string;
  entidade: 'Clube' | 'SAD';
  valor: number;
}

export interface EntidadeSocialCFO {
  id: string;
  nome: string;
  nif: string;
  tipos: ('Atleta' | 'Sócio' | 'EE')[];
  escalao?: string;
  estado: 'Ativo' | 'Pendente' | 'Arquivado';
  situacaoFinanceira: 'Regularizado' | 'Em Dívida';
  documentacao: 'Válida' | 'Em Validação' | 'Caducada';
}

export interface EventoAuditoriaCFO {
  id: string;
  dataHora: string;
  acao: 'LIQUIDAÇÃO_PAGAMENTO' | 'GERAÇÃO_PROVISÃO' | 'ALTERAÇÃO_ESTATUTO_SÓCIO' | 'EMISSÃO_FATURA' | 'EXPORTAÇÃO_FINANCEIRA';
  ator: string;
  role: string;
  entidadeAfetada: string;
  centroResponsabilidade: 'Clube' | 'SAD' | 'Ambos';
  valor: number;
  ip: string;
  rawJson: string;
}

export interface DetalhePassivoCFO {
  id: string;
  escalao: string;
  tipologia: string;
  numDebitos: number;
  valorEmDivida: number;
  entidade: 'Clube' | 'SAD';
  antiguidadeMedia: number; // em dias
}

export interface RubricaFinanceiraCFO {
  id: string;
  nome: string;
  escalao: string;
  debitosGerados: number;
  valorTotal: number;
  valorLiquidado: number;
  valorEmDivida: number;
  taxaLiq: number;
}

// ── Serviço Mock ──────────────────────────────────────

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const cfoService = {
  getFluxosUltimos: async (): Promise<FluxoCaixaCFO[]> => {
    await delay(300);
    return [
      { id: '1', hora: '14:30', metodo: 'Multibanco', pagador: 'Carlos Silva', entidade: 'Clube', valor: 120.0 },
      { id: '2', hora: '13:15', metodo: 'Numerário', pagador: 'Maria Santos', entidade: 'SAD', valor: 45.0 },
      { id: '3', hora: '11:45', metodo: 'MBWay', pagador: 'João Costa', entidade: 'Clube', valor: 35.0 },
      { id: '4', hora: '10:20', metodo: 'Multibanco', pagador: 'Ana Pereira', entidade: 'SAD', valor: 210.0 },
      { id: '5', hora: '09:05', metodo: 'Numerário', pagador: 'Rui Neves', entidade: 'Clube', valor: 15.0 },
    ];
  },

  getRubricas: async (entidade: 'Clube' | 'SAD'): Promise<RubricaFinanceiraCFO[]> => {
    await delay(400);
    if (entidade === 'Clube') {
      return [
        { id: 'c1', nome: 'Quota Associativa Anual', escalao: 'Seniores', debitosGerados: 1200, valorTotal: 36000, valorLiquidado: 34500, valorEmDivida: 1500, taxaLiq: 95.8 },
        { id: 'c2', nome: 'Mensalidade Ginástica', escalao: 'Todos', debitosGerados: 150, valorTotal: 4500, valorLiquidado: 3200, valorEmDivida: 1300, taxaLiq: 71.1 },
        { id: 'c3', nome: 'Inscrição Sócio', escalao: '-', debitosGerados: 85, valorTotal: 850, valorLiquidado: 850, valorEmDivida: 0, taxaLiq: 100 },
      ];
    } else {
      return [
        { id: 's1', nome: 'Mensalidade Sócio Sub-15', escalao: 'Sub-15', debitosGerados: 245, valorTotal: 8575, valorLiquidado: 7500, valorEmDivida: 1075, taxaLiq: 87.4 },
        { id: 's2', nome: 'Equipamento Formação', escalao: 'Todos', debitosGerados: 120, valorTotal: 6000, valorLiquidado: 5100, valorEmDivida: 900, taxaLiq: 85.0 },
        { id: 's3', nome: 'Mensalidade Sócio Sub-17', escalao: 'Sub-17', debitosGerados: 180, valorTotal: 7200, valorLiquidado: 4500, valorEmDivida: 2700, taxaLiq: 62.5 }, // Taxa < 70
      ];
    }
  },

  getEntidadesSociais: async (): Promise<EntidadeSocialCFO[]> => {
    await delay(500);
    return [
      { id: '1', nome: 'Diogo Marques', nif: '245678901', tipos: ['Atleta', 'Sócio'], escalao: 'Sub-15', estado: 'Ativo', situacaoFinanceira: 'Regularizado', documentacao: 'Válida' },
      { id: '2', nome: 'Carlos Silva', nif: '210987654', tipos: ['EE', 'Sócio'], estado: 'Ativo', situacaoFinanceira: 'Em Dívida', documentacao: 'Válida' },
      { id: '3', nome: 'João Santos', nif: '267123456', tipos: ['Atleta'], escalao: 'Sub-17', estado: 'Pendente', situacaoFinanceira: 'Regularizado', documentacao: 'Em Validação' },
      { id: '4', nome: 'Maria Pereira', nif: '234567890', tipos: ['EE'], estado: 'Ativo', situacaoFinanceira: 'Regularizado', documentacao: 'Válida' },
      { id: '5', nome: 'Rui Neves', nif: '256789012', tipos: ['Atleta', 'Sócio'], escalao: 'Seniores', estado: 'Ativo', situacaoFinanceira: 'Em Dívida', documentacao: 'Caducada' },
    ];
  },

  getAuditoriaFinanceira: async (): Promise<EventoAuditoriaCFO[]> => {
    await delay(400);
    return [
      {
        id: 'evt_9a8b7c6d', dataHora: '13 Mai 2026, 14:32:05', acao: 'LIQUIDAÇÃO_PAGAMENTO', ator: 'Joana Martins', role: 'Secretaria',
        entidadeAfetada: 'Carlos Silva [EE]', centroResponsabilidade: 'Clube', valor: 120.0, ip: '192.168.1.45',
        rawJson: JSON.stringify({ event_id: "evt_9a8b7c6d", timestamp: "2026-05-13T14:32:05Z", actor_id: "usr_sec_01", entity_type: "EE", entity_id: "ee_123", financial_center: "CLUBE", amount: 120.0, changes: { status: { before: "UNPAID", after: "PAID" } } }, null, 2)
      },
      {
        id: 'evt_1b2c3d4e', dataHora: '12 Mai 2026, 09:15:22', acao: 'GERAÇÃO_PROVISÃO', ator: 'Sistema Lote', role: 'Automático',
        entidadeAfetada: 'Lote 230 débitos (Maio)', centroResponsabilidade: 'Ambos', valor: 8575.0, ip: '127.0.0.1',
        rawJson: JSON.stringify({ event_id: "evt_1b2c3d4e", timestamp: "2026-05-12T09:15:22Z", actor_id: "sys_batch", entity_type: "PROVISION_BATCH", entity_id: "batch_mai26", financial_center: "AMBOS", amount: 8575.0 }, null, 2)
      },
      {
        id: 'evt_5f6g7h8i', dataHora: '11 Mai 2026, 16:45:10', acao: 'ALTERAÇÃO_ESTATUTO_SÓCIO', ator: 'Miguel Costa', role: 'Direção',
        entidadeAfetada: 'Rui Neves [Sócio]', centroResponsabilidade: 'Clube', valor: 0, ip: '192.168.1.12',
        rawJson: JSON.stringify({ event_id: "evt_5f6g7h8i", timestamp: "2026-05-11T16:45:10Z", actor_id: "usr_dir_02", entity_type: "MEMBER", entity_id: "mem_987", financial_center: "CLUBE", amount: 0, changes: { status: { before: "ACTIVE", after: "SUSPENDED" }, reason: { before: null, after: "Dívida > 90 dias" } } }, null, 2)
      },
      {
        id: 'evt_9z8y7x6w', dataHora: '10 Mai 2026, 11:20:00', acao: 'EMISSÃO_FATURA', ator: 'Joana Martins', role: 'Secretaria',
        entidadeAfetada: 'Fatura FT 2026/145 (Maria Santos)', centroResponsabilidade: 'SAD', valor: 45.0, ip: '192.168.1.45',
        rawJson: JSON.stringify({ event_id: "evt_9z8y7x6w", timestamp: "2026-05-10T11:20:00Z", actor_id: "usr_sec_01", entity_type: "INVOICE", entity_id: "inv_2026_145", financial_center: "SAD", amount: 45.0, changes: { status: { before: "DRAFT", after: "ISSUED" } } }, null, 2)
      }
    ];
  },

  getDetalhePassivo: async (): Promise<DetalhePassivoCFO[]> => {
    await delay(300);
    return [
      { id: 'dp1', escalao: 'Sub-15', tipologia: 'Mensalidade Sócio', numDebitos: 45, valorEmDivida: 1575.0, entidade: 'SAD', antiguidadeMedia: 42 },
      { id: 'dp2', escalao: 'Seniores', tipologia: 'Quota Associativa', numDebitos: 110, valorEmDivida: 3300.0, entidade: 'Clube', antiguidadeMedia: 120 }, // > 30 dias -> vermelho
      { id: 'dp3', escalao: 'Sub-17', tipologia: 'Equipamento', numDebitos: 15, valorEmDivida: 750.0, entidade: 'SAD', antiguidadeMedia: 15 },
    ];
  }
};
