import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle, Clock, AlertCircle, Lock, Archive, LucideIcon } from 'lucide-react-native';

export type EstadoFinanceiro = 'PAGO' | 'PENDENTE' | 'VENCIDO' | 'VENCIDO_CRITICO';
export type EstadoDocumental = 'APROVADO' | 'EM_ANALISE' | 'REJEITADO' | 'EM_FALTA';
export type Elegibilidade = 'APTO' | 'BLOQUEADO' | 'VINCULO_ENCERRADO';

// ── Badge de Estado Financeiro ──────────────────────────

export function BadgeFinanceiro({ estado, showLabel = true }: { estado: EstadoFinanceiro, showLabel?: boolean }) {
  let bg = '#ECFDF5', text = '#047857', border = '#047857', Icon = CheckCircle, label = 'Pago';
  
  if (estado === 'PENDENTE') {
    bg = '#FFFBEB'; text = '#B45309'; border = '#B45309'; Icon = Clock; label = 'Pendente';
  } else if (estado === 'VENCIDO' || estado === 'VENCIDO_CRITICO') {
    bg = '#FEE2E2'; text = '#991B1B'; border = '#991B1B'; Icon = AlertCircle; label = 'Vencido';
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: border }]}>
      <Icon size={12} color={text} />
      {showLabel && <Text style={[styles.text, { color: text }]}>{label}</Text>}
    </View>
  );
}

// ── Badge de Estado Documental ──────────────────────────

export function BadgeDocumental({ estado, showLabel = true }: { estado: EstadoDocumental, showLabel?: boolean }) {
  let bg = '#ECFDF5', text = '#047857', Icon = CheckCircle, label = 'Aprovado';
  
  if (estado === 'EM_ANALISE') {
    bg = '#EFF6FF'; text = '#1D4ED8'; Icon = Clock; label = 'Em Análise';
  } else if (estado === 'REJEITADO') {
    bg = '#FEE2E2'; text = '#991B1B'; Icon = AlertCircle; label = 'Rejeitado';
  } else if (estado === 'EM_FALTA') {
    bg = '#FEE2E2'; text = '#991B1B'; Icon = AlertCircle; label = 'Em Falta';
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderWidth: 0 }]}>
      <Icon size={12} color={text} />
      {showLabel && <Text style={[styles.text, { color: text }]}>{label}</Text>}
    </View>
  );
}

// ── Badge de Elegibilidade ──────────────────────────────

export function BadgeElegibilidade({ estado, showLabel = true }: { estado: Elegibilidade, showLabel?: boolean }) {
  let bg = '#ECFDF5', text = '#047857', border = '#047857', Icon = CheckCircle, label = 'Apto';
  
  if (estado === 'BLOQUEADO') {
    bg = '#FEE2E2'; text = '#991B1B'; border = '#991B1B'; Icon = Lock; label = 'Bloqueado';
  } else if (estado === 'VINCULO_ENCERRADO') {
    bg = '#F1F5F9'; text = '#64748B'; border = '#E2E8F0'; Icon = Archive; label = 'Vínculo Encerrado';
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: border }]}>
      <Icon size={10} color={text} />
      {showLabel && <Text style={[styles.text, { color: text, fontSize: 10 }]}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    gap: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  }
});
