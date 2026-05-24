/**
 * EncarregadoDetailScreen — Detalhe de um Encarregado de Educação.
 *
 * Mostra dados pessoais, situação financeira e lista de atletas associados.
 */

import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { User, Mail, Phone, MapPin, CreditCard, FileText } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { secretariaService } from '@/services/secretariaService';

interface EncarregadoDetailScreenProps {
  encarregadoId: number;
  onBack: () => void;
}

export function EncarregadoDetailScreen({
  encarregadoId,
  onBack,
}: EncarregadoDetailScreenProps): React.JSX.Element {
  const { data: ee, isLoading } = useQuery({
    queryKey: ['encarregado', encarregadoId],
    queryFn: () => secretariaService.getEncarregado(encarregadoId),
  });

  const { data: situacao } = useQuery({
    queryKey: ['encarregado-situacao', encarregadoId],
    queryFn: () => secretariaService.getEncarregadoSituacaoFinanceira(encarregadoId),
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.DOURADO_CTA} />
      </View>
    );
  }

  if (!ee) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Encarregado não encontrado.</Text>
        <Button label="Voltar" onPress={onBack} variant="secondary" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Back */}
      <Button
        label="← Voltar à lista"
        onPress={onBack}
        variant="secondary"
        style={styles.backButton}
      />

      {/* Info Card */}
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {ee.nome.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{ee.nome}</Text>
            <Text style={styles.nifLabel}>NIF: {ee.nif ?? 'Não definido'}</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <InfoRow icon={Mail} label="Email" value={ee.email ?? '—'} />
          <InfoRow icon={Phone} label="Telemóvel" value={ee.telemovel ?? '—'} />
          <InfoRow icon={MapPin} label="Morada" value={ee.morada ?? '—'} />
        </View>
      </Card>

      {/* Financial Summary */}
      {situacao && (
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Situação Financeira</Text>
          <View style={styles.financeRow}>
            <View style={styles.financeItem}>
              <Text style={styles.financeLabel}>Total em Dívida</Text>
              <Text style={[styles.financeValue, { color: Colors.ERRO_TEXT }]}>
                {Number(situacao.totalDivida).toFixed(2)} €
              </Text>
            </View>
            <View style={styles.financeItem}>
              <Text style={styles.financeLabel}>Total Pago</Text>
              <Text style={[styles.financeValue, { color: Colors.SUCESSO_TEXT }]}>
                {Number(situacao.totalPago).toFixed(2)} €
              </Text>
            </View>
          </View>

          {situacao.obrigacoes.length > 0 && (
            <View style={styles.obrigacoesList}>
              {situacao.obrigacoes.slice(0, 5).map((ob) => (
                <View key={ob.id} style={styles.obrigacaoRow}>
                  <View style={styles.obrigacaoInfo}>
                    <Text style={styles.obrigacaoTipo}>{ob.tipo}</Text>
                    <Text style={styles.obrigacaoData}>{ob.dataVencimento}</Text>
                  </View>
                  <View style={styles.obrigacaoRight}>
                    <Text style={styles.obrigacaoValor}>{Number(ob.valor).toFixed(2)} €</Text>
                    <Badge
                      variant={ob.estado === 'PAGO' ? 'success' : ob.estado === 'EM_ATRASO' ? 'error' : 'warning'}
                      label={ob.estado}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
        </Card>
      )}
    </ScrollView>
  );
}

function InfoRow({
  icon: IconComponent,
  label,
  value,
}: {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <View style={styles.infoRow}>
      <IconComponent size={16} color={Colors.GRAY_500_TEXTO2} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  errorText: {
    fontSize: 14,
    color: Colors.ERRO_TEXT,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  card: {
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.DOURADO_CTA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.PRETO_PRIMARIO,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
  },
  nifLabel: {
    fontSize: 13,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 2,
  },
  infoGrid: {
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.GRAY_200_BORDAS,
    paddingTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.GRAY_500_TEXTO2,
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.GRAY_900_TEXTO1,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.GRAY_900_TEXTO1,
  },
  financeRow: {
    flexDirection: 'row',
    gap: 16,
  },
  financeItem: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  financeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.GRAY_500_TEXTO2,
    marginBottom: 4,
  },
  financeValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  obrigacoesList: {
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.GRAY_200_BORDAS,
    paddingTop: 12,
  },
  obrigacaoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
  },
  obrigacaoInfo: {
    flex: 1,
  },
  obrigacaoTipo: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.GRAY_900_TEXTO1,
  },
  obrigacaoData: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 2,
  },
  obrigacaoRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  obrigacaoValor: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.GRAY_900_TEXTO1,
  },
});
