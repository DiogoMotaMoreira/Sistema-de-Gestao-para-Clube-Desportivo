import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Dumbbell, Trophy, Clock, FileEdit, CheckCircle, XCircle, Share2, Users } from 'lucide-react-native';
import { PortalHeader } from './components/PortalHeader';
import { portalService, Dependente, EventoPortal } from '@/services/portalService';

export function AgendaScreen({ navigation }: any): React.JSX.Element {
  const [dependente, setDependente] = useState<Dependente | null>(null);
  const [eventos, setEventos] = useState<EventoPortal[]>([]);
  const [vista, setVista] = useState<'Proximos' | 'Passados'>('Proximos');
  const [showJustify, setShowJustify] = useState(false);
  const [eventoParaJustificar, setEventoParaJustificar] = useState<EventoPortal | null>(null);
  const [motivo, setMotivo] = useState('');

  useEffect(() => {
    if (dependente) {
      portalService.getEventos(dependente.id, vista === 'Passados').then(setEventos);
    }
  }, [dependente, vista]);

  const abrirJustificacao = (evento: EventoPortal) => {
    setEventoParaJustificar(evento);
    setMotivo('');
    setShowJustify(true);
  };

  const submeterJustificacao = () => {
    if (motivo.length >= 10 && eventoParaJustificar) {
      portalService.submeterJustificacao(eventoParaJustificar.id, motivo).then(() => {
        setShowJustify(false);
        // Atualizar lista
        if (dependente) portalService.getEventos(dependente.id, vista === 'Passados').then(setEventos);
      });
    }
  };

  return (
    <View style={styles.container}>
      <PortalHeader onDependenteChange={setDependente} />

      {/* Toggle de Vista */}
      <View style={styles.toggleContainer}>
         <TouchableOpacity 
           style={[styles.toggleBtn, vista === 'Proximos' && styles.toggleBtnActive]}
           onPress={() => setVista('Proximos')}
         >
            <Text style={[styles.toggleBtnText, vista === 'Proximos' && styles.toggleBtnTextActive]}>Próximos</Text>
         </TouchableOpacity>
         <TouchableOpacity 
           style={[styles.toggleBtn, vista === 'Passados' && styles.toggleBtnActive]}
           onPress={() => setVista('Passados')}
         >
            <Text style={[styles.toggleBtnText, vista === 'Passados' && styles.toggleBtnTextActive]}>Passados</Text>
         </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 16, gap: 16 }}>
        {eventos.length === 0 ? (
           <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Clock size={48} color="#CBD5E1" />
              <Text style={{ marginTop: 16, color: '#64748B' }}>Sem eventos encontrados.</Text>
           </View>
        ) : (
          eventos.map(e => {
            if (e.tipo === 'TREINO') {
              return (
                <View key={e.id} style={[styles.card, { borderLeftColor: e.estadoPresenca === 'AUSENTE_NAO_JUSTIFICADO' ? '#EA580C' : '#047857' }]}>
                   <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <View style={[styles.badgePill, { backgroundColor: e.estadoPresenca === 'AUSENTE_NAO_JUSTIFICADO' ? '#FFF7ED' : '#ECFDF5' }]}>
                         <Dumbbell size={12} color={e.estadoPresenca === 'AUSENTE_NAO_JUSTIFICADO' ? '#EA580C' : '#047857'} />
                         <Text style={[styles.badgePillText, { color: e.estadoPresenca === 'AUSENTE_NAO_JUSTIFICADO' ? '#EA580C' : '#047857' }]}>TREINO</Text>
                      </View>
                      <Text style={{ fontSize: 13, color: e.estadoPresenca === 'AUSENTE_NAO_JUSTIFICADO' ? '#EA580C' : '#047857', fontWeight: '700' }}>{new Date(e.dataHora).toLocaleDateString()}</Text>
                   </View>
                   <Text style={styles.cardSub}>{e.instalacao}</Text>

                   {e.estadoPresenca === 'AUSENTE_NAO_JUSTIFICADO' && (
                     <>
                        <View style={[styles.badgeEstado, { backgroundColor: '#FEE2E2', marginTop: 8 }]}>
                           <XCircle size={12} color="#991B1B" />
                           <Text style={[styles.badgeEstadoText, { color: '#991B1B' }]}>Ausente — Não justificado</Text>
                        </View>
                        <Text style={{ fontSize: 12, color: '#EA580C', marginTop: 8 }}>Prazo: 3h restantes</Text>
                        <TouchableOpacity style={[styles.btnFull, { backgroundColor: '#EA580C', marginTop: 12 }]} onPress={() => abrirJustificacao(e)}>
                           <FileEdit size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                           <Text style={styles.btnFullText}>Justificar Falta</Text>
                        </TouchableOpacity>
                     </>
                   )}
                </View>
              );
            }
            if (e.tipo === 'JOGO') {
              return (
                <View key={e.id} style={[styles.card, { borderLeftColor: '#1D4ED8' }]}>
                   <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <View style={[styles.badgePill, { backgroundColor: '#EFF6FF' }]}>
                         <Trophy size={12} color="#1D4ED8" />
                         <Text style={[styles.badgePillText, { color: '#1D4ED8' }]}>JOGO OFICIAL</Text>
                      </View>
                      <Text style={{ fontSize: 13, color: '#1D4ED8', fontWeight: '700' }}>{new Date(e.dataHora).toLocaleDateString()}</Text>
                   </View>
                   <Text style={styles.cardTitle}>vs {e.adversario}</Text>
                   <Text style={styles.cardSub}>{e.quadro} · {e.instalacao} · {e.condicao}</Text>
                   <Text style={styles.cardSub}>Concentração: {e.horaConcentracao} · {e.localConcentracao}</Text>
                   
                   {e.isConvocado ? (
                     <>
                        <View style={[styles.badgeEstado, { backgroundColor: '#ECFDF5', marginTop: 12 }]}>
                           <CheckCircle size={14} color="#047857" />
                           <Text style={[styles.badgeEstadoText, { color: '#047857', fontSize: 14 }]}>{dependente?.nome} está CONVOCADO</Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                           <TouchableOpacity style={[styles.btnFullOutline, { flex: 1, borderColor: '#1D4ED8' }]}>
                              <Users size={16} color="#1D4ED8" style={{ marginRight: 8 }} />
                              <Text style={[styles.btnFullText, { color: '#1D4ED8', fontSize: 13 }]}>Ver Convocatória</Text>
                           </TouchableOpacity>
                           <TouchableOpacity style={[styles.btnFullOutline, { flex: 1, borderColor: '#E2E8F0' }]}>
                              <Share2 size={16} color="#0F172A" style={{ marginRight: 8 }} />
                              <Text style={[styles.btnFullText, { color: '#0F172A', fontSize: 13 }]}>Partilhar PDF</Text>
                           </TouchableOpacity>
                        </View>
                     </>
                   ) : (
                     <Text style={{ fontSize: 12, color: '#64748B', fontStyle: 'italic', marginTop: 12 }}>{dependente?.nome} não está convocado para este jogo</Text>
                   )}
                </View>
              );
            }
            return null;
          })
        )}
      </ScrollView>

      {/* Bottom Sheet "Justificação de Ausência" */}
      <Modal visible={showJustify} transparent animationType="slide">
         <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.backdrop} onPress={() => setShowJustify(false)} />
            <View style={styles.bottomSheet}>
               <View style={styles.handle} />
               <ScrollView style={{ padding: 24 }}>
                  <View style={styles.contextBlock}>
                     <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F172A' }}>TREINO — {eventoParaJustificar ? new Date(eventoParaJustificar.dataHora).toLocaleDateString() : ''}</Text>
                     <Text style={{ fontSize: 12, color: '#64748B' }}>{dependente?.nome} · {dependente?.equipa}</Text>
                  </View>
                  
                  <View style={styles.countdownBlock}>
                     <Clock size={14} color="#B45309" />
                     <Text style={{ fontSize: 12, color: '#B45309', marginLeft: 8 }}>Podes justificar por mais 3h 15m</Text>
                  </View>

                  <Text style={styles.inputLabel}>Motivo da ausência *</Text>
                  <TextInput 
                    style={styles.textarea} 
                    placeholder="Descreve o motivo da falta (mínimo 10 caracteres)" 
                    multiline 
                    numberOfLines={5}
                    value={motivo}
                    onChangeText={setMotivo}
                  />
                  <Text style={{ fontSize: 11, color: motivo.length < 10 ? '#991B1B' : '#64748B', textAlign: 'right', marginTop: 4 }}>{motivo.length} / 500</Text>
                  {motivo.length > 0 && motivo.length < 10 && <Text style={{ fontSize: 11, color: '#DC2626' }}>O motivo deve ter pelo menos 10 caracteres.</Text>}

                  <Text style={[styles.inputLabel, { marginTop: 16 }]}>Comprovativo (opcional)</Text>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                     <TouchableOpacity style={[styles.btnUpload, { backgroundColor: '#F1C40F' }]}>
                        <Text style={{ color: '#000000', fontWeight: '600' }}>Fotografar</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={[styles.btnUploadOutline]}>
                        <Text style={{ color: '#0F172A' }}>Escolher Ficheiro</Text>
                     </TouchableOpacity>
                  </View>

                  <TouchableOpacity 
                     style={[styles.btnSubmeter, motivo.length < 10 && styles.btnSubmeterDisabled]} 
                     disabled={motivo.length < 10}
                     onPress={submeterJustificacao}
                  >
                     <Text style={[styles.btnSubmeterText, motivo.length < 10 && { color: '#CBD5E1' }]}>Submeter Justificação</Text>
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
  toggleContainer: { flexDirection: 'row', padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', justifyContent: 'center', gap: 8 },
  toggleBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  toggleBtnActive: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  toggleBtnText: { fontSize: 14, color: '#0F172A' },
  toggleBtnTextActive: { color: '#FFFFFF', fontWeight: '600' },
  content: { flex: 1 },
  card: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderLeftWidth: 4, borderRadius: 12, padding: 16 },
  badgePill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 16, alignSelf: 'flex-start' },
  badgePillText: { fontSize: 10, fontWeight: '600', marginLeft: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  cardSub: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  badgeEstado: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start' },
  badgeEstadoText: { fontSize: 12, fontWeight: '600', marginLeft: 4 },
  btnFull: { height: 48, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  btnFullText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  btnFullOutline: { height: 44, borderRadius: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' },
  bottomSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '80%' },
  handle: { width: 32, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginTop: 12 },
  contextBlock: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 16 },
  countdownBlock: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#B45309', borderRadius: 8, padding: 12, marginBottom: 16 },
  inputLabel: { fontSize: 12, color: '#64748B', marginBottom: 8 },
  textarea: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, minHeight: 100, textAlignVertical: 'top' },
  btnUpload: { flex: 1, height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnUploadOutline: { flex: 1, height: 48, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  btnSubmeter: { height: 52, borderRadius: 12, backgroundColor: '#F1C40F', alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  btnSubmeterDisabled: { backgroundColor: '#F1F5F9' },
  btnSubmeterText: { fontSize: 15, fontWeight: '600', color: '#000000' },
});
