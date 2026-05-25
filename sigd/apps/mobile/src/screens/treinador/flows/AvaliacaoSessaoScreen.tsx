import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '@/constants/colors';
import { treinadorService, AtletaPlantel } from '@/services/treinadorService';
import { Check, Lock } from 'lucide-react-native';

export function AvaliacaoSessaoScreen({ route, navigation }: any): React.JSX.Element {
  const { eventoId } = route.params;
  const [plantel, setPlantel] = useState<AtletaPlantel[]>([]);
  const [notas, setNotas] = useState<Record<number, number | null>>({});

  useEffect(() => {
    navigation.setOptions({
      title: 'Avaliação — 17:00',
      headerRight: () => (
        <View style={{ marginRight: 16 }}>
           <Text style={{ fontSize: 12, color: '#047857', fontWeight: '700' }}>4h 30m</Text>
        </View>
      )
    });

    treinadorService.getPlantel(1).then(p => {
      // Mock: Assumir que só os aptos/condicionados estiveram presentes na chamada
      const presentes = p.filter(a => !a.semaforo.startsWith('INAPTO'));
      setPlantel(presentes);
      
      const n: Record<number, number> = {};
      presentes.forEach(a => n[a.id] = 3.0);
      setNotas(n);
    });
  }, [eventoId, navigation]);

  const handleChangeNota = (id: number, delta: number) => {
    setNotas(prev => {
      let current = prev[id];
      if (current === null) current = 3.0; // recover from null
      let nova = current + delta;
      if (nova < 0.0) nova = 0.0;
      if (nova > 5.0) nova = 5.0;
      return { ...prev, [id]: nova };
    });
  };

  const handleLimpar = (id: number) => {
    setNotas(prev => ({ ...prev, [id]: null }));
  };

  const submitAvaliacao = async () => {
    try {
      const arr = Object.keys(notas).map(k => ({ atletaId: Number(k), nota: notas[Number(k)] }));
      await treinadorService.submeterAvaliacao(eventoId, arr);
      
      Alert.alert('Sucesso', 'Sessão submetida com sucesso');
      navigation.navigate('Hoje');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível submeter a avaliação.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Apenas atletas presentes na chamada · Escala: 0.0–5.0, incremento 0.5</Text>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {plantel.map(atleta => {
          const nota = notas[atleta.id];
          const hasNota = nota !== null;

          return (
            <View key={atleta.id} style={styles.card}>
               <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                 <View style={styles.avatarMini}><Text style={styles.avatarMiniText}>{atleta.nome.charAt(0)}</Text></View>
                 <View style={{ marginLeft: 8 }}>
                   <Text style={styles.nome}>{atleta.nome}</Text>
                   <Text style={styles.posicao}>{atleta.posicao}</Text>
                 </View>
               </View>

               <View style={styles.stepperContainer}>
                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity 
                      style={[styles.stepBtn, !hasNota && styles.stepBtnDisabled]} 
                      onPress={() => handleChangeNota(atleta.id, -0.5)}
                      disabled={!hasNota}
                    >
                      <Text style={[styles.stepBtnText, !hasNota && { color: Colors.GRAY_200_BORDAS }]}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.notaVal}>{hasNota ? nota.toFixed(1) : '—'}</Text>
                    <TouchableOpacity 
                      style={[styles.stepBtn, !hasNota && styles.stepBtnDisabled]} 
                      onPress={() => handleChangeNota(atleta.id, 0.5)}
                      disabled={!hasNota}
                    >
                      <Text style={[styles.stepBtnText, !hasNota && { color: Colors.GRAY_200_BORDAS }]}>+</Text>
                    </TouchableOpacity>
                 </View>
                 
                 {hasNota ? (
                    <TouchableOpacity onPress={() => handleLimpar(atleta.id)}>
                      <Text style={styles.limparTxt}>Limpar nota</Text>
                    </TouchableOpacity>
                 ) : (
                    <Text style={styles.naoAvaliadoTxt}>Será registado como Não Avaliado</Text>
                 )}
               </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Footer Fixo */}
      <View style={styles.footer}>
         <TouchableOpacity style={styles.btnSubmeter} onPress={submitAvaliacao}>
           <Check size={18} color="#000000" style={{ marginRight: 8 }} />
           <Text style={styles.btnSubmeterText}>Submeter Sessão Completa</Text>
         </TouchableOpacity>
         <Text style={styles.footerSub}>Atletas sem nota serão registados como 'Não Avaliado'</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  banner: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#1D4ED8',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bannerText: {
    fontSize: 12,
    color: '#1D4ED8',
  },
  list: {
    flex: 1,
  },
  card: {
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.GRAY_200_BORDAS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMiniText: {
    fontSize: 14,
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
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    borderColor: '#F1F5F9',
  },
  stepBtnText: {
    fontSize: 20,
    color: '#0F172A',
  },
  notaVal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    width: 48,
    textAlign: 'center',
  },
  limparTxt: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
    textDecorationLine: 'underline',
  },
  naoAvaliadoTxt: {
    fontSize: 11,
    color: Colors.GRAY_500_TEXTO2,
    fontStyle: 'italic',
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
  btnSubmeter: {
    flexDirection: 'row',
    backgroundColor: Colors.DOURADO_CTA,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSubmeterText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  footerSub: {
    fontSize: 11,
    color: Colors.GRAY_500_TEXTO2,
    textAlign: 'center',
    marginTop: 8,
  },
});
