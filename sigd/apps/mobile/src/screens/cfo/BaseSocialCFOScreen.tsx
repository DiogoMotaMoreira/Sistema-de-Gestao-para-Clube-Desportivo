import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Download, CheckCircle, AlertCircle } from 'lucide-react-native';
import { PageHeader } from '../../components/ui/PageHeader';
import { cfoService, EntidadeSocialCFO } from '@/services/cfoService';
import { Colors } from '@/constants/colors';

export function BaseSocialCFOScreen(): React.JSX.Element {
  const [entidades, setEntidades] = useState<EntidadeSocialCFO[]>([]);

  useEffect(() => {
    cfoService.getEntidadesSociais().then(setEntidades);
  }, []);

  return (
    <View style={styles.container}>
      <PageHeader
        title="Base Social & Desportiva"
        breadcrumbs={[
          { label: 'Direção Financeira' },
          { label: 'Base Social' },
        ]}
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        
        {/* Filtros */}
        <View style={styles.filtersContainer}>
           <View style={{ flexDirection: 'row', gap: 12, flex: 1 }}>
              <View style={styles.dropdown}><Text style={styles.dropdownText}>Tipo: Todos</Text></View>
              <View style={styles.dropdown}><Text style={styles.dropdownText}>Escalão: Todos</Text></View>
              <View style={styles.dropdown}><Text style={styles.dropdownText}>Estado: Todos</Text></View>
           </View>
           <TouchableOpacity style={styles.btnOutline}>
              <Download size={16} color={Colors.GRAY_900_TEXTO1} style={{ marginRight: 6 }} />
              <Text style={styles.btnOutlineText}>Exportar CSV</Text>
           </TouchableOpacity>
        </View>

        {/* Resumo Demográfico */}
        <View style={styles.summaryRow}>
           <View style={styles.summaryCard}>
              <Text style={styles.sumTitle}>Total de Sócios Ativos</Text>
              <Text style={styles.sumValue}>12.450</Text>
              <Text style={styles.sumSub}>Com vínculo associativo ativo</Text>
           </View>
           <View style={styles.summaryCard}>
              <Text style={styles.sumTitle}>Sócios Regularizados</Text>
              <Text style={styles.sumValue}>10.956</Text>
              <View style={[styles.badgePill, { backgroundColor: '#ECFDF5', marginTop: 4 }]}><Text style={{ color: '#047857', fontSize: 11, fontWeight: '600' }}>88% do total</Text></View>
           </View>
           <View style={styles.summaryCard}>
              <Text style={styles.sumTitle}>Atletas Inscritos</Text>
              <Text style={styles.sumValue}>450</Text>
              <Text style={styles.sumSub}>Em 18 equipas ativas</Text>
           </View>
           <View style={styles.summaryCard}>
              <Text style={styles.sumTitle}>Documentação Pendente</Text>
              <Text style={styles.sumValue}>23</Text>
              <View style={[styles.badgePill, { backgroundColor: '#FEE2E2', marginTop: 4 }]}><Text style={{ color: '#991B1B', fontSize: 11, fontWeight: '600' }}>5,1% sem EMD válido</Text></View>
           </View>
        </View>

        {/* Tabela */}
        <View style={styles.table}>
           <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 2.5 }]}>NOME / NIF</Text>
              <Text style={[styles.th, { flex: 2 }]}>TIPO</Text>
              <Text style={[styles.th, { flex: 1.5 }]}>ESCALÃO</Text>
              <Text style={[styles.th, { flex: 1.5 }]}>ESTADO</Text>
              <Text style={[styles.th, { flex: 2 }]}>SITUAÇÃO FINANCEIRA</Text>
              <Text style={[styles.th, { flex: 1.5 }]}>DOCUMENTAÇÃO</Text>
           </View>
           
           {entidades.map(e => {
              // Lógica cores
              let estadoBg = '#F1F5F9', estadoText = '#64748B';
              if (e.estado === 'Ativo') { estadoBg = '#ECFDF5'; estadoText = '#047857'; }
              else if (e.estado === 'Pendente') { estadoBg = '#FFFBEB'; estadoText = '#B45309'; }

              let docBg = '#F1F5F9', docText = '#64748B';
              if (e.documentacao === 'Válida') { docBg = '#ECFDF5'; docText = '#047857'; }
              else if (e.documentacao === 'Em Validação') { docBg = '#FFFBEB'; docText = '#B45309'; }
              else if (e.documentacao === 'Caducada') { docBg = '#FEE2E2'; docText = '#991B1B'; }

              return (
                 <View key={e.id} style={styles.tableRow}>
                    <View style={{ flex: 2.5 }}>
                       <Text style={{ fontSize: 14, fontWeight: '700', color: Colors.GRAY_900_TEXTO1 }}>{e.nome}</Text>
                       <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2 }}>{e.nif}</Text>
                    </View>
                    
                    <View style={{ flex: 2, flexDirection: 'row', gap: 6 }}>
                       {e.tipos.includes('Atleta') && <View style={[styles.badgePill, { backgroundColor: '#EFF6FF' }]}><Text style={{ color: '#1D4ED8', fontSize: 10 }}>Atleta</Text></View>}
                       {e.tipos.includes('Sócio') && <View style={[styles.badgePill, { backgroundColor: '#ECFDF5' }]}><Text style={{ color: '#047857', fontSize: 10 }}>Sócio</Text></View>}
                       {e.tipos.includes('EE') && <View style={[styles.badgePill, { backgroundColor: '#F1F5F9' }]}><Text style={{ color: '#64748B', fontSize: 10 }}>EE</Text></View>}
                    </View>

                    <View style={{ flex: 1.5 }}>
                       {e.escalao && <View style={[styles.badgePill, { backgroundColor: '#F1F5F9' }]}><Text style={{ color: '#64748B', fontSize: 10 }}>{e.escalao}</Text></View>}
                    </View>

                    <View style={{ flex: 1.5 }}>
                       <View style={[styles.badgePill, { backgroundColor: estadoBg }]}><Text style={{ color: estadoText, fontSize: 11, fontWeight: '600' }}>{e.estado}</Text></View>
                    </View>

                    <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                       {e.situacaoFinanceira === 'Regularizado' ? (
                          <><CheckCircle size={14} color={Colors.SUCESSO_TEXT} style={{ marginRight: 6 }} /><Text style={{ fontSize: 12, color: Colors.SUCESSO_TEXT, fontWeight: '600' }}>Regularizado</Text></>
                       ) : (
                          <><AlertCircle size={14} color={Colors.ERRO_TEXT} style={{ marginRight: 6 }} /><Text style={{ fontSize: 12, color: Colors.ERRO_TEXT, fontWeight: '600' }}>Em Dívida</Text></>
                       )}
                    </View>

                    <View style={{ flex: 1.5 }}>
                       <View style={[styles.badgePill, { backgroundColor: docBg }]}><Text style={{ color: docText, fontSize: 11, fontWeight: '600' }}>{e.documentacao}</Text></View>
                    </View>
                 </View>
              );
           })}
           <View style={styles.tableFooter}>
              <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2 }}>A mostrar 1–5 de 12.450 registos</Text>
              <View style={{ flexDirection: 'row', gap: 16 }}>
                 <Text style={{ fontSize: 12, color: Colors.INFO_TEXT, fontWeight: '500' }}>← Anterior</Text>
                 <Text style={{ fontSize: 12, color: Colors.INFO_TEXT, fontWeight: '500' }}>Próxima →</Text>
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
  filtersContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.BRANCO, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 12, padding: 16 },
  dropdown: { borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  dropdownText: { fontSize: 13, color: Colors.GRAY_900_TEXTO1 },
  btnOutline: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  btnOutlineText: { fontSize: 13, fontWeight: '500', color: Colors.GRAY_900_TEXTO1 },
  summaryRow: { flexDirection: 'row', gap: 16 },
  summaryCard: { flex: 1, backgroundColor: Colors.BRANCO, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 16, padding: 20 },
  sumTitle: { fontSize: 12, fontWeight: '600', color: Colors.GRAY_500_TEXTO2, textTransform: 'uppercase', marginBottom: 8 },
  sumValue: { fontSize: 28, fontWeight: '700', color: Colors.GRAY_900_TEXTO1 },
  sumSub: { fontSize: 12, color: Colors.GRAY_500_TEXTO2, marginTop: 4 },
  table: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, overflow: 'hidden', backgroundColor: Colors.BRANCO },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  th: { fontSize: 11, fontWeight: '600', color: Colors.GRAY_500_TEXTO2 },
  tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', alignItems: 'center' },
  badgePill: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  tableFooter: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' }
});
