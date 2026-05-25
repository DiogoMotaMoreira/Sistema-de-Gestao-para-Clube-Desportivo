import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '@/constants/colors';
import { treinadorService, AtletaPlantel } from '@/services/treinadorService';
import { SemaforoBadge } from '../components/SemaforoBadge';
import { Check } from 'lucide-react-native';

export function FichaJogoFlowScreen({ route, navigation }: any): React.JSX.Element {
  const { eventoId } = route.params;
  const [plantel, setPlantel] = useState<AtletaPlantel[]>([]);
  const [titulares, setTitulares] = useState<number[]>([]);

  const TETO_TITULARES = 11; // 11 para futebol

  useEffect(() => {
    navigation.setOptions({ title: 'XI Inicial' });
    
    treinadorService.getPlantel(1).then(p => {
       // Apenas aptos e condicionados seriam convocados na realidade
       setPlantel(p.filter(a => !a.semaforo.startsWith('INAPTO')));
    });
  }, [navigation]);

  const toggleTitular = (id: number) => {
    setTitulares(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        if (prev.length >= TETO_TITULARES) return prev;
        return [...prev, id];
      }
    });
  };

  const isLimitReached = titulares.length >= TETO_TITULARES;

  const handleConfirmar = () => {
    Alert.alert('Submeter Ficha', 'Mock transacional: Confirmar o XI e suplentes (ignorando passo de eventos de jogo por agora)?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Submeter', onPress: async () => {
         const suplentes = plantel.filter(a => !titulares.includes(a.id)).map(a => a.id);
         await treinadorService.submeterFichaJogo(eventoId, titulares, suplentes, []);
         navigation.navigate('Jogos');
      } }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Barra Progresso Global */}
      <View style={styles.progressBar}>
         <Text style={[styles.progressStep, { color: '#0F172A', fontWeight: '700' }]}>1 XI Inicial</Text>
         <Text style={styles.progressDivider}>—</Text>
         <Text style={[styles.progressStep, { color: Colors.GRAY_200_BORDAS }]}>2 Eventos</Text>
         <Text style={styles.progressDivider}>—</Text>
         <Text style={[styles.progressStep, { color: Colors.GRAY_200_BORDAS }]}>3 Rever</Text>
         
         <View style={{ flex: 1 }} />
         <Text style={styles.autoSave}>Guardado — 15:02</Text>
      </View>

      <View style={{ padding: 16 }}>
         <Text style={styles.instruction}>Selecione os {TETO_TITULARES} titulares</Text>
      </View>

      {isLimitReached && (
         <View style={styles.bannerInfo}>
            <Text style={{ color: '#047857', fontSize: 12 }}>{TETO_TITULARES} titulares selecionados — restantes são suplentes</Text>
         </View>
      )}

      <ScrollView style={styles.list} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
         {/* Lista Mista (os titulares ficam checked, os outros ficam unchecked ou suplentes) */}
         {plantel.map(atleta => {
           const isTitular = titulares.includes(atleta.id);
           
           return (
             <TouchableOpacity 
               key={atleta.id} 
               style={[styles.card, isTitular && styles.cardSelected]}
               onPress={() => toggleTitular(atleta.id)}
               disabled={!isTitular && isLimitReached}
             >
                <View style={[styles.checkbox, isTitular && styles.checkboxSelected, !isTitular && isLimitReached && { opacity: 0.3 }]}>
                  {isTitular && <Check size={16} color="#000000" />}
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                   <Text style={[styles.nome, !isTitular && isLimitReached && { color: Colors.GRAY_500_TEXTO2 }]}>{atleta.nome}</Text>
                   <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                     <Text style={styles.posicao}>{atleta.posicao}</Text>
                     <SemaforoBadge estado={atleta.semaforo} size="sm" />
                   </View>
                </View>
             </TouchableOpacity>
           );
         })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.btnDourado, titulares.length === 0 && { opacity: 0.5 }]} 
          disabled={titulares.length === 0}
          onPress={handleConfirmar}
        >
          <Text style={styles.btnDouradoText}>Confirmar XI e Avançar</Text>
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
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.BRANCO,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  progressStep: {
    fontSize: 12,
  },
  progressDivider: {
    marginHorizontal: 8,
    color: Colors.GRAY_200_BORDAS,
  },
  autoSave: {
    fontSize: 11,
    color: Colors.GRAY_500_TEXTO2,
    fontStyle: 'italic',
  },
  instruction: {
    fontSize: 14,
    color: Colors.GRAY_500_TEXTO2,
  },
  bannerInfo: {
    backgroundColor: '#ECFDF5',
    padding: 12,
    paddingHorizontal: 16,
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
  nome: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  posicao: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
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
  },
  btnDouradoText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
});
