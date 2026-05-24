/**
 * Card — Container de cartão do SIGD
 *
 * DESIGN.md §3.4:
 * - Background: #FFFFFF
 * - Borda: 1px #E2E8F0
 * - Corner Radius: 12px ou 16px
 * - Drop Shadow: Sombra Suave (Y=1, Blur=2, Opacity=5%)
 */

import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  radius?: 12 | 16;
  /** Borda esquerda colorida para cards de tipo/estado */
  leftBorderColor?: string;
}

export function Card({
  children,
  style,
  radius = 12,
  leftBorderColor,
}: CardProps): React.JSX.Element {
  return (
    <View
      style={[
        styles.container,
        { borderRadius: radius },
        leftBorderColor != null && {
          borderLeftWidth: 4,
          borderLeftColor: leftBorderColor,
        },
        style,
      ]}
      accessibilityRole="summary"
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 12,
    padding: 16,
    // Sombra Suave — DESIGN.md §1.3
    shadowColor: Colors.PRETO_PRIMARIO,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});
