import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@/constants/colors';
import { treinadorService, AtletaPlantel, SemaforoClinico, EstatisticasAtleta } from '@/services/treinadorService';
import { SemaforoBadge } from '../components/SemaforoBadge';
import { CheckCircle, Minus } from 'lucide-react-native';

export function PerfilAtletaScreen({ route, navigation }: any): React.JSX.Element {
  const { atletaId } = route.params;
  const [atleta, setAtleta] = useState<AtletaPlantel | null>(null);
  const [stats, setStats] = useState<EstatisticasAtleta | null>(null);

  useEffect(() => {
    navigation.setOptions({ title: 'Perfil do Atleta' });
    const equipaId = 1;
    Promise.all([
      treinadorService.getPlantel(equipaId),
      treinadorService.getSemaforoPlantel(equipaId)
    ]).then(([plantel, semaforoData]) => {
      const a = plantel.find(p => p.id === atletaId);
      if (a) {
        const semaforoReal = semaforoData.find(s => s.atletaId === atletaId)?.semaforo;
        
        let semaforoMapeado: SemaforoClinico = 'APTO';
        if (semaforoReal === 'AMARELO') semaforoMapeado = 'CONDICIONADO';
        else if (semaforoReal === 'VERMELHO') semaforoMapeado = 'INAPTO_EMD';
        else if (semaforoReal === 'BLOQUEADO') semaforoMapeado = 'INAPTO_LESAO';
        
        setAtleta({
          ...a,
          semaforo: semaforoMapeado
        });
      }
    }).catch(() => {});
    treinadorService.getEstatisticasAtleta(atletaId)
      .then(setStats)
      .catch(() => {});
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
      <Text style={styles.sectionTitle}>ESTATÍSTICAS REAIS</Text>
      <View style={styles.statsCard}>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Taxa de Presença</Text>
            <Text style={[styles.statValue, {
              color: (stats?.taxaPresenca ?? 0) >= 80 ? '#047857' : (stats?.taxaPresenca ?? 0) >= 60 ? '#B45309' : '#991B1B'
            }]}>
              {stats ? `${stats.taxaPresenca.toFixed(1)}%` : '—'}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Avaliação Média</Text>
            <Text style={styles.statValue}>
              {stats ? (stats.avaliacaoMedia > 0 ? `${stats.avaliacaoMedia.toFixed(1)} / 5.0` : '—') : '—'}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Presenças</Text>
            <Text style={styles.statValue}>
              {stats ? `${stats.presencas}` : '—'}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Sessões</Text>
            <Text style={styles.statValue}>
              {stats ? `${stats.totalSessoes}` : '—'}
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
