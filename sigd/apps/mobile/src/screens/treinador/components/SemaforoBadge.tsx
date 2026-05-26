import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react-native';
import type { SemaforoClinico } from '@/services/treinadorService';

interface Props {
  estado: SemaforoClinico;
  size?: 'sm' | 'md';
}

export function SemaforoBadge({ estado, size = 'md' }: Props) {
  let config = { bg: '', text: '', label: '', icon: CheckCircle };

  switch (estado) {
    case 'APTO':
      config = { bg: '#ECFDF5', text: '#047857', label: 'Apto', icon: CheckCircle };
      break;
    case 'CONDICIONADO':
      config = { bg: '#FFFBEB', text: '#B45309', label: 'Condicionado', icon: AlertTriangle };
      break;
    case 'INAPTO_LESAO':
      config = { bg: '#FEE2E2', text: '#991B1B', label: 'Baixa Médica', icon: XCircle };
      break;
    case 'INAPTO_EMD':
      config = { bg: '#FEE2E2', text: '#991B1B', label: 'EMD em falta', icon: XCircle };
      break;
  }

  const Icon = config.icon;
  const iconSize = size === 'sm' ? 12 : 16;
  const fontSize = size === 'sm' ? 11 : 12;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg, borderColor: config.text }]}>
      <Icon size={iconSize} color={config.text} />
      <Text style={[styles.text, { color: config.text, fontSize }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  text: {
    fontWeight: '600',
  },
});
