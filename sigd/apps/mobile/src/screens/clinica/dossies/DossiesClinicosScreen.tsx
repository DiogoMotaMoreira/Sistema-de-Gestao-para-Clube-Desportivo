import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { Search, ChevronRight, Activity, Users, Plus, ShieldCheck, AlertTriangle, XCircle, Clock, Lock, FilePlus, Paperclip } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Badge, Button } from '@/components/ui';

// Tipos Mockados
type Semaforo = 'APTO' | 'CONDICIONADO' | 'INAPTO_LESAO' | 'INAPTO_EMD';

interface AtletaMock {
  id: string;
  nome: string;
  escalao: string;
  idade: number;
  semaforo: Semaforo;
  ocorrenciasAtivas: number;
}

const MOCK_ATLETAS: AtletaMock[] = [
  { id: '1', nome: 'João Silva', escalao: 'Sub-17', idade: 16, semaforo: 'APTO', ocorrenciasAtivas: 0 },
  { id: '2', nome: 'Beatriz Santos', escalao: 'Sub-15', idade: 14, semaforo: 'INAPTO_LESAO', ocorrenciasAtivas: 1 },
  { id: '3', nome: 'Carlos Ferreira', escalao: 'Sub-19', idade: 18, semaforo: 'CONDICIONADO', ocorrenciasAtivas: 1 },
];

function getSemaforoData(estado: Semaforo) {
  switch (estado) {
    case 'APTO': return { bg: '#ECFDF5', text: '#047857', icon: ShieldCheck, label: 'APTO — Elegível' };
    case 'CONDICIONADO': return { bg: '#FFFBEB', text: '#B45309', icon: AlertTriangle, label: 'CONDICIONADO — Restrição Parcial' };
    case 'INAPTO_LESAO': return { bg: '#FEE2E2', text: '#991B1B', icon: XCircle, label: 'INAPTO — Lesão Ativa' };
    case 'INAPTO_EMD': return { bg: '#FEF3C7', text: '#92400E', icon: Clock, label: 'INAPTO — EMD Caducado' };
  }
}

