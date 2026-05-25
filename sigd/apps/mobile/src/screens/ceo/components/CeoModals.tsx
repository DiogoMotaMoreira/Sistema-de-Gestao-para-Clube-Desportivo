import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, FileText, Loader, Download } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { DetalheDivida, AuditoriaEvento } from '@/services/ceoService';

// ── 1. Modal Relatório Executivo ────────────────────────

export function ModalRelatorioExecutivo({ visible, onClose }: { visible: boolean, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const handleGerar = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSucesso(true);
    }, 1500);
  };

  const handleClose = () => {
    setSucesso(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={handleClose} disabled={loading} />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
             <Text style={styles.modalTitle}>Gerar Relatório Executivo</Text>
             <TouchableOpacity onPress={handleClose} disabled={loading}><X size={20} color={Colors.GRAY_500_TEXTO2} /></TouchableOpacity>
          </View>
          <Text style={styles.modalSub}>Selecione as secções a incluir no documento.</Text>
          
          <View style={styles.infoBlock}>
             <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2 }}>Período incluído: Época Ativa</Text>
             <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2 }}>Gerado por: CEO · {new Date().toLocaleDateString()}</Text>
          </View>

          <View style={{ gap: 12, marginBottom: 16 }}>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.checkboxChecked}><Text style={{ color: '#fff', fontSize: 10 }}>✓</Text></View>
                <Text style={styles.checkboxLabel}>Visão Executiva Integrada — KPIs e alertas estratégicos</Text>
             </View>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.checkboxChecked}><Text style={{ color: '#fff', fontSize: 10 }}>✓</Text></View>
                <Text style={styles.checkboxLabel}>Análise Financeira — Clube vs. SAD e tesouraria</Text>
             </View>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.checkboxUnchecked} />
                <Text style={styles.checkboxLabel}>Performance Desportiva por Escalão</Text>
             </View>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.checkboxUnchecked} />
                <Text style={styles.checkboxLabel}>Base Associativa com segmentação demográfica</Text>
             </View>
          </View>

          <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2, marginBottom: 24 }}>As secções marcadas serão incluídas no documento PDF. As secções obrigatórias não podem ser removidas.</Text>

          {sucesso && (
             <View style={styles.bannerSucesso}>
                <Text style={{ color: Colors.SUCESSO_TEXT, fontSize: 14 }}>✓ Relatório gerado com sucesso.</Text>
             </View>
          )}

          <View style={styles.footerRow}>
             <TouchableOpacity style={styles.btnOutline} onPress={handleClose} disabled={loading}>
                <Text style={styles.btnOutlineText}>{sucesso ? 'Fechar' : 'Cancelar'}</Text>
             </TouchableOpacity>

             {sucesso ? (
                <TouchableOpacity style={styles.btnOutline}>
                   <Text style={styles.btnOutlineText}>Descarregar PDF</Text>
                </TouchableOpacity>
             ) : (
                <TouchableOpacity style={[styles.btnDourado, loading && { opacity: 0.5 }]} onPress={handleGerar} disabled={loading}>
                   {loading ? <Loader size={16} color="#000" /> : <FileText size={16} color="#000" />}
                   <Text style={styles.btnDouradoText}>{loading ? 'A gerar...' : 'Gerar PDF'}</Text>
                </TouchableOpacity>
             )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── 2. Modal Drill-Down Dívida ──────────────────────────

export function ModalDrillDownDivida({ visible, onClose, dados }: { visible: boolean, onClose: () => void, dados: DetalheDivida[] }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modalContent, { width: '80%', maxWidth: 800 }]}>
          <View style={styles.modalHeader}>
             <Text style={styles.modalTitle}>Passivo Pendente — Detalhe por Escalão</Text>
             <TouchableOpacity onPress={onClose}><X size={20} color={Colors.GRAY_500_TEXTO2} /></TouchableOpacity>
          </View>
          <Text style={[styles.modalSub, { marginBottom: 24 }]}>Período: Época Ativa</Text>

          {/* Tabela Simples */}
          <View style={styles.table}>
             <View style={styles.tableHeader}>
                <Text style={[styles.th, { flex: 2 }]}>ESCALÃO</Text>
                <Text style={[styles.th, { flex: 2 }]}>EE EM DÍVIDA</Text>
                <Text style={[styles.th, { flex: 2 }]}>VALOR TOTAL</Text>
                <Text style={[styles.th, { flex: 2 }]}>DÍVIDA MÉDIA/EE</Text>
                <Text style={[styles.th, { flex: 1.5 }]}>ENTIDADE</Text>
                <Text style={[styles.th, { flex: 2 }]}>ANTIGUIDADE</Text>
             </View>
             {dados.map(row => (
                <View key={row.id} style={styles.tableRow}>
                   <Text style={[styles.td, { flex: 2 }]}>{row.escalao}</Text>
                   <Text style={[styles.td, { flex: 2 }]}>{row.numEeEmDivida}</Text>
                   <Text style={[styles.td, { flex: 2, color: Colors.ERRO_TEXT, fontWeight: '700' }]}>{row.valorTotalEmDivida.toFixed(2)} €</Text>
                   <Text style={[styles.td, { flex: 2 }]}>{row.dividaMediaPorEe.toFixed(2)} €</Text>
                   <View style={{ flex: 1.5, justifyContent: 'center' }}>
                      <View style={[styles.badgePill, { backgroundColor: row.entidade === 'SAD' ? '#FFFBEB' : '#F1F5F9' }]}>
                         <Text style={[styles.badgeText, { color: row.entidade === 'SAD' ? '#B45309' : '#64748B' }]}>{row.entidade}</Text>
                      </View>
                   </View>
                   <View style={{ flex: 2, justifyContent: 'center' }}>
                      <View style={[styles.badgePill, { backgroundColor: row.antiguidadeMedia > 30 ? '#FEE2E2' : '#FFFBEB' }]}>
                         <Text style={[styles.badgeText, { color: row.antiguidadeMedia > 30 ? '#991B1B' : '#B45309' }]}>{row.antiguidadeMedia} dias</Text>
                      </View>
                   </View>
                </View>
             ))}
             <View style={[styles.tableRow, { backgroundColor: '#F8FAFC', borderBottomWidth: 0 }]}>
                <Text style={[styles.td, { fontWeight: '700', flex: 1 }]}>Total: 105 EE em dívida · 4.005,00 €</Text>
             </View>
          </View>

          <View style={[styles.footerRow, { justifyContent: 'space-between', marginTop: 24 }]}>
             <TouchableOpacity style={styles.btnOutline}>
                <Download size={16} color={Colors.GRAY_900_TEXTO1} style={{ marginRight: 6 }} />
                <Text style={styles.btnOutlineText}>Exportar CSV</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.btnOutline} onPress={onClose}>
                <Text style={styles.btnOutlineText}>Fechar</Text>
             </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── 3. Modal Detalhe de Auditoria ───────────────────────

