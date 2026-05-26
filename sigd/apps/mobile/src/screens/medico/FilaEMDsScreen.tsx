import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { ClipboardList, AlertCircle, CheckCircle, XCircle } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clinicaService, FilaEMDResponse } from '../../services/clinicaService';

export function FilaEMDsScreen(): React.JSX.Element {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['filaEmds'],
    queryFn: () => clinicaService.getFilaEMD(0, 50)
  });

  const deliberarMutation = useMutation({
    mutationFn: ({ id, decisao }: { id: number, decisao: 'APROVADO' | 'REPROVADO' }) => {
      const grauFinal = decisao === 'APROVADO' ? 'VERDE' : 'VERMELHO';
      const obsDeliberacao = decisao === 'APROVADO' 
        ? 'Válido até 2027-05-26' 
        : 'EMD Reprovado — Inapto para prática desportiva';
      
      return clinicaService.deliberar(id, { grauFinal, obsDeliberacao });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filaEmds'] });
      queryClient.invalidateQueries({ queryKey: ['ocorrenciasAtivas'] });
    },
    onError: () => {
      Alert.alert('Erro', 'Não foi possível deliberar o EMD.');
    }
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
        <Text style={styles.emptyTitle}>Erro ao carregar fila EMD</Text>
      </View>
    );
  }

  const emds = data?.content || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Fila de EMDs</Text>
        <Text style={styles.subtitle}>{emds.length} exames pendentes de validação.</Text>
      </View>

      {emds.length === 0 ? (
        <View style={styles.emptyState}>
          <CheckCircle size={48} color={Colors.GRAY_200_BORDAS} />
          <Text style={styles.emptyTitle}>Tudo em dia!</Text>
          <Text style={styles.emptyText}>Não há exames pendentes de validação.</Text>
        </View>
      ) : (
        emds.map((emd: FilaEMDResponse) => (
          <View key={emd.id} style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.nome}>{emd.atletaNome}</Text>
              <Text style={styles.meta}>Submetido há {emd.diasPendente} dias</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity 
                style={[styles.btn, styles.btnReject]}
                onPress={() => deliberarMutation.mutate({ id: emd.id, decisao: 'REPROVADO' })}
                disabled={deliberarMutation.isPending}
              >
                <XCircle size={18} color="#991B1B" />
                <Text style={styles.btnRejectText}>Reprovar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.btn, styles.btnApprove]}
                onPress={() => deliberarMutation.mutate({ id: emd.id, decisao: 'APROVADO' })}
                disabled={deliberarMutation.isPending}
              >
                <CheckCircle size={18} color="#047857" />
                <Text style={styles.btnApproveText}>Aprovar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
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
  card: { backgroundColor: Colors.BRANCO, borderRadius: 8, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS },
  cardInfo: { marginBottom: 16 },
  nome: { fontSize: 16, fontWeight: '600', color: Colors.GRAY_900_TEXTO1 },
  meta: { fontSize: 13, color: Colors.GRAY_500_TEXTO2, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 6, gap: 8, borderWidth: 1 },
  btnReject: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  btnRejectText: { color: '#991B1B', fontWeight: '600', fontSize: 14 },
  btnApprove: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  btnApproveText: { color: '#047857', fontWeight: '600', fontSize: 14 },
  emptyState: { padding: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.BRANCO, borderRadius: 8, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderStyle: 'dashed', marginTop: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: Colors.GRAY_900_TEXTO1, marginTop: 16 },
  emptyText: { fontSize: 14, color: Colors.GRAY_500_TEXTO2, marginTop: 8 },
});
