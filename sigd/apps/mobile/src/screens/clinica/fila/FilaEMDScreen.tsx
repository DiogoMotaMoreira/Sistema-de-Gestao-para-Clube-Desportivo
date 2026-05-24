/**
 * FilaEMDScreen — Lista de ocorrências pendentes de deliberação EMD.
 *
 * Apresenta cards com semáforo de restrição, tipo, dias pendente
 * e botão de detalhe. Suporta pull-to-refresh.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  ClipboardList,
  ChevronRight,
  Clock,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Card, Badge, EmptyState } from '@/components/ui';
import {
  clinicaService,
  type FilaEMDResponse,
  type GrauRestricaoDesportiva,
  TIPO_OCORRENCIA_LABELS,
  GRAU_LABELS,
} from '@/services/clinicaService';

// ── Props / Navigation ─────────────────────────────────

interface FilaEMDScreenProps {
  onNavigateToDetail?: (id: number) => void;
  onNavigateToCreate?: () => void;
}

// ── Helpers ─────────────────────────────────────────────

function getSemaforoConfig(grau: GrauRestricaoDesportiva) {
  switch (grau) {
    case 'VERDE':
      return { variant: 'success' as const, icon: ShieldCheck, label: GRAU_LABELS.VERDE };
    case 'AMARELO':
      return { variant: 'warning' as const, icon: ShieldAlert, label: GRAU_LABELS.AMARELO };
    case 'VERMELHO':
      return { variant: 'error' as const, icon: ShieldX, label: GRAU_LABELS.VERMELHO };
  }
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

// ── Component ──────────────────────────────────────────

export function FilaEMDScreen({
  onNavigateToDetail,
  onNavigateToCreate,
}: FilaEMDScreenProps): React.JSX.Element {
  const [items, setItems] = useState<FilaEMDResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const response = await clinicaService.getFilaEMD(0, 50);
      setItems(response.content);
    } catch (err) {
      setError('Não foi possível carregar a fila EMD');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Carregar na montagem
  React.useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    void fetchData();
  }, [fetchData]);

  // ── Loading ────────────────────────────────────────────

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.DOURADO_CTA} />
        <Text style={styles.loadingText}>A carregar fila EMD...</Text>
      </View>
    );
  }

  // ── Error ──────────────────────────────────────────────

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <EmptyState
          icon={AlertTriangle}
          title="Erro ao carregar"
          subtitle={error}
          ctaLabel="Tentar novamente"
          onCtaPress={() => { setLoading(true); void fetchData(); }}
        />
      </View>
    );
  }

  // ── Render Item ────────────────────────────────────────

  const renderItem = ({ item }: { item: FilaEMDResponse }) => {
    const semaforo = getSemaforoConfig(item.grauRestricao);
    const borderColor =
      item.grauRestricao === 'VERMELHO' ? Colors.ERRO_TEXT
      : item.grauRestricao === 'AMARELO' ? Colors.AVISO_TEXT
      : Colors.SUCESSO_TEXT;

    return (
      <Card style={styles.card} leftBorderColor={borderColor}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.atletaNome}>{item.atletaNome}</Text>
            <View style={styles.badgeRow}>
              <Badge
                variant={semaforo.variant}
                label={semaforo.label}
                icon={semaforo.icon}
              />
              <Badge
                variant="neutral"
                label={TIPO_OCORRENCIA_LABELS[item.tipo]}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => onNavigateToDetail?.(item.id)}
            accessibilityLabel={`Ver detalhe de ${item.atletaNome}`}
            accessibilityRole="button"
          >
            <Text style={styles.detailButtonText}>Detalhe</Text>
            <ChevronRight size={16} color={Colors.DOURADO_CTA} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.infoRow}>
            <Clock size={14} color={Colors.GRAY_500_TEXTO2} />
            <Text style={styles.infoText}>
              {formatDate(item.dataOcorrencia)}
            </Text>
          </View>
          <View style={styles.diasBadge}>
            <Text style={[
              styles.diasText,
              item.diasPendente > 7 && styles.diasTextUrgent,
            ]}>
              {item.diasPendente}d pendente{item.diasPendente !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {item.dataReavaliacao != null && (
          <Text style={styles.reavaliacaoText}>
            Reavaliação: {formatDate(item.dataReavaliacao)}
          </Text>
        )}
      </Card>
    );
  };

  // ── Main ───────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>
          Fila EMD ({items.length})
        </Text>
        {onNavigateToCreate && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={onNavigateToCreate}
            accessibilityLabel="Registar ocorrência"
            accessibilityRole="button"
          >
            <Text style={styles.createButtonText}>+ Nova Ocorrência</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          items.length === 0 && styles.emptyListContent,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.DOURADO_CTA}
            colors={[Colors.DOURADO_CTA]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon={ClipboardList}
            title="Fila EMD vazia"
            subtitle="Não existem ocorrências pendentes de deliberação."
            ctaLabel={onNavigateToCreate ? 'Registar Ocorrência' : undefined}
            onCtaPress={onNavigateToCreate}
          />
        }
      />
    </View>
  );
}

// ── Estilos ────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.GRAY_50_FUNDO,
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.GRAY_500_TEXTO2,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.BRANCO,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
  },
  createButton: {
    backgroundColor: Colors.DOURADO_CTA,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.PRETO_PRIMARIO,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  emptyListContent: {
    flex: 1,
  },
  card: {
    marginBottom: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  atletaNome: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.GRAY_900_TEXTO1,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(241, 196, 15, 0.08)',
    gap: 4,
  },
  detailButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.DOURADO_CTA,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.GRAY_100_HOVER,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    color: Colors.GRAY_500_TEXTO2,
  },
  diasBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: Colors.GRAY_100_HOVER,
  },
  diasText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.GRAY_500_TEXTO2,
  },
  diasTextUrgent: {
    color: Colors.ERRO_TEXT,
  },
  reavaliacaoText: {
    fontSize: 12,
    color: Colors.INFO_TEXT,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
