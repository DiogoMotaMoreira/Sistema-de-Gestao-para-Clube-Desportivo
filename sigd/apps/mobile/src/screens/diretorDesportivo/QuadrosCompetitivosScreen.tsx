import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, Trophy, PlayCircle, Calendar, CheckCircle, Pencil, Archive } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { diretorDesportivoService, QuadroCompetitivo, EquipaDT } from '@/services/diretorDesportivoService';

function deterministicShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let currentSeed = seed;
  const random = () => {
    const x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}

function getSeededRivals(seed: number) {
  const baseRivals = [
    'Futebol Clube do Porto B',
    'Sport Lisboa e Benfica B',
    'Sporting Clube de Portugal B',
    'Sporting Clube de Braga B'
  ];

  const shuffledRivals = deterministicShuffle(baseRivals, seed);

  const getStats = (pts: number, posIdx: number) => {
    const j = 22;
    const v = Math.floor(pts / 3);
    const e = pts - v * 3;
    const d = j - v - e;
    const gm = 30 + (seed * (posIdx + 3) + posIdx * 7) % 25;
    const gs = 10 + (seed * (posIdx + 5) + posIdx * 9) % 20;
    return { j, v, e, d, gm, gs, pts };
  };

  return [
    { pos: '2º', nome: shuffledRivals[0], ...getStats(48 + (seed * 3) % 5, 0) },
    { pos: '3º', nome: shuffledRivals[1], ...getStats(42 + (seed * 7) % 5, 1) },
    { pos: '4º', nome: shuffledRivals[2], ...getStats(36 + (seed * 11) % 5, 2) },
    { pos: '5º', nome: shuffledRivals[3], ...getStats(28 + (seed * 13) % 7, 3) }
  ];
}

