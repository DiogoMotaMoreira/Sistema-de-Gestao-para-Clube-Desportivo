import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { Colors } from '@/constants/colors';
import { treinadorService, AtletaPlantel } from '@/services/treinadorService';
import { SemaforoBadge } from '../components/SemaforoBadge';
import { ChevronRight, ChevronLeft, Check, AlertTriangle } from 'lucide-react-native';

export function ConvocatoriaFlowScreen({ route, navigation }: any): React.JSX.Element {
  console.log('ConvocatoriaFlow params:', route?.params);
  const eventoId = route?.params?.eventoId ?? null;
  const equipaId = route?.params?.equipaId ?? null;
  
  const [step, setStep] = useState<1 | 2>(1);
  const [plantel, setPlantel] = useState<AtletaPlantel[]>([]);
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [horaConcentracao, setHoraConcentracao] = useState('14:00');
  const [localConcentracao, setLocalConcentracao] = useState('');
  
  const TETO = 18;

  useEffect(() => {
    navigation.setOptions({ title: 'Convocatória' });
    if (!eventoId || !equipaId) {
       setErrorMsg('Erro: parâmetros em falta.');
       setIsLoading(false);
       return;
    }
    
    treinadorService.getPlantel(equipaId)
      .then(data => {
         setPlantel(data);
      })
      .catch(e => {
         console.error('Erro ao carregar plantel', e);
         setErrorMsg('Não foi possível carregar o plantel.');
      })
      .finally(() => {
         setIsLoading(false);
      });
  }, [navigation, eventoId]);

  const toggleAtleta = (atleta: AtletaPlantel) => {
    const semaforo = atleta.semaforo ?? 'APTO';
    
    if (semaforo.startsWith('INAPTO') || (semaforo as string) === 'BLOQUEADO' || (semaforo as string) === 'PENDENTE_EMD') {
      return;
    }
    
    if (semaforo === 'CONDICIONADO') {
      Alert.alert(
        'Atleta Condicionado',
        `${atleta.nome} tem restrições médicas. Confirmas a convocatória?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Confirmar', onPress: () => {
            setSelecionados(prev => {
              const next = new Set(prev);
              if (next.has(atleta.id)) next.delete(atleta.id);
              else {
                if (next.size < TETO) next.add(atleta.id);
              }
              return Array.from(next);
            });
          }}
        ]
      );
      return;
    }
    
    setSelecionados(prev => {
      const next = new Set(prev);
      if (next.has(atleta.id)) next.delete(atleta.id);
      else {
        if (next.size < TETO) next.add(atleta.id);
      }
      return Array.from(next);
    });
  };

  const isLimitReached = selecionados.length >= TETO;

  const handlePublicar = async () => {
     try {
       setIsLoading(true);
       await treinadorService.guardarConvocatoria(eventoId, selecionados, true, localConcentracao || 'Balneários', horaConcentracao || '14:00');
       Alert.alert('Sucesso', 'Convocatória publicada!');
       navigation.goBack();
     } catch (e) {
       console.error('Erro ao guardar convocatória', e);
       Alert.alert('Erro', 'Ocorreu um erro ao guardar a convocatória.');
     } finally {
       setIsLoading(false);
     }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
         <ActivityIndicator size="large" color="#0F172A" />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
         <AlertTriangle size={48} color="#991B1B" style={{ marginBottom: 16 }} />
         <Text style={{ fontSize: 16, color: '#991B1B', textAlign: 'center' }}>{errorMsg}</Text>
      </View>
    );
  }

  if (step === 2) {
    return (
      <View style={styles.container}>
        <View style={styles.contextBar}>
          <Text style={styles.contextText}>Logística</Text>
        </View>

        <View style={{ padding: 16 }}>
          <Text style={styles.label}>Hora de concentração</Text>
          <TextInput 
            style={styles.input} 
            value={horaConcentracao}
            onChangeText={setHoraConcentracao}
            placeholder="HH:MM"
          />
          
          <Text style={[styles.label, { marginTop: 16 }]}>Local de concentração</Text>
          <TextInput 
            style={styles.input} 
            value={localConcentracao}
            onChangeText={setLocalConcentracao}
            placeholder="Ex: Balneário Principal"
          />
        </View>

        <View style={styles.footer}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity 
              style={[styles.btnSecundario, { flex: 1 }]} 
              onPress={() => setStep(1)}
            >
              <ChevronLeft size={18} color={Colors.GRAY_900_TEXTO1} />
              <Text style={styles.btnSecundarioText}>Voltar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.btnDourado, { flex: 2 }]} 
              onPress={handlePublicar}
            >
              <Text style={styles.btnDouradoText}>Publicar Convocatória</Text>
              <Check size={18} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra Contexto */}
      <View style={styles.contextBar}>
        <Text style={styles.contextText}>Nova Convocatória</Text>
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
          const isInapto = atleta.semaforo !== 'APTO' && !atleta.semaforo.startsWith('CONDICIONADO');

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
              onPress={() => toggleAtleta(atleta)}
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
          onPress={() => setStep(2)}
        >
          <Text style={styles.btnDouradoText}>Continuar</Text>
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
  label: { fontSize: 13, color: Colors.GRAY_900_TEXTO1, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, padding: 12, fontSize: 15 },
  btnSecundario: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    backgroundColor: '#F1F5F9', height: 52, borderRadius: 12, gap: 8
  },
  btnSecundarioText: { fontSize: 15, fontWeight: '600', color: Colors.GRAY_900_TEXTO1 }
});
