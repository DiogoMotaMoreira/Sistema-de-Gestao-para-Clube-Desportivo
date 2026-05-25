import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Plus, FileText, Upload, FolderOpen, Camera, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react-native';
import { portalService, Dependente, DocumentoPortal } from '@/services/portalService';
import { PortalHeader } from './components/PortalHeader';

export function DocumentosScreen({ navigation }: any): React.JSX.Element {
  const [dependente, setDependente] = useState<Dependente | null>(null);
  const [documentos, setDocumentos] = useState<DocumentoPortal[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);

  useEffect(() => {
    if (dependente) {
      portalService.getDocumentos(dependente.id).then(setDocumentos);
    }
  }, [dependente]);

  const abrirUpload = (tipo?: string) => {
    setSelectedDocType(tipo || null);
    setShowUpload(true);
  };

  const submeterDoc = () => {
    if (dependente && selectedDocType) {
      portalService.submeterDocumento(dependente.id, selectedDocType).then(() => {
        setShowUpload(false);
        portalService.getDocumentos(dependente.id).then(setDocumentos);
      });
    }
  };

  return (
    <View style={styles.container}>
      <PortalHeader onDependenteChange={setDependente} />

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 16 }}>
        
        {documentos.length === 0 ? (
          <View style={styles.emptyState}>
             <FolderOpen size={64} color="#CBD5E1" />
             <Text style={styles.emptyTitle}>Ainda não enviaste documentos</Text>
             <Text style={styles.emptySub}>Submete o EMD e os documentos de identificação para ativar o cartão do atleta.</Text>
          </View>
        ) : (
          <>
             <Text style={styles.sectionLabel}>DOCUMENTOS ENVIADOS</Text>

             <View style={{ gap: 8 }}>
               {documentos.map(doc => {
                 let color = '#1D4ED8', Icon = Clock, TrackerText = 'Em análise pelo Departamento';
                 if (doc.estado === 'APROVADO') { color = '#047857'; Icon = CheckCircle; TrackerText = 'Aprovado'; }
                 if (doc.estado === 'REJEITADO') { color = '#991B1B'; Icon = XCircle; TrackerText = 'Rejeitado'; }
                 
                 return (
                   <View key={doc.id} style={[styles.card, { borderLeftColor: color, borderColor: doc.estado === 'REJEITADO' ? '#FEE2E2' : '#E2E8F0' }]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                         <FileText size={20} color={color} style={{ marginRight: 8 }} />
                         <Text style={styles.docTitle}>{doc.tipo}</Text>
                      </View>
                      <Text style={styles.docDate}>Submetido a {new Date(doc.dataSubmissao).toLocaleDateString()}</Text>
                      
                      {/* Tracker Visual */}
                      <View style={styles.trackerRow}>
                         <View style={{ alignItems: 'center' }}>
                            <View style={[styles.trackerNode, { backgroundColor: color, borderColor: color }]} />
                            <Text style={[styles.trackerLabel, { color }]}>Recebido</Text>
                         </View>
                         <View style={[styles.trackerLine, { backgroundColor: color }]} />
                         <View style={{ alignItems: 'center' }}>
                            <View style={[styles.trackerNode, { backgroundColor: doc.estado === 'APROVADO' || doc.estado === 'REJEITADO' ? color : color, borderColor: color }]} />
                            <Text style={[styles.trackerLabel, { color }]}>Analisado</Text>
                         </View>
                         <View style={[styles.trackerLine, { backgroundColor: doc.estado === 'APROVADO' || doc.estado === 'REJEITADO' ? color : '#E2E8F0' }]} />
                         <View style={{ alignItems: 'center' }}>
                            <View style={[styles.trackerNode, { backgroundColor: doc.estado === 'APROVADO' || doc.estado === 'REJEITADO' ? color : 'transparent', borderColor: doc.estado === 'APROVADO' || doc.estado === 'REJEITADO' ? color : '#E2E8F0' }]} />
                            <Text style={[styles.trackerLabel, { color: doc.estado === 'APROVADO' || doc.estado === 'REJEITADO' ? color : '#E2E8F0' }]}>{doc.estado === 'REJEITADO' ? 'Rejeitado' : 'Aprovado'}</Text>
                         </View>
                      </View>

                      {doc.estado === 'APROVADO' && (
                        <Text style={{ fontSize: 12, color: '#047857', fontWeight: '700', marginTop: 12 }}>Válido até: {doc.dataValidade ? new Date(doc.dataValidade).toLocaleDateString() : 'N/A'}</Text>
                      )}

                      {doc.estado === 'REJEITADO' && (
                        <>
                           <View style={styles.motivoBlock}>
                              <Text style={{ fontSize: 11, color: '#991B1B', fontWeight: '700', marginBottom: 4 }}>MOTIVO:</Text>
                              <Text style={{ fontSize: 13, color: '#991B1B', fontStyle: 'italic' }}>{doc.motivoRejeicao}</Text>
                           </View>
                           <TouchableOpacity style={styles.btnOutlineVermelho} onPress={() => abrirUpload(doc.tipo)}>
                              <Upload size={16} color="#991B1B" style={{ marginRight: 8 }} />
                              <Text style={styles.btnOutlineVermelhoText}>Submeter Novo Documento</Text>
                           </TouchableOpacity>
                        </>
                      )}

                      {doc.estado === 'EM_ANALISE' && (
                        <Text style={{ fontSize: 11, color: '#1D4ED8', fontStyle: 'italic', marginTop: 12 }}>Em análise pela Secretaria / Departamento Médico</Text>
                      )}
                   </View>
                 );
               })}
             </View>
          </>
        )}
      </ScrollView>

      {/* FAB */}
      {dependente?.elegibilidade !== 'VINCULO_ENCERRADO' && (
        <TouchableOpacity style={styles.fab} onPress={() => abrirUpload()}>
           <Plus size={24} color="#000000" />
        </TouchableOpacity>
      )}

      {/* Bottom Sheet "Novo Documento" */}
      <Modal visible={showUpload} transparent animationType="slide">
         <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.backdrop} onPress={() => setShowUpload(false)} />
            <View style={styles.bottomSheet}>
               <View style={styles.handle} />
               <Text style={styles.sheetTitle}>Submeter Documento</Text>
               <ScrollView style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
                  
                  <Text style={styles.inputLabel}>Tipo de Documento *</Text>
                  {/* Mock Dropdown */}
                  <TouchableOpacity style={styles.dropdown}>
                     <Text style={{ fontSize: 14, color: selectedDocType ? '#0F172A' : '#64748B' }}>
                       {selectedDocType || 'Seleciona o tipo...'}
                     </Text>
                  </TouchableOpacity>

                  <View style={{ flexDirection: 'row', gap: 12, marginTop: 24, marginBottom: 16 }}>
                     <TouchableOpacity style={[styles.btnUpload, { backgroundColor: '#F1C40F' }]}>
                        <Camera size={20} color="#000000" style={{ marginBottom: 4 }} />
                        <Text style={{ color: '#000000', fontWeight: '600' }}>Fotografar</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.btnUploadOutline}>
                        <FolderOpen size={20} color="#0F172A" style={{ marginBottom: 4 }} />
                        <Text style={{ color: '#0F172A' }}>Escolher Ficheiro</Text>
                     </TouchableOpacity>
                  </View>

                  <Text style={{ fontSize: 12, color: '#64748B', textAlign: 'center', marginBottom: 24 }}>Formatos aceites: PDF ou PNG · Máx. 5 MB</Text>

                  <TouchableOpacity 
                    style={[styles.btnSubmeter, !selectedDocType && styles.btnSubmeterDisabled]}
                    disabled={!selectedDocType}
                    onPress={submeterDoc}
                  >
                     <Text style={[styles.btnSubmeterText, !selectedDocType && { color: '#CBD5E1' }]}>Submeter Documento</Text>
                  </TouchableOpacity>
               </ScrollView>
            </View>
         </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { flex: 1 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyTitle: { fontSize: 16, color: '#64748B', marginTop: 16, fontWeight: '600' },
  emptySub: { fontSize: 13, color: '#64748B', marginTop: 4, textAlign: 'center', paddingHorizontal: 32 },
  sectionLabel: { fontSize: 11, color: '#64748B', fontWeight: '700', paddingVertical: 16 },
  card: { backgroundColor: '#FFFFFF', borderWidth: 1, borderLeftWidth: 4, borderRadius: 12, padding: 16 },
  docTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  docDate: { fontSize: 12, color: '#64748B', marginBottom: 16 },
  trackerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  trackerNode: { width: 12, height: 12, borderRadius: 6, borderWidth: 1 },
  trackerLabel: { fontSize: 11, marginTop: 4 },
  trackerLine: { flex: 1, height: 2, marginTop: 5, marginHorizontal: 4 },
  motivoBlock: { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#991B1B', borderRadius: 8, padding: 10, marginTop: 12 },
  btnOutlineVermelho: { flexDirection: 'row', height: 44, borderRadius: 12, borderWidth: 1, borderColor: '#991B1B', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  btnOutlineVermelhoText: { color: '#991B1B', fontSize: 14, fontWeight: '600' },
  fab: { position: 'absolute', bottom: 20, right: 16, width: 56, height: 56, borderRadius: 28, backgroundColor: '#F1C40F', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5, elevation: 6 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' },
  bottomSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  handle: { width: 32, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginTop: 12 },
  sheetTitle: { fontSize: 18, fontWeight: '600', color: '#0F172A', paddingHorizontal: 16, paddingVertical: 12 },
  inputLabel: { fontSize: 12, color: '#64748B', marginBottom: 8 },
  dropdown: { height: 48, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, justifyContent: 'center', paddingHorizontal: 16 },
  btnUpload: { flex: 1, height: 56, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnUploadOutline: { flex: 1, height: 56, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  btnSubmeter: { height: 52, borderRadius: 12, backgroundColor: '#F1C40F', alignItems: 'center', justifyContent: 'center' },
  btnSubmeterDisabled: { backgroundColor: '#F1F5F9' },
  btnSubmeterText: { fontSize: 15, fontWeight: '600', color: '#000000' },
});