export function DossiesClinicosScreen(): React.JSX.Element {
  const [viewState, setViewState] = useState<'GRID' | 'DOSSIE'>('GRID');
  const [selectedAtleta, setSelectedAtleta] = useState<AtletaMock | null>(null);

  const [activeTab, setActiveTab] = useState<'ativas' | 'historico' | 'emds'>('ativas');
  const [filterType, setFilterType] = useState<'TODOS' | 'INAPTOS'>('TODOS');
  const [search, setSearch] = useState('');

  const atletasFiltrados = MOCK_ATLETAS.filter(a => {
    if (filterType === 'INAPTOS' && a.semaforo === 'APTO') return false;
    if (search && !a.nome.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleOpenDossie = (atleta: AtletaMock) => {
    setSelectedAtleta(atleta);
    setViewState('DOSSIE');
    setActiveTab('ativas');
  };

  const handleCloseDossie = () => {
    setViewState('GRID');
    setSelectedAtleta(null);
  };

  if (viewState === 'DOSSIE' && selectedAtleta) {
    const s = getSemaforoData(selectedAtleta.semaforo);
    const Icon = s.icon;
    return (
      <View style={styles.container}>
        {/* Breadcrumb */}
        <View style={styles.breadcrumb}>
          <TouchableOpacity onPress={handleCloseDossie}>
            <Text style={styles.breadcrumbLink}>Dossiês Clínicos</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbSep}> {'>'} </Text>
          <Text style={styles.breadcrumbActive}>{selectedAtleta.nome}</Text>
        </View>

        {/* Biographic Header */}
        <View style={styles.bioHeader}>
          <View style={styles.bioAvatar}>
            <Text style={styles.bioAvatarText}>{selectedAtleta.nome.charAt(0)}</Text>
          </View>
          <View style={styles.bioContent}>
            <Text style={styles.bioName}>{selectedAtleta.nome}</Text>
            <Text style={styles.bioMeta}>{selectedAtleta.escalao} · {selectedAtleta.idade} anos</Text>
            <Text style={styles.bioMeta}>Última Consulta: 20/05/2026</Text>
          </View>
          <View style={styles.bioActions}>
            <View style={[styles.bioBadge, { backgroundColor: s.bg }]}>
              <Icon size={16} color={s.text} />
              <Text style={[styles.bioBadgeText, { color: s.text }]}>{s.label}</Text>
            </View>
            <TouchableOpacity style={styles.btnNovaOcorrencia}>
              <Plus size={16} color={Colors.PRETO_PRIMARIO} />
              <Text style={styles.btnNovaOcorrenciaText}>Nova Ocorrência</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {(['ativas', 'historico', 'emds'] as const).map(tab => (
            <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'ativas' ? 'Ocorrências Ativas' : tab === 'historico' ? 'Histórico Clínico' : 'Histórico de EMDs'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <ScrollView style={styles.dossieContent}>
          {activeTab === 'ativas' && selectedAtleta.ocorrenciasAtivas > 0 ? (
            <View style={styles.lesaoCard}>
              <View style={styles.lesaoHeader}>
                <View style={styles.lesaoHeaderTitle}>
                  <Text style={styles.lesaoName}>Entorse no Joelho Direito</Text>
                  <View style={styles.lesaoBadge}>
                    <Activity size={12} color="#1D4ED8" />
                    <Text style={styles.lesaoBadgeText}>Em Tratamento</Text>
                  </View>
                </View>
                <View style={styles.lesaoMeta}>
                  <Text style={styles.lesaoMetaText}>Próxima Reavaliação: 30/05/2026</Text>
                  <View style={styles.lesaoButtons}>
                    <TouchableOpacity style={styles.btnEvolucao}>
                      <FilePlus size={14} color={Colors.GRAY_900_TEXTO1} />
                      <Text style={styles.btnEvolucaoText}>Nova Evolução</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnAlta}>
                      <ShieldCheck size={14} color="#047857" />
                      <Text style={styles.btnAltaText}>Emitir Alta</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.timeline}>
                <View style={styles.timelineNode}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      <Text style={styles.timelineDate}>20 Mai 2026 · 14:30</Text>
                      <View style={[styles.grauBadge, { backgroundColor: '#FEE2E2' }]}><Text style={{color: '#991B1B', fontSize: 11}}>Interrupção Total</Text></View>
                    </View>
                    <Text style={styles.timelineNota}>Atleta com dor intensa e edema visível. Início de gelo e repouso.</Text>
                    <Text style={styles.timelineFooter}>Registado por: Dr. Medico · 20/05/2026 14:30</Text>
                  </View>
                </View>
              </View>
            </View>
          ) : activeTab === 'ativas' ? (
            <View style={styles.emptyState}>
              <Activity size={48} color={Colors.GRAY_200_BORDAS} opacity={0.5} />
              <Text style={styles.emptyTitle}>Sem ocorrências clínicas ativas.</Text>
              <Text style={styles.emptySub}>O atleta encontra-se clinicamente apto.</Text>
            </View>
          ) : activeTab === 'historico' ? (
            <View style={styles.emptyState}>
              <Clock size={48} color={Colors.GRAY_200_BORDAS} opacity={0.5} />
              <Text style={styles.emptyTitle}>Sem ocorrências clínicas no histórico.</Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Search size={48} color={Colors.GRAY_200_BORDAS} opacity={0.5} />
              <Text style={styles.emptyTitle}>Nenhum EMD no histórico deste atleta.</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filtersBar}>
        <View style={styles.toggleGroup}>
          <TouchableOpacity
            style={[styles.toggleBtn, filterType === 'INAPTOS' && styles.toggleBtnActiveInaptos]}
            onPress={() => setFilterType('INAPTOS')}
          >
            <Text style={[styles.toggleTextInaptos, filterType === 'INAPTOS' && styles.toggleTextActiveInaptos]}>Apenas Inaptos / Lesionados</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, filterType === 'TODOS' && styles.toggleBtnActiveTodos]}
            onPress={() => setFilterType('TODOS')}
          >
            <Text style={[styles.toggleTextTodos, filterType === 'TODOS' && styles.toggleTextActiveTodos]}>Todos os Atletas</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar atleta por nome..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView style={styles.gridContainer} contentContainerStyle={styles.gridContent}>
        {atletasFiltrados.map(a => {
          const s = getSemaforoData(a.semaforo);
          const Icon = s.icon;
          return (
            <View key={a.id} style={styles.card}>
              <View style={styles.cardAvatar}>
                <Text style={styles.cardAvatarText}>{a.nome.charAt(0)}</Text>
              </View>
              <Text style={styles.cardName}>{a.nome}</Text>
              <Text style={styles.cardMeta}>{a.escalao} · {a.idade} anos</Text>
              
              <View style={[styles.cardSemaforo, { backgroundColor: s.bg }]}>
                <Icon size={12} color={s.text} />
                <Text style={[styles.cardSemaforoText, { color: s.text }]}>{s.label}</Text>
              </View>
              
              {a.ocorrenciasAtivas > 0 && (
                <View style={styles.cardOcorrencias}>
                  <Activity size={12} color="#1D4ED8" />
                  <Text style={styles.cardOcorrenciasText}>{a.ocorrenciasAtivas} Ocorrência Ativa</Text>
                </View>
              )}

              <TouchableOpacity style={styles.btnVerDossie} onPress={() => handleOpenDossie(a)}>
                <Text style={styles.btnVerDossieText}>Ver Dossiê</Text>
                <ChevronRight size={16} color={Colors.PRETO_PRIMARIO} />
              </TouchableOpacity>
            </View>
          );
        })}
        {atletasFiltrados.length === 0 && (
          <View style={styles.emptyGrid}>
            <Users size={64} color={Colors.GRAY_200_BORDAS} opacity={0.5} />
            <Text style={styles.emptyGridTitle}>Nenhum atleta encontrado.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  filtersBar: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.BRANCO,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
  },
  toggleBtnActiveInaptos: {
    backgroundColor: '#FEE2E2',
    borderColor: '#991B1B',
  },
  toggleTextInaptos: {
    color: '#991B1B',
    fontSize: 14,
  },
  toggleTextActiveInaptos: {
    fontWeight: '600',
  },
  toggleBtnActiveTodos: {
    backgroundColor: Colors.GRAY_100_HOVER,
    borderColor: Colors.GRAY_200_BORDAS,
  },
  toggleTextTodos: {
    color: Colors.GRAY_900_TEXTO1,
    fontSize: 14,
  },
  toggleTextActiveTodos: {
    fontWeight: '600',
  },
  searchInput: {
    width: 250,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  gridContainer: {
    flex: 1,
  },
  gridContent: {
    padding: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  card: {
    width: 280,
    backgroundColor: Colors.BRANCO,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    alignItems: 'center',
    ...Platform.select({ web: { boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }, default: { elevation: 1 } }),
  },
  cardAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.GRAY_200_BORDAS,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.GRAY_500_TEXTO2,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
  },
  cardMeta: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
    marginBottom: 12,
  },
  cardSemaforo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
    gap: 4,
  },
  cardSemaforoText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardOcorrencias: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    marginBottom: 16,
    gap: 4,
  },
  cardOcorrenciasText: {
    fontSize: 11,
    color: '#1D4ED8',
    fontWeight: '500',
  },
  btnVerDossie: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: Colors.DOURADO_CTA,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  btnVerDossieText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.PRETO_PRIMARIO,
  },
  emptyGrid: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 64,
  },
  emptyGridTitle: {
    fontSize: 16,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 16,
  },
  /* Dossie Individual */
  breadcrumb: {
    flexDirection: 'row',
    padding: 16,
  },
  breadcrumbLink: {
    fontSize: 14,
    color: Colors.GRAY_500_TEXTO2,
  },
  breadcrumbSep: {
    fontSize: 14,
    color: Colors.GRAY_500_TEXTO2,
  },
  breadcrumbActive: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.GRAY_900_TEXTO1,
  },
  bioHeader: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.BRANCO,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    alignItems: 'center',
  },
  bioAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.GRAY_200_BORDAS,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 24,
  },
  bioAvatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.GRAY_500_TEXTO2,
  },
  bioContent: {
    flex: 1,
  },
  bioName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
    marginBottom: 4,
  },
  bioMeta: {
    fontSize: 14,
    color: Colors.GRAY_500_TEXTO2,
    marginBottom: 2,
  },
  bioActions: {
    alignItems: 'flex-end',
    gap: 16,
  },
  bioBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  bioBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  btnNovaOcorrencia: {
    flexDirection: 'row',
    backgroundColor: Colors.DOURADO_CTA,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    gap: 6,
  },
  btnNovaOcorrenciaText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.PRETO_PRIMARIO,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.DOURADO_CTA,
  },
  tabText: {
    fontSize: 14,
    color: Colors.GRAY_500_TEXTO2,
  },
  tabTextActive: {
    fontWeight: '600',
    color: Colors.GRAY_900_TEXTO1,
  },
  dossieContent: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 64,
  },
  emptyTitle: {
    fontSize: 14,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 16,
  },
  emptySub: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 4,
  },
  lesaoCard: {
    backgroundColor: Colors.BRANCO,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderLeftWidth: 4,
    borderLeftColor: '#991B1B', // Vermelho
  },
  lesaoHeader: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
    paddingBottom: 16,
    marginBottom: 16,
  },
  lesaoHeaderTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lesaoName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
  },
  lesaoBadge: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
  },
  lesaoBadgeText: {
    fontSize: 11,
    color: '#1D4ED8',
    fontWeight: '500',
  },
  lesaoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lesaoMetaText: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
  },
  lesaoButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  btnEvolucao: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
  },
  btnEvolucaoText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.GRAY_900_TEXTO1,
  },
  btnAlta: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
  },
  btnAltaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
  },
  timeline: {
    marginLeft: 8,
  },
  timelineNode: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#991B1B',
    marginTop: 4,
    marginRight: 16,
  },
  timelineContent: {
    flex: 1,
    borderLeftWidth: 2,
    borderLeftColor: Colors.GRAY_200_BORDAS,
    paddingLeft: 16,
    marginLeft: -22,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
  },
  grauBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  timelineNota: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.GRAY_900_TEXTO1,
    marginBottom: 8,
  },
  timelineFooter: {
    fontSize: 11,
    fontStyle: 'italic',
    color: Colors.GRAY_500_TEXTO2,
  },
});
