import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TrendingUp, AlertCircle, PieChart, Banknote, Trophy, ClipboardCheck, UserX, Users, ShieldCheck, FileCheck, AlertTriangle, CheckCircle, BarChart2 } from 'lucide-react-native';
import { PageHeader } from '../../components/ui/PageHeader';
import { CeoFilters, PresetPeriodo } from './components/CeoFilters';
import { CeoKpiCard } from './components/CeoKpiCard';
import { ModalRelatorioExecutivo, ModalDrillDownDivida } from './components/CeoModals';
import { ceoService, AlertaEstrategico, KpiCardData, DetalheDivida } from '@/services/ceoService';
import { Colors } from '@/constants/colors';

export function VisaoExecutivaScreen(): React.JSX.Element {
  const [periodo, setPeriodo] = useState<PresetPeriodo>('Época Ativa');
  const [alertas, setAlertas] = useState<AlertaEstrategico[]>([]);
  const [kpiReceita, setKpiReceita] = useState<KpiCardData | null>(null);
  const [kpiPassivo, setKpiPassivo] = useState<KpiCardData | null>(null);
  const [showModalPdf, setShowModalPdf] = useState(false);
  const [showModalDivida, setShowModalDivida] = useState(false);
  const [detalheDivida, setDetalheDivida] = useState<DetalheDivida[]>([]);

  useEffect(() => {
    carregarDados();
  }, [periodo]);

  const carregarDados = async () => {
    const dataAlertas = await ceoService.getAlertas(periodo);
    setAlertas(dataAlertas);
    const receita = await ceoService.getKpiReceitaTotal(periodo);
    setKpiReceita(receita);
    const passivo = await ceoService.getKpiPassivoPendente(periodo);
    setKpiPassivo(passivo);
    const detalhe = await ceoService.getDetalheDivida();
    setDetalheDivida(detalhe);
  };

  return (
    <View style={styles.container}>
      <PageHeader
        title="Visão Executiva Integrada"
        breadcrumbs={[
          { label: 'Presidência' },
          { label: 'Visão Executiva' },
        ]}
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        
        {/* Barra de Filtros */}
        <CeoFilters 
          label="Período de análise:"
          presets={['Esta Semana', 'Este Mês', 'Época Ativa', 'Personalizado']}
          activePreset={periodo}
          onChangePreset={setPeriodo}
          onExportPDF={() => setShowModalPdf(true)}
        />

        {/* Alertas Estratégicos */}
        <View style={[styles.alertBlock, alertas.length > 0 ? styles.alertBlockActive : styles.alertBlockOk]}>
           <View style={styles.alertHeader}>
              {alertas.length > 0 ? <AlertTriangle size={16} color={Colors.AVISO_TEXT} /> : <CheckCircle size={16} color={Colors.SUCESSO_TEXT} />}
              <Text style={[styles.alertTitle, { marginLeft: 8 }]}>Alertas Estratégicos</Text>
           </View>

           {alertas.length > 0 ? (
              <View style={styles.alertList}>
                 {alertas.map((a, i) => (
                    <View key={a.id} style={[styles.alertItem, i > 0 && { borderTopWidth: 1, borderTopColor: Colors.GRAY_200_BORDAS }]}>
                       <AlertTriangle size={14} color={Colors.AVISO_TEXT} />
                       <Text style={styles.alertItemText}>{a.texto}</Text>
                       <View style={[styles.alertBadge, { backgroundColor: a.severidade === 'Crítico' ? '#FEE2E2' : '#FFFBEB' }]}>
                          <Text style={[styles.alertBadgeText, { color: a.severidade === 'Crítico' ? '#991B1B' : '#B45309' }]}>{a.severidade}</Text>
                       </View>
                    </View>
                 ))}
              </View>
           ) : (
              <Text style={{ fontSize: 14, color: Colors.SUCESSO_TEXT, marginTop: 8 }}>Sem alertas críticos ativos — Clube operacionalmente saudável.</Text>
           )}
        </View>

        {/* Linha 1 - Financeiros */}
        <Text style={styles.sectionTitle}>Indicadores Financeiros</Text>
        <View style={styles.grid4}>
           <CeoKpiCard 
              label="RECEITA TOTAL (YTD)"
              valorFormatado={kpiReceita?.valorFormatado || "—"}
              subtexto={kpiReceita?.subtexto || ""}
              icon={TrendingUp}
              variacaoTexto={kpiReceita?.variacaoTexto}
              variacaoPositiva={kpiReceita?.variacaoPositiva}
           />
           <CeoKpiCard 
              label="PASSIVO PENDENTE"
              valorFormatado={kpiPassivo?.valorFormatado || "—"}
              subtexto={kpiPassivo?.subtexto || ""}
              icon={AlertCircle}
              iconColor={Colors.ERRO_TEXT}
              valorCor={Colors.ERRO_TEXT}
              variacaoTexto={kpiPassivo?.variacaoTexto}
              variacaoPositiva={kpiPassivo?.variacaoPositiva}
              onDrillDown={() => setShowModalDivida(true)}
              drillDownText="Ver detalhes por escalão"
           />
           <CeoKpiCard 
              label="TAXA DE REGULARIDADE"
              valorFormatado="88%"
              subtexto="10.956 de 12.450 sócios com quotas em dia"
              icon={PieChart}
              gaugeValue={88}
           />
           <CeoKpiCard 
              label="FLUXO DE CAIXA"
              valorFormatado="2.100,00 €"
              subtexto="No período selecionado"
              icon={Banknote}
           />
        </View>

        {/* Linha 2 - Desportivos */}
        <Text style={styles.sectionTitle}>Performance Desportiva</Text>
        <View style={styles.grid3}>
           <CeoKpiCard 
              label="RESULTADOS ÚLTIMA JORNADA"
              valorFormatado="—"
              subtexto="12 jogos disputados · Época 2025/2026"
              icon={Trophy}
           >
              <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
                 <View style={[styles.badgePill, { backgroundColor: '#ECFDF5' }]}><Text style={{ color: '#047857', fontSize: 11, fontWeight: '600' }}>7 Vitórias</Text></View>
                 <View style={[styles.badgePill, { backgroundColor: '#FFFBEB' }]}><Text style={{ color: '#B45309', fontSize: 11, fontWeight: '600' }}>3 Empates</Text></View>
                 <View style={[styles.badgePill, { backgroundColor: '#FEE2E2' }]}><Text style={{ color: '#991B1B', fontSize: 11, fontWeight: '600' }}>2 Derrotas</Text></View>
              </View>
           </CeoKpiCard>
           
           <CeoKpiCard 
              label="FICHAS SUBMETIDAS NO PRAZO"
              valorFormatado="92%"
              subtexto="11 de 12 jogos com ficha dentro do prazo"
              icon={ClipboardCheck}
              gaugeValue={92}
           />

           <CeoKpiCard 
              label="ATLETAS BLOQUEADOS"
              valorFormatado="31"
              valorCor={Colors.ERRO_TEXT}
              subtexto="Atletas inaptos para treino ou convocatória"
              icon={UserX}
              iconColor={Colors.ERRO_TEXT}
           >
              <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
                 <View style={[styles.badgePill, { backgroundColor: '#FEE2E2' }]}><Text style={{ color: '#991B1B', fontSize: 11, fontWeight: '600' }}>Doc: 12</Text></View>
                 <View style={[styles.badgePill, { backgroundColor: '#FFFBEB' }]}><Text style={{ color: '#B45309', fontSize: 11, fontWeight: '600' }}>Cli: 5</Text></View>
                 <View style={[styles.badgePill, { backgroundColor: '#FEE2E2' }]}><Text style={{ color: '#991B1B', fontSize: 11, fontWeight: '600' }}>Fin: 14</Text></View>
              </View>
           </CeoKpiCard>
        </View>

        {/* Linha 3 - Operacionais */}
        <Text style={styles.sectionTitle}>Indicadores Operacionais</Text>
        <View style={styles.grid3}>
           <CeoKpiCard 
              label="SÓCIOS ATIVOS"
              valorFormatado="12.450"
              subtexto="Vínculo associativo ativo e regularizado"
              icon={Users}
              variacaoTexto="+2,1% vs. época anterior"
              variacaoPositiva={true}
           />
           <CeoKpiCard 
              label="ATLETAS FEDERADOS"
              valorFormatado="450"
              subtexto="Distribuídos por 18 equipas ativas"
              icon={ShieldCheck}
              variacaoTexto="+4,0% vs. época anterior"
              variacaoPositiva={true}
           />
           <CeoKpiCard 
              label="SAÚDE DOCUMENTAL"
              valorFormatado="87%"
              subtexto="392 de 450 atletas com docs válidos"
              icon={FileCheck}
              gaugeValue={87}
           />
        </View>

        {/* Gráficos */}
        <View style={styles.chartsContainer}>
           <View style={[styles.chartCard, { flex: 0.65 }]}>
              <View style={styles.chartHeader}>
                 <Text style={styles.chartTitle}>Evolução Mensal de Proveitos — Clube vs. SAD</Text>
              </View>
              <View style={styles.chartMockArea}>
                 <BarChart2 size={48} color={Colors.GRAY_200_BORDAS} style={{ opacity: 0.5 }} />
                 <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2, marginTop: 8 }}>[Gráfico de Barras Agrupadas - Em Desenvolvimento]</Text>
              </View>
           </View>

           <View style={[styles.chartCard, { flex: 0.35 }]}>
              <View style={styles.chartHeader}>
                 <Text style={styles.chartTitle}>Atletas por Escalão</Text>
              </View>
              <View style={styles.chartMockArea}>
                 <PieChart size={48} color={Colors.GRAY_200_BORDAS} style={{ opacity: 0.5 }} />
                 <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2, marginTop: 8 }}>[Donut Chart]</Text>
              </View>
           </View>
        </View>

        <Text style={styles.footerText}>Dados calculados às 14:00 de hoje · Última sincronização: {new Date().toLocaleDateString()} · Época ativa: 2025/2026</Text>

      </ScrollView>

      <ModalRelatorioExecutivo visible={showModalPdf} onClose={() => setShowModalPdf(false)} />
      <ModalDrillDownDivida visible={showModalDivida} onClose={() => setShowModalDivida(false)} dados={detalheDivida} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.GRAY_50_FUNDO },
  content: { flex: 1 },
  scrollContent: { padding: 32, gap: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: Colors.GRAY_900_TEXTO1, marginBottom: -8, marginTop: 8 },
  grid4: { flexDirection: 'row', gap: 16 },
  grid3: { flexDirection: 'row', gap: 16 },
  alertBlock: { borderWidth: 1, borderRadius: 12, padding: 16, width: '100%' },
  alertBlockActive: { backgroundColor: '#FFFBEB', borderColor: '#B45309' },
  alertBlockOk: { backgroundColor: '#ECFDF5', borderColor: '#047857' },
  alertHeader: { flexDirection: 'row', alignItems: 'center' },
  alertTitle: { fontSize: 14, fontWeight: '600', color: Colors.GRAY_900_TEXTO1 },
  alertList: { marginTop: 12 },
  alertItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  alertItemText: { flex: 1, fontSize: 14, color: Colors.GRAY_900_TEXTO1, marginLeft: 8 },
  alertBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, marginLeft: 12 },
  alertBadgeText: { fontSize: 11, fontWeight: '600' },
  badgePill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 12 },
  chartsContainer: { flexDirection: 'row', gap: 16, height: 350, marginTop: 16 },
  chartCard: { backgroundColor: Colors.BRANCO, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  chartHeader: { marginBottom: 16 },
  chartTitle: { fontSize: 14, fontWeight: '600', color: Colors.GRAY_900_TEXTO1 },
  chartMockArea: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  footerText: { fontSize: 12, color: Colors.GRAY_500_TEXTO2, textAlign: 'right', marginTop: 16 },
});
