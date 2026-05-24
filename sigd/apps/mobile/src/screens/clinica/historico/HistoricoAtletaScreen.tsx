/**
 * HistoricoAtletaScreen — Histórico de ocorrências por atleta.
 *
 * Permite pesquisar atletas e visualizar as ocorrências
 * clínicas associadas com semáforo, tipo, data e estado EMD.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  FileSearch,
  User,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Card, Badge, EmptyState, SearchInput } from '@/components/ui';
import { secretariaService, type AtletaResponse } from '@/services/secretariaService';
import {
  clinicaService,
  type OcorrenciaResponse,
  type GrauRestricaoDesportiva,
  TIPO_OCORRENCIA_LABELS,
  GRAU_LABELS,
  ESTADO_EMD_LABELS,
} from '@/services/clinicaService';

// ── Props ──────────────────────────────────────────────

interface HistoricoAtletaScreenProps {
  onNavigateToDetail?: (id: number) => void;
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

function getEstadoEMDBadgeVariant(estado: string): 'warning' | 'success' | 'neutral' {
  switch (estado) {
    case 'EM_AVALIACAO': return 'warning';
    case 'DELIBERADO': return 'success';
    case 'ARQUIVADO': return 'neutral';
    default: return 'neutral';
  }
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

// ── Component ──────────────────────────────────────────

export function HistoricoAtletaScreen({
  onNavigateToDetail,
}: HistoricoAtletaScreenProps): React.JSX.Element {
  const [searchResults, setSearchResults] = useState<AtletaResponse[]>([]);
  const [selectedAtleta, setSelectedAtleta] = useState<AtletaResponse | null>(null);
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaResponse[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingOcorrencias, setLoadingOcorrencias] = useState(false);
  const [searched, setSearched] = useState(false);

  // ── Pesquisa de atletas ────────────────────────────────

  const handleSearch = useCallback(async (query: string) => {
    if (query.length === 0) {
      setSearchResults([]);
      setSelectedAtleta(null);
      setOcorrencias([]);
      setSearched(false);
      return;
    }

    try {
      setLoadingSearch(true);
      setSearched(true);
      const response = await secretariaService.getAtletas(query, undefined, 0, 10);
      setSearchResults(response.content);
    } catch {
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  }, []);

  // ── Selecionar atleta ──────────────────────────────────

  const handleSelectAtleta = useCallback(async (atleta: AtletaResponse) => {
    setSelectedAtleta(atleta);
    setSearchResults([]);

    try {
      setLoadingOcorrencias(true);
      const data = await clinicaService.getOcorrenciasPorAtleta(atleta.id);
      setOcorrencias(data);
    } catch {
      setOcorrencias([]);
    } finally {
      setLoadingOcorrencias(false);
    }
  }, []);

  // ── Render ─────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <SearchInput
          placeholder="Pesquisar atleta por nome..."
          onSearch={handleSearch}
          minChars={2}
        />

        {/* Resultados da pesquisa */}
        {loadingSearch && (
          <View style={styles.searchLoading}>
            <ActivityIndicator size="small" color={Colors.DOURADO_CTA} />
            <Text style={styles.searchLoadingText}>A pesquisar...</Text>
          </View>
        )}

        {!loadingSearch && searched && searchResults.length === 0 && selectedAtleta == null && (
          <Text style={styles.noResultsText}>Nenhum atleta encontrado</Text>
        )}

        {searchResults.length > 0 && (
          <View style={styles.searchResultsList}>
            {searchResults.map((atleta) => (
              <TouchableOpacity
                key={atleta.id}
                style={styles.searchResultItem}
                onPress={() => void handleSelectAtleta(atleta)}
                accessibilityLabel={`Selecionar ${atleta.nomeCompleto}`}
                accessibilityRole="button"
              >
                <User size={16} color={Colors.GRAY_500_TEXTO2} />
                <View style={styles.searchResultInfo}>
                  <Text style={styles.searchResultName}>{atleta.nomeCompleto}</Text>
                  <Text style={styles.searchResultTeam}>
                    {atleta.equipaNome ?? 'Sem equipa'} · {atleta.estadoElegibilidade}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Atleta selecionado */}
      {selectedAtleta != null && (
        <View style={styles.selectedAtleta}>
          <Card leftBorderColor={Colors.DOURADO_CTA}>
            <View style={styles.selectedRow}>
              <View style={styles.selectedAvatar}>
                <Text style={styles.selectedAvatarText}>
                  {selectedAtleta.nomeCompleto.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.selectedInfo}>
                <Text style={styles.selectedName}>{selectedAtleta.nomeCompleto}</Text>
                <Text style={styles.selectedTeam}>
                  {selectedAtleta.equipaNome ?? 'Sem equipa'}
                </Text>
              </View>
              <Badge
                variant={selectedAtleta.estadoElegibilidade === 'APTO' ? 'success' : 'warning'}
                label={selectedAtleta.estadoElegibilidade}
              />
            </View>
          </Card>
        </View>
      )}

      {/* Ocorrências do atleta */}
      {selectedAtleta != null && (
        loadingOcorrencias ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.DOURADO_CTA} />
          </View>
        ) : (
          <FlatList
            data={ocorrencias}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={[
              styles.listContent,
              ocorrencias.length === 0 && styles.emptyListContent,
            ]}
            renderItem={({ item }) => {
              const semaforo = getSemaforoConfig(item.grauRestricao);
              const estadoVariant = getEstadoEMDBadgeVariant(item.estadoEMD);

              return (
                <TouchableOpacity
                  onPress={() => onNavigateToDetail?.(item.id)}
                  activeOpacity={0.7}
                  accessibilityLabel={`Ocorrência de ${formatDate(item.dataOcorrencia)}`}
                  accessibilityRole="button"
                >
                  <Card style={styles.ocorrenciaCard}>
                    <View style={styles.ocorrenciaHeader}>
                      <Badge
                        variant={semaforo.variant}
                        label={semaforo.label}
                        icon={semaforo.icon}
                      />
                      <Badge
                        variant="neutral"
                        label={TIPO_OCORRENCIA_LABELS[item.tipo]}
                      />
                      <Badge
                        variant={estadoVariant}
                        label={ESTADO_EMD_LABELS[item.estadoEMD]}
                      />
                    </View>
                    <View style={styles.ocorrenciaBody}>
                      <Text style={styles.ocorrenciaDiagnostico} numberOfLines={2}>
                        {item.diagnostico}
                      </Text>
                      <Text style={styles.ocorrenciaDate}>
                        {formatDate(item.dataOcorrencia)}
                      </Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <EmptyState
                icon={FileSearch}
                title="Sem ocorrências"
                subtitle={`${selectedAtleta.nomeCompleto} não tem ocorrências clínicas registadas.`}
              />
            }
          />
        )
      )}

      {/* Estado inicial */}
      {selectedAtleta == null && !searched && (
        <View style={styles.initialState}>
          <EmptyState
            icon={FileSearch}
            title="Pesquisar atleta"
            subtitle="Introduza o nome do atleta para visualizar o historial clínico."
          />
        </View>
      )}
    </View>
  );
}

// ── Estilos ────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  searchSection: {
    padding: 16,
    backgroundColor: Colors.BRANCO,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
  },
  searchLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  searchLoadingText: {
    fontSize: 13,
    color: Colors.GRAY_500_TEXTO2,
  },
  noResultsText: {
    fontSize: 13,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 12,
    fontStyle: 'italic',
  },
  searchResultsList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
    overflow: 'hidden',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_100_HOVER,
    gap: 10,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.GRAY_900_TEXTO1,
  },
  searchResultTeam: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 2,
  },
  selectedAtleta: {
    padding: 16,
    paddingBottom: 0,
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.DOURADO_CTA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.PRETO_PRIMARIO,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.GRAY_900_TEXTO1,
  },
  selectedTeam: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  emptyListContent: {
    flex: 1,
  },
  ocorrenciaCard: {
    marginBottom: 2,
  },
  ocorrenciaHeader: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  ocorrenciaBody: {
    borderTopWidth: 1,
    borderTopColor: Colors.GRAY_100_HOVER,
    paddingTop: 10,
  },
  ocorrenciaDiagnostico: {
    fontSize: 13,
    color: Colors.GRAY_900_TEXTO1,
    lineHeight: 18,
  },
  ocorrenciaDate: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 6,
  },
  initialState: {
    flex: 1,
  },
});
