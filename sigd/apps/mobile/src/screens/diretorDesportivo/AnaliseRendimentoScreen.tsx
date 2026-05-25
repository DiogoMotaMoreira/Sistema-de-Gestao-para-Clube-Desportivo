import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowUpRight, Clock, FileText, BarChart2, LineChart, Search } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { diretorDesportivoService, KPIStats } from '@/services/diretorDesportivoService';

export function AnaliseRendimentoScreen({ navigation }: any): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'Coletivo' | 'Individual' | 'Incumprimentos'>('Coletivo');
  const [kpi, setKpi] = useState<KPIStats | null>(null);

  useEffect(() => {
    if (activeTab === 'Coletivo') {
      diretorDesportivoService.getKPIsColetivos().then(setKpi);
    }
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Análise e Rendimento</Text>
      </View>

      {/* Sub-Tabs */}
      <View style={styles.tabsBar}>
         <TouchableOpacity 
           style={[styles.tab, activeTab === 'Coletivo' && styles.tabActive]}
           onPress={() => setActiveTab('Coletivo')}
         >
           <Text style={[styles.tabText, activeTab === 'Coletivo' && styles.tabTextActive]}>Visão Global — Coletivo</Text>
         </TouchableOpacity>
         <TouchableOpacity 
           style={[styles.tab, activeTab === 'Individual' && styles.tabActive]}
           onPress={() => setActiveTab('Individual')}
         >
           <Text style={[styles.tabText, activeTab === 'Individual' && styles.tabTextActive]}>Análise Individual</Text>
         </TouchableOpacity>
         <TouchableOpacity 
           style={[styles.tab, activeTab === 'Incumprimentos' && styles.tabActive]}
           onPress={() => setActiveTab('Incumprimentos')}
         >
           <Text style={[styles.tabText, activeTab === 'Incumprimentos' && styles.tabTextActive]}>Auditoria de Incumprimentos</Text>
         </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 24 }}>
         {activeTab === 'Coletivo' && kpi && (
            <>
              {/* Toolbar */}
              <View style={styles.toolbar}>
                 <View style={styles.dropdownMock}><Text style={styles.dropdownText}>Época: Época Ativa</Text></View>
                 <View style={styles.dropdownMock}><Text style={styles.dropdownText}>Equipa: Todas as Equipas</Text></View>
                 <View style={styles.dropdownMock}><Text style={styles.dropdownText}>Período: Época Completa</Text></View>
                 <TouchableOpacity><Text style={{ color: '#1D4ED8', fontSize: 12 }}>Limpar Filtros</Text></TouchableOpacity>
              </View>

              {/* KPI Cards */}
              <View style={styles.kpiGrid}>
                 <View style={styles.kpiCard}>
                   <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                     <Text style={styles.kpiLabel}>TAXA DE VITÓRIAS</Text>
                     <View style={styles.badgeAmbar}>
                        <Clock size={10} color="#B45309" />
                        <Text style={{ fontSize: 9, color: '#B45309', fontWeight: '600', marginLeft: 4 }}>Inclui dados provisórios</Text>
                     </View>
                   </View>
                   <Text style={styles.kpiValue}>{((kpi.vitorias / (kpi.vitorias + kpi.empates + kpi.derrotas)) * 100).toFixed(1)}%</Text>
                   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <ArrowUpRight size={14} color="#047857" />
                      <Text style={{ fontSize: 12, color: '#047857', marginLeft: 4 }}>+4,2% vs. período ant.</Text>
                   </View>
                 </View>

                 <View style={styles.kpiCard}>
                   <Text style={styles.kpiLabel}>GOLOS MARCADOS</Text>
                   <Text style={styles.kpiValue}>{kpi.golosMarcados}</Text>
                   <Text style={{ fontSize: 12, color: '#64748B' }}>Média: {(kpi.golosMarcados / 22).toFixed(1)} por jogo</Text>
                 </View>

                 <View style={styles.kpiCard}>
                   <Text style={styles.kpiLabel}>GOLOS SOFRIDOS</Text>
                   <Text style={[styles.kpiValue, { color: '#991B1B' }]}>{kpi.golosSofridos}</Text>
                   <Text style={{ fontSize: 12, color: '#64748B' }}>Média: {(kpi.golosSofridos / 22).toFixed(1)} por jogo</Text>
                 </View>

                 <View style={styles.kpiCard}>
                   <Text style={styles.kpiLabel}>FICHAS DE JOGO SUBMETIDAS</Text>
                   <Text style={[styles.kpiValue, { color: kpi.fichasSubmetidas < kpi.fichasTotal ? '#991B1B' : '#047857' }]}>
                      {kpi.fichasSubmetidas}/{kpi.fichasTotal}
                   </Text>
                   <Text style={{ fontSize: 12, color: '#991B1B' }}>{kpi.fichasTotal - kpi.fichasSubmetidas} em falta</Text>
                   <View style={{ marginTop: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 12 }}>
                      <TouchableOpacity onPress={() => setActiveTab('Incumprimentos')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                         <Text style={{ fontSize: 12, color: '#1D4ED8', marginRight: 4 }}>Ver Incumprimentos →</Text>
                      </TouchableOpacity>
                   </View>
                 </View>
              </View>

              {/* Gráficos Mock */}
              <View style={{ flexDirection: 'row', gap: 24, marginTop: 24 }}>
                 <View style={styles.chartPanel}>
                    <BarChart2 size={40} color="#E2E8F0" style={{ marginBottom: 16 }} />
                    <Text style={{ fontSize: 14, color: '#64748B' }}>Gráfico: Rendimento por Escalão</Text>
                 </View>
                 <View style={styles.chartPanel}>
                    <LineChart size={40} color="#E2E8F0" style={{ marginBottom: 16 }} />
                    <Text style={{ fontSize: 14, color: '#64748B' }}>Gráfico: Tendência de Golos</Text>
                 </View>
              </View>
            </>
         )}

         {activeTab === 'Individual' && (
            <View style={styles.emptyState}>
               <Search size={64} color="#CBD5E1" />
               <Text style={styles.emptyTitle}>Pesquise um atleta para visualizar o seu perfil de rendimento.</Text>
               <View style={styles.searchBar}>
                  <Search size={20} color="#64748B" />
                  <Text style={{ fontSize: 14, color: '#94A3B8', marginLeft: 12 }}>Nome do atleta...</Text>
               </View>
            </View>
         )}

         {activeTab === 'Incumprimentos' && (
            <View style={styles.emptyState}>
               {/* Em vez da tabela vamos usar um empty state simples só para constar na view inicial */}
               <Clock size={64} color="#CBD5E1" />
               <Text style={styles.emptyTitle}>Nenhum incumprimento corresponde aos filtros aplicados.</Text>
            </View>
         )}
      </ScrollView>

      {/* Footer Global da ABA 4 */}
      <View style={styles.footerBar}>
         <Text style={{ fontSize: 12, color: '#64748B' }}>Dados calculados às 14:00 de 25/05/2026 · Próxima atualização automática: 15:00</Text>
         <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
            <FileText size={14} color="#0F172A" style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 12, fontWeight: '600' }}>Exportar Relatório (PDF)</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  pageHeader: { backgroundColor: '#FFFFFF', paddingHorizontal: 24, paddingTop: 24 },
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#0F172A', marginBottom: 16 },
  tabsBar: { flexDirection: 'row', backgroundColor: '#FFFFFF', paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  tab: { paddingVertical: 12, marginRight: 24 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#F1C40F' },
  tabText: { fontSize: 14, color: '#64748B' },
  tabTextActive: { color: '#0F172A', fontWeight: '600' },
  content: { flex: 1 },
  toolbar: { flexDirection: 'row', gap: 16, alignItems: 'center', marginBottom: 24 },
  dropdownMock: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, backgroundColor: '#FFFFFF' },
  dropdownText: { fontSize: 14, color: '#0F172A' },
  kpiGrid: { flexDirection: 'row', gap: 16 },
  kpiCard: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 20 },
  kpiLabel: { fontSize: 10, fontWeight: '700', color: '#64748B', marginBottom: 12 },
  kpiValue: { fontSize: 28, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  badgeAmbar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 12 },
  chartPanel: { flex: 1, height: 300, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyTitle: { fontSize: 16, color: '#64748B', marginTop: 16, fontWeight: '600' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', width: 400, padding: 12, borderRadius: 8, marginTop: 24 },
  footerBar: { backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
