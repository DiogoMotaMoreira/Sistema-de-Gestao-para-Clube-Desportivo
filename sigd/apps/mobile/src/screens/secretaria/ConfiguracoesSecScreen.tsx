import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Settings } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Input, Button } from '../../components/ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { secretariaService } from '../../services/secretariaService';

export function ConfiguracoesSecScreen(): React.JSX.Element {
  const queryClient = useQueryClient();

  // Época State
  const [nomeEpoca, setNomeEpoca] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  // Provisões State
  const [selectedEpocaParaProvisao, setSelectedEpocaParaProvisao] = useState<number | null>(null);

  const { data: epocas, isLoading: isLoadingEpocas } = useQuery({
    queryKey: ['adminEpocas'],
    queryFn: adminService.getEpocas,
  });

  const createEpocaMutation = useMutation({
    mutationFn: () => adminService.criarEpoca(nomeEpoca, dataInicio, dataFim),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEpocas'] });
      setNomeEpoca('');
      setDataInicio('');
      setDataFim('');
      Alert.alert('Sucesso', 'Época criada com sucesso.');
    },
    onError: () => Alert.alert('Erro', 'Não foi possível criar a época.')
  });

  const ativarEpocaMutation = useMutation({
    mutationFn: adminService.ativarEpoca,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEpocas'] });
      Alert.alert('Sucesso', 'Época ativada com sucesso.');
    },
    onError: () => Alert.alert('Erro', 'Não foi possível ativar a época.')
  });

  const gerarProvisoesMutation = useMutation({
    mutationFn: (epocaId: number) => secretariaService.gerarProvisoes(epocaId),
    onSuccess: () => {
      Alert.alert('Sucesso', 'Provisões geradas com sucesso.');
      setSelectedEpocaParaProvisao(null);
    },
    onError: () => Alert.alert('Erro', 'Não foi possível gerar provisões.')
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configurações</Text>
        <Text style={styles.headerSubtitle}>Gestão de Épocas e Provisões</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Secção de Épocas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Época Desportiva</Text>
          
          {isLoadingEpocas ? (
            <ActivityIndicator color={Colors.DOURADO_CTA} />
          ) : epocas?.length === 0 ? (
            <Text style={{ color: Colors.GRAY_500_TEXTO2 }}>Nenhuma época encontrada.</Text>
          ) : (
            epocas?.map(e => (
              <View key={e.id} style={styles.epocaRow}>
                <View>
                  <Text style={styles.epocaNome}>
                    {e.nome} <Text style={{ color: e.estado === 'ATIVA' ? Colors.SUCESSO_TEXT : Colors.GRAY_500_TEXTO2, fontSize: 12 }}>({e.estado})</Text>
                  </Text>
                  <Text style={styles.epocaDatas}>{e.dataInicio} até {e.dataFim}</Text>
                </View>
                {e.estado === 'EM_PLANEAMENTO' && (
                  <Button 
                    variant="secondary" 
                    label="Activar" 
                    onPress={() => ativarEpocaMutation.mutate(e.id)} 
                    disabled={ativarEpocaMutation.isPending} 
                  />
                )}
              </View>
            ))
          )}

          <View style={styles.formRow}>
            <View style={{ flex: 1 }}><Input label="Nome" placeholder="Ex: 2026/2027" value={nomeEpoca} onChangeText={setNomeEpoca} /></View>
            <View style={{ flex: 1, marginHorizontal: 8 }}><Input label="Início" placeholder="YYYY-MM-DD" value={dataInicio} onChangeText={setDataInicio} /></View>
            <View style={{ flex: 1 }}><Input label="Fim" placeholder="YYYY-MM-DD" value={dataFim} onChangeText={setDataFim} /></View>
          </View>
          <Button 
            variant="primary" 
            label="Criar Nova Época" 
            onPress={() => createEpocaMutation.mutate()} 
            disabled={!nomeEpoca || !dataInicio || !dataFim || createEpocaMutation.isPending} 
            style={{ marginTop: 8 }} 
          />
        </View>

        {/* Secção de Provisões */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gerar Provisões Financeiras</Text>
          <Text style={{ color: Colors.GRAY_500_TEXTO2, fontSize: 13, marginBottom: 16 }}>
            Esta ação vai gerar as quotas anuais e mensalidades para todos os atletas ativos na época selecionada.
          </Text>

          {epocas?.map(e => (
            <TouchableOpacity 
              key={e.id} 
              style={[styles.epocaSelectRow, selectedEpocaParaProvisao === e.id && styles.epocaSelectRowActive]}
              onPress={() => setSelectedEpocaParaProvisao(e.id)}
            >
              <Text style={[styles.epocaSelectText, selectedEpocaParaProvisao === e.id && { color: Colors.DOURADO_CTA, fontWeight: '700' }]}>
                {e.nome} ({e.estado})
              </Text>
            </TouchableOpacity>
          ))}

          <Button 
            variant="primary" 
            label="Confirmar Geração de Provisões" 
            onPress={() => selectedEpocaParaProvisao && gerarProvisoesMutation.mutate(selectedEpocaParaProvisao)} 
            disabled={!selectedEpocaParaProvisao || gerarProvisoesMutation.isPending} 
            style={{ marginTop: 16 }} 
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.GRAY_50_FUNDO },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: Colors.GRAY_200_BORDAS },
  headerTitle: { fontSize: 24, fontWeight: '700', color: Colors.GRAY_900_TEXTO1 },
  headerSubtitle: { fontSize: 14, color: Colors.GRAY_500_TEXTO2, marginTop: 4 },
  content: { flex: 1, padding: 20 },
  section: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: Colors.GRAY_900_TEXTO1, marginBottom: 16 },
  epocaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.GRAY_200_BORDAS },
  epocaNome: { fontSize: 16, fontWeight: '600', color: Colors.GRAY_900_TEXTO1 },
  epocaDatas: { fontSize: 13, color: Colors.GRAY_500_TEXTO2, marginTop: 2 },
  formRow: { flexDirection: 'row', marginTop: 16 },
  epocaSelectRow: { padding: 12, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, marginBottom: 8 },
  epocaSelectRowActive: { borderColor: Colors.DOURADO_CTA, backgroundColor: '#EFF6FF' },
  epocaSelectText: { fontSize: 14, color: Colors.GRAY_900_TEXTO1 },
});
