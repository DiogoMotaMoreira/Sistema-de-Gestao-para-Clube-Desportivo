/**
 * Badge — Soft Pills semânticas do SIGD
 *
 * DESIGN.md §3.3:
 * - Estrutura: Ícone vetorial pequeno à esquerda + Texto descritivo à direita.
 * - PROIBIDO emojis nativos (🟢, 🔴). Usar SEMPRE ícones Lucide.
 * - Variantes: success (verde), warning (ambar), error (vermelho), info (azul).
 *
 * Também suporta variante "neutral" para badges informativos (Gray).
 */

import React from 'react';
import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
  icon?: LucideIcon;
  /** Tamanho do ícone (default: 12) */
  iconSize?: number;
  /** Borda sólida na mesma cor do texto (para legibilidade ao sol — TREINADOR.md) */
  bordered?: boolean;
  style?: ViewStyle;
}

export function Badge({
  variant,
  label,
  icon: IconComponent,
  iconSize = 12,
  bordered = false,
  style,
}: BadgeProps): React.JSX.Element {
  const palette = VARIANT_PALETTE[variant];

  const containerStyle: ViewStyle[] = [
    styles.container,
    { backgroundColor: palette.bg },
    bordered && { borderWidth: 1, borderColor: palette.text },
    style as ViewStyle,
  ].filter(Boolean) as ViewStyle[];

  const textColor = palette.text;

  return (
    <View style={containerStyle} accessibilityLabel={label} accessibilityRole="text">
      {IconComponent != null && (
        <IconComponent size={iconSize} color={textColor} />
      )}
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
}

// ── Paleta por variante ────────────────────────────────

interface BadgePalette {
  bg: string;
  text: string;
}

const VARIANT_PALETTE: Record<BadgeVariant, BadgePalette> = {
  success: { bg: Colors.SUCESSO_BG, text: Colors.SUCESSO_TEXT },
  warning: { bg: Colors.AVISO_BG, text: Colors.AVISO_TEXT },
  error: { bg: Colors.ERRO_BG, text: Colors.ERRO_TEXT },
  info: { bg: Colors.INFO_BG, text: Colors.INFO_TEXT },
  neutral: { bg: Colors.GRAY_100_HOVER, text: Colors.GRAY_500_TEXTO2 },
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  } as TextStyle,
});
