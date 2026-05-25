import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ShieldCheck, Download } from 'lucide-react-native';
import { PageHeader } from '../../components/ui/PageHeader';
import { ModalAuditoriaFinanceira } from './components/CfoModals';
import { cfoService, EventoAuditoriaCFO } from '@/services/cfoService';
import { Colors } from '@/constants/colors';

export function AuditoriaFinanceiraCFOScreen(): React.JSX.Element {
  const [eventos, setEventos] = useState<EventoAuditoriaCFO[]>([]);
  const [eventoSelecionado, setEventoSelecionado] = useState<EventoAuditoriaCFO | null>(null);

  useEffect(() => {
    cfoService.getAuditoriaFinanceira().then(setEventos);
  }, []);

  return (
    <View style={styles.container}>
      <PageHeader
        title="Auditoria Financeira"
        breadcrumbs={[
          { label: 'Direção Financeira' },
          { label: 'Auditoria' },
        ]}
      />

      {/* Banner Imutabilidade */}
      <View style={styles.banner}>
         <ShieldCheck size={20} color={Colors.INFO_TEXT} style={{ marginRight: 12 }} />
         <Text style={styles.bannerText}>Este registo é imutável (append-only). Nenhum dado pode ser editado ou eliminado. Visibilidade restrita a eventos do domínio financeiro.</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        
        {/* Barra de Filtros */}
        <View style={styles.filtersContainer}>
           <View style={{ flexDirection: 'row', gap: 12, flex: 1, flexWrap: 'wrap' }}>
              <TextInput style={styles.inputDate} placeholder="De: dd/mm/aaaa" />
              <TextInput style={styles.inputDate} placeholder="Até: dd/mm/aaaa" />
              <View style={styles.dropdown}><Text style={styles.dropdownText}>Todos os Tipos</Text></View>
              <TextInput style={styles.inputSearch} placeholder="Pesquisar por nome do ator ou entidade..." />
           </View>
           <TouchableOpacity style={styles.btnOutline}>
              <Download size={16} color={Colors.GRAY_900_TEXTO1} style={{ marginRight: 6 }} />
              <Text style={styles.btnOutlineText}>Exportar CSV</Text>
           </TouchableOpacity>
        </View>

        {/* Tabela de Auditoria */}
        <View style={styles.table}>
           <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 1.5 }]}>DATA / HORA</Text>
              <Text style={[styles.th, { flex: 1.5 }]}>EVENTO</Text>
              <Text style={[styles.th, { flex: 1.5 }]}>ATOR</Text>
              <Text style={[styles.th, { flex: 2 }]}>ENTIDADE AFETADA</Text>
              <Text style={[styles.th, { flex: 1.5 }]}>CENTRO RESP.</Text>
              <Text style={[styles.th, { flex: 1.5 }]}>VALOR</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>DETALHE</Text>
           </View>
           
           {eventos.map(e => {
              // Cores Evento
              let badgeAcaoBg = '#F1F5F9', badgeAcaoColor = '#64748B';
              if (e.acao === 'LIQUIDAÇÃO_PAGAMENTO') { badgeAcaoBg = '#ECFDF5'; badgeAcaoColor = '#047857'; }
              else if (e.acao === 'GERAÇÃO_PROVISÃO') { badgeAcaoBg = '#EFF6FF'; badgeAcaoColor = '#1D4ED8'; }
              else if (e.acao === 'ALTERAÇÃO_ESTATUTO_SÓCIO') { badgeAcaoBg = '#FFFBEB'; badgeAcaoColor = '#B45309'; }

              // Cores Centro
              let badgeCentroBg = '#F1F5F9', badgeCentroColor = '#64748B';
              if (e.centroResponsabilidade === 'SAD') { badgeCentroBg = '#FFFBEB'; badgeCentroColor = '#B45309'; }
              else if (e.centroResponsabilidade === 'Ambos') { badgeCentroBg = '#EFF6FF'; badgeCentroColor = '#1D4ED8'; }

              return (
                 <View key={e.id} style={styles.tableRow}>
                    <Text style={[styles.td, { flex: 1.5 }]}>{e.dataHora}</Text>
                    
                    <View style={{ flex: 1.5, alignItems: 'flex-start' }}>
                       <View style={[styles.badgePill, { backgroundColor: badgeAcaoBg }]}>
                          <Text style={[styles.badgeText, { color: badgeAcaoColor }]}>{e.acao}</Text>
                       </View>
                    </View>
                    
                    <View style={{ flex: 1.5 }}>
                       <Text style={[styles.td, { fontWeight: '600' }]}>{e.ator}</Text>
                       <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2 }}>{e.role}</Text>
                    </View>
                    
                    <Text style={[styles.td, { flex: 2 }]}>{e.entidadeAfetada}</Text>
                    
                    <View style={{ flex: 1.5, alignItems: 'flex-start' }}>
                       <View style={[styles.badgePill, { backgroundColor: badgeCentroBg }]}>
                          <Text style={[styles.badgeText, { color: badgeCentroColor }]}>{e.centroResponsabilidade}</Text>
                       </View>
                    </View>
                    
                    <Text style={[styles.td, { flex: 1.5, fontWeight: '700' }]}>{e.valor > 0 ? e.valor.toFixed(2) + ' €' : '—'}</Text>
                    
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                       <TouchableOpacity style={styles.btnDetalhe} onPress={() => setEventoSelecionado(e)}>
                          <Text style={styles.btnDetalheText}>Ver Detalhe</Text>
                       </TouchableOpacity>
                    </View>
                 </View>
              );
           })}
           <View style={styles.tableFooter}>
              <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2 }}>A mostrar 1–4 de 242 eventos financeiros</Text>
              <View style={{ flexDirection: 'row', gap: 16 }}>
                 <Text style={{ fontSize: 12, color: Colors.INFO_TEXT, fontWeight: '500' }}>← Anterior</Text>
                 <Text style={{ fontSize: 12, color: Colors.INFO_TEXT, fontWeight: '500' }}>Próxima →</Text>
              </View>
           </View>
        </View>

      </ScrollView>

      <ModalAuditoriaFinanceira visible={!!eventoSelecionado} onClose={() => setEventoSelecionado(null)} evento={eventoSelecionado} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.GRAY_50_FUNDO },
  banner: { flexDirection: 'row', backgroundColor: '#EFF6FF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1D4ED8', alignItems: 'center' },
  bannerText: { fontSize: 13, color: '#1D4ED8', fontWeight: '500', flex: 1 },
  content: { flex: 1 },
  scrollContent: { padding: 32, gap: 24 },
  filtersContainer: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: Colors.BRANCO, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 12, padding: 16, gap: 16 },
  inputDate: { borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, width: 120 },
  dropdown: { borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, justifyContent: 'center' },
  dropdownText: { fontSize: 13, color: Colors.GRAY_900_TEXTO1 },
  inputSearch: { borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, flex: 1, minWidth: 250 },
  btnOutline: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8, alignSelf: 'flex-start' },
  btnOutlineText: { fontSize: 13, fontWeight: '500', color: Colors.GRAY_900_TEXTO1 },
  table: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, overflow: 'hidden', backgroundColor: Colors.BRANCO },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  th: { fontSize: 11, fontWeight: '600', color: Colors.GRAY_500_TEXTO2 },
  tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', alignItems: 'center' },
  td: { fontSize: 13, color: Colors.GRAY_900_TEXTO1 },
  badgePill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 10, fontWeight: '600' },
  btnDetalhe: { borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  btnDetalheText: { fontSize: 12, fontWeight: '500', color: Colors.GRAY_900_TEXTO1 },
  tableFooter: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' }
});
