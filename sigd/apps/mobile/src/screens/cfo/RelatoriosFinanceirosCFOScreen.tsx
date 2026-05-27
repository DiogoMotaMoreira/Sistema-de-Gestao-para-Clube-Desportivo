import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'lucide-react-native';
import { PageHeader } from '../../components/ui/PageHeader';
import { CeoFilters, PresetPeriodo } from '../ceo/components/CeoFilters';
import { cfoService } from '@/services/cfoService';
import { Colors } from '@/constants/colors';

export function RelatoriosFinanceirosCFOScreen(): React.JSX.Element {
  const [periodo, setPeriodo] = useState<PresetPeriodo>('Época Ativa');
  const [resumo, setResumo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    cfoService.getResumoFinanceiro()
      .then(setResumo)
      .finally(() => setLoading(false));
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

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
           <Text style={{ color: Colors.GRAY_500_TEXTO2 }}>A carregar dados financeiros reais...</Text>
        </View>
      ) : (
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
                 <View style={styles.kpiInlineItem}><Text style={styles.kpiInlineLabel}>RECEITA CAPTADA</Text><Text style={styles.kpiInlineValue}>{resumo ? new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(resumo.clube.receita) : "—"}</Text></View>
                 <View style={styles.kpiInlineItem}><Text style={styles.kpiInlineLabel}>DÍVIDA VENCIDA</Text><Text style={[styles.kpiInlineValue, { color: Colors.ERRO_TEXT }]}>{resumo ? new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(resumo.clube.divida) : "—"}</Text></View>
                 <View style={[styles.kpiInlineItem, { borderRightWidth: 0 }]}><Text style={styles.kpiInlineLabel}>OBRIGAÇÕES</Text><Text style={[styles.kpiInlineValue, { color: Colors.SUCESSO_TEXT }]}>{resumo ? resumo.clube.totalObrigacoes : "—"}</Text></View>
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
                 {(resumo?.detalhesPorRubrica || []).filter((r: any) => r.entidade === 'CLUBE').map((r: any, idx: number) => (
                    <View key={idx} style={styles.tableRow}>
                       <Text style={[styles.td, { flex: 2, fontWeight: '500' }]}>{r.rubrica}</Text>
                       <View style={{ flex: 1.5 }}><View style={[styles.badgePill, { backgroundColor: '#F1F5F9' }]}><Text style={{ fontSize: 10, color: '#64748B' }}>Global</Text></View></View>
                       <Text style={[styles.td, { flex: 1.5 }]}>{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(r.totalGerado)}</Text>
                       <Text style={[styles.td, { flex: 1.5, color: Colors.ERRO_TEXT }]}>{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(r.totalDivida)}</Text>
                       <Text style={[styles.td, { flex: 1, color: Colors.SUCESSO_TEXT, fontWeight: '700' }]}>{r.taxaLiquidacao.toFixed(1)}%</Text>
                    </View>
                 ))}
                 <View style={styles.tableFooter}><Text style={{ fontSize: 11, color: Colors.INFO_TEXT }}>← Anterior</Text><Text style={{ fontSize: 11, color: Colors.INFO_TEXT }}>Próxima →</Text></View>
              </View>
           </View>

           {/* Painel SAD */}
           <View style={styles.panelCompare}>
              <View style={[styles.badgePanel, { backgroundColor: '#FFFBEB' }]}><Text style={{ color: '#B45309', fontSize: 12, fontWeight: '600' }}>SAD / FORMAÇÃO</Text></View>
              
              <View style={styles.kpiInlineRow}>
                 <View style={styles.kpiInlineItem}><Text style={styles.kpiInlineLabel}>RECEITA CAPTADA</Text><Text style={styles.kpiInlineValue}>{resumo ? new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(resumo.sad.receita) : "—"}</Text></View>
                 <View style={styles.kpiInlineItem}><Text style={styles.kpiInlineLabel}>DÍVIDA VENCIDA</Text><Text style={[styles.kpiInlineValue, { color: Colors.ERRO_TEXT }]}>{resumo ? new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(resumo.sad.divida) : "—"}</Text></View>
                 <View style={[styles.kpiInlineItem, { borderRightWidth: 0 }]}><Text style={styles.kpiInlineLabel}>OBRIGAÇÕES</Text><Text style={[styles.kpiInlineValue, { color: Colors.SUCESSO_TEXT }]}>{resumo ? resumo.sad.totalObrigacoes : "—"}</Text></View>
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
                 {(resumo?.detalhesPorRubrica || []).filter((r: any) => r.entidade === 'SAD').map((r: any, idx: number) => (
                    <View key={idx} style={styles.tableRow}>
                       <Text style={[styles.td, { flex: 2, fontWeight: '500' }]}>{r.rubrica}</Text>
                       <View style={{ flex: 1.5 }}><View style={[styles.badgePill, { backgroundColor: '#F1F5F9' }]}><Text style={{ fontSize: 10, color: '#64748B' }}>Global</Text></View></View>
                       <Text style={[styles.td, { flex: 1.5 }]}>{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(r.totalGerado)}</Text>
                       <Text style={[styles.td, { flex: 1.5, color: Colors.ERRO_TEXT }]}>{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(r.totalDivida)}</Text>
                       <Text style={[styles.td, { flex: 1, color: r.taxaLiquidacao >= 85 ? Colors.SUCESSO_TEXT : r.taxaLiquidacao >= 70 ? Colors.AVISO_TEXT : Colors.ERRO_TEXT, fontWeight: '700' }]}>{r.taxaLiquidacao.toFixed(1)}%</Text>
                    </View>
                 ))}
                 <View style={styles.tableFooter}><Text style={{ fontSize: 11, color: Colors.INFO_TEXT }}>← Anterior</Text><Text style={{ fontSize: 11, color: Colors.INFO_TEXT }}>Próxima →</Text></View>
              </View>
           </View>

        </View>

      </ScrollView>
      )}
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
