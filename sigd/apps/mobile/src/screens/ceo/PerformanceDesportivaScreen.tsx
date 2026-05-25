import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Trophy, BarChart2 } from 'lucide-react-native';
import { PageHeader } from '../../components/ui/PageHeader';
import { CeoFilters, PresetPeriodo } from './components/CeoFilters';
import { CeoKpiCard } from './components/CeoKpiCard';
import { Colors } from '@/constants/colors';

export function PerformanceDesportivaScreen(): React.JSX.Element {
  const [periodo, setPeriodo] = useState<PresetPeriodo>('Época Ativa');

  return (
    <View style={styles.container}>
      <PageHeader
        title="Performance Desportiva"
        breadcrumbs={[
          { label: 'Presidência' },
          { label: 'Performance Desportiva' },
        ]}
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        
        {/* Barra de Filtros */}
        <CeoFilters 
          label="Período de análise:"
          presets={['Esta Semana', 'Este Mês', 'Época Ativa', 'Personalizado']}
          activePreset={periodo}
          onChangePreset={setPeriodo}
        />

        {/* KPIs Desportivos */}
        <View style={styles.grid4}>
           <CeoKpiCard 
              label="JOGOS DISPUTADOS"
              valorFormatado="36"
              subtexto="No período selecionado"
              icon={Trophy}
           />
           <CeoKpiCard 
              label="DISTRIBUIÇÃO DE RESULTADOS"
              valorFormatado="—"
              subtexto="V = Vitória · E = Empate · D = Derrota"
              icon={Trophy}
           >
              <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
                 <View style={[styles.badgePill, { backgroundColor: '#ECFDF5' }]}><Text style={{ color: '#047857', fontSize: 11, fontWeight: '600' }}>21 V</Text></View>
                 <View style={[styles.badgePill, { backgroundColor: '#FFFBEB' }]}><Text style={{ color: '#B45309', fontSize: 11, fontWeight: '600' }}>8 E</Text></View>
                 <View style={[styles.badgePill, { backgroundColor: '#FEE2E2' }]}><Text style={{ color: '#991B1B', fontSize: 11, fontWeight: '600' }}>7 D</Text></View>
              </View>
           </CeoKpiCard>
           <CeoKpiCard 
              label="MÉDIA DE GOLOS POR JOGO"
              valorFormatado="—"
              subtexto="Golos marcados e sofridos por jogo"
              icon={Trophy}
           >
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8 }}>
                 <Text style={{ color: Colors.SUCESSO_TEXT, fontWeight: '700', fontSize: 16 }}>2,3 a favor</Text>
                 <Text style={{ color: Colors.ERRO_TEXT, fontWeight: '700', fontSize: 16 }}>1,1 contra</Text>
              </View>
           </CeoKpiCard>
           <CeoKpiCard 
              label="FICHAS DE JOGO PENDENTES"
              valorFormatado="2"
              valorCor={Colors.AVISO_TEXT}
              subtexto="Jogos dentro da janela de 24h"
              icon={Trophy}
              iconColor={Colors.AVISO_TEXT}
           >
              <View style={[styles.badgePill, { backgroundColor: '#FFFBEB', alignSelf: 'flex-start', marginBottom: 8 }]}>
                 <Text style={{ color: '#B45309', fontSize: 10, fontWeight: '600' }}>Dados provisórios incluídos nas métricas</Text>
              </View>
           </CeoKpiCard>
        </View>

        {/* Tabela de Resultados por Escalão */}
        <Text style={styles.sectionTitle}>Resultados por Escalão</Text>
        <View style={styles.table}>
           <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 2 }]}>ESCALÃO</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>JOGOS</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>V</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>E</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>D</Text>
              <Text style={[styles.th, { flex: 1.5, textAlign: 'center' }]}>GOLOS FAVOR</Text>
              <Text style={[styles.th, { flex: 1.5, textAlign: 'center' }]}>GOLOS CONTRA</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>SALDO</Text>
              <Text style={[styles.th, { flex: 2 }]}>ESTADO DOS DADOS</Text>
           </View>
           
           <View style={styles.tableRow}>
              <Text style={[styles.td, { flex: 2, fontWeight: '600' }]}>Sub-15</Text>
              <Text style={[styles.td, { flex: 1, textAlign: 'center' }]}>8</Text>
              <Text style={[styles.td, { flex: 1, textAlign: 'center' }]}>5</Text>
              <Text style={[styles.td, { flex: 1, textAlign: 'center' }]}>2</Text>
              <Text style={[styles.td, { flex: 1, textAlign: 'center' }]}>1</Text>
              <Text style={[styles.td, { flex: 1.5, textAlign: 'center' }]}>18</Text>
              <Text style={[styles.td, { flex: 1.5, textAlign: 'center' }]}>9</Text>
              <Text style={[styles.td, { flex: 1, textAlign: 'center', color: Colors.SUCESSO_TEXT, fontWeight: '700' }]}>+9</Text>
              <Text style={[styles.td, { flex: 2 }]}>—</Text>
           </View>

           <View style={styles.tableRow}>
              <Text style={[styles.td, { flex: 2, fontWeight: '600' }]}>Sub-17</Text>
              <Text style={[styles.td, { flex: 1, textAlign: 'center' }]}>7</Text>
              <Text style={[styles.td, { flex: 1, textAlign: 'center' }]}>4</Text>
              <Text style={[styles.td, { flex: 1, textAlign: 'center' }]}>1</Text>
              <Text style={[styles.td, { flex: 1, textAlign: 'center' }]}>2</Text>
              <Text style={[styles.td, { flex: 1.5, textAlign: 'center' }]}>12</Text>
              <Text style={[styles.td, { flex: 1.5, textAlign: 'center' }]}>8</Text>
              <Text style={[styles.td, { flex: 1, textAlign: 'center', color: Colors.SUCESSO_TEXT, fontWeight: '700' }]}>+4</Text>
              <View style={{ flex: 2 }}>
                 <View style={[styles.badgePill, { backgroundColor: '#FFFBEB', alignSelf: 'flex-start' }]}>
                    <Text style={{ color: '#B45309', fontSize: 11, fontWeight: '600' }}>Provisório</Text>
                 </View>
              </View>
           </View>
        </View>

        {/* Gráfico Win Rate */}
        <View style={styles.chartCard}>
           <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Win Rate (%) por Escalão</Text>
           </View>
           <View style={styles.chartMockArea}>
              <BarChart2 size={48} color={Colors.GRAY_200_BORDAS} style={{ opacity: 0.5 }} />
              <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2, marginTop: 8 }}>[Gráfico de Barras Horizontais - Em Desenvolvimento]</Text>
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
  sectionTitle: { fontSize: 16, fontWeight: '600', color: Colors.GRAY_900_TEXTO1, marginBottom: -8 },
  grid4: { flexDirection: 'row', gap: 16 },
  badgePill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 12 },
  table: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, overflow: 'hidden', backgroundColor: Colors.BRANCO },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  th: { fontSize: 11, fontWeight: '600', color: Colors.GRAY_500_TEXTO2 },
  tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', alignItems: 'center' },
  td: { fontSize: 13, color: Colors.GRAY_900_TEXTO1 },
  chartCard: { backgroundColor: Colors.BRANCO, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 16, padding: 20, height: 350 },
  chartHeader: { marginBottom: 16 },
  chartTitle: { fontSize: 14, fontWeight: '600', color: Colors.GRAY_900_TEXTO1 },
  chartMockArea: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});
