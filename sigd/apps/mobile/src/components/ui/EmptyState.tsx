/**
 * EmptyState — Estado vazio para tabelas e ecrãs do SIGD
 *
 * DESIGN.md §4 (Padrões Comportamentais):
 * - Nunca apresentar ecrãs ou tabelas em branco.
 * - Ícone vetorial gigante centrado (opacidade 10%).
 * - Título claro.
 * - Subtítulo.
 * - Botão Primário para criar a primeira entidade.
 */

import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
  /** Tamanho do ícone (default: 64) */
  iconSize?: number;
  style?: ViewStyle;
}

export function EmptyState({
  icon: IconComponent,
  title,
  subtitle,
  ctaLabel,
  onCtaPress,
  iconSize = 64,
  style,
}: EmptyStateProps): React.JSX.Element {
  return (
    <View style={[styles.container, style]} accessibilityLabel={`Estado vazio: ${title}`} accessibilityRole="text">
      <View style={styles.iconWrapper}>
        <IconComponent size={iconSize} color={Colors.GRAY_200_BORDAS} />
      </View>

      <Text style={styles.title}>{title}</Text>

      {subtitle != null && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}

      {ctaLabel != null && onCtaPress != null && (
        <View style={styles.ctaWrapper}>
          <Button
            label={ctaLabel}
            onPress={onCtaPress}
            variant="primary"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  iconWrapper: {
    opacity: 0.1,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.GRAY_500_TEXTO2,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.GRAY_500_TEXTO2,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 4,
  },
  ctaWrapper: {
    marginTop: 20,
  },
});
