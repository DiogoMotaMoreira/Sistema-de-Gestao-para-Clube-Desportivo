import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CheckSquare, Lock, Ban } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { treinadorService, AtletaPlantel } from '@/services/treinadorService';
import { SemaforoBadge } from '../components/SemaforoBadge';

type EstadoChamada = 'PRESENTE' | 'ATRASADO' | 'AUSENTE' | 'POR_MARCAR';

export function ChamadaScreen({ route, navigation }: any): React.JSX.Element {
  const { eventoId } = route.params;
  const [plantel, setPlantel] = useState<AtletaPlantel[]>([]);
  const [estados, setEstados] = useState<Record<number, EstadoChamada>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      title: 'Chamada',
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 16 }} onPress={handleMarcarTodos}>
          <CheckSquare size={24} color={Colors.DOURADO_CTA} />
        </TouchableOpacity>
      )
    });

    setIsLoading(true);
    treinadorService.getSessao(eventoId)
      .then(sessao => {
        navigation.setOptions({ title: `Chamada — ${sessao.horaInicio.substring(0, 5)}` });
        return treinadorService.getPlantel(sessao.equipaId);
      })
      .then(p => {
        setPlantel(p);
        const est: Record<number, EstadoChamada> = {};
        p.forEach(a => {
          if (a.semaforo.startsWith('INAPTO')) {
             est[a.id] = 'AUSENTE'; // Ou POR_MARCAR e lidar no bloqueio
          } else {
             est[a.id] = 'POR_MARCAR';
          }
        });
        setEstados(est);
      })
      .catch(e => {
        console.error('Erro ao carregar chamada', e);
        Alert.alert('Erro', 'Não foi possível carregar a sessão de treino.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [eventoId, navigation]);

  const handleMarcarTodos = () => {
    const newEst = { ...estados };
    plantel.forEach(a => {
      if (!a.semaforo.startsWith('INAPTO')) {
        newEst[a.id] = 'PRESENTE';
      }
    });
    setEstados(newEst);
  };

  const setEstadoAtleta = (id: number, e: EstadoChamada) => {
    setEstados(prev => ({ ...prev, [id]: e }));
  };

  const submitChamada = async () => {
    await treinadorService.submeterChamada(eventoId, Object.keys(estados).map(k => ({ atletaId: Number(k), estado: estados[Number(k)] })));
    navigation.navigate('AvaliacaoSessao', { eventoId });
  };

  const countP = Object.values(estados).filter(e => e === 'PRESENTE').length;
  const countA = Object.values(estados).filter(e => e === 'ATRASADO').length;
  const countF = Object.values(estados).filter(e => e === 'AUSENTE').length;
  const countM = Object.values(estados).filter(e => e === 'POR_MARCAR').length;

  const isReady = countM === 0;

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
         <ActivityIndicator size="large" color="#0F172A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sticky Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progCol}>
          <Text style={styles.progLabel}>PRESENTES</Text>
          <Text style={[styles.progVal, { color: '#047857' }]}>{countP}</Text>
        </View>
        <View style={styles.progCol}>
          <Text style={styles.progLabel}>ATRASADOS</Text>
          <Text style={[styles.progVal, { color: '#B45309' }]}>{countA}</Text>
        </View>
        <View style={styles.progCol}>
          <Text style={styles.progLabel}>AUSENTES</Text>
          <Text style={[styles.progVal, { color: '#991B1B' }]}>{countF}</Text>
        </View>
        <View style={styles.progCol}>
          <Text style={styles.progLabel}>POR MARCAR</Text>
          <Text style={[styles.progVal, countM > 0 ? { color: '#991B1B' } : { color: '#0F172A' }]}>{countM}</Text>
        </View>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {plantel.map(atleta => {
          const state = estados[atleta.id] || 'POR_MARCAR';
          const isInapto = atleta.semaforo.startsWith('INAPTO');
          
          if (isInapto) {
            const isEmd = atleta.semaforo === 'INAPTO_EMD';
            const badgeLabel = isEmd ? 'EMD em Falta' : 'Baixa Médica';

            return (
              <View key={atleta.id} style={[styles.card, styles.cardInapto, { backgroundColor: '#F8FAFC' }]}>
                <View style={{ flex: 1 }}>
                   <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                     <View style={styles.avatarMini}><Text style={styles.avatarMiniText}>{atleta.nome.charAt(0)}</Text></View>
                     <Text style={[styles.nome, { color: Colors.GRAY_500_TEXTO2 }]}>{atleta.nome}</Text>
                   </View>
                   <View style={{ flexDirection: 'row', marginTop: 8 }}>
                     <View style={[styles.badge, { backgroundColor: '#FEE2E2', borderColor: '#FECACA' }]}>
                       <Ban size={10} color="#991B1B" />
                       <Text style={[styles.badgeText, { color: '#991B1B', marginLeft: 4 }]}>{badgeLabel}</Text>
                     </View>
                   </View>
                </View>
                <View style={[styles.chipsContainer, { opacity: 0.5 }]}>
                  <View style={[styles.chip, styles.chipDisabled]}><Text style={styles.chipTextDisabled}>P</Text></View>
                  <View style={[styles.chip, styles.chipDisabled]}><Text style={styles.chipTextDisabled}>A</Text></View>
                  <View style={[styles.chip, styles.chipDisabled]}><Text style={styles.chipTextDisabled}>F</Text></View>
                  <Lock size={16} color={Colors.GRAY_500_TEXTO2} style={{ marginLeft: 8 }} />
                </View>
              </View>
            );
          }

          let bg: string = Colors.BRANCO;
          let border: string = Colors.GRAY_200_BORDAS;
          if (state === 'PRESENTE') { bg = '#ECFDF5'; border = '#047857'; }
          if (state === 'ATRASADO') { bg = '#FFFBEB'; border = '#B45309'; }
          if (state === 'AUSENTE') { bg = '#FEE2E2'; border = '#991B1B'; }

          return (
            <View key={atleta.id} style={[styles.card, { backgroundColor: bg, borderColor: border }]}>
               <View style={{ flex: 1 }}>
                   <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                     <View style={styles.avatarMini}><Text style={styles.avatarMiniText}>{atleta.nome.charAt(0)}</Text></View>
                     <Text style={styles.nome}>{atleta.nome}</Text>
                   </View>
                   <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                     <Text style={styles.posicao}>{atleta.posicao}</Text>
                     <SemaforoBadge estado={atleta.semaforo} size="sm" />
                   </View>
               </View>
               <View style={styles.chipsContainer}>
                  <TouchableOpacity style={[styles.chip, state === 'PRESENTE' && styles.chipP]} onPress={() => setEstadoAtleta(atleta.id, 'PRESENTE')}>
                    <Text style={[styles.chipText, state === 'PRESENTE' && { color: '#047857' }]}>P</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.chip, state === 'ATRASADO' && styles.chipA]} onPress={() => setEstadoAtleta(atleta.id, 'ATRASADO')}>
                    <Text style={[styles.chipText, state === 'ATRASADO' && { color: '#B45309' }]}>A</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.chip, state === 'AUSENTE' && styles.chipF]} onPress={() => setEstadoAtleta(atleta.id, 'AUSENTE')}>
                    <Text style={[styles.chipText, state === 'AUSENTE' && { color: '#991B1B' }]}>F</Text>
                  </TouchableOpacity>
               </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Footer Fixo */}
      <View style={styles.footer}>
         <TouchableOpacity 
           style={[styles.btnAvançar, !isReady && styles.btnAvançarDisabled]} 
           disabled={!isReady}
           onPress={submitChamada}
         >
           <Text style={[styles.btnAvançarText, !isReady && styles.btnAvançarTextDisabled]}>Avançar para Avaliação</Text>
         </TouchableOpacity>
         {!isReady && (
           <Text style={styles.footerSub}>Atribua estado a {countM} atleta(s) em falta para continuar</Text>
         )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  progressContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.BRANCO,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  progCol: {
    flex: 1,
    alignItems: 'center',
  },
  progLabel: {
    fontSize: 10,
    color: Colors.GRAY_500_TEXTO2,
    fontWeight: '600',
    marginBottom: 4,
  },
  progVal: {
    fontSize: 16,
    fontWeight: '700',
  },
  list: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    minHeight: 80,
    marginBottom: 8,
  },
  cardInapto: {
    backgroundColor: '#F8FAFC',
    borderColor: Colors.GRAY_200_BORDAS,
    opacity: 0.6,
  },
  avatarMini: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.GRAY_200_BORDAS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMiniText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.GRAY_500_TEXTO2,
  },
  nome: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  posicao: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipP: { backgroundColor: '#ECFDF5', borderColor: '#047857' },
  chipA: { backgroundColor: '#FFFBEB', borderColor: '#B45309' },
  chipF: { backgroundColor: '#FEE2E2', borderColor: '#991B1B' },
  chipDisabled: {
    backgroundColor: '#F1F5F9',
    opacity: 0.5,
  },
  chipText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.GRAY_500_TEXTO2,
  },
  chipTextDisabled: {
    fontSize: 16,
    fontWeight: '700',
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
  btnAvançar: {
    backgroundColor: Colors.DOURADO_CTA,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAvançarDisabled: {
    backgroundColor: '#F1F5F9',
  },
  btnAvançarText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  btnAvançarTextDisabled: {
    color: Colors.GRAY_500_TEXTO2,
  },
  footerSub: {
    fontSize: 11,
    color: Colors.GRAY_500_TEXTO2,
    textAlign: 'center',
    marginTop: 8,
  },
});
