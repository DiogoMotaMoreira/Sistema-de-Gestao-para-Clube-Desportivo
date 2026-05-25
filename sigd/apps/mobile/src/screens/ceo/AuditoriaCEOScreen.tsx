import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ShieldCheck, Download } from 'lucide-react-native';
import { PageHeader } from '../../components/ui/PageHeader';
import { ModalAuditoria } from './components/CeoModals';
import { ceoService, AuditoriaEvento } from '@/services/ceoService';
import { Colors } from '@/constants/colors';

export function AuditoriaCEOScreen(): React.JSX.Element {
  const [eventos, setEventos] = useState<AuditoriaEvento[]>([]);
  const [eventoSelecionado, setEventoSelecionado] = useState<AuditoriaEvento | null>(null);

  useEffect(() => {
    ceoService.getAuditoria().then(setEventos);
  }, []);

  return (
    <View style={styles.container}>
      <PageHeader
        title="Auditoria"
        breadcrumbs={[
          { label: 'Presidência' },
          { label: 'Auditoria' },
        ]}
      />

      {/* Banner Imutabilidade */}
      <View style={styles.banner}>
         <ShieldCheck size={20} color={Colors.INFO_TEXT} style={{ marginRight: 12 }} />
         <Text style={styles.bannerText}>Acesso de visualização apenas. Todos os registos são imutáveis (RF-24 / RNF-10). Nenhum dado pode ser editado ou eliminado.</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        
        {/* Barra de Filtros (Pesquisa manual mockada) */}
        <View style={styles.filtersContainer}>
           <View style={{ flexDirection: 'row', gap: 12, flex: 1, flexWrap: 'wrap' }}>
              <TextInput style={styles.inputDate} placeholder="De: dd/mm/aaaa" />
              <TextInput style={styles.inputDate} placeholder="Até: dd/mm/aaaa" />
              <View style={styles.dropdown}><Text style={styles.dropdownText}>Todos os Módulos</Text></View>
              <View style={styles.dropdown}><Text style={styles.dropdownText}>Todos os Tipos</Text></View>
              <TextInput style={styles.inputSearch} placeholder="Pesquisar por nome do ator ou entidade..." />
           </View>
           <TouchableOpacity style={styles.btnOutline}>
              <Download size={16} color={Colors.GRAY_900_TEXTO1} style={{ marginRight: 6 }} />
              <Text style={styles.btnOutlineText}>Exportar Logs (CSV)</Text>
           </TouchableOpacity>
        </View>

        {/* Tabela de Auditoria */}
        <View style={styles.table}>
           <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 1.5 }]}>DATA / HORA</Text>
              <Text style={[styles.th, { flex: 2 }]}>ATOR</Text>
              <Text style={[styles.th, { flex: 2 }]}>AÇÃO</Text>
              <Text style={[styles.th, { flex: 1.5 }]}>MÓDULO</Text>
              <Text style={[styles.th, { flex: 1.5 }]}>ENDEREÇO IP</Text>
              <Text style={[styles.th, { flex: 1.5, textAlign: 'right' }]}>DETALHE</Text>
           </View>
           
           {eventos.map(e => {
              // Lógica de cor do badge
              let badgeBg = '#F1F5F9';
              let badgeColor = '#64748B';
              if (e.acao.includes('SEGURANÇA') || e.acao.includes('BLOQUEAR')) {
                 badgeBg = '#FEE2E2'; badgeColor = '#991B1B';
              } else if (e.acao.includes('CRIAÇÃO')) {
                 badgeBg = '#ECFDF5'; badgeColor = '#047857';
              } else if (e.acao.includes('EDIÇÃO') || e.acao.includes('LIQUIDAÇÃO') || e.acao.includes('GERAÇÃO')) {
                 badgeBg = '#EFF6FF'; badgeColor = '#1D4ED8';
              } else if (e.acao.includes('VALIDAÇÃO') || e.acao.includes('CLÍNICA')) {
                 badgeBg = '#FFFBEB'; badgeColor = '#B45309';
              }

              return (
                 <View key={e.id} style={styles.tableRow}>
                    <Text style={[styles.td, { flex: 1.5 }]}>{e.dataHora}</Text>
                    <View style={{ flex: 2 }}>
                       <Text style={[styles.td, { fontWeight: '600' }]}>{e.ator}</Text>
                       <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2 }}>{e.role}</Text>
                    </View>
                    <View style={{ flex: 2, alignItems: 'flex-start' }}>
                       <View style={[styles.badgeAcao, { backgroundColor: badgeBg }]}>
                          <Text style={[styles.badgeAcaoText, { color: badgeColor }]}>{e.acao}</Text>
                       </View>
                    </View>
                    <Text style={[styles.td, { flex: 1.5 }]}>{e.modulo}</Text>
                    <Text style={[styles.td, { flex: 1.5, fontFamily: 'monospace', color: Colors.GRAY_500_TEXTO2 }]}>{e.ip}</Text>
                    <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                       <TouchableOpacity style={styles.btnDetalhe} onPress={() => setEventoSelecionado(e)}>
                          <Text style={styles.btnDetalheText}>Ver Detalhe</Text>
                       </TouchableOpacity>
                    </View>
                 </View>
              );
           })}
           <View style={styles.tableFooter}>
              <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2 }}>A mostrar 1–3 de 158 eventos</Text>
           </View>
        </View>

      </ScrollView>

      <ModalAuditoria visible={!!eventoSelecionado} onClose={() => setEventoSelecionado(null)} evento={eventoSelecionado} />

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
  badgeAcao: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
  badgeAcaoText: { fontSize: 11, fontWeight: '600' },
  btnDetalhe: { borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  btnDetalheText: { fontSize: 12, fontWeight: '500', color: Colors.GRAY_900_TEXTO1 },
  tableFooter: { padding: 12, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' }
});
