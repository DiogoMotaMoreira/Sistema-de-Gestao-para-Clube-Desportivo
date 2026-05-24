/**
 * AtletaDetailScreen — Detalhe de um Atleta.
 */

import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { User, Calendar, Shield, Users, CreditCard } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { secretariaService } from '@/services/secretariaService';

const ESTADO_BADGE_MAP: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
  APTO: 'success',
  INAPTO: 'error',
  PENDENTE_EMD: 'warning',
  BLOQUEADO_FINANCEIRO: 'error',
};

interface AtletaDetailScreenProps {
  atletaId: number;
  onBack: () => void;
}

export function AtletaDetailScreen({
  atletaId,
  onBack,
}: AtletaDetailScreenProps): React.JSX.Element {
  const { data: atleta, isLoading } = useQuery({
    queryKey: ['atleta', atletaId],
    queryFn: () => secretariaService.getAtleta(atletaId),
  });

  if (isLoading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color={Colors.DOURADO_CTA} />
      </View>
    );
  }

  if (!atleta) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.errorText}>Atleta não encontrado.</Text>
        <Button label="Voltar" onPress={onBack} variant="secondary" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Button
        label="← Voltar à lista"
        onPress={onBack}
        variant="secondary"
        style={styles.backButton}
      />

      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {atleta.nomeCompleto.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{atleta.nomeCompleto}</Text>
            <Badge
              variant={ESTADO_BADGE_MAP[atleta.estadoElegibilidade] ?? 'neutral'}
              label={atleta.estadoElegibilidade}
            />
          </View>
        </View>

        <View style={styles.infoGrid}>
          <InfoRow label="Data Nascimento" value={atleta.dataNascimento} />
          <InfoRow label="NIF" value={atleta.nif ?? '—'} />
          <InfoRow label="Nº Sócio" value={atleta.numeroSocio ?? '—'} />
          <InfoRow label="Posição" value={atleta.posicao ?? '—'} />
          <InfoRow label="Equipa" value={atleta.equipaNome ?? 'Sem equipa'} />
          <InfoRow label="Encarregado" value={atleta.encarregadoNome} />
        </View>
      </Card>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.GRAY_50_FUNDO },
  content: { padding: 24, gap: 16 },
  centerBox: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  errorText: { fontSize: 14, color: Colors.ERRO_TEXT },
  backButton: { alignSelf: 'flex-start' },
  card: { gap: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.INFO_BG, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '700', color: Colors.INFO_TEXT },
  headerInfo: { flex: 1, gap: 6 },
  name: { fontSize: 20, fontWeight: '700', color: Colors.GRAY_900_TEXTO1 },
  infoGrid: {
    gap: 10, borderTopWidth: 1, borderTopColor: Colors.GRAY_200_BORDAS, paddingTop: 16,
  },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12, fontWeight: '500', color: Colors.GRAY_500_TEXTO2,
  },
  infoValue: { fontSize: 14, color: Colors.GRAY_900_TEXTO1 },
});
