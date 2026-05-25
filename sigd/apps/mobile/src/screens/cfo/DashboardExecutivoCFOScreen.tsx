import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TrendingUp, AlertCircle, Users, ShieldCheck, BarChart2, Banknote, Info } from 'lucide-react-native';
import { PageHeader } from '../../components/ui/PageHeader';
import { CeoFilters, PresetPeriodo } from '../ceo/components/CeoFilters';
import { CeoKpiCard } from '../ceo/components/CeoKpiCard';
import { ModalDrillDownDividaCFO } from './components/CfoModals';
import { cfoService, DetalhePassivoCFO, FluxoCaixaCFO } from '@/services/cfoService';
import { Colors } from '@/constants/colors';

export function DashboardExecutivoCFOScreen(): React.JSX.Element {
  const [periodo, setPeriodo] = useState<PresetPeriodo>('Época Ativa');
  const [showModalDivida, setShowModalDivida] = useState(false);
  const [detalheDivida, setDetalheDivida] = useState<DetalhePassivoCFO[]>([]);
  const [fluxos, setFluxos] = useState<FluxoCaixaCFO[]>([]);

  useEffect(() => {
    cfoService.getDetalhePassivo().then(setDetalheDivida);
    cfoService.getFluxosUltimos().then(setFluxos);
  }, [periodo]);

  return (
    <View style={styles.container}>
      <PageHeader
        title="Dashboard Executivo"
        breadcrumbs={[
          { label: 'Direção Financeira' },
          { label: 'Dashboard Executivo' },
        ]}
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        
        {/* Barra de Filtros */}
        <CeoFilters 
          label="Período de análise:"
          presets={['Este Mês', 'Trimestre', 'Época Ativa', 'Personalizado']}
          activePreset={periodo}
          onChangePreset={setPeriodo}
          onExportCSV={() => {}}
        />

        {/* Secção 1 — Cartões de KPI */}
        <View style={styles.grid4}>
           <CeoKpiCard 
              label="RECEITA TOTAL"
              valorFormatado="1.240.500,00 €"
              subtexto={`Época 2025/2026 · Atualizado às ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
              icon={TrendingUp}
              variacaoTexto="+12,3% face à época anterior"
              variacaoPositiva={true}
           />
           <CeoKpiCard 
              label="PASSIVO PENDENTE"
              valorFormatado="45.200,00 €"
              subtexto="230 mensalidades em atraso"
              icon={AlertCircle}
              iconColor={Colors.ERRO_TEXT}
              valorCor={Colors.ERRO_TEXT}
              variacaoTexto="-8,2% face ao mês anterior"
              variacaoPositiva={true}
              onDrillDown={() => setShowModalDivida(true)}
              drillDownText="Ver detalhes por escalão"
           />
           <CeoKpiCard 
              label="SÓCIOS ATIVOS"
              valorFormatado="12.450"
              subtexto="Taxa de regularidade associativa: 88%"
              icon={Users}
              variacaoTexto="+3,1% face ao mês anterior"
              variacaoPositiva={true}
           />
           <CeoKpiCard 
              label="ATLETAS FEDERADOS"
              valorFormatado="450"
              subtexto="Distribuídos por 18 equipas"
              icon={ShieldCheck}
              variacaoTexto="+4,0% face à época anterior"
              variacaoPositiva={true}
           />
        </View>

        {/* Secção 2 — Gráficos e Fluxos */}
        <View style={styles.chartsRow}>
           <View style={[styles.chartCard, { flex: 0.6 }]}>
              <View style={styles.chartHeader}>
                 <Text style={styles.chartTitle}>Evolução de Proveitos — Clube vs. SAD</Text>
                 <View style={{ flexDirection: 'row', gap: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}><View style={[styles.legendDot, { backgroundColor: Colors.PRETO_PRIMARIO }]} /><Text style={styles.legendText}>Clube</Text></View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}><View style={[styles.legendDot, { backgroundColor: Colors.DOURADO_CTA }]} /><Text style={styles.legendText}>SAD</Text></View>
                 </View>
              </View>
              <View style={styles.chartMockArea}>
                 <BarChart2 size={48} color={Colors.GRAY_200_BORDAS} style={{ opacity: 0.5 }} />
                 <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2, marginTop: 8 }}>[Gráfico de Barras Agrupadas - Em Desenvolvimento]</Text>
              </View>
           </View>

           <View style={[styles.chartCard, { flex: 0.4, padding: 0 }]}>
              <View style={{ padding: 20 }}>
                 <Text style={styles.chartTitle}>Últimos Fluxos em Numerário</Text>
                 <Text style={styles.chartSub}>Movimentos presenciais da Secretaria</Text>

                 <View style={styles.fluxoResumoBox}>
                    <View style={styles.fluxoCol}><Text style={styles.fluxColLabel}>Numerário</Text><Text style={styles.fluxColValue}>320,00 €</Text></View>
                    <View style={styles.fluxoCol}><Text style={styles.fluxColLabel}>Multibanco</Text><Text style={[styles.fluxColValue, { color: Colors.INFO_TEXT }]}>1.240,00 €</Text></View>
                    <View style={[styles.fluxoCol, { borderRightWidth: 0 }]}><Text style={styles.fluxColLabel}>MBWay</Text><Text style={[styles.fluxColValue, { color: Colors.SUCESSO_TEXT }]}>540,00 €</Text></View>
                 </View>
                 <Text style={{ fontSize: 10, color: Colors.GRAY_500_TEXTO2, textAlign: 'center', marginTop: 4 }}>Clube: 1.500,00 € · SAD: 600,00 €</Text>
              </View>
              
              {fluxos.map((f, i) => (
                 <View key={f.id} style={[styles.fluxoRow, i === 0 && { borderTopWidth: 1 }]}>
                    <View style={{ width: 80 }}>
                       <Text style={{ fontSize: 14, fontWeight: '700', color: Colors.GRAY_900_TEXTO1 }}>{f.hora}</Text>
                       <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2 }}>{f.metodo}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                       <Text style={{ fontSize: 14, color: Colors.GRAY_900_TEXTO1 }}>{f.pagador}</Text>
                       <View style={[styles.badgePill, { backgroundColor: f.entidade === 'SAD' ? '#FFFBEB' : '#F1F5F9', marginTop: 4 }]}>
                          <Text style={[styles.badgeText, { color: f.entidade === 'SAD' ? '#B45309' : '#64748B' }]}>{f.entidade}</Text>
                       </View>
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: Colors.GRAY_900_TEXTO1 }}>{f.valor.toFixed(2)} €</Text>
                 </View>
              ))}
              <View style={styles.tableFooter}>
                 <Text style={{ fontSize: 12, color: Colors.INFO_TEXT, fontWeight: '500' }}>← Anterior</Text>
                 <Text style={{ fontSize: 12, color: Colors.INFO_TEXT, fontWeight: '500' }}>Próxima →</Text>
              </View>
           </View>
        </View>

        {/* Secção 3 — Distribuições (CFO partilha os mesmos gráficos da ABA 4 do CEO, logo vou usar os cards simplificados) */}
        <View style={styles.chartsRow}>
           <View style={[styles.chartCard, { flex: 0.5 }]}>
              <Text style={styles.chartTitle}>Distribuição de Atletas por Escalão</Text>
              <View style={styles.chartMockArea}>
                 <BarChart2 size={48} color={Colors.GRAY_200_BORDAS} style={{ opacity: 0.5 }} />
                 <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2, marginTop: 8 }}>[Donut Chart]</Text>
              </View>
           </View>
           <View style={[styles.chartCard, { flex: 0.5, alignItems: 'center', justifyContent: 'center' }]}>
              <Text style={styles.chartTitle}>Taxa de Regularidade Associativa</Text>
              <View style={styles.gaugeMock}>
                 <Text style={{ fontSize: 32, fontWeight: '700', color: Colors.SUCESSO_TEXT }}>88%</Text>
              </View>
              <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2, marginTop: 8 }}>Sócios com quotas em dia</Text>
              <Text style={{ fontSize: 12, color: Colors.GRAY_900_TEXTO1, fontWeight: '600', marginTop: 4 }}>10.956 <Text style={{ color: Colors.GRAY_500_TEXTO2, fontWeight: '400' }}>de 12.450 sócios regularizados</Text></Text>
           </View>
        </View>

        {/* Secção 4 — Estado das Provisões */}
        <View style={styles.provisoesCard}>
           <View style={{ flex: 1 }}>
              <Text style={styles.chartTitle}>Provisões da Época Ativa — 2025/2026</Text>
           </View>
           <View style={{ flexDirection: 'row', gap: 24 }}>
              <View style={styles.provItem}>
                 <Text style={styles.provLabel}>DÉBITOS GERADOS</Text>
                 <Text style={styles.provValue}>5.400</Text>
                 <Text style={styles.provSub}>Mensalidades + Quotas</Text>
              </View>
              <View style={styles.provItem}>
                 <Text style={styles.provLabel}>DÉBITOS EM FALTA</Text>
                 <Text style={[styles.provValue, { color: Colors.ERRO_TEXT }]}>14</Text>
                 <Text style={styles.provSub}>Atletas sem plano processado</Text>
              </View>
              <View style={[styles.provItem, { borderRightWidth: 0 }]}>
                 <Text style={styles.provLabel}>ÚLTIMA GERAÇÃO EM LOTE</Text>
                 <Text style={styles.provValue}>12 Mai 2026</Text>
                 <Text style={styles.provSub}>Processado pela Secretaria</Text>
              </View>
           </View>
           <View style={styles.infoBadge}>
              <Info size={14} color={Colors.INFO_TEXT} style={{ marginRight: 6 }} />
              <Text style={{ fontSize: 11, color: Colors.INFO_TEXT }}>A geração de provisões é executada pela Secretaria. Este painel é read-only.</Text>
           </View>
        </View>

        <Text style={styles.footerText}>Dados atualizados às {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} de hoje · Próxima atualização automática: 16:00</Text>

      </ScrollView>

      <ModalDrillDownDividaCFO visible={showModalDivida} onClose={() => setShowModalDivida(false)} dados={detalheDivida} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.GRAY_50_FUNDO },
  content: { flex: 1 },
  scrollContent: { padding: 32, gap: 24 },
  grid4: { flexDirection: 'row', gap: 16 },
  chartsRow: { flexDirection: 'row', gap: 16, height: 400 },
  chartCard: { backgroundColor: Colors.BRANCO, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 16, padding: 20 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  chartTitle: { fontSize: 14, fontWeight: '600', color: Colors.GRAY_900_TEXTO1 },
  chartSub: { fontSize: 12, color: Colors.GRAY_500_TEXTO2, marginBottom: 16 },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendText: { fontSize: 12, color: Colors.GRAY_500_TEXTO2 },
  chartMockArea: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  fluxoResumoBox: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS },
  fluxoCol: { flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: Colors.GRAY_200_BORDAS },
  fluxColLabel: { fontSize: 10, color: Colors.GRAY_500_TEXTO2, marginBottom: 4 },
  fluxColValue: { fontSize: 14, fontWeight: '700', color: Colors.GRAY_900_TEXTO1 },
  fluxoRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.GRAY_200_BORDAS },
  badgePill: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 12 },
  badgeText: { fontSize: 10, fontWeight: '600' },
  tableFooter: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#F8FAFC', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  gaugeMock: { width: 160, height: 80, borderTopLeftRadius: 80, borderTopRightRadius: 80, borderWidth: 16, borderBottomWidth: 0, borderColor: Colors.SUCESSO_TEXT, alignItems: 'center', justifyContent: 'flex-end', marginTop: 32 },
  provisoesCard: { flexDirection: 'row', backgroundColor: Colors.BRANCO, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 12, padding: 16, alignItems: 'center' },
  provItem: { paddingHorizontal: 16, borderRightWidth: 1, borderRightColor: Colors.GRAY_200_BORDAS },
  provLabel: { fontSize: 10, color: Colors.GRAY_500_TEXTO2, marginBottom: 4 },
  provValue: { fontSize: 20, fontWeight: '700', color: Colors.GRAY_900_TEXTO1 },
  provSub: { fontSize: 11, color: Colors.GRAY_500_TEXTO2 },
  infoBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', padding: 8, borderRadius: 8, marginLeft: 24, maxWidth: 200 },
  footerText: { fontSize: 12, color: Colors.GRAY_500_TEXTO2, textAlign: 'right' },
});
