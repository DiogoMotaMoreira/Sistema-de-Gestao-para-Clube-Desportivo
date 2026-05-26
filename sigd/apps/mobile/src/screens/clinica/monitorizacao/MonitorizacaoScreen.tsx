import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Calendar, Search, Activity, Info } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { clinicaService, OcorrenciaResponse } from '@/services/clinicaService';
import { useFocusEffect } from '@react-navigation/native';

interface MonitorData extends OcorrenciaResponse {
  grauAtual: string;
}

export function MonitorizacaoScreen(): React.JSX.Element {
  const [filterType, setFilterType] = useState<'TODOS' | 'INAPTO' | 'CONDICIONADO'>('TODOS');
  const [search, setSearch] = useState('');
  const [ocorrencias, setOcorrencias] = useState<MonitorData[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const fetchOcorrencias = async () => {
        setLoading(true);
        try {
          const data = await clinicaService.getOcorrenciasAtivas();
          const mapped: MonitorData[] = await Promise.all(
            data.map(async (oc) => {
              try {
                const evs = await clinicaService.getEvolucoes(oc.id);
                const grauAtual = evs.length > 0 ? evs[evs.length - 1].grauRestricao : oc.grauRestricao;
                return { ...oc, grauAtual };
              } catch {
                return { ...oc, grauAtual: oc.grauRestricao };
              }
            })
          );
          if (isActive) setOcorrencias(mapped);
        } catch (error) {
          console.error(error);
        } finally {
          if (isActive) setLoading(false);
        }
      };
      fetchOcorrencias();
      return () => { isActive = false; };
    }, [])
  );

  const filtrados = ocorrencias.filter(a => {
    if (filterType === 'INAPTO' && a.grauAtual !== 'VERMELHO') return false;
    if (filterType === 'CONDICIONADO' && a.grauAtual !== 'AMARELO') return false;
    if (search && !(a.atletaNome || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const reavaliacoesProximas = ocorrencias.filter(o => {
    if (!o.dataReavaliacao) return false;
    const reav = new Date(o.dataReavaliacao);
    const now = new Date();
    const diff = reav.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days >= 0 && days <= 7;
  }).sort((a, b) => new Date(a.dataReavaliacao!).getTime() - new Date(b.dataReavaliacao!).getTime());

  return (
    <View style={styles.container}>
      {/* Alerta de Reavaliações */}
      <View style={styles.alertCard}>
        <View style={styles.alertHeader}>
          <Calendar size={16} color="#B45309" />
          <Text style={styles.alertTitle}>Reavaliações Clínicas nos Próximos 7 Dias</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.alertList}>
          {reavaliacoesProximas.length > 0 ? (
            reavaliacoesProximas.map(r => (
              <TouchableOpacity key={r.id} style={styles.alertPill}>
                <Text style={styles.alertPillName}>{r.atletaNome}</Text>
                <Text style={styles.alertPillMeta}>Reavaliação: {r.dataReavaliacao}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ fontSize: 13, color: Colors.GRAY_500_TEXTO2 }}>Sem reavaliações nos próximos 7 dias.</Text>
          )}
        </ScrollView>
      </View>

      {/* Barra de Filtros */}
      <View style={styles.filtersBar}>
        <View style={styles.toggleGroup}>
          <TouchableOpacity
            style={[styles.toggleBtn, filterType === 'TODOS' && styles.toggleBtnActiveTodos]}
            onPress={() => setFilterType('TODOS')}
          >
            <Text style={[styles.toggleText, filterType === 'TODOS' && styles.toggleTextActiveTodos]}>Todos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, filterType === 'INAPTO' && styles.toggleBtnActiveInapto]}
            onPress={() => setFilterType('INAPTO')}
          >
            <Text style={[styles.toggleTextInapto, filterType === 'INAPTO' && styles.toggleTextActiveInapto]}>Inaptos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, filterType === 'CONDICIONADO' && styles.toggleBtnActiveCondicionado]}
            onPress={() => setFilterType('CONDICIONADO')}
          >
            <Text style={[styles.toggleTextCondicionado, filterType === 'CONDICIONADO' && styles.toggleTextActiveCondicionado]}>Condicionados</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={16} color={Colors.GRAY_500_TEXTO2} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar atleta..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Tabela de Monitorização */}
      <View style={styles.tableContainer}>
        {/* Cabeçalho */}
        <View style={styles.tableHeader}>
          <Text style={[styles.th, { flex: 2 }]}>ATLETA</Text>
          <Text style={[styles.th, { flex: 2 }]}>DIAGNÓSTICO</Text>
          <Text style={[styles.th, { flex: 1 }]}>DATA OCORRÊNCIA</Text>
          <Text style={[styles.th, { flex: 2 }]}>GRAU ATUAL</Text>
          <Text style={[styles.th, { flex: 1 }]}>REAVALIAÇÃO</Text>
        </View>

        {/* Linhas */}
        <ScrollView>
          {loading ? (
            <View style={{ padding: 32, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={Colors.DOURADO_CTA} />
            </View>
          ) : filtrados.length === 0 ? (
            <View style={{ padding: 32, alignItems: 'center' }}>
              <Text style={{ color: Colors.GRAY_500_TEXTO2 }}>Sem ocorrências ativas.</Text>
            </View>
          ) : (
            filtrados.map(a => {
              const grauColor = a.grauAtual === 'VERMELHO' ? '#991B1B' : '#B45309';
              const grauBg = a.grauAtual === 'VERMELHO' ? '#FEE2E2' : '#FFFBEB';
              const grauLabel = a.grauAtual === 'VERMELHO' ? 'Interrupção Total' : 'Restrição Condicionada';
              
              return (
                <View key={a.id} style={styles.tr}>
                  <Text style={[styles.tdBold, { flex: 2 }]}>{a.atletaNome}</Text>
                  <Text style={[styles.td, { flex: 2 }]}>{a.diagnostico}</Text>
                  <Text style={[styles.td, { flex: 1 }]}>{a.dataOcorrencia}</Text>
                  <View style={[styles.tdContent, { flex: 2 }]}>
                    <View style={[styles.badge, { backgroundColor: grauBg }]}>
                      <Activity size={12} color={grauColor} />
                      <Text style={[styles.badgeText, { color: grauColor }]}>{grauLabel}</Text>
                    </View>
                  </View>
                  <View style={[styles.tdContent, { flex: 1 }]}>
                    {a.dataReavaliacao ? (
                      <Text style={styles.tdMono}>{a.dataReavaliacao}</Text>
                    ) : (
                      <Text style={styles.td}>—</Text>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>

      {/* Footer Info */}
      <View style={styles.footerInfo}>
        <Info size={12} color={Colors.GRAY_500_TEXTO2} />
        <Text style={styles.footerInfoText}>
          O grau de restrição indicado reflete a evolução médica mais recente. Atletas em estado inativo não constam da listagem principal até deliberação do corpo médico.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
    padding: 24,
  },
  alertCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#B45309',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B45309',
  },
  alertList: {
    flexDirection: 'row',
  },
  alertPill: {
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  alertPillName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
  },
  alertPillMeta: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 2,
  },
  filtersBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
  },
  toggleBtnActiveTodos: {
    backgroundColor: Colors.DOURADO_CTA,
    borderColor: Colors.DOURADO_CTA,
  },
  toggleText: {
    color: Colors.GRAY_900_TEXTO1,
    fontSize: 14,
  },
  toggleTextActiveTodos: {
    fontWeight: '600',
  },
  toggleBtnActiveInapto: {
    backgroundColor: '#FEE2E2',
    borderColor: '#991B1B',
  },
  toggleTextInapto: {
    color: '#991B1B',
    fontSize: 14,
  },
  toggleTextActiveInapto: {
    fontWeight: '600',
  },
  toggleBtnActiveCondicionado: {
    backgroundColor: '#FFFBEB',
    borderColor: '#B45309',
  },
  toggleTextCondicionado: {
    color: '#B45309',
    fontSize: 14,
  },
  toggleTextActiveCondicionado: {
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
    paddingHorizontal: 12,
    width: 250,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.GRAY_50_FUNDO,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
  },
  th: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.GRAY_500_TEXTO2,
    textTransform: 'uppercase',
  },
  tr: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
    alignItems: 'center',
  },
  tdBold: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
  },
  td: {
    fontSize: 14,
    color: Colors.GRAY_900_TEXTO1,
  },
  tdContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tdMono: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
    gap: 8,
  },
  footerInfoText: {
    flex: 1,
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
  },
});
