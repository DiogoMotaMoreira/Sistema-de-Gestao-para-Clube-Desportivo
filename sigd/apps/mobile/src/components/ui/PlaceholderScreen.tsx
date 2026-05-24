/**
 * PlaceholderScreen — Componente reutilizável para ecrãs ainda não implementados.
 *
 * Exibe o nome do módulo com empty state padrão (ícone + título + subtítulo)
 * seguindo o padrão de Empty States do DESIGN.md.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface PlaceholderScreenProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function PlaceholderScreen({ title, subtitle, icon }: PlaceholderScreenProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 16,
    opacity: 0.15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.GRAY_900_TEXTO1,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.GRAY_500_TEXTO2,
    textAlign: 'center',
    lineHeight: 20,
  },
});
