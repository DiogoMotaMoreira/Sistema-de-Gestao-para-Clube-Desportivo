import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Download, PieChart, BarChart3 } from 'lucide-react-native';
import { PageHeader } from '../../components/ui/PageHeader';
import { ceoService, DemografiaEscalao } from '@/services/ceoService';
import { Colors } from '@/constants/colors';

export function BaseAssociativaScreen(): React.JSX.Element {
  const [demografia, setDemografia] = useState<DemografiaEscalao[]>([]);

  useEffect(() => {
    ceoService.getDemografia().then(setDemografia);
  }, []);

  return (
    <View style={styles.container}>
      <PageHeader
        title="Base Associativa"
        breadcrumbs={[
          { label: 'Presidência' },
          { label: 'Base Associativa' },
        ]}
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        
        {/* Mini-Dashboard de Topo */}
        <View style={styles.topDashboard}>
           <View style={styles.topDashItem}>
              <Text style={styles.topDashLabel}>SÓCIOS ATIVOS</Text>
              <Text style={styles.topDashValue}>12.450</Text>
           </View>
           <View style={styles.topDashItem}>
              <Text style={styles.topDashLabel}>TAXA DE REGULARIDADE</Text>
              <Text style={[styles.topDashValue, { color: Colors.SUCESSO_TEXT }]}>88%</Text>
              <Text style={styles.topDashSub}>10.956 em dia</Text>
           </View>
           <View style={[styles.topDashItem, { borderRightWidth: 0 }]}>
              <Text style={styles.topDashLabel}>ATLETAS INSCRITOS</Text>
              <Text style={styles.topDashValue}>450</Text>
              <Text style={styles.topDashSub}>Em 18 equipas</Text>
           </View>
        </View>

        {/* Filtros e Ações */}
        <View style={styles.filtersContainer}>
           <View style={{ flexDirection: 'row', gap: 12, flex: 1 }}>
              <View style={styles.dropdown}><Text style={styles.dropdownText}>Todos os Escalões</Text></View>
              <View style={styles.dropdown}><Text style={styles.dropdownText}>Todas as Idades</Text></View>
              <View style={styles.dropdown}><Text style={styles.dropdownText}>Todos os Estados</Text></View>
           </View>
           <TouchableOpacity style={styles.btnOutline}>
              <Download size={16} color={Colors.GRAY_900_TEXTO1} style={{ marginRight: 6 }} />
              <Text style={styles.btnOutlineText}>Exportar CSV</Text>
           </TouchableOpacity>
        </View>

        {/* Dois Gráficos */}
        <View style={styles.chartsRow}>
           <View style={[styles.chartCard, { flex: 0.5 }]}>
              <Text style={styles.chartTitle}>Distribuição de Atletas por Escalão</Text>
              <View style={styles.chartMockArea}>
                 <PieChart size={48} color={Colors.GRAY_200_BORDAS} style={{ opacity: 0.5 }} />
                 <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2, marginTop: 8 }}>[Donut Chart]</Text>
              </View>
           </View>
           <View style={[styles.chartCard, { flex: 0.5 }]}>
              <Text style={styles.chartTitle}>Sócios por Situação Financeira</Text>
              <View style={styles.chartMockArea}>
                 <BarChart3 size={48} color={Colors.GRAY_200_BORDAS} style={{ opacity: 0.5 }} />
                 <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2, marginTop: 8 }}>[Gráfico Barras Horizontais]</Text>
              </View>
           </View>
        </View>

        {/* Tabela */}
        <View style={styles.table}>
           <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 2 }]}>ESCALÃO</Text>
              <Text style={[styles.th, { flex: 1.5, textAlign: 'center' }]}>ATLETAS ATIVOS</Text>
              <Text style={[styles.th, { flex: 1.5, textAlign: 'center' }]}>SÓCIOS (ATLETAS)</Text>
              <Text style={[styles.th, { flex: 1.5, textAlign: 'center' }]}>% DOCS EM DIA</Text>
              <Text style={[styles.th, { flex: 2, textAlign: 'center' }]}>% FINAN. REGULARIZADO</Text>
           </View>
           
           {demografia.map(d => (
              <View key={d.escalao} style={styles.tableRow}>
                 <Text style={[styles.td, { flex: 2, fontWeight: '600' }]}>{d.escalao}</Text>
                 <Text style={[styles.td, { flex: 1.5, textAlign: 'center' }]}>{d.atletasAtivos}</Text>
                 <Text style={[styles.td, { flex: 1.5, textAlign: 'center' }]}>{d.socios}</Text>
                 
                 <View style={{ flex: 1.5, alignItems: 'center' }}>
                    <View style={[styles.badgeCell, { backgroundColor: d.percDocsDia >= 80 ? '#ECFDF5' : '#FEE2E2' }]}>
                       <Text style={{ fontSize: 12, fontWeight: '600', color: d.percDocsDia >= 80 ? '#047857' : '#991B1B' }}>{d.percDocsDia}%</Text>
                    </View>
                 </View>

                 <View style={{ flex: 2, alignItems: 'center' }}>
                    <View style={[styles.badgeCell, { backgroundColor: d.percFinanDia >= 80 ? '#ECFDF5' : '#FEE2E2' }]}>
                       <Text style={{ fontSize: 12, fontWeight: '600', color: d.percFinanDia >= 80 ? '#047857' : '#991B1B' }}>{d.percFinanDia}%</Text>
                    </View>
                 </View>
              </View>
           ))}
           <View style={[styles.tableRow, { backgroundColor: '#F8FAFC' }]}>
              <Text style={[styles.td, { flex: 1, fontWeight: '700' }]}>Total: 450 atletas · 87% docs em dia · 88% financ. regularizado</Text>
           </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.GRAY_50_FUNDO },
  content: { flex: 1 },
  scrollContent: { padding: 32, gap: 24 },
  topDashboard: { flexDirection: 'row', backgroundColor: Colors.BRANCO, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 12, paddingVertical: 16 },
  topDashItem: { flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: Colors.GRAY_200_BORDAS },
  topDashLabel: { fontSize: 10, fontWeight: '700', color: Colors.GRAY_500_TEXTO2, marginBottom: 4 },
  topDashValue: { fontSize: 24, fontWeight: '700', color: Colors.GRAY_900_TEXTO1 },
  topDashSub: { fontSize: 12, color: Colors.GRAY_500_TEXTO2, marginTop: 4 },
  filtersContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.BRANCO, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 12, padding: 16 },
  dropdown: { borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  dropdownText: { fontSize: 13, color: Colors.GRAY_900_TEXTO1 },
  btnOutline: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  btnOutlineText: { fontSize: 13, fontWeight: '500', color: Colors.GRAY_900_TEXTO1 },
  chartsRow: { flexDirection: 'row', gap: 16, height: 320 },
  chartCard: { backgroundColor: Colors.BRANCO, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 16, padding: 20 },
  chartTitle: { fontSize: 14, fontWeight: '600', color: Colors.GRAY_900_TEXTO1, marginBottom: 16 },
  chartMockArea: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  table: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, overflow: 'hidden', backgroundColor: Colors.BRANCO },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  th: { fontSize: 11, fontWeight: '600', color: Colors.GRAY_500_TEXTO2 },
  tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', alignItems: 'center' },
  td: { fontSize: 13, color: Colors.GRAY_900_TEXTO1 },
  badgeCell: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 },
});
