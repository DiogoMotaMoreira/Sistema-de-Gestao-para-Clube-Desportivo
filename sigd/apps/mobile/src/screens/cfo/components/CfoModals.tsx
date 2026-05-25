import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, CheckCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { DetalhePassivoCFO, EventoAuditoriaCFO } from '@/services/cfoService';

// ── 1. Modal Drill-Down Dívida CFO ──────────────────────

export function ModalDrillDownDividaCFO({ visible, onClose, dados }: { visible: boolean, onClose: () => void, dados: DetalhePassivoCFO[] }) {
  const totalDivida = dados.reduce((sum, d) => sum + d.valorEmDivida, 0);
  const totalDebitos = dados.reduce((sum, d) => sum + d.numDebitos, 0);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modalContent, { width: '80%', maxWidth: 900 }]}>
          <View style={styles.modalHeader}>
             <Text style={styles.modalTitle}>Passivo Pendente — Detalhe por Escalão e Tipologia</Text>
             <TouchableOpacity onPress={onClose}><X size={20} color={Colors.GRAY_500_TEXTO2} /></TouchableOpacity>
          </View>
          <Text style={[styles.modalSub, { marginBottom: 24 }]}>Período analisado: Época Ativa</Text>

          {dados.length > 0 ? (
             <View style={styles.table}>
                <View style={styles.tableHeader}>
                   <Text style={[styles.th, { flex: 1.5 }]}>ESCALÃO</Text>
                   <Text style={[styles.th, { flex: 2 }]}>TIPOLOGIA</Text>
                   <Text style={[styles.th, { flex: 1.5 }]}>Nº DE DÉBITOS</Text>
                   <Text style={[styles.th, { flex: 2 }]}>VALOR EM DÍVIDA</Text>
                   <Text style={[styles.th, { flex: 1.5 }]}>ENTIDADE</Text>
                   <Text style={[styles.th, { flex: 1.5 }]}>ANTIGUIDADE MÉDIA</Text>
                </View>
                {dados.map(row => (
                   <View key={row.id} style={styles.tableRow}>
                      <View style={{ flex: 1.5 }}>
                         <View style={[styles.badgePill, { backgroundColor: '#F1F5F9' }]}>
                            <Text style={[styles.badgeText, { color: '#64748B' }]}>{row.escalao}</Text>
                         </View>
                      </View>
                      <Text style={[styles.td, { flex: 2 }]}>{row.tipologia}</Text>
                      <Text style={[styles.td, { flex: 1.5 }]}>{row.numDebitos}</Text>
                      <Text style={[styles.td, { flex: 2, color: Colors.ERRO_TEXT, fontWeight: '700' }]}>{row.valorEmDivida.toFixed(2)} €</Text>
                      <View style={{ flex: 1.5, justifyContent: 'center' }}>
                         <View style={[styles.badgePill, { backgroundColor: row.entidade === 'SAD' ? '#FFFBEB' : '#F1F5F9' }]}>
                            <Text style={[styles.badgeText, { color: row.entidade === 'SAD' ? '#B45309' : '#64748B' }]}>{row.entidade}</Text>
                         </View>
                      </View>
                      <View style={{ flex: 1.5, justifyContent: 'center' }}>
                         <View style={[styles.badgePill, { backgroundColor: row.antiguidadeMedia > 30 ? '#FEE2E2' : '#FFFBEB' }]}>
                            <Text style={[styles.badgeText, { color: row.antiguidadeMedia > 30 ? '#991B1B' : '#B45309' }]}>{row.antiguidadeMedia} dias</Text>
                         </View>
                      </View>
                   </View>
                ))}
                <View style={[styles.tableRow, { backgroundColor: '#F8FAFC', borderBottomWidth: 0 }]}>
                   <Text style={[styles.td, { fontWeight: '700', flex: 1 }]}>Total: {totalDebitos} débitos · {totalDivida.toFixed(2)} €</Text>
                </View>
             </View>
          ) : (
             <View style={{ padding: 48, alignItems: 'center' }}>
                <CheckCircle size={40} color={Colors.SUCESSO_TEXT} style={{ opacity: 0.5, marginBottom: 16 }} />
                <Text style={{ fontSize: 16, color: Colors.SUCESSO_TEXT, fontWeight: '500' }}>Sem passivo pendente para o período selecionado.</Text>
             </View>
          )}

          <View style={[styles.footerRow, { justifyContent: 'flex-end', marginTop: 24 }]}>
             <TouchableOpacity style={styles.btnOutline} onPress={onClose}>
                <Text style={styles.btnOutlineText}>Fechar</Text>
             </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── 2. Modal Detalhe de Evento Financeiro (UC-16.1) ─────