export function ModalAuditoria({ visible, onClose, evento }: { visible: boolean, onClose: () => void, evento: AuditoriaEvento | null }) {
  if (!evento) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modalContent, { width: '60%', maxWidth: 600 }]}>
          <View style={styles.modalHeader}>
             <Text style={styles.modalTitle}>Detalhe do Evento de Auditoria</Text>
             <TouchableOpacity onPress={onClose}><X size={20} color={Colors.GRAY_500_TEXTO2} /></TouchableOpacity>
          </View>

          <View style={styles.metaGrelha}>
             <View style={styles.metaItem}><Text style={styles.metaLabel}>ID do Evento:</Text><Text style={styles.metaValueMono}>{evento.id}</Text></View>
             <View style={styles.metaItem}><Text style={styles.metaLabel}>Data / Hora:</Text><Text style={styles.metaValue}>{evento.dataHora}</Text></View>
             <View style={styles.metaItem}><Text style={styles.metaLabel}>Ator:</Text><Text style={styles.metaValue}>{evento.ator} — {evento.role}</Text></View>
             <View style={styles.metaItem}><Text style={styles.metaLabel}>Módulo:</Text><Text style={styles.metaValue}>{evento.modulo}</Text></View>
             <View style={styles.metaItem}><Text style={styles.metaLabel}>Endereço IP:</Text><Text style={styles.metaValueMono}>{evento.ip}</Text></View>
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
  infoBlock: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 16 },
  checkboxChecked: { width: 16, height: 16, backgroundColor: Colors.GRAY_900_TEXTO1, borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  checkboxUnchecked: { width: 16, height: 16, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 4, marginRight: 8 },
  checkboxLabel: { fontSize: 14, color: Colors.GRAY_900_TEXTO1 },
  footerRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  btnOutline: { borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' },
  btnOutlineText: { fontSize: 14, fontWeight: '500', color: Colors.GRAY_900_TEXTO1 },
  btnDourado: { backgroundColor: Colors.DOURADO_CTA, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  btnDouradoText: { fontSize: 14, fontWeight: '600', color: Colors.PRETO_PRIMARIO },
  bannerSucesso: { backgroundColor: '#ECFDF5', padding: 12, borderRadius: 8, marginBottom: 24 },
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
