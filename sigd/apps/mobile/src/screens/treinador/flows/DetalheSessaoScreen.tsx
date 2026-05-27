import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '@/constants/colors';
import { treinadorService } from '@/services/treinadorService';
import { ArrowLeft, Clock, Dumbbell, Calendar, CheckCircle2, AlertTriangle, AlertCircle, XCircle } from 'lucide-react-native';

export function DetalheSessaoScreen({ route, navigation }: any): React.JSX.Element {
  const { sessaoId } = route.params;
  const [loading, setLoading] = useState(true);
  const [detalhe, setDetalhe] = useState<any>(null);

  useEffect(() => {
    navigation.setOptions({ title: 'Detalhes do Treino' });

    if (!sessaoId) {
      setLoading(false);
      return;
    }

    treinadorService.getSessaoDetalhe(sessaoId)
      .then(data => {
        setDetalhe(data);
      })
      .catch(e => {
        console.error('Erro ao carregar detalhes da sessão', e);
        Alert.alert('Erro', 'Não foi possível carregar os detalhes desta sessão.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sessaoId, navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.DOURADO_CTA} />
        <Text style={styles.loadingText}>A carregar detalhes...</Text>
      </View>
    );
  }

  if (!detalhe) {
    return (
      <View style={styles.emptyContainer}>
        <AlertCircle size={48} color="#991B1B" />
        <Text style={styles.emptyTitle}>Sessão não encontrada</Text>
        <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
          <Text style={styles.btnVoltarText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatarData = (dataStr: string) => {
    if (!dataStr) return '';
    const parts = dataStr.split('-');
    if (parts.length !== 3) return dataStr;
    const [ano, mes, dia] = parts;
    return `${dia}/${mes}/${ano}`;
  };

  const renderStatusBadge = (estado: string) => {
    if (estado === 'PRESENTE') {
      return (
        <View style={[styles.badge, styles.badgePresente]}>
          <CheckCircle2 size={12} color="#047857" />
          <Text style={[styles.badgeText, { color: '#047857' }]}>PRESENTE</Text>
        </View>
      );
    }
    if (estado === 'ATRASADO') {
      return (
        <View style={[styles.badge, styles.badgeAtrasado]}>
          <Clock size={12} color="#B45309" />
          <Text style={[styles.badgeText, { color: '#B45309' }]}>ATRASADO</Text>
        </View>
      );
    }
    return (
      <View style={[styles.badge, styles.badgeAusente]}>
        <XCircle size={12} color="#991B1B" />
        <Text style={[styles.badgeText, { color: '#991B1B' }]}>AUSENTE</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        
        {/* Card de Resumo de Sessão */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.iconBox}>
              <Dumbbell size={24} color="#000000" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.headerTitle}>Sessão de Treino</Text>
              <Text style={styles.headerSub}>{detalhe.equipaNome}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Calendar size={14} color={Colors.GRAY_500_TEXTO2} />
              <Text style={styles.metaValue}>{formatarData(detalhe.data)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={14} color={Colors.GRAY_500_TEXTO2} />
              <Text style={styles.metaValue}>{detalhe.horaInicio.substring(0, 5)} - {detalhe.horaFim.substring(0, 5)}</Text>
            </View>
          </View>
        </View>

        {/* Listagem de Atletas */}
        <Text style={styles.sectionTitle}>ASSIDUIDADE & AVALIAÇÃO DE RENDIMENTO</Text>

        <View style={styles.listCard}>
          {detalhe.detalhes && detalhe.detalhes.length === 0 ? (
            <View style={styles.emptyList}>
              <Text style={styles.emptyListText}>Sem atletas registados nesta sessão.</Text>
            </View>
          ) : (
            detalhe.detalhes.map((atleta: any, index: number) => {
              const hasNota = atleta.nota !== null && atleta.nota !== undefined;
              return (
                <View key={atleta.atletaId} style={[styles.atletaRow, index === detalhe.detalhes.length - 1 && { borderBottomWidth: 0 }]}>
                  <View style={styles.avatarMini}>
                    <Text style={styles.avatarMiniText}>{atleta.atletaNome.charAt(0)}</Text>
                  </View>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.atletaNome}>{atleta.atletaNome}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 4 }}>
                      {renderStatusBadge(atleta.estado)}
                    </View>
                  </View>

                  <View style={styles.notaBox}>
                    <Text style={styles.notaLabel}>NOTA</Text>
                    <Text style={[styles.notaValue, hasNota ? styles.notaValueActive : styles.notaValueInactive]}>
                      {hasNota ? Number(atleta.nota).toFixed(1) : '—'}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

      </ScrollView>

      {/* Footer com botão de voltar */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnVoltarLarga} onPress={() => navigation.goBack()}>
          <ArrowLeft size={16} color="#000000" style={{ marginRight: 8 }} />
          <Text style={styles.btnVoltarLargaText}>Voltar ao Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.GRAY_500_TEXTO2,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#991B1B',
    marginTop: 16,
    marginBottom: 24,
  },
  btnVoltar: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
  },
  btnVoltarText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.GRAY_900_TEXTO1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  headerCard: {
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: Colors.PRETO_PRIMARIO,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.DOURADO_CTA,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 14,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.GRAY_200_BORDAS,
    marginVertical: 14,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaValue: {
    fontSize: 13,
    color: Colors.GRAY_900_TEXTO1,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.GRAY_500_TEXTO2,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  listCard: {
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 16,
    padding: 4,
    shadowColor: Colors.PRETO_PRIMARIO,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyList: {
    padding: 24,
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 14,
    color: Colors.GRAY_500_TEXTO2,
    fontStyle: 'italic',
  },
  atletaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  avatarMini: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.GRAY_50_FUNDO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMiniText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.GRAY_500_TEXTO2,
  },
  atletaNome: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  badgePresente: {
    backgroundColor: '#ECFDF5',
  },
  badgeAtrasado: {
    backgroundColor: '#FFFBEB',
  },
  badgeAusente: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  notaBox: {
    alignItems: 'center',
    minWidth: 48,
  },
  notaLabel: {
    fontSize: 8,
    fontWeight: '600',
    color: Colors.GRAY_500_TEXTO2,
    marginBottom: 2,
  },
  notaValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  notaValueActive: {
    color: '#0F172A',
  },
  notaValueInactive: {
    color: Colors.GRAY_200_BORDAS,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.BRANCO,
    borderTopWidth: 1,
    borderTopColor: Colors.GRAY_200_BORDAS,
    padding: 16,
  },
  btnVoltarLarga: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.DOURADO_CTA,
    height: 52,
    borderRadius: 12,
  },
  btnVoltarLargaText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
});
