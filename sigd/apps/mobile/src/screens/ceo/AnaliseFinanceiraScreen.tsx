import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Download, FileText, LineChart, Table } from 'lucide-react-native';
import { PageHeader } from '../../components/ui/PageHeader';
import { CeoFilters, PresetPeriodo } from './components/CeoFilters';
import { CeoKpiCard } from './components/CeoKpiCard';
import { ceoService, KpiCardData, FluxoCaixa, RubricaFinanceira } from '@/services/ceoService';
import { Colors } from '@/constants/colors';

type AbaInterna = 'Tesouraria' | 'Clube vs SAD' | 'Fluxos de Caixa';

export function AnaliseFinanceiraScreen(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<AbaInterna>('Tesouraria');
  const [periodo, setPeriodo] = useState<PresetPeriodo>('Época Ativa');
  
  const [fluxos, setFluxos] = useState<FluxoCaixa[]>([]);
  const [rubricas, setRubricas] = useState<RubricaFinanceira[]>([]);

  useEffect(() => {
    ceoService.getFluxosCaixa().then(setFluxos);
    ceoService.getRubricasFinanceiras('Clube').then(setRubricas);
  }, []);

  return (
    <View style={styles.container}>
      <PageHeader
        title="Análise Financeira"
        breadcrumbs={[
          { label: 'Presidência' },
          { label: 'Análise Financeira' },
        ]}
      />

      {/* Sub-navegação */}
      <View style={styles.tabsContainer}>
         {(['Tesouraria', 'Clube vs SAD', 'Fluxos de Caixa'] as AbaInterna[]).map(tab => (
            <TouchableOpacity 
               key={tab} 
               style={[styles.tab, activeTab === tab && styles.tabActive]}
               onPress={() => setActiveTab(tab)}
            >
               <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
         ))}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        
        {/* Barra de Filtros Comum */}
        <CeoFilters 
          label="Período de análise:"
          presets={['Este Mês', 'Trimestre', 'Época Ativa', 'Personalizado']}
          activePreset={periodo}
          onChangePreset={setPeriodo}
          onExportPDF={activeTab !== 'Fluxos de Caixa' ? () => {} : undefined}
          onExportCSV={activeTab === 'Fluxos de Caixa' ? () => {} : undefined}
        />

        {/* CONTEÚDO: TESOURARIA */}
        {activeTab === 'Tesouraria' && (
          <>
             <View style={styles.grid3}>
                <CeoKpiCard 
                   label="RECEITA CAPTADA"
                   valorFormatado="1.240.500,00 €"
                   subtexto="Época 2025/2026"
                   icon={FileText}
                   variacaoTexto="+12,3% vs. anterior"
                   variacaoPositiva={true}
                />
                <CeoKpiCard 
                   label="DÍVIDA VENCIDA TOTAL"
                   valorFormatado="45.200,00 €"
                   subtexto="Mensalidades em atraso"
                   icon={FileText}
                   valorCor={Colors.ERRO_TEXT}
                   iconColor={Colors.ERRO_TEXT}
                   variacaoTexto="-8,2% vs. anterior"
                   variacaoPositiva={true}
                />
                <CeoKpiCard 
                   label="RÁCIO DE LIQUIDEZ"
                   valorFormatado="96,5%"
                   subtexto="Receita Captada / (Receita + Dívida)"
                   icon={FileText}
                   valorCor={Colors.SUCESSO_TEXT}
                   variacaoTexto="+2,1% vs. anterior"
                   variacaoPositiva={true}
                />
             </View>

             <View style={[styles.chartCard, { height: 400, marginTop: 16 }]}>
                <View style={styles.chartHeader}>
                   <Text style={styles.chartTitle}>Evolução de Receita vs. Dívida</Text>
                   <View style={{ flexDirection: 'row', gap: 16 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}><View style={[styles.legendDot, { backgroundColor: Colors.SUCESSO_TEXT }]} /><Text style={styles.legendText}>Receita Captada</Text></View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}><View style={[styles.legendDot, { backgroundColor: Colors.ERRO_TEXT }]} /><Text style={styles.legendText}>Dívida Vencida</Text></View>
                   </View>
                </View>
                <View style={styles.chartMockArea}>
                   <LineChart size={48} color={Colors.GRAY_200_BORDAS} style={{ opacity: 0.5 }} />
                   <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2, marginTop: 8 }}>[Gráfico de Linha - Em Desenvolvimento]</Text>
                </View>
             </View>
          </>
        )}

        {/* CONTEÚDO: CLUBE VS SAD */}
        {activeTab === 'Clube vs SAD' && (
          <View style={{ flexDirection: 'row', gap: 16 }}>
             {/* Painel Clube */}
             <View style={styles.panelCompare}>
                <View style={[styles.badgePanel, { backgroundColor: Colors.PRETO_PRIMARIO }]}><Text style={{ color: Colors.BRANCO, fontSize: 12, fontWeight: '600' }}>ASSOCIAÇÃO / CLUBE</Text></View>
                
                <View style={styles.kpiInlineRow}>
                   <View style={styles.kpiInlineItem}><Text style={styles.kpiInlineLabel}>RECEITA</Text><Text style={styles.kpiInlineValue}>820.300,00 €</Text></View>
                   <View style={styles.kpiInlineItem}><Text style={styles.kpiInlineLabel}>DÍVIDA</Text><Text style={[styles.kpiInlineValue, { color: Colors.ERRO_TEXT }]}>28.500,00 €</Text></View>
                   <View style={[styles.kpiInlineItem, { borderRightWidth: 0 }]}><Text style={styles.kpiInlineLabel}>COBERTURA</Text><Text style={[styles.kpiInlineValue, { color: Colors.SUCESSO_TEXT }]}>96,6%</Text></View>
                </View>

                <View style={styles.chartMockAreaMini}>
                   <LineChart size={32} color={Colors.GRAY_200_BORDAS} />
                </View>

                <Text style={styles.subTableTitle}>Detalhe por Rubrica</Text>
                <View style={styles.table}>
                   <View style={styles.tableHeader}>
                      <Text style={[styles.th, { flex: 2 }]}>RUBRICA</Text>
                      <Text style={[styles.th, { flex: 1.5 }]}>VALOR TOTAL</Text>
                      <Text style={[styles.th, { flex: 1.5 }]}>EM DÍVIDA</Text>
                      <Text style={[styles.th, { flex: 1 }]}>TAXA LIQ.</Text>
                   </View>
                   {rubricas.map(r => (
                      <View key={r.id} style={styles.tableRow}>
                         <Text style={[styles.td, { flex: 2 }]}>{r.nome}</Text>
                         <Text style={[styles.td, { flex: 1.5 }]}>{r.valorTotal.toFixed(2)} €</Text>
                         <Text style={[styles.td, { flex: 1.5, color: Colors.ERRO_TEXT }]}>{r.emDivida.toFixed(2)} €</Text>
                         <Text style={[styles.td, { flex: 1, color: Colors.SUCESSO_TEXT, fontWeight: '700' }]}>{r.taxaLiq}%</Text>
                      </View>
                   ))}
                </View>
             </View>

             {/* Painel SAD */}
             <View style={styles.panelCompare}>
                <View style={[styles.badgePanel, { backgroundColor: '#FFFBEB' }]}><Text style={{ color: '#B45309', fontSize: 12, fontWeight: '600' }}>SAD / FORMAÇÃO</Text></View>
                
                <View style={styles.kpiInlineRow}>
                   <View style={styles.kpiInlineItem}><Text style={styles.kpiInlineLabel}>RECEITA</Text><Text style={styles.kpiInlineValue}>420.200,00 €</Text></View>
                   <View style={styles.kpiInlineItem}><Text style={styles.kpiInlineLabel}>DÍVIDA</Text><Text style={[styles.kpiInlineValue, { color: Colors.ERRO_TEXT }]}>16.700,00 €</Text></View>
                   <View style={[styles.kpiInlineItem, { borderRightWidth: 0 }]}><Text style={styles.kpiInlineLabel}>COBERTURA</Text><Text style={[styles.kpiInlineValue, { color: Colors.SUCESSO_TEXT }]}>96,1%</Text></View>
                </View>

                <View style={styles.chartMockAreaMini}>
                   <LineChart size={32} color={Colors.GRAY_200_BORDAS} />
                </View>

                <Text style={styles.subTableTitle}>Detalhe por Rubrica</Text>
                <View style={styles.table}>
                   <View style={styles.tableHeader}>
                      <Text style={[styles.th, { flex: 2 }]}>RUBRICA</Text>
                      <Text style={[styles.th, { flex: 1.5 }]}>VALOR TOTAL</Text>
                      <Text style={[styles.th, { flex: 1.5 }]}>EM DÍVIDA</Text>
                      <Text style={[styles.th, { flex: 1 }]}>TAXA LIQ.</Text>
                   </View>
                   <View style={styles.tableMockEmpty}>
                      <Table size={24} color={Colors.GRAY_200_BORDAS} style={{ marginBottom: 8 }} />
                      <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2 }}>Sem rubricas registadas</Text>
                   </View>
                </View>
             </View>
          </View>
        )}

        {/* CONTEÚDO: FLUXOS DE CAIXA */}
        {activeTab === 'Fluxos de Caixa' && (
          <View style={styles.table}>
             <View style={styles.tableHeader}>
                <Text style={[styles.th, { flex: 2 }]}>CANAL</Text>
                <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>VALOR TOTAL (CLUBE)</Text>
                <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>VALOR TOTAL (SAD)</Text>
                <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>TOTAL COMBINADO</Text>
             </View>
             {fluxos.map(f => (
                <View key={f.canal} style={styles.tableRow}>
                   <Text style={[styles.td, { flex: 2, fontWeight: '600' }]}>{f.canal}</Text>
                   <Text style={[styles.td, { flex: 2, textAlign: 'right' }]}>{f.valorClube.toFixed(2)} €</Text>
                   <Text style={[styles.td, { flex: 2, textAlign: 'right' }]}>{f.valorSad.toFixed(2)} €</Text>
                   <Text style={[styles.td, { flex: 2, textAlign: 'right', fontWeight: '700' }]}>{f.total.toFixed(2)} €</Text>
                </View>
             ))}
             <View style={[styles.tableRow, { backgroundColor: '#F8FAFC' }]}>
                <Text style={[styles.td, { flex: 2, fontWeight: '700' }]}>Total</Text>
                <Text style={[styles.td, { flex: 2, textAlign: 'right', fontWeight: '700' }]}>7.800,00 €</Text>
                <Text style={[styles.td, { flex: 2, textAlign: 'right', fontWeight: '700' }]}>1.960,00 €</Text>
                <Text style={[styles.td, { flex: 2, textAlign: 'right', fontWeight: '700' }]}>9.760,00 €</Text>
             </View>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.GRAY_50_FUNDO },
  tabsContainer: { flexDirection: 'row', backgroundColor: Colors.BRANCO, borderBottomWidth: 1, borderBottomColor: Colors.GRAY_200_BORDAS, paddingHorizontal: 32 },
  tab: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: Colors.DOURADO_CTA },
  tabText: { fontSize: 14, color: Colors.GRAY_500_TEXTO2 },
  tabTextActive: { color: Colors.GRAY_900_TEXTO1, fontWeight: '600' },
  content: { flex: 1 },
  scrollContent: { padding: 32, gap: 24 },
  grid3: { flexDirection: 'row', gap: 16 },
  chartCard: { backgroundColor: Colors.BRANCO, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 16, padding: 20 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  chartTitle: { fontSize: 14, fontWeight: '600', color: Colors.GRAY_900_TEXTO1 },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendText: { fontSize: 12, color: Colors.GRAY_500_TEXTO2 },
  chartMockArea: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  panelCompare: { flex: 1, backgroundColor: Colors.BRANCO, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 16, padding: 20 },
  badgePanel: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginBottom: 16 },
  kpiInlineRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.GRAY_200_BORDAS, paddingBottom: 16, marginBottom: 16 },
  kpiInlineItem: { flex: 1, borderRightWidth: 1, borderRightColor: Colors.GRAY_200_BORDAS, paddingHorizontal: 8 },
  kpiInlineLabel: { fontSize: 10, color: Colors.GRAY_500_TEXTO2, marginBottom: 4 },
  kpiInlineValue: { fontSize: 18, fontWeight: '700', color: Colors.GRAY_900_TEXTO1 },
  chartMockAreaMini: { height: 120, backgroundColor: '#F8FAFC', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  subTableTitle: { fontSize: 14, fontWeight: '600', color: Colors.GRAY_900_TEXTO1, marginBottom: 8 },
  table: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, overflow: 'hidden', backgroundColor: Colors.BRANCO },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  th: { fontSize: 11, fontWeight: '600', color: Colors.GRAY_500_TEXTO2 },
  tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', alignItems: 'center' },
  td: { fontSize: 13, color: Colors.GRAY_900_TEXTO1 },
  tableMockEmpty: { padding: 32, alignItems: 'center', justifyContent: 'center' }
});