export function ModalAuditoriaFinanceira({ visible, onClose, evento }: { visible: boolean, onClose: () => void, evento: EventoAuditoriaCFO | null }) {
  if (!evento) return null;

  // Lógica de badge para Centro de Resp.
  let badgeCentroBg = '#F1F5F9'; let badgeCentroColor = '#64748B';
  if (evento.centroResponsabilidade === 'SAD') { badgeCentroBg = '#FFFBEB'; badgeCentroColor = '#B45309'; }
  else if (evento.centroResponsabilidade === 'Ambos') { badgeCentroBg = '#EFF6FF'; badgeCentroColor = '#1D4ED8'; }

  // Lógica de badge para Ação
  let badgeAcaoBg = '#F1F5F9'; let badgeAcaoColor = '#64748B';
  if (evento.acao === 'LIQUIDAÇÃO_PAGAMENTO') { badgeAcaoBg = '#ECFDF5'; badgeAcaoColor = '#047857'; }
  else if (evento.acao === 'GERAÇÃO_PROVISÃO') { badgeAcaoBg = '#EFF6FF'; badgeAcaoColor = '#1D4ED8'; }
  else if (evento.acao === 'ALTERAÇÃO_ESTATUTO_SÓCIO') { badgeAcaoBg = '#FFFBEB'; badgeAcaoColor = '#B45309'; }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modalContent, { width: '60%', maxWidth: 700 }]}>
          <View style={styles.modalHeader}>
             <Text style={styles.modalTitle}>Detalhe do Evento Financeiro</Text>
             <TouchableOpacity onPress={onClose}><X size={20} color={Colors.GRAY_500_TEXTO2} /></TouchableOpacity>
          </View>

          <View style={styles.metaGrelha}>
             <View style={styles.metaItem}><Text style={styles.metaLabel}>ID do Evento:</Text><Text style={styles.metaValueMono}>{evento.id}</Text></View>
             <View style={styles.metaItem}><Text style={styles.metaLabel}>Data / Hora:</Text><Text style={styles.metaValue}>{evento.dataHora}</Text></View>
             
             <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Tipo de Evento:</Text>
                <View style={[styles.badgePill, { backgroundColor: badgeAcaoBg, marginTop: 4 }]}><Text style={[styles.badgeText, { color: badgeAcaoColor }]}>{evento.acao}</Text></View>
             </View>
             <View style={styles.metaItem}><Text style={styles.metaLabel}>Ator:</Text><Text style={styles.metaValue}>{evento.ator} — {evento.role}</Text></View>
             
             <View style={styles.metaItem}><Text style={styles.metaLabel}>Endereço IP:</Text><Text style={styles.metaValueMono}>{evento.ip}</Text></View>
             <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Centro de Responsabilidade:</Text>
                <View style={[styles.badgePill, { backgroundColor: badgeCentroBg, marginTop: 4 }]}><Text style={[styles.badgeText, { color: badgeCentroColor }]}>{evento.centroResponsabilidade}</Text></View>
             </View>
             
             <View style={styles.metaItem}><Text style={styles.metaLabel}>Entidade Afetada:</Text><Text style={styles.metaValue}>{evento.entidadeAfetada}</Text></View>
             <View style={styles.metaItem}><Text style={styles.metaLabel}>Valor da Operação:</Text><Text style={[styles.metaValue, { fontWeight: '700' }]}>{evento.valor.toFixed(2)} €</Text></View>
          </View>

          <ScrollView style={styles.jsonBlock}>
             <Text style={styles.jsonText}>{evento.rawJson}</Text>
          </ScrollView>

          <View style={[styles.footerRow, { justifyContent: 'flex-end', marginTop: 24 }]}>
             <TouchableOpacity style={styles.btnOutline} onPress={onClose}>
                <Text style={styles.btnOutlineText}>Fechar</Text>
             </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContent: { backgroundColor: Colors.BRANCO, borderRadius: 16, padding: 24, width: '90%', maxWidth: 500, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: '600', color: Colors.GRAY_900_TEXTO1 },
  modalSub: { fontSize: 14, color: Colors.GRAY_500_TEXTO2, marginBottom: 16 },
  footerRow: { flexDirection: 'row', gap: 12 },
  btnOutline: { borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' },
  btnOutlineText: { fontSize: 14, fontWeight: '500', color: Colors.GRAY_900_TEXTO1 },
  table: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  th: { fontSize: 11, fontWeight: '600', color: Colors.GRAY_500_TEXTO2 },
  tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', alignItems: 'center' },
  td: { fontSize: 13, color: Colors.GRAY_900_TEXTO1 },
  badgePill: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  metaGrelha: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metaItem: { width: '45%' },
  metaLabel: { fontSize: 11, color: Colors.GRAY_500_TEXTO2, marginBottom: 4 },
  metaValue: { fontSize: 13, color: Colors.GRAY_900_TEXTO1, fontWeight: '500' },
  metaValueMono: { fontSize: 12, color: Colors.GRAY_500_TEXTO2, fontFamily: 'monospace' },
  jsonBlock: { backgroundColor: '#1E293B', padding: 16, borderRadius: 8, maxHeight: 280 },
  jsonText: { color: '#F8FAFC', fontSize: 13, fontFamily: 'monospace' }
});
