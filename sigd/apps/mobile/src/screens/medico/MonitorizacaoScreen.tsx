import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Activity, Calendar, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { useQuery } from '@tanstack/react-query';
import { clinicaService, OcorrenciaResponse } from '../../services/clinicaService';

export function MonitorizacaoScreen(): React.JSX.Element {
  const { data: ocorrencias = [], isLoading, isError } = useQuery({
    queryKey: ['ocorrenciasAtivas'],
    queryFn: clinicaService.getOcorrenciasAtivas
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.GRAY_900_TEXTO1} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <AlertCircle size={48} color={Colors.GRAY_200_BORDAS} />
        <Text style={styles.emptyTitle}>Erro ao carregar dados</Text>
      </View>
    );
  }

  const hoje = new Date();
  const duasSemanas = new Date();
  duasSemanas.setDate(hoje.getDate() + 14);

  const reavaliacoesProximas = ocorrencias.filter(o => {
    if (!o.dataReavaliacao) return false;
    const dataReav = new Date(o.dataReavaliacao);
    return dataReav >= hoje && dataReav <= duasSemanas;
  }).sort((a, b) => new Date(a.dataReavaliacao!).getTime() - new Date(b.dataReavaliacao!).getTime());

  const renderOcorrenciaCard = (o: OcorrenciaResponse, showReavDate = false) => {
    let color = '#047857';
    if (o.grauRestricao === 'AMARELO') color = '#B45309';
    if (o.grauRestricao === 'VERMELHO') color = '#991B1B';

    return (
      <View key={o.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.nome}>{o.atletaNome}</Text>
          <View style={[styles.badge, { borderColor: color }]}>
            <Text style={[styles.badgeText, { color }]}>{o.grauRestricao}</Text>
          </View>
        </View>
        <Text style={styles.diagnostico}>{o.diagnostico}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.footerItem}>
            <Activity size={14} color={Colors.GRAY_500_TEXTO2} />
            <Text style={styles.footerText}>{o.tipo}</Text>
          </View>
          {showReavDate && o.dataReavaliacao && (
            <View style={styles.footerItem}>
              <Calendar size={14} color="#B45309" />
              <Text style={[styles.footerText, { color: '#B45309', fontWeight: '600' }]}>
                Reavaliar a {new Date(o.dataReavaliacao).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Monitorização</Text>
        <Text style={styles.subtitle}>{ocorrencias.length} atletas sob observação clínica ativa.</Text>
      </View>

      <Text style={styles.sectionTitle}>Reavaliações Próximas (14 dias)</Text>
      {reavaliacoesProximas.length === 0 ? (
        <View style={styles.emptyState}>
          <CheckCircle size={32} color={Colors.GRAY_200_BORDAS} />
          <Text style={styles.emptyText}>Sem reavaliações agendadas</Text>
        </View>
      ) : (
        reavaliacoesProximas.map(o => renderOcorrenciaCard(o, true))
      )}

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Atletas em Acompanhamento</Text>
      {ocorrencias.length === 0 ? (
        <View style={styles.emptyState}>
          <CheckCircle size={32} color={Colors.GRAY_200_BORDAS} />
          <Text style={styles.emptyText}>Sem ocorrências ativas</Text>
        </View>
      ) : (
        ocorrencias.map(o => renderOcorrenciaCard(o))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.GRAY_50_FUNDO },
  content: { padding: 16, paddingBottom: 80 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.GRAY_900_TEXTO1 },
  subtitle: { fontSize: 14, color: Colors.GRAY_500_TEXTO2, marginTop: 4 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: Colors.GRAY_500_TEXTO2, marginBottom: 12, textTransform: 'uppercase' },
  card: { backgroundColor: Colors.BRANCO, borderRadius: 8, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  nome: { fontSize: 16, fontWeight: '600', color: Colors.GRAY_900_TEXTO1, flex: 1 },
  badge: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, marginLeft: 8 },
  badgeText: { fontSize: 10, fontWeight: '600' },
  diagnostico: { fontSize: 14, color: Colors.GRAY_500_TEXTO2, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', gap: 16, borderTopWidth: 1, borderTopColor: Colors.GRAY_50_FUNDO, paddingTop: 12 },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { fontSize: 12, color: Colors.GRAY_500_TEXTO2 },
  emptyState: { padding: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.BRANCO, borderRadius: 8, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderStyle: 'dashed' },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: Colors.GRAY_900_TEXTO1, marginTop: 16 },
  emptyText: { fontSize: 14, color: Colors.GRAY_500_TEXTO2, marginTop: 8 },
});