export function QuadrosCompetitivosScreen({ navigation }: any): React.JSX.Element {
  const [quadros, setQuadros] = useState<QuadroCompetitivo[]>([]);
  const [equipas, setEquipas] = useState<EquipaDT[]>([]);
  const [selectedEquipaId, setSelectedEquipaId] = useState<number | null>(null);

  const seededRivals = selectedEquipaId ? getSeededRivals(selectedEquipaId) : [];

  useEffect(() => {
    diretorDesportivoService.getQuadros().then(setQuadros);
    diretorDesportivoService.getEquipas().then((eqs) => {
      setEquipas(eqs);
      if (eqs.length > 0) {
        setSelectedEquipaId(eqs[0].id);
      }
    });
  }, []);

  const handleCycleEquipa = () => {
    if (equipas.length === 0) return;
    const index = equipas.findIndex(eq => eq.id === selectedEquipaId);
    if (index === equipas.length - 1) {
      setSelectedEquipaId(equipas[0].id);
    } else {
      setSelectedEquipaId(equipas[index + 1].id);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Quadros Competitivos</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {selectedEquipaId && (
            <TouchableOpacity style={styles.btnSelector} onPress={handleCycleEquipa}>
              <Text style={styles.btnSelectorText}>
                Equipa: {equipas.find(e => e.id === selectedEquipaId)?.nome || ''}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.btnDourado}>
             <Plus size={16} color="#000000" style={{ marginRight: 8 }} />
             <Text style={styles.btnDouradoText}>Novo Quadro Competitivo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 24 }}>
        
        {quadros.length === 0 ? (
          <View style={styles.emptyState}>
             <Trophy size={64} color="#CBD5E1" />
             <Text style={styles.emptyTitle}>Nenhum quadro competitivo registado.</Text>
             <Text style={styles.emptySub}>Crie quadros competitivos para agendar jogos oficiais.</Text>
          </View>
        ) : (
          <>
            <View style={styles.table}>
               {/* Header */}
               <View style={styles.tableHeader}>
                  <Text style={[styles.th, { flex: 2 }]}>NOME DA PROVA</Text>
                  <Text style={[styles.th, { flex: 1 }]}>ESCALÃO ASSOCIADO</Text>
                  <Text style={[styles.th, { flex: 2 }]}>EQUIPAS ASSOCIADAS</Text>
                  <Text style={[styles.th, { flex: 1 }]}>ESTADO</Text>
                  <Text style={[styles.th, { width: 100, textAlign: 'right' }]}>AÇÕES</Text>
               </View>

               {/* Rows */}
               {quadros.map(q => {
                 let badgeBg = '#F1F5F9', badgeText = '#64748B', Icon = CheckCircle;
                 if (q.estado === 'EM_CURSO') { badgeBg = '#ECFDF5'; badgeText = '#047857'; Icon = PlayCircle; }
                 if (q.estado === 'AGENDADO') { badgeBg = '#FFFBEB'; badgeText = '#B45309'; Icon = Calendar; }

                 return (
                   <View key={q.id} style={styles.tableRow}>
                      <View style={{ flex: 2 }}><Text style={styles.tdNome}>{q.nome}</Text></View>
                      <View style={{ flex: 1 }}>
                         <View style={styles.badgeEscalao}><Text style={styles.badgeEscalaoText}>{q.escalao}</Text></View>
                      </View>
                      <View style={{ flex: 2, flexDirection: 'row', gap: 4 }}>
                         {q.equipas.map(eq => (
                           <View key={eq} style={styles.badgeEscalao}><Text style={styles.badgeEscalaoText}>{eq}</Text></View>
                         ))}
                      </View>
                      <View style={{ flex: 1 }}>
                         <View style={[styles.badgeEstado, { backgroundColor: badgeBg }]}>
                            <Icon size={12} color={badgeText} />
                            <Text style={[styles.badgeEstadoText, { color: badgeText }]}>{q.estado.replace('_', ' ')}</Text>
                         </View>
                      </View>
                      <View style={{ width: 100, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                         <TouchableOpacity style={styles.btnIcon}><Pencil size={14} color="#64748B" /></TouchableOpacity>
                         <TouchableOpacity style={styles.btnIcon}><Archive size={14} color="#64748B" /></TouchableOpacity>
                      </View>
                   </View>
                 );
               })}
            </View>

            {/* Tabela Classificativa Mock com Equipa Real no Topo */}
            {selectedEquipaId && (
              <View style={{ marginTop: 32 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 }}>
                  <Trophy size={20} color="#F1C40F" />
                  <Text style={{ fontSize: 18, fontWeight: '700', color: '#0F172A' }}>Classificação Provisória</Text>
                </View>
                
                <View style={styles.table}>
                   {/* Header Classificação */}
                   <View style={styles.tableHeader}>
                      <Text style={[styles.th, { width: 50 }]}>POS</Text>
                      <Text style={[styles.th, { flex: 3 }]}>CLUBE / EQUIPA</Text>
                      <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>J</Text>
                      <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>V</Text>
                      <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>E</Text>
                      <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>D</Text>
                      <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>GM</Text>
                      <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>GS</Text>
                      <Text style={[styles.th, { flex: 1.5, textAlign: 'center', fontWeight: '700' }]}>PTS</Text>
                   </View>

                   {/* 1º Lugar: Equipa Real Selecionada */}
                   <View style={[styles.tableRow, { backgroundColor: '#ECFDF5' }]}>
                      <Text style={[{ width: 50, fontWeight: '700', color: '#047857' }]}>1º</Text>
                      <Text style={[styles.tdNome, { flex: 3, color: '#047857' }]}>
                        🏆 {equipas.find(e => e.id === selectedEquipaId)?.nome || ''}
                      </Text>
                      <Text style={[{ flex: 1, textAlign: 'center' }]}>22</Text>
                      <Text style={[{ flex: 1, textAlign: 'center' }]}>18</Text>
                      <Text style={[{ flex: 1, textAlign: 'center' }]}>3</Text>
                      <Text style={[{ flex: 1, textAlign: 'center' }]}>1</Text>
                      <Text style={[{ flex: 1, textAlign: 'center' }]}>54</Text>
                      <Text style={[{ flex: 1, textAlign: 'center' }]}>12</Text>
                      <Text style={[{ flex: 1.5, textAlign: 'center', fontWeight: '700', color: '#047857' }]}>57</Text>
                   </View>

                   {/* Outros Lugares: Mocks de Rivais Tradicionais */}
                   {seededRivals.map((item, index) => (
                     <View key={index} style={styles.tableRow}>
                        <Text style={[{ width: 50, color: '#64748B' }]}>{item.pos}</Text>
                        <Text style={[styles.tdNome, { flex: 3, fontWeight: '500' }]}>{item.nome}</Text>
                        <Text style={[{ flex: 1, textAlign: 'center' }]}>{item.j}</Text>
                        <Text style={[{ flex: 1, textAlign: 'center' }]}>{item.v}</Text>
                        <Text style={[{ flex: 1, textAlign: 'center' }]}>{item.e}</Text>
                        <Text style={[{ flex: 1, textAlign: 'center' }]}>{item.d}</Text>
                        <Text style={[{ flex: 1, textAlign: 'center' }]}>{item.gm}</Text>
                        <Text style={[{ flex: 1, textAlign: 'center' }]}>{item.gs}</Text>
                        <Text style={[{ flex: 1.5, textAlign: 'center', fontWeight: '700' }]}>{item.pts}</Text>
                     </View>
                   ))}
                </View>
              </View>
            )}
          </>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  pageHeader: { backgroundColor: '#FFFFFF', padding: 24, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#0F172A' },
  content: { flex: 1 },
  btnDourado: { flexDirection: 'row', backgroundColor: '#F1C40F', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnDouradoText: { fontSize: 14, fontWeight: '600', color: '#000000' },
  btnSelector: { paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, backgroundColor: '#FFFFFF', justifyContent: 'center' },
  btnSelectorText: { fontSize: 14, color: '#0F172A', fontWeight: '600' },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyTitle: { fontSize: 16, color: '#64748B', marginTop: 16, fontWeight: '600' },
  emptySub: { fontSize: 14, color: '#64748B', marginTop: 4 },
  table: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', padding: 16, backgroundColor: '#F8FAFC', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  th: { fontSize: 10, fontWeight: '700', color: '#64748B' },
  tableRow: { flexDirection: 'row', padding: 16, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tdNome: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  badgeEscalao: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start' },
  badgeEscalaoText: { fontSize: 11, color: '#64748B' },
  badgeEstado: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start' },
  badgeEstadoText: { fontSize: 11, fontWeight: '600' },
  btnIcon: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 6, padding: 6 },
});
