import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@/constants/colors';
import { treinadorService, AtletaPlantel } from '@/services/treinadorService';
import { SemaforoBadge } from '../components/SemaforoBadge';
import { CheckCircle, Minus } from 'lucide-react-native';

export function PerfilAtletaScreen({ route, navigation }: any): React.JSX.Element {
  const { atletaId } = route.params;
  const [atleta, setAtleta] = useState<AtletaPlantel | null>(null);

  useEffect(() => {
    navigation.setOptions({ title: 'Perfil do Atleta' });
    // Mock fetch
    treinadorService.getPlantel(1).then(plantel => {
      const a = plantel.find(p => p.id === atletaId);
      if (a) setAtleta(a);
    });
  }, [atletaId, navigation]);

  if (!atleta) return <View style={styles.container} />;

  const corAssiduidade = (atleta.assiduidade ?? 0) >= 80 ? '#047857' : (atleta.assiduidade ?? 0) >= 60 ? '#B45309' : '#991B1B';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Identificação */}
      <View style={styles.idCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{atleta.nome.charAt(0)}</Text>
        </View>
        <Text style={styles.nome}>{atleta.nome}</Text>
        <Text style={styles.meta}>{atleta.posicao} · Sub-15 · {atleta.idade} anos</Text>
        <View style={styles.badgeContainer}>
          <SemaforoBadge estado={atleta.semaforo} size="md" />
        </View>
      </View>

      {/* Estatísticas Recentes */}
      <Text style={styles.sectionTitle}>ESTATÍSTICAS RECENTES</Text>
      <View style={styles.statsCard}>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Taxa de Assiduidade (4 sem.)</Text>
            <Text style={[styles.statValue, { color: corAssiduidade }]}>
              {atleta.assiduidade ? `${atleta.assiduidade}%` : '—'}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Avaliação Média (5 sess.)</Text>
            <Text style={styles.statValue}>
              {atleta.mediaAvaliacao ? `${atleta.mediaAvaliacao.toFixed(1)} / 5.0` : '—'}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Minutos Esta Época</Text>
            <Text style={styles.statValue}>
              {atleta.minutosEpoca ? `${atleta.minutosEpoca} min` : '—'}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Convocatórias Esta Época</Text>
            <Text style={styles.statValue}>
              {atleta.convocatoriasEpoca ?? '—'}
            </Text>
          </View>
        </View>
      </View>

      {/* Últimas Convocatórias */}
      <Text style={styles.sectionTitle}>ÚLTIMAS CONVOCATÓRIAS</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.convocatoriasList}>
        {/* Mock das últimas convocatórias */}
        <View style={[styles.convPill, styles.convPillConvocado]}>
          <CheckCircle size={14} color="#047857" />
          <Text style={[styles.convPillText, { color: '#047857' }]}>14 Jun</Text>
        </View>
        <View style={[styles.convPill, styles.convPillNaoConvocado]}>
          <Minus size={14} color={Colors.GRAY_500_TEXTO2} />
          <Text style={[styles.convPillText, { color: Colors.GRAY_500_TEXTO2 }]}>07 Jun</Text>
        </View>
        <View style={[styles.convPill, styles.convPillConvocado]}>
          <CheckCircle size={14} color="#047857" />
          <Text style={[styles.convPillText, { color: '#047857' }]}>30 Mai</Text>
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  idCard: {
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.GRAY_200_BORDAS,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.GRAY_500_TEXTO2,
  },
  nome: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    textAlign: 'center',
  },
  meta: {
    fontSize: 14,
    color: Colors.GRAY_500_TEXTO2,
    marginBottom: 16,
    textAlign: 'center',
  },
  badgeContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.GRAY_500_TEXTO2,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  statsCard: {
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statBox: {
    width: '50%',
    padding: 12,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  convocatoriasList: {
    flexDirection: 'row',
  },
  convPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    gap: 6,
  },
  convPillConvocado: {
    backgroundColor: '#ECFDF5',
  },
  convPillNaoConvocado: {
    backgroundColor: '#F1F5F9',
  },
  convPillText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
