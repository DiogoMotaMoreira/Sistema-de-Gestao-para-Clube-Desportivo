import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { ChevronLeft, ChevronRight, Plus, ExternalLink, Clock } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { diretorDesportivoService, EventoCalendario } from '@/services/diretorDesportivoService';

export function CalendarioGlobalScreen({ navigation }: any): React.JSX.Element {
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [showSlideOver, setShowSlideOver] = useState(false);

  useEffect(() => {
    diretorDesportivoService.getEventos(5, 2026).then(setEventos);
  }, []);

  return (
    <View style={styles.container}>
      {/* Page Header Simplificado */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Calendário Global</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 24 }}>
        
        {/* Barra de Stats */}
        <View style={styles.statsBar}>
           <View style={styles.statItem}>
              <Text style={styles.statLabel}>ESTE MÊS — TREINOS</Text>
              <Text style={[styles.statValue, { color: '#047857' }]}>24</Text>
           </View>
           <View style={styles.statDivider} />
           <View style={styles.statItem}>
              <Text style={styles.statLabel}>ESTE MÊS — JOGOS</Text>
              <Text style={[styles.statValue, { color: '#1D4ED8' }]}>8</Text>
           </View>
           <View style={styles.statDivider} />
           <View style={styles.statItem}>
              <Text style={styles.statLabel}>PENDÊNCIAS</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[styles.statValue, { color: '#991B1B' }]}>2</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Analise')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                   <Text style={{ fontSize: 12, color: '#1D4ED8', marginRight: 4 }}>Ver Incumprimentos</Text>
                   <ExternalLink size={12} color="#1D4ED8" />
                </TouchableOpacity>
              </View>
           </View>
        </View>

        {/* Toolbar do Calendário */}
        <View style={styles.toolbar}>
           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
               <TouchableOpacity><ChevronLeft size={20} color="#0F172A" /></TouchableOpacity>
               <Text style={{ fontSize: 18, fontWeight: '700', color: '#0F172A' }}>Maio 2026</Text>
               <TouchableOpacity><ChevronRight size={20} color="#0F172A" /></TouchableOpacity>
             </View>

             <View style={styles.toggleGroup}>
                <TouchableOpacity style={[styles.toggleBtn, styles.toggleBtnActive]}><Text style={styles.toggleBtnTextActive}>Mensal</Text></TouchableOpacity>
                <TouchableOpacity style={styles.toggleBtn}><Text style={styles.toggleBtnText}>Semanal</Text></TouchableOpacity>
             </View>
             
             <View style={styles.dropdownMock}>
               <Text style={{ fontSize: 14, color: '#0F172A' }}>Equipa: Ver Todas</Text>
             </View>
           </View>

           <TouchableOpacity style={styles.btnDourado} onPress={() => setShowSlideOver(true)}>
             <Plus size={16} color="#000000" style={{ marginRight: 8 }} />
             <Text style={styles.btnDouradoText}>Agendar Evento</Text>
           </TouchableOpacity>
        </View>

        {/* Grelha de Calendário Mockada */}
        <View style={styles.grid}>
          {/* Header Dias da semana */}
          <View style={styles.gridHeader}>
             {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
               <View key={d} style={styles.gridHeaderCell}><Text style={styles.gridHeaderText}>{d}</Text></View>
             ))}
          </View>
          {/* Corpo (Apenas 1 semana de mock para o layout) */}
          <View style={styles.gridRow}>
             {[10, 11, 12, 13, 14, 15, 16].map(d => (
               <View key={d} style={styles.gridCell}>
                 <Text style={styles.dayNumber}>{d}</Text>
                 
                 {/* Renderizar Eventos neste dia */}
                 {eventos.filter(e => new Date(e.dataHora).getDate() === d).map(e => {
                    let bg = '#ECFDF5', text = '#047857', border = '#047857';
                    if (e.tipo === 'JOGO') { bg = '#EFF6FF'; text = '#1D4ED8'; border = '#1D4ED8'; }
                    if (e.tipo === 'MANUTENCAO') { bg = '#FFFBEB'; text = '#B45309'; border = '#B45309'; }

                    return (
                      <View key={e.id} style={[styles.eventoBloco, { backgroundColor: bg, borderLeftColor: border }]}>
                         <Text style={[styles.eventoTexto, { color: text }]} numberOfLines={1}>{e.titulo}</Text>
                         {e.fichaFalta && <View style={styles.pontoVermelho} />}
                         {e.semConvocatoria && (
                            <View style={styles.badgeSemConvocatoria}>
                              <Clock size={10} color="#B45309" />
                              <Text style={styles.badgeSemConvocatoriaText}>Sem convocatória</Text>
                            </View>
                         )}
                      </View>
                    );
                 })}
               </View>
             ))}
          </View>
        </View>

      </ScrollView>

      {/* Slide-over "Agendar Novo Evento" Mock */}
      <Modal visible={showSlideOver} transparent animationType="slide">
         <View style={styles.slideOverOverlay}>
            <TouchableOpacity style={styles.slideOverBackdrop} onPress={() => setShowSlideOver(false)} />
            <View style={styles.slideOverPanel}>
               <View style={styles.slideOverHeader}>
                 <Text style={{ fontSize: 18, fontWeight: '600', color: '#0F172A' }}>Agendar Novo Evento</Text>
                 <TouchableOpacity onPress={() => setShowSlideOver(false)}><Text style={{ fontSize: 24, color: '#64748B' }}>×</Text></TouchableOpacity>
               </View>
               <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
                 <View style={{ padding: 12, borderBottomWidth: 2, borderBottomColor: '#F1C40F' }}>
                   <Text style={{ fontSize: 14, fontWeight: '600', color: '#0F172A' }}>TREINO</Text>
                 </View>
                 <View style={{ padding: 12 }}>
                   <Text style={{ fontSize: 14, color: '#64748B' }}>JOGO OFICIAL</Text>
                 </View>
               </View>
               <ScrollView style={{ padding: 20 }}>
                  <Text style={styles.inputLabel}>Equipa *</Text>
                  <TextInput style={styles.input} placeholder="Selecione a equipa..." />
                  
                  <Text style={styles.inputLabel}>Instalação *</Text>
                  <TextInput style={styles.input} placeholder="Selecione a instalação..." />
                  
                  <Text style={styles.inputLabel}>Hora de Início *</Text>
                  <TextInput style={styles.input} placeholder="HH:MM" />
               </ScrollView>
               <View style={styles.slideOverFooter}>
                 <TouchableOpacity style={[styles.btnOutline, { flex: 1, marginRight: 12 }]} onPress={() => setShowSlideOver(false)}>
                   <Text style={{ color: '#0F172A' }}>Cancelar</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={[styles.btnDourado, { flex: 2 }]} onPress={() => setShowSlideOver(false)}>
                   <Text style={styles.btnDouradoText}>Validar Planeamento</Text>
                 </TouchableOpacity>
               </View>
            </View>
         </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  pageHeader: { backgroundColor: '#FFFFFF', padding: 24, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#0F172A' },
  content: { flex: 1 },
  statsBar: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', padding: 16, marginBottom: 24 },
  statItem: { flex: 1, paddingHorizontal: 16 },
  statDivider: { width: 1, backgroundColor: '#E2E8F0' },
  statLabel: { fontSize: 10, color: '#64748B', fontWeight: '600', marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '700' },
  toolbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  toggleGroup: { flexDirection: 'row', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  toggleBtn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'transparent' },
  toggleBtnActive: { backgroundColor: '#F1C40F' },
  toggleBtnText: { fontSize: 14, color: '#0F172A' },
  toggleBtnTextActive: { fontSize: 14, color: '#000000', fontWeight: '600' },
  dropdownMock: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, backgroundColor: '#FFFFFF' },
  btnDourado: { flexDirection: 'row', backgroundColor: '#F1C40F', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnDouradoText: { fontSize: 14, fontWeight: '600', color: '#000000' },
  grid: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, overflow: 'hidden' },
  gridHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
  gridHeaderCell: { flex: 1, padding: 12, alignItems: 'center' },
  gridHeaderText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  gridRow: { flexDirection: 'row', height: 140 },
  gridCell: { flex: 1, borderRightWidth: 1, borderRightColor: '#E2E8F0', padding: 8 },
  dayNumber: { fontSize: 14, color: '#0F172A', marginBottom: 8 },
  eventoBloco: { padding: 4, borderRadius: 4, borderLeftWidth: 3, marginBottom: 4, position: 'relative' },
  eventoTexto: { fontSize: 11, fontWeight: '600' },
  pontoVermelho: { position: 'absolute', top: 2, right: 2, width: 6, height: 6, borderRadius: 3, backgroundColor: '#991B1B' },
  badgeSemConvocatoria: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', alignSelf: 'flex-start', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  badgeSemConvocatoriaText: { fontSize: 9, color: '#B45309', marginLeft: 2, fontWeight: '600' },
  slideOverOverlay: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end' },
  slideOverBackdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.3)' },
  slideOverPanel: { width: 480, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: -5, height: 0 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 10 },
  slideOverHeader: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  inputLabel: { fontSize: 12, color: '#64748B', marginBottom: 4, marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, fontSize: 14 },
  slideOverFooter: { padding: 20, borderTopWidth: 1, borderTopColor: '#E2E8F0', flexDirection: 'row' },
  btnOutline: { borderWidth: 1, borderColor: '#E2E8F0', padding: 12, borderRadius: 8, alignItems: 'center' },
});
