import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/colors';
import { treinadorService, FichaJogoResponse } from '@/services/treinadorService';
import { Trophy, CheckCircle, ArrowLeft, Plus, Minus, ClipboardList } from 'lucide-react-native';

export function FichaJogoFlowScreen({ route, navigation }: any): React.JSX.Element {

  const eventoId = route?.params?.eventoId;

  const [loading, setLoading] = useState<boolean>(true);
  const [fichaExistente, setFichaExistente] = useState<FichaJogoResponse | null>(null);
  const [modoLeitura, setModoLeitura] = useState<boolean>(false);

  // Form State
  const [golosMarcados, setGolosMarcados] = useState<number>(0);
  const [golosSofridos, setGolosSofridos] = useState<number>(0);
  const [observacoes, setObservacoes] = useState<string>('');

  useEffect(() => {
    navigation.setOptions({ title: 'Ficha de Jogo' });

    if (!eventoId) {
      setLoading(false);
      return;
    }

    treinadorService.getFichaJogo(eventoId)
      .then(ficha => {
        setFichaExistente(ficha);
        setModoLeitura(true);
        setLoading(false);
      })
      .catch(() => {
        // 404 - ficha não existe, prosseguir para o formulário
        setFichaExistente(null);
        setModoLeitura(false);
        setLoading(false);
      });
  }, [eventoId, navigation]);

  const handleSubmeter = async () => {


    if (!eventoId) {
      Alert.alert('Erro', 'Não foi possível submeter a ficha: ID do evento inválido ou ausente.');
      return;
    }

    setLoading(true);
    try {

      await treinadorService.submeterFichaJogo(eventoId, golosMarcados, golosSofridos, observacoes);
      Alert.alert('Sucesso', 'Ficha submetida com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível submeter: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.DOURADO_CTA} />
        <Text style={styles.loadingText}>A carregar dados...</Text>
      </View>
    );
  }

  // ── Modo Leitura (Ficha já submetida) ────────────────────────
  if (modoLeitura && fichaExistente) {
    const isVitoria = fichaExistente.resultado === 'VITORIA';
    const isEmpate = fichaExistente.resultado === 'EMPATE';
    
    let resultLabel = 'Derrota';
    let resultColor: string = Colors.ERRO_TEXT;
    let resultBg: string = Colors.ERRO_BG;
    
    if (isVitoria) {
      resultLabel = 'Vitória';
      resultColor = Colors.SUCESSO_TEXT;
      resultBg = Colors.SUCESSO_BG;
    } else if (isEmpate) {
      resultLabel = 'Empate';
      resultColor = Colors.AVISO_TEXT;
      resultBg = Colors.AVISO_BG;
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.cardHeader}>
             <Trophy size={48} color={isVitoria ? Colors.DOURADO_CTA : Colors.GRAY_500_TEXTO2} style={{ marginBottom: 12 }} />
             <Text style={styles.submittedTitle}>Ficha de Jogo Submetida</Text>
             <Text style={styles.submittedSub}>Esta ficha está em modo apenas de leitura</Text>
          </View>

          <View style={styles.scorePlacard}>
             <View style={[styles.resultBadge, { backgroundColor: resultBg, borderColor: resultColor }]}>
                <Text style={[styles.resultBadgeText, { color: resultColor }]}>{resultLabel.toUpperCase()}</Text>
             </View>
             
             <View style={styles.scoreRow}>
                <View style={styles.scoreNumberBox}>
                   <Text style={styles.scoreNumberText}>{fichaExistente.golosMarcados}</Text>
                   <Text style={styles.scoreLabel}>Golos Marcados</Text>
                </View>
                
                <Text style={styles.scoreDivider}>-</Text>
                
                <View style={styles.scoreNumberBox}>
                   <Text style={styles.scoreNumberText}>{fichaExistente.golosSofridos}</Text>
                   <Text style={styles.scoreLabel}>Golos Sofridos</Text>
                </View>
             </View>
          </View>

          <View style={styles.section}>
             <Text style={styles.sectionTitle}>Observações</Text>
             <View style={styles.observationsContainer}>
                <Text style={fichaExistente.observacoes ? styles.observationsText : styles.noObservationsText}>
                  {fichaExistente.observacoes ? `"${fichaExistente.observacoes}"` : 'Sem observações registadas para este jogo.'}
                </Text>
             </View>
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.btnOutline} onPress={() => navigation.goBack()}>
             <ArrowLeft size={16} color={Colors.GRAY_900_TEXTO1} style={{ marginRight: 8 }} />
             <Text style={styles.btnOutlineText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Modo Formulário (Nova Submissão) ────────────────────────
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.cardHeader}>
           <ClipboardList size={40} color={Colors.GRAY_900_TEXTO1} style={{ marginBottom: 12 }} />
           <Text style={styles.submittedTitle}>Preencher Ficha de Jogo</Text>
           <Text style={styles.submittedSub}>Introduza o resultado final do jogo</Text>
        </View>

        <View style={styles.formCard}>
           {/* Golos Marcados */}
           <View style={styles.stepperRow}>
              <View style={{ flex: 1 }}>
                 <Text style={styles.stepperLabel}>Golos Marcados</Text>
                 <Text style={styles.stepperSublabel}>A nossa equipa</Text>
              </View>
              <View style={styles.stepperControls}>
                 <TouchableOpacity 
                   style={styles.stepperButton} 
                   onPress={() => setGolosMarcados(prev => Math.max(0, prev - 1))}
                 >
                    <Minus size={18} color={Colors.GRAY_900_TEXTO1} />
                 </TouchableOpacity>
                 
                 <Text style={styles.stepperValue}>{golosMarcados}</Text>
                 
                 <TouchableOpacity 
                   style={styles.stepperButton} 
                   onPress={() => setGolosMarcados(prev => prev + 1)}
                 >
                    <Plus size={18} color={Colors.GRAY_900_TEXTO1} />
                 </TouchableOpacity>
              </View>
           </View>

           <View style={styles.formDivider} />

           {/* Golos Sofridos */}
           <View style={styles.stepperRow}>
              <View style={{ flex: 1 }}>
                 <Text style={styles.stepperLabel}>Golos Sofridos</Text>
                 <Text style={styles.stepperSublabel}>Equipa adversária</Text>
              </View>
              <View style={styles.stepperControls}>
                 <TouchableOpacity 
                   style={styles.stepperButton} 
                   onPress={() => setGolosSofridos(prev => Math.max(0, prev - 1))}
                 >
                    <Minus size={18} color={Colors.GRAY_900_TEXTO1} />
                 </TouchableOpacity>
                 
                 <Text style={styles.stepperValue}>{golosSofridos}</Text>
                 
                 <TouchableOpacity 
                   style={styles.stepperButton} 
                   onPress={() => setGolosSofridos(prev => prev + 1)}
                 >
                    <Plus size={18} color={Colors.GRAY_900_TEXTO1} />
                 </TouchableOpacity>
              </View>
           </View>
        </View>

        <View style={styles.section}>
           <Text style={styles.sectionTitle}>Observações</Text>
           <TextInput
             style={styles.textArea}
             placeholder="Adicione notas tácticas, substituições ou observações gerais sobre o jogo..."
             placeholderTextColor={Colors.GRAY_500_TEXTO2}
             multiline
             numberOfLines={4}
             value={observacoes}
             onChangeText={setObservacoes}
           />
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.btnDourado, loading && { opacity: 0.5 }]} 
          onPress={handleSubmeter}
          disabled={loading}
        >
           <CheckCircle size={18} color="#000000" style={{ marginRight: 8 }} />
           <Text style={styles.btnDouradoText}>Submeter Ficha de Jogo</Text>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  submittedTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
  },
  submittedSub: {
    fontSize: 14,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 4,
  },
  scorePlacard: {
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: Colors.PRETO_PRIMARIO,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  resultBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  scoreNumberBox: {
    alignItems: 'center',
    flex: 1,
  },
  scoreNumberText: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.GRAY_900_TEXTO1,
  },
  scoreLabel: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 4,
    fontWeight: '500',
  },
  scoreDivider: {
    fontSize: 32,
    fontWeight: '300',
    color: Colors.GRAY_200_BORDAS,
    marginHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.GRAY_500_TEXTO2,
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  observationsContainer: {
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 12,
    padding: 16,
  },
  observationsText: {
    fontSize: 14,
    color: Colors.GRAY_900_TEXTO1,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  noObservationsText: {
    fontSize: 14,
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
  btnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.BRANCO,
  },
  btnOutlineText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.GRAY_900_TEXTO1,
  },
  formCard: {
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.PRETO_PRIMARIO,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
  },
  stepperSublabel: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 2,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepperButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    backgroundColor: Colors.GRAY_50_FUNDO,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.GRAY_900_TEXTO1,
    minWidth: 24,
    textAlign: 'center',
  },
  formDivider: {
    height: 1,
    backgroundColor: Colors.GRAY_200_BORDAS,
    marginVertical: 16,
  },
  textArea: {
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: Colors.GRAY_900_TEXTO1,
    minHeight: 100,
    textAlignVertical: 'top',
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
