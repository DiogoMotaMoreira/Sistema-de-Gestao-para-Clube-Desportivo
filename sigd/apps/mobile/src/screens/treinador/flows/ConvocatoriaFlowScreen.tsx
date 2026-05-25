import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '@/constants/colors';
import { treinadorService, AtletaPlantel } from '@/services/treinadorService';
import { SemaforoBadge } from '../components/SemaforoBadge';
import { ChevronRight, Check } from 'lucide-react-native';

export function ConvocatoriaFlowScreen({ route, navigation }: any): React.JSX.Element {
  const { eventoId } = route.params;
  const [plantel, setPlantel] = useState<AtletaPlantel[]>([]);
  const [selecionados, setSelecionados] = useState<number[]>([]);
  
  const TETO = 18;

  useEffect(() => {
    navigation.setOptions({ title: 'Convocatória' });
    treinadorService.getPlantel(1).then(setPlantel);
  }, [navigation]);

  const toggleAtleta = (id: number) => {
    setSelecionados(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        if (prev.length >= TETO) return prev;
        return [...prev, id];
      }
    });
  };

  const isLimitReached = selecionados.length >= TETO;

  const handleConfirmar = () => {
    // Na realidade abriria Bottom Sheet de logística (Local, Hora).
    // Para simplificar no mock transacional:
    Alert.alert('Detalhes Logísticos', 'Confirma a publicação desta convocatória?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Publicar', onPress: async () => {
         await treinadorService.guardarConvocatoria(eventoId, selecionados, true, 'Balneários', '14:00');
         navigation.navigate('Jogos');
      } }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Barra Contexto */}
      <View style={styles.contextBar}>
        <Text style={styles.contextText}>FC Rival · Sábado 15:00</Text>
      </View>

      {/* Contador */}
      <View style={styles.counterRow}>
        <Text style={[styles.counterText, isLimitReached && { color: '#B45309' }]}>
          {isLimitReached ? 'Limite atingido' : `${selecionados.length} / ${TETO} selecionados`}
        </Text>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {plantel.map(atleta => {
          const isSelected = selecionados.includes(atleta.id);
          const isInapto = atleta.semaforo.startsWith('INAPTO');

          if (isInapto) {
            return (
              <View key={atleta.id} style={[styles.card, styles.cardBloqueado]}>
                <View style={styles.checkboxDisabled} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                   <Text style={[styles.nome, { color: Colors.GRAY_500_TEXTO2 }]}>{atleta.nome}</Text>
                   <Text style={styles.posicao}>{atleta.posicao}</Text>
                   <SemaforoBadge estado={atleta.semaforo} size="sm" />
                </View>
              </View>
            );
          }

          return (
            <TouchableOpacity 
              key={atleta.id} 
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => toggleAtleta(atleta.id)}
            >
               <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                 {isSelected && <Check size={16} color="#000000" />}
               </View>
               <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.nome}>{atleta.nome}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <Text style={styles.posicao}>{atleta.posicao}</Text>
                    <SemaforoBadge estado={atleta.semaforo} size="sm" />
                  </View>
                  <Text style={styles.stats}>Méd: {atleta.mediaAvaliacao?.toFixed(1) || '—'} · Assiduidade: {atleta.assiduidade || 0}%</Text>
               </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.btnDourado, selecionados.length === 0 && { opacity: 0.5 }]} 
          disabled={selecionados.length === 0}
          onPress={handleConfirmar}
        >
          <Text style={styles.btnDouradoText}>Confirmar Seleção</Text>
          <ChevronRight size={18} color="#000000" />
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
  contextBar: {
    backgroundColor: '#EFF6FF',
    borderBottomWidth: 1,
    borderBottomColor: '#1D4ED8',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  contextText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  counterRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  counterText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  list: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  cardSelected: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F1C40F',
  },
  cardBloqueado: {
    backgroundColor: '#F8FAFC',
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#F1C40F',
    borderColor: '#F1C40F',
  },
  checkboxDisabled: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.GRAY_200_BORDAS,
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
  stats: {
    fontSize: 11,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 4,
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
  btnDourado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.DOURADO_CTA,
    height: 52,
    borderRadius: 12,
    gap: 8,
  },
  btnDouradoText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
});
