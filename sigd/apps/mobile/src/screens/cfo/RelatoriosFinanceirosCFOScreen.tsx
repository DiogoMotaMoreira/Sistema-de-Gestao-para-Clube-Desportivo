import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FileText, Sheet, LineChart, Table } from 'lucide-react-native';
import { PageHeader } from '../../components/ui/PageHeader';
import { CeoFilters, PresetPeriodo } from '../ceo/components/CeoFilters';
import { cfoService, RubricaFinanceiraCFO } from '@/services/cfoService';
import { Colors } from '@/constants/colors';

export function RelatoriosFinanceirosCFOScreen(): React.JSX.Element {
  const [periodo, setPeriodo] = useState<PresetPeriodo>('Época Ativa');
  
  const [rubricasClube, setRubricasClube] = useState<RubricaFinanceiraCFO[]>([]);
  const [rubricasSad, setRubricasSad] = useState<RubricaFinanceiraCFO[]>([]);

  useEffect(() => {
    cfoService.getRubricas('Clube').then(setRubricasClube);
    cfoService.getRubricas('SAD').then(setRubricasSad);
  }, []);

  return (
    <View style={styles.container}>
      <PageHeader
        title="Relatórios Financeiros"
        breadcrumbs={[
          { label: 'Direção Financeira' },
          { label: 'Relatórios Financeiros' },
        ]}
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        
        {/* Barra de Filtros */}
        <View style={styles.filtersWrapper}>
           <CeoFilters 
             label="Período de análise:"
             presets={['Este Mês', 'Trimestre', 'Época Ativa', 'Personalizado']}
             activePreset={periodo}
             onChangePreset={setPeriodo}
             onExportPDF={() => {}}
             onExportCSV={() => {}} // Simulando botão Excel
           />
        </View>

        {/* PAINÉIS COMPARATIVOS */}
        <View style={{ flexDirection: 'row', gap: 16 }}>
           
           {/* Painel Clube */}
           <View style={styles.panelCompare}>
              <View style={[styles.badgePanel, { backgroundColor: Colors.PRETO_PRIMARIO }]}><Text style={{ color: Colors.BRANCO, fontSize: 12, fontWeight: '600' }}>ASSOCIAÇÃO / CLUBE</Text></View>
              
              <View style={styles.kpiInlineRow}>
                 <View style={styles.kpiInlineItem}><Text style={styles.kpiInlineLabel}>RECEITA CAPTADA</Text><Text style={styles.kpiInlineValue}>820.300,00 €</Text></View>
                 <View style={styles.kpiInlineItem}><Text style={styles.kpiInlineLabel}>DÍVIDA VENCIDA</Text><Text style={[styles.kpiInlineValue, { color: Colors.ERRO_TEXT }]}>28.500,00 €</Text></View>
                 <View style={[styles.kpiInlineItem, { borderRightWidth: 0 }]}><Text style={styles.kpiInlineLabel}>RÁCIO EFICIÊNCIA</Text><Text style={[styles.kpiInlineValue, { color: Colors.SUCESSO_TEXT }]}>96,6%</Text></View>
              </View>

              <View style={styles.chartMockAreaMini}>
                 <LineChart size={32} color={Colors.GRAY_200_BORDAS} />
                 <Text style={{ fontSize: 10, color: Colors.GRAY_500_TEXTO2, marginTop: 4 }}>[Gráfico de Linha Mensal]</Text>
              </View>

              <Text style={styles.subTableTitle}>Detalhe por Rubrica</Text>
              <View style={styles.table}>
                 <View style={styles.tableHeader}>
                    <Text style={[styles.th, { flex: 2 }]}>RUBRICA</Text>
                    <Text style={[styles.th, { flex: 1.5 }]}>ESCALÃO</Text>
                    <Text style={[styles.th, { flex: 1.5 }]}>GERADO</Text>
                    <Text style={[styles.th, { flex: 1.5 }]}>EM DÍVIDA</Text>
                    <Text style={[styles.th, { flex: 1 }]}>TAXA LIQ.</Text>
                 </View>
                 {rubricasClube.map(r => (
                    <View key={r.id} style={styles.tableRow}>
                       <Text style={[styles.td, { flex: 2, fontWeight: '500' }]}>{r.nome}</Text>
                       <View style={{ flex: 1.5 }}><View style={[styles.badgePill, { backgroundColor: '#F1F5F9' }]}><Text style={{ fontSize: 10, color: '#64748B' }}>{r.escalao}</Text></View></View>
                       <Text style={[styles.td, { flex: 1.5 }]}>{r.valorTotal.toFixed(2)} €</Text>
                       <Text style={[styles.td, { flex: 1.5, color: Colors.ERRO_TEXT }]}>{r.valorEmDivida.toFixed(2)} €</Text>
                       <Text style={[styles.td, { flex: 1, color: Colors.SUCESSO_TEXT, fontWeight: '700' }]}>{r.taxaLiq}%</Text>
                    </View>
                 ))}
                 <View style={styles.tableFooter}><Text style={{ fontSize: 11, color: Colors.INFO_TEXT }}>← Anterior</Text><Text style={{ fontSize: 11, color: Colors.INFO_TEXT }}>Próxima →</Text></View>
              </View>
           </View>

           {/* Painel SAD */}
           <View style={styles.panelCompare}>
              <View style={[styles.badgePanel, { backgroundColor: '#FFFBEB' }]}><Text style={{ color: '#B45309', fontSize: 12, fontWeight: '600' }}>SAD / FORMAÇÃO</Text></View>
              
              <View style={styles.kpiInlineRow}>
                 <View style={styles.kpiInlineItem}><Text style={styles.kpiInlineLabel}>RECEITA CAPTADA</Text><Text style={styles.kpiInlineValue}>420.200,00 €</Text></View>
                 <View style={styles.kpiInlineItem}><Text style={styles.kpiInlineLabel}>DÍVIDA VENCIDA</Text><Text style={[styles.kpiInlineValue, { color: Colors.ERRO_TEXT }]}>16.700,00 €</Text></View>
                 <View style={[styles.kpiInlineItem, { borderRightWidth: 0 }]}><Text style={styles.kpiInlineLabel}>RÁCIO EFICIÊNCIA</Text><Text style={[styles.kpiInlineValue, { color: Colors.SUCESSO_TEXT }]}>96,1%</Text></View>
              </View>

              <View style={styles.chartMockAreaMini}>
                 <LineChart size={32} color={Colors.GRAY_200_BORDAS} />
                 <Text style={{ fontSize: 10, color: Colors.GRAY_500_TEXTO2, marginTop: 4 }}>[Gráfico de Linha Mensal]</Text>
              </View>

              <Text style={styles.subTableTitle}>Detalhe por Rubrica</Text>
              <View style={styles.table}>
                 <View style={styles.tableHeader}>
                    <Text style={[styles.th, { flex: 2 }]}>RUBRICA</Text>
                    <Text style={[styles.th, { flex: 1.5 }]}>ESCALÃO</Text>
                    <Text style={[styles.th, { flex: 1.5 }]}>GERADO</Text>
                    <Text style={[styles.th, { flex: 1.5 }]}>EM DÍVIDA</Text>
                    <Text style={[styles.th, { flex: 1 }]}>TAXA LIQ.</Text>
                 </View>
                 {rubricasSad.map(r => (
                    <View key={r.id} style={styles.tableRow}>
                       <Text style={[styles.td, { flex: 2, fontWeight: '500' }]}>{r.nome}</Text>
                       <View style={{ flex: 1.5 }}><View style={[styles.badgePill, { backgroundColor: '#F1F5F9' }]}><Text style={{ fontSize: 10, color: '#64748B' }}>{r.escalao}</Text></View></View>
                       <Text style={[styles.td, { flex: 1.5 }]}>{r.valorTotal.toFixed(2)} €</Text>
                       <Text style={[styles.td, { flex: 1.5, color: Colors.ERRO_TEXT }]}>{r.valorEmDivida.toFixed(2)} €</Text>
                       <Text style={[styles.td, { flex: 1, color: r.taxaLiq >= 85 ? Colors.SUCESSO_TEXT : r.taxaLiq >= 70 ? Colors.AVISO_TEXT : Colors.ERRO_TEXT, fontWeight: '700' }]}>{r.taxaLiq}%</Text>
                    </View>
                 ))}
                 <View style={styles.tableFooter}><Text style={{ fontSize: 11, color: Colors.INFO_TEXT }}>← Anterior</Text><Text style={{ fontSize: 11, color: Colors.INFO_TEXT }}>Próxima →</Text></View>
              </View>
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
  filtersWrapper: { },
  panelCompare: { flex: 1, backgroundColor: Colors.BRANCO, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 16, padding: 20 },
  badgePanel: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginBottom: 16 },
  kpiInlineRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.GRAY_200_BORDAS, paddingBottom: 16, marginBottom: 16 },
  kpiInlineItem: { flex: 1, borderRightWidth: 1, borderRightColor: Colors.GRAY_200_BORDAS, paddingHorizontal: 8 },
  kpiInlineLabel: { fontSize: 10, color: Colors.GRAY_500_TEXTO2, marginBottom: 4 },
  kpiInlineValue: { fontSize: 18, fontWeight: '700', color: Colors.GRAY_900_TEXTO1 },
  chartMockAreaMini: { height: 160, backgroundColor: '#F8FAFC', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 24, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderStyle: 'dashed' },
  subTableTitle: { fontSize: 14, fontWeight: '600', color: Colors.GRAY_900_TEXTO1, marginBottom: 8 },
  table: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, overflow: 'hidden', backgroundColor: Colors.BRANCO },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  th: { fontSize: 11, fontWeight: '600', color: Colors.GRAY_500_TEXTO2 },
  tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', alignItems: 'center' },
  td: { fontSize: 13, color: Colors.GRAY_900_TEXTO1 },
  tableFooter: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  badgePill: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
});
