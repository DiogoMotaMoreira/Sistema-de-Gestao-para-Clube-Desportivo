/**
 * SemaforoBadge — Componente de domínio do SIGD
 *
 * TREINADOR.md — Especificação do Semáforo Clínico:
 * - APTO:                Fundo #ECFDF5 | Texto #047857 | Borda 1px #047857 | Ícone CheckCircle
 * - CONDICIONADO:        Fundo #FFFBEB | Texto #B45309 | Borda 1px #B45309 | Ícone AlertTriangle
 * - INAPTO — Clínico:    Fundo #FEE2E2 | Texto #991B1B | Borda 1px #991B1B | Ícone XCircle
 * - INAPTO — Documental: Fundo #FEF3C7 | Texto #92400E | Borda 1px #92400E | Ícone Clock
 *
 * REGRA: O Treinador NUNCA vê diagnósticos ou notas clínicas (RF-23 Data Masking).
 * Apenas o semáforo mascarado.
 *
 * PROIBIDO emojis nativos (🟢🔴). Usar SEMPRE ícones Lucide.
 * Todos os badges têm borda sólida (1px) na mesma cor do texto para
 * contraste ao sol (TREINADOR.md).
 */

import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

// ── Tipos ──────────────────────────────────────────────

export type EstadoElegibilidade =
  | 'APTO'
  | 'CONDICIONADO'
  | 'INAPTO_CLINICO'
  | 'INAPTO_DOCUMENTAL';

interface SemaforoBadgeProps {
  estado: EstadoElegibilidade;
  /** Variante compacta para listas (default: false) */
  compact?: boolean;
  style?: ViewStyle;
}

// ── Configuração por estado ────────────────────────────

interface SemaforoConfig {
  bg: string;
  text: string;
  border: string;
  icon: LucideIcon;
  label: string;
}

const SEMAFORO_CONFIG: Record<EstadoElegibilidade, SemaforoConfig> = {
  APTO: {
    bg: Colors.SUCESSO_BG,
    text: Colors.SUCESSO_TEXT,
    border: Colors.SUCESSO_TEXT,
    icon: CheckCircle,
    label: 'Apto',
  },
  CONDICIONADO: {
    bg: Colors.AVISO_BG,
    text: Colors.AVISO_TEXT,
    border: Colors.AVISO_TEXT,
    icon: AlertTriangle,
    label: 'Condicionado',
  },
  INAPTO_CLINICO: {
    bg: Colors.ERRO_BG,
    text: Colors.ERRO_TEXT,
    border: Colors.ERRO_TEXT,
    icon: XCircle,
    label: 'Inapto — Clínico',
  },
  INAPTO_DOCUMENTAL: {
    bg: '#FEF3C7',
    text: '#92400E',
    border: '#92400E',
    icon: Clock,
    label: 'Inapto — Documental',
  },
};

// ── Componente ─────────────────────────────────────────

export function SemaforoBadge({
  estado,
  compact = false,
  style,
}: SemaforoBadgeProps): React.JSX.Element {
  const config = SEMAFORO_CONFIG[estado];
  const IconComponent = config.icon;

  return (
    <View
      style={[
        styles.container,
        compact && styles.containerCompact,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
        },
        style,
      ]}
      accessibilityLabel={`Estado de elegibilidade: ${config.label}`}
      accessibilityRole="text"
    >
      <IconComponent
        size={compact ? 10 : 12}
        color={config.text}
      />
      <Text
        style={[
          styles.label,
          compact && styles.labelCompact,
          { color: config.text },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  containerCompact: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  labelCompact: {
    fontSize: 10,
  },
});
