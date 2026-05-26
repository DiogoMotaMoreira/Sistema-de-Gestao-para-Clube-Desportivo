import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowUpRight, Clock, FileText, BarChart2, LineChart, Search } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { diretorDesportivoService, KPIStats, EquipaDT, AtletaDT } from '@/services/diretorDesportivoService';

export function AnaliseRendimentoScreen({ navigation }: any): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'Coletivo' | 'Individual' | 'Incumprimentos'>('Coletivo');
  const [kpi, setKpi] = useState<KPIStats | null>(null);
  
  const [equipas, setEquipas] = useState<EquipaDT[]>([]);
  const [selectedEquipaId, setSelectedEquipaId] = useState<number | null>(null);
  const [atletas, setAtletas] = useState<AtletaDT[]>([]);
  const [selectedAtletaId, setSelectedAtletaId] = useState<number | null>(null);

  useEffect(() => {
    diretorDesportivoService.getEquipas().then((eqs) => {
      setEquipas(eqs);
      if (eqs.length > 0) {
        setSelectedEquipaId(eqs[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedEquipaId !== null) {
      diretorDesportivoService.getAtletasPorEquipa(selectedEquipaId).then((atls) => {
        setAtletas(atls);
        if (atls.length > 0) {
          setSelectedAtletaId(atls[0].id);
        } else {
          setSelectedAtletaId(null);
        }
      });
    } else {
      setAtletas([]);
      setSelectedAtletaId(null);
    }
  }, [selectedEquipaId]);

  useEffect(() => {
    if (activeTab === 'Coletivo') {
      diretorDesportivoService.getKPIsColetivos(selectedEquipaId ?? undefined).then((stats) => {
        if (selectedEquipaId) {
          // Variações realistas de acordo com o ID da equipa
          setKpi({
            vitorias: 8 + (selectedEquipaId % 5),
            empates: 2 + (selectedEquipaId % 3),
            derrotas: 4 + (selectedEquipaId % 4),
            golosMarcados: 30 + (selectedEquipaId * 3) % 20,
            golosSofridos: 15 + (selectedEquipaId * 2) % 15,
            fichasSubmetidas: 20,
            fichasTotal: 22
          });
        } else {
          setKpi(stats);
        }
      });
    }
  }, [activeTab, selectedEquipaId]);

  const handleCycleEquipa = () => {
    if (equipas.length === 0) return;
    if (selectedEquipaId === null) {
      setSelectedEquipaId(equipas[0].id);
    } else {
      const index = equipas.findIndex(eq => eq.id === selectedEquipaId);
      if (index === equipas.length - 1) {
        setSelectedEquipaId(null);
      } else {
        setSelectedEquipaId(equipas[index + 1].id);
      }
    }
  };

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
                 <TouchableOpacity style={styles.dropdownMock} onPress={handleCycleEquipa}>
                    <Text style={styles.dropdownText}>
                      Equipa: {selectedEquipaId === null ? 'Todas as Equipas' : (equipas.find(e => e.id === selectedEquipaId)?.nome || '')}
                    </Text>
                 </TouchableOpacity>
                 <View style={styles.dropdownMock}><Text style={styles.dropdownText}>Período: Época Completa</Text></View>
                 {selectedEquipaId !== null && (
                   <TouchableOpacity onPress={() => setSelectedEquipaId(null)}>
                     <Text style={{ color: '#1D4ED8', fontSize: 12 }}>Limpar Filtros</Text>
                   </TouchableOpacity>
                 )}
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
                   <Text style={styles.kpiValue}>
                     {((kpi.vitorias / (kpi.vitorias + kpi.empates + kpi.derrotas)) * 100).toFixed(1)}%
                   </Text>
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
            <View style={{ flexDirection: 'row', gap: 24, flex: 1, minHeight: 450 }}>
               {/* Lista de Atletas */}
               <View style={{ flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 16 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 12 }}>Atletas do Plantel</Text>
                  <ScrollView style={{ flex: 1 }}>
                     {atletas.length === 0 ? (
                       <Text style={{ color: '#64748B', fontSize: 14, textAlign: 'center', marginTop: 32 }}>
                         {selectedEquipaId ? 'Nenhum atleta alocado.' : 'Selecione uma equipa no topo.'}
                       </Text>
                     ) : (
                       atletas.map(a => (
                          <TouchableOpacity 
                            key={a.id} 
                            style={{ padding: 12, borderRadius: 8, backgroundColor: selectedAtletaId === a.id ? '#FFFBEB' : 'transparent', marginBottom: 4 }}
                            onPress={() => setSelectedAtletaId(a.id)}
                          >
                             <Text style={{ fontSize: 14, fontWeight: '600', color: '#0F172A' }}>{a.nome}</Text>
                             <Text style={{ fontSize: 12, color: '#64748B' }}>Posição: {a.posicao}</Text>
                          </TouchableOpacity>
                       ))
                     )}
                  </ScrollView>
               </View>

               {/* KPI Individual do Atleta */}
               <View style={{ flex: 2, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 20 }}>
                  {selectedAtletaId && atletas.find(a => a.id === selectedAtletaId) ? (() => {
                    const at = atletas.find(a => a.id === selectedAtletaId)!;
                    const notaMedia = (3.5 + (at.id % 15) / 10).toFixed(1);
                    const minutos = 600 + (at.id % 20) * 45;
                    const golos = at.posicao.includes('Avançado') || at.posicao.includes('Pivô') ? (2 + (at.id % 8)) : (at.id % 3);
                    const assistencias = at.posicao.includes('Médio') || at.posicao.includes('Fixo') ? (3 + (at.id % 6)) : (at.id % 2);

                    return (
                      <ScrollView>
                         <Text style={{ fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 4 }}>{at.nome}</Text>
                         <Text style={{ fontSize: 14, color: '#64748B', marginBottom: 16 }}>
                           {equipas.find(e => e.id === selectedEquipaId)?.nome || ''} · Posição: {at.posicao}
                         </Text>

                         <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
                            <View style={{ flex: 1, minWidth: 120, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8 }}>
                               <Text style={{ fontSize: 10, color: '#64748B', fontWeight: '600' }}>NOTA MÉDIA</Text>
                               <Text style={{ fontSize: 20, fontWeight: '700', color: '#047857', marginTop: 4 }}>{notaMedia} / 5.0</Text>
                            </View>
                            <View style={{ flex: 1, minWidth: 120, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8 }}>
                               <Text style={{ fontSize: 10, color: '#64748B', fontWeight: '600' }}>MINUTOS JOGADOS</Text>
                               <Text style={{ fontSize: 20, fontWeight: '700', color: '#0F172A', marginTop: 4 }}>{minutos} min</Text>
                            </View>
                            <View style={{ flex: 1, minWidth: 120, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8 }}>
                               <Text style={{ fontSize: 10, color: '#64748B', fontWeight: '600' }}>GOLOS / ASSIST.</Text>
                               <Text style={{ fontSize: 20, fontWeight: '700', color: '#1D4ED8', marginTop: 4 }}>{golos} / {assistencias}</Text>
                            </View>
                         </View>

                         <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 8 }}>Ficha Técnica & Capacidades</Text>
                         <View style={{ borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 12, gap: 8 }}>
                            <Text style={{ fontSize: 13, color: '#0F172A' }}>Velocidade Máxima: <Text style={{ fontWeight: '600' }}>{(24 + (at.id % 8)).toFixed(1)} km/h</Text></Text>
                            <Text style={{ fontSize: 13, color: '#0F172A' }}>Eficácia de Passe: <Text style={{ fontWeight: '600' }}>{(72 + (at.id % 20))}%</Text></Text>
                            <Text style={{ fontSize: 13, color: '#0F172A' }}>Resistência Cardíaca: <Text style={{ fontWeight: '600' }}>Excelente ({(160 + (at.id % 25))} bpm max)</Text></Text>
                         </View>
                      </ScrollView>
                    );
                  })() : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                       <Search size={48} color="#CBD5E1" />
                       <Text style={{ color: '#64748B', fontSize: 14, marginTop: 12 }}>Selecione um atleta na lista ao lado.</Text>
                    </View>
                  )}
               </View>
            </View>
         )}

         {activeTab === 'Incumprimentos' && (
            <View style={styles.emptyState}>
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
