/**
 * Design Tokens — Paleta de Cores do SIGD
 * Fonte: DESIGN.md v2.2
 *
 * NUNCA hardcodar valores hex nos componentes.
 * Importar SEMPRE deste ficheiro.
 */

export const Colors = {
  // ── Cores Primárias ──────────────────────────────────
  PRETO_PRIMARIO: '#000000',
  BRANCO: '#FFFFFF',
  DOURADO_CTA: '#F1C40F',

  // ── Escala de Cinzentos ──────────────────────────────
  GRAY_50_FUNDO: '#F8FAFC',
  GRAY_100_HOVER: '#F1F5F9',
  GRAY_200_BORDAS: '#E2E8F0',
  GRAY_500_TEXTO2: '#64748B',
  GRAY_900_TEXTO1: '#0F172A',

  // ── Cores Semânticas (Soft Badges / Pills) ───────────
  SUCESSO_BG: '#ECFDF5',
  SUCESSO_TEXT: '#047857',

  AVISO_BG: '#FFFBEB',
  AVISO_TEXT: '#B45309',

  ERRO_BG: '#FEE2E2',
  ERRO_TEXT: '#991B1B',

  INFO_BG: '#EFF6FF',
  INFO_TEXT: '#1D4ED8',

  // ── Documental (Ocre/Amber) ─────────────────────────
  DOCUMENTAL_BG: '#FEF3C7',
  DOCUMENTAL_TEXT: '#92400E',

  // ── Extras ───────────────────────────────────────────
  ERRO_BORDA_FOCUS: '#DC2626',
} as const;

export type ColorToken = keyof typeof Colors;
