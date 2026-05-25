import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, Trophy, PlayCircle, Calendar, CheckCircle, Pencil, Archive } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { diretorDesportivoService, QuadroCompetitivo } from '@/services/diretorDesportivoService';

export function QuadrosCompetitivosScreen({ navigation }: any): React.JSX.Element {
  const [quadros, setQuadros] = useState<QuadroCompetitivo[]>([]);

  useEffect(() => {
    diretorDesportivoService.getQuadros().then(setQuadros);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Quadros Competitivos</Text>
        <TouchableOpacity style={styles.btnDourado}>
           <Plus size={16} color="#000000" style={{ marginRight: 8 }} />
           <Text style={styles.btnDouradoText}>Novo Quadro Competitivo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 24 }}>
        
        {quadros.length === 0 ? (
          <View style={styles.emptyState}>
             <Trophy size={64} color="#CBD5E1" />
             <Text style={styles.emptyTitle}>Nenhum quadro competitivo registado.</Text>
             <Text style={styles.emptySub}>Crie quadros competitivos para agendar jogos oficiais.</Text>
          </View>
        ) : (
          <View style={styles.table}>
             {/* Header */}
             <View style={styles.tableHeader}>
                <Text style={[styles.th, { flex: 2 }]}>NOME DA PROVA</Text>
                <Text style={[styles.th, { flex: 1 }]}>ESCALÃO ASSOCIADO</Text>
                <Text style={[styles.th, { flex: 2 }]}>EQUIPAS ASSOCIADAS</Text>
                <Text style={[styles.th, { flex: 1 }]}>ESTADO</Text>
                <Text style={[styles.th, { width: 100, textAlign: 'right' }]}>AÇÕES</Text>
             </View>

             {/* Rows */}
             {quadros.map(q => {
               let badgeBg = '#F1F5F9', badgeText = '#64748B', Icon = CheckCircle;
               if (q.estado === 'EM_CURSO') { badgeBg = '#ECFDF5'; badgeText = '#047857'; Icon = PlayCircle; }
               if (q.estado === 'AGENDADO') { badgeBg = '#FFFBEB'; badgeText = '#B45309'; Icon = Calendar; }

               return (
                 <View key={q.id} style={styles.tableRow}>
                    <View style={{ flex: 2 }}><Text style={styles.tdNome}>{q.nome}</Text></View>
                    <View style={{ flex: 1 }}>
                       <View style={styles.badgeEscalao}><Text style={styles.badgeEscalaoText}>{q.escalao}</Text></View>
                    </View>
                    <View style={{ flex: 2, flexDirection: 'row', gap: 4 }}>
                       {q.equipas.map(eq => (
                         <View key={eq} style={styles.badgeEscalao}><Text style={styles.badgeEscalaoText}>{eq}</Text></View>
                       ))}
                    </View>
                    <View style={{ flex: 1 }}>
                       <View style={[styles.badgeEstado, { backgroundColor: badgeBg }]}>
                          <Icon size={12} color={badgeText} />
                          <Text style={[styles.badgeEstadoText, { color: badgeText }]}>{q.estado.replace('_', ' ')}</Text>
                       </View>
                    </View>
                    <View style={{ width: 100, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                       <TouchableOpacity style={styles.btnIcon}><Pencil size={14} color="#64748B" /></TouchableOpacity>
                       <TouchableOpacity style={styles.btnIcon}><Archive size={14} color="#64748B" /></TouchableOpacity>
                    </View>
                 </View>
               );
             })}
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  pageHeader: { backgroundColor: '#FFFFFF', padding: 24, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#0F172A' },
  content: { flex: 1 },
  btnDourado: { flexDirection: 'row', backgroundColor: '#F1C40F', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnDouradoText: { fontSize: 14, fontWeight: '600', color: '#000000' },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyTitle: { fontSize: 16, color: '#64748B', marginTop: 16, fontWeight: '600' },
  emptySub: { fontSize: 14, color: '#64748B', marginTop: 4 },
  table: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', padding: 16, backgroundColor: '#F8FAFC', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  th: { fontSize: 10, fontWeight: '700', color: '#64748B' },
  tableRow: { flexDirection: 'row', padding: 16, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tdNome: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  badgeEscalao: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start' },
  badgeEscalaoText: { fontSize: 11, color: '#64748B' },
  badgeEstado: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start' },
  badgeEstadoText: { fontSize: 11, fontWeight: '600' },
  btnIcon: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 6, padding: 6 },
});
