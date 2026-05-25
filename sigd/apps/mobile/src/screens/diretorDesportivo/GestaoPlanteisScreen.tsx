import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, ChevronRight, Layers, AlertTriangle, XCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { diretorDesportivoService, EquipaDT } from '@/services/diretorDesportivoService';

export function GestaoPlanteisScreen({ navigation }: any): React.JSX.Element {
  const [equipas, setEquipas] = useState<EquipaDT[]>([]);

  useEffect(() => {
    diretorDesportivoService.getEquipas().then(setEquipas);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Gestão de Plantéis</Text>
        <TouchableOpacity style={styles.btnDourado}>
           <Plus size={16} color="#000000" style={{ marginRight: 8 }} />
           <Text style={styles.btnDouradoText}>Criar Escalão / Equipa</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 24 }}>
        
        {equipas.length === 0 ? (
          <View style={styles.emptyState}>
             <Layers size={64} color="#CBD5E1" />
             <Text style={styles.emptyTitle}>Nenhuma equipa criada.</Text>
             <Text style={styles.emptySub}>Crie a primeira estrutura hierárquica do clube.</Text>
          </View>
        ) : (
          <>
             {/* Agrupamento por Modalidade - Mock Futebol */}
             <Text style={styles.sectionTitle}>SECÇÃO: FUTEBOL</Text>
             <View style={styles.divider} />
             
             <View style={styles.grid}>
                {equipas.filter(e => e.modalidade === 'Futebol').map(e => (
                   <View key={e.id} style={styles.card}>
                      <Text style={styles.equipaNome}>{e.nome}</Text>
                      <Text style={styles.treinador}>{e.treinadorPrincipal || 'Sem Treinador Principal'}</Text>
                      <Text style={styles.numAtletas}>{e.numAtletas} atletas</Text>

                      <View style={styles.badgesRow}>
                         {e.inaptos > 0 && (
                            <View style={[styles.badge, { backgroundColor: '#FFFBEB' }]}>
                               <AlertTriangle size={12} color="#B45309" />
                               <Text style={[styles.badgeText, { color: '#B45309' }]}>{e.inaptos} Inaptos</Text>
                            </View>
                         )}
                         {e.bloqueados > 0 && (
                            <View style={[styles.badge, { backgroundColor: '#FEE2E2' }]}>
                               <XCircle size={12} color="#991B1B" />
                               <Text style={[styles.badgeText, { color: '#991B1B' }]}>{e.bloqueados} Bloqueados</Text>
                            </View>
                         )}
                      </View>

                      <TouchableOpacity
                         style={styles.btnOutline}
                         onPress={() => navigation.navigate('PlantelEquipaDT', { equipaId: e.id, equipaNome: e.nome })}
                      >
                         <Text style={styles.btnOutlineText}>Gerir Plantel</Text>
                         <ChevronRight size={16} color="#0F172A" />
                      </TouchableOpacity>
                   </View>
                ))}
             </View>

             <Text style={[styles.sectionTitle, { marginTop: 24 }]}>SECÇÃO: FUTSAL</Text>
             <View style={styles.divider} />
             <View style={styles.grid}>
                {equipas.filter(e => e.modalidade === 'Futsal').map(e => (
                   <View key={e.id} style={styles.card}>
                      <Text style={styles.equipaNome}>{e.nome}</Text>
                      <Text style={styles.treinador}>{e.treinadorPrincipal || 'Sem Treinador Principal'}</Text>
                      <Text style={styles.numAtletas}>{e.numAtletas} atletas</Text>
                      <TouchableOpacity
                         style={styles.btnOutline}
                         onPress={() => navigation.navigate('PlantelEquipaDT', { equipaId: e.id, equipaNome: e.nome })}
                      >
                         <Text style={styles.btnOutlineText}>Gerir Plantel</Text>
                         <ChevronRight size={16} color="#0F172A" />
                      </TouchableOpacity>
                   </View>
                ))}
             </View>
          </>
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
  sectionTitle: { fontSize: 12, color: '#64748B', fontWeight: '700', paddingBottom: 8 },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  card: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 20, width: 300, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  equipaNome: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  treinador: { fontSize: 14, color: '#64748B', marginBottom: 4 },
  numAtletas: { fontSize: 12, color: '#64748B', marginBottom: 12 },
  badgesRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, gap: 4 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  btnOutline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 8, borderRadius: 8, marginTop: 'auto' },
  btnOutlineText: { fontSize: 14, fontWeight: '600', color: '#0F172A', marginRight: 8 },
});
