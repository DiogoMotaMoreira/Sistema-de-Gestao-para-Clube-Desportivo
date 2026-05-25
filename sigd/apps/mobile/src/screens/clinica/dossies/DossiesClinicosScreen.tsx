import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Modal, Alert, ActivityIndicator } from 'react-native';
import { Search, ChevronRight, Activity, Users, Plus, ShieldCheck, AlertTriangle, XCircle, Clock, Lock, FilePlus, Paperclip, CheckCircle, X } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Badge, Button } from '@/components/ui';
import { clinicaService, AltaMedicaRequest, OcorrenciaResponse } from '@/services/clinicaService';
import { secretariaService, AtletaResponse } from '@/services/secretariaService';

// ── Tipos ──────────────────────────────────────────────

type Semaforo = 'APTO' | 'CONDICIONADO' | 'INAPTO_LESAO' | 'INAPTO_EMD';

interface AtletaDossie {
  id: number;
  nome: string;
  escalao: string;
  idade: number;
  semaforo: Semaforo;
}

function mapElegibilidadeToSemaforo(estado: string): Semaforo {
  switch (estado) {
    case 'INAPTO': return 'INAPTO_LESAO';
    case 'CONDICIONADO': return 'CONDICIONADO';
    default: return 'APTO';
  }
}

function calcularIdade(dataNascimento: string): number {
  const nascimento = new Date(dataNascimento);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

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
  const [selectedAtleta, setSelectedAtleta] = useState<AtletaDossie | null>(null);

  const [activeTab, setActiveTab] = useState<'ativas' | 'historico' | 'emds'>('ativas');
  const [filterType, setFilterType] = useState<'TODOS' | 'INAPTOS'>('TODOS');
  const [search, setSearch] = useState('');

  // Alta Médica modal state
  const [altaModalVisible, setAltaModalVisible] = useState(false);
  const [altaOcorrenciaId, setAltaOcorrenciaId] = useState<number | null>(null);
  const [altaParecer, setAltaParecer] = useState('');
  const [altaDataEncerramento, setAltaDataEncerramento] = useState('');
  const [altaLoading, setAltaLoading] = useState(false);
  const [altaDateError, setAltaDateError] = useState('');

  // Real atletas from API
  const [atletas, setAtletas] = useState<AtletaDossie[]>([]);
  const [atletasLoading, setAtletasLoading] = useState(false);

  const fetchAtletas = useCallback(async () => {
    setAtletasLoading(true);
    try {
      const page = await secretariaService.getAtletas(undefined, undefined, 0, 200);
      const mapped: AtletaDossie[] = page.content.map((a: AtletaResponse) => ({
        id: a.id,
        nome: a.nomeCompleto,
        escalao: a.equipaNome || '-',
        idade: calcularIdade(a.dataNascimento),
        semaforo: mapElegibilidadeToSemaforo(a.estadoElegibilidade),
      }));
      setAtletas(mapped);
    } catch {
      setAtletas([]);
    } finally {
      setAtletasLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAtletas();
  }, [fetchAtletas]);

  // Real ocorrências from API
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaResponse[]>([]);
  const [ocorrenciasLoading, setOcorrenciasLoading] = useState(false);

  const fetchOcorrencias = useCallback(async (atletaId: number) => {
    setOcorrenciasLoading(true);
    try {
      const data = await clinicaService.getOcorrenciasPorAtleta(atletaId);
      setOcorrencias(data);
    } catch {
      setOcorrencias([]);
    } finally {
      setOcorrenciasLoading(false);
    }
  }, []);

  useEffect(() => {
    if (viewState === 'DOSSIE' && selectedAtleta) {
      fetchOcorrencias(selectedAtleta.id);
    } else {
      setOcorrencias([]);
    }
  }, [viewState, selectedAtleta, fetchOcorrencias]);

  const atletasFiltrados = atletas.filter(a => {
    if (filterType === 'INAPTOS' && a.semaforo === 'APTO') return false;
    if (search && !a.nome.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleOpenDossie = (atleta: AtletaDossie) => {
    setSelectedAtleta(atleta);
    setViewState('DOSSIE');
    setActiveTab('ativas');
  };

  const handleCloseDossie = () => {
    setViewState('GRID');
    setSelectedAtleta(null);
  };

  const openAltaModal = (ocorrenciaId: number) => {
    setAltaOcorrenciaId(ocorrenciaId);
    setAltaParecer('');
    setAltaDataEncerramento('');
    setAltaDateError('');
    setAltaModalVisible(true);
  };

  const closeAltaModal = () => {
    setAltaModalVisible(false);
    setAltaOcorrenciaId(null);
    setAltaParecer('');
    setAltaDataEncerramento('');
    setAltaDateError('');
  };

  const handleAltaDateChange = (text: string) => {
    setAltaDataEncerramento(text);
    // Validate YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
      const date = new Date(text);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date > today) {
        setAltaDateError('A data de encerramento não pode ser futura.');
      } else {
        setAltaDateError('');
      }
    } else if (text.length >= 10) {
      setAltaDateError('Formato inválido. Use AAAA-MM-DD.');
    } else {
      setAltaDateError('');
    }
  };

  const isAltaFormValid = altaParecer.trim().length >= 10
    && /^\d{4}-\d{2}-\d{2}$/.test(altaDataEncerramento)
    && !altaDateError
    && !altaLoading;

  const handleSubmitAlta = async () => {
    if (!isAltaFormValid || !altaOcorrenciaId) return;
    setAltaLoading(true);
    try {
      await clinicaService.emitirAlta(altaOcorrenciaId, {
        parecer: altaParecer.trim(),
        dataEncerramento: altaDataEncerramento,
      });
      closeAltaModal();
      // Refresh ocorrências and atletas to reflect the alta
      if (selectedAtleta) {
        fetchOcorrencias(selectedAtleta.id);
      }
      fetchAtletas();
      Alert.alert(
        'Alta Emitida',
        'A alta médica foi registada com sucesso. O semáforo do atleta foi atualizado.',
      );
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Erro ao emitir alta médica.';
      Alert.alert('Erro', msg);
    } finally {
      setAltaLoading(false);
    }
  };

  if (viewState === 'DOSSIE' && selectedAtleta) {
    // Derive semáforo dynamically from real ocorrências
    const ativas = ocorrencias.filter(o => o.estado === 'ATIVA');
    const computedSemaforo: Semaforo = ativas.some(o => o.grauRestricao === 'VERMELHO')
      ? 'INAPTO_LESAO'
      : ativas.some(o => o.grauRestricao === 'AMARELO')
        ? 'CONDICIONADO'
        : 'APTO';
    const s = getSemaforoData(ocorrenciasLoading ? selectedAtleta.semaforo : computedSemaforo);
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
          {activeTab === 'ativas' && ocorrenciasLoading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color={Colors.GRAY_500_TEXTO2} />
              <Text style={styles.emptyTitle}>A carregar ocorrências...</Text>
            </View>
          ) : activeTab === 'ativas' && ocorrencias.filter(o => o.estado === 'ATIVA').length > 0 ? (
            <>
              {ocorrencias.filter(o => o.estado === 'ATIVA').map(oc => {
                const grauColor = oc.grauRestricao === 'VERMELHO' ? '#991B1B'
                  : oc.grauRestricao === 'AMARELO' ? '#B45309' : '#047857';
                const grauBg = oc.grauRestricao === 'VERMELHO' ? '#FEE2E2'
                  : oc.grauRestricao === 'AMARELO' ? '#FFFBEB' : '#ECFDF5';
                const grauLabel = oc.grauRestricao === 'VERMELHO' ? 'Interrupção Total'
                  : oc.grauRestricao === 'AMARELO' ? 'Restrição Condicionada' : 'Sem Restrição';
                return (
                  <View key={oc.id} style={[styles.lesaoCard, { borderLeftColor: grauColor, marginBottom: 16 }]}>
                    <View style={styles.lesaoHeader}>
                      <View style={styles.lesaoHeaderTitle}>
                        <Text style={styles.lesaoName}>{oc.diagnostico}</Text>
                        <View style={styles.lesaoBadge}>
                          <Activity size={12} color="#1D4ED8" />
                          <Text style={styles.lesaoBadgeText}>Em Tratamento</Text>
                        </View>
                      </View>
                      <View style={styles.lesaoMeta}>
                        <Text style={styles.lesaoMetaText}>
                          {oc.dataReavaliacao ? `Próxima Reavaliação: ${oc.dataReavaliacao}` : 'Sem reavaliação agendada'}
                        </Text>
                        <View style={styles.lesaoButtons}>
                          <TouchableOpacity style={styles.btnEvolucao}>
                            <FilePlus size={14} color={Colors.GRAY_900_TEXTO1} />
                            <Text style={styles.btnEvolucaoText}>Nova Evolução</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.btnAlta} onPress={() => openAltaModal(oc.id)}>
                            <ShieldCheck size={14} color="#047857" />
                            <Text style={styles.btnAltaText}>Emitir Alta</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <View style={styles.timeline}>
                      <View style={styles.timelineNode}>
                        <View style={[styles.timelineDot, { backgroundColor: grauColor }]} />
                        <View style={styles.timelineContent}>
                          <View style={styles.timelineHeader}>
                            <Text style={styles.timelineDate}>{oc.dataOcorrencia}</Text>
                            <View style={[styles.grauBadge, { backgroundColor: grauBg }]}>
                              <Text style={{ color: grauColor, fontSize: 11 }}>{grauLabel}</Text>
                            </View>
                          </View>
                          <Text style={styles.timelineNota}>{oc.diagnostico}</Text>
                          <Text style={styles.timelineFooter}>
                            Registado por: {oc.medicoCriadorNome || 'N/D'} · {oc.criadoEm?.substring(0, 10) || ''}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </>
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

        {/* Modal Alta Médica (RF-19) */}
        <Modal
          visible={altaModalVisible}
          transparent
          animationType="fade"
          onRequestClose={closeAltaModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Emitir Alta Médica</Text>
                  <Text style={styles.modalSubtitle}>
                    {selectedAtleta ? `${selectedAtleta.nome} · ${selectedAtleta.escalao}` : ''}
                  </Text>
                </View>
                <TouchableOpacity onPress={closeAltaModal} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <X size={20} color={Colors.GRAY_500_TEXTO2} />
                </TouchableOpacity>
              </View>

              {/* Preview de impacto no semáforo */}
              <View style={styles.altaImpactBanner}>
                <CheckCircle size={20} color="#047857" />
                <Text style={styles.altaImpactText}>
                  O semáforo transitará para APTO — atleta elegível para treino e convocatórias.
                </Text>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {/* Campo: Data de Encerramento */}
                <Text style={styles.fieldLabel}>Data Efetiva de Encerramento *</Text>
                <TextInput
                  style={[styles.fieldInput, altaDateError ? styles.fieldInputError : null]}
                  placeholder="AAAA-MM-DD"
                  placeholderTextColor={Colors.GRAY_500_TEXTO2}
                  value={altaDataEncerramento}
                  onChangeText={handleAltaDateChange}
                  maxLength={10}
                />
                {altaDateError ? (
                  <Text style={styles.fieldError}>{altaDateError}</Text>
                ) : (
                  <Text style={styles.fieldHelper}>* Deve ser igual ou anterior à data de hoje.</Text>
                )}

                {/* Campo: Parecer Final */}
                <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Parecer Final — Diretrizes para o Corpo Técnico *</Text>
                <TextInput
                  style={[styles.fieldTextarea]}
                  placeholder="Descreva as condicionantes para o regresso à atividade desportiva e as instruções para o treinador..."
                  placeholderTextColor={Colors.GRAY_500_TEXTO2}
                  value={altaParecer}
                  onChangeText={setAltaParecer}
                  multiline
                  numberOfLines={4}
                  maxLength={2000}
                  textAlignVertical="top"
                />
                <View style={styles.charCountRow}>
                  <Text style={[
                    styles.charCount,
                    altaParecer.trim().length < 10 && altaParecer.length > 0 ? { color: '#991B1B' } : {},
                  ]}>
                    {altaParecer.length} / 2000
                  </Text>
                </View>
                {altaParecer.length > 0 && altaParecer.trim().length < 10 && (
                  <Text style={styles.fieldError}>O parecer deve ter pelo menos 10 caracteres.</Text>
                )}
                <Text style={styles.fieldHelperBlue}>
                  Este parecer será visível ao corpo técnico no semáforo (versão mascarada — sem diagnóstico clínico).
                </Text>
              </ScrollView>

              {/* Rodapé do Modal */}
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.btnCancelOutline} onPress={closeAltaModal}>
                  <Text style={styles.btnCancelOutlineText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.btnConfirmarAlta,
                    !isAltaFormValid && styles.btnConfirmarAltaDisabled,
                  ]}
                  onPress={handleSubmitAlta}
                  disabled={!isAltaFormValid}
                >
                  {altaLoading ? (
                    <ActivityIndicator size="small" color="#047857" />
                  ) : (
                    <>
                      <CheckCircle size={16} color={isAltaFormValid ? '#047857' : '#9CA3AF'} />
                      <Text style={[
                        styles.btnConfirmarAltaText,
                        !isAltaFormValid && { color: '#9CA3AF' },
                      ]}>Confirmar Alta</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
              
              {a.semaforo !== 'APTO' && (
                <View style={styles.cardOcorrencias}>
                  <Activity size={12} color="#1D4ED8" />
                  <Text style={styles.cardOcorrenciasText}>Ocorrência Ativa</Text>
                </View>
              )}

              <TouchableOpacity style={styles.btnVerDossie} onPress={() => handleOpenDossie(a)}>
                <Text style={styles.btnVerDossieText}>Ver Dossiê</Text>
                <ChevronRight size={16} color={Colors.PRETO_PRIMARIO} />
              </TouchableOpacity>
            </View>
          );
        })}
        {atletasLoading && atletas.length === 0 && (
          <View style={styles.emptyGrid}>
            <ActivityIndicator size="large" color={Colors.GRAY_500_TEXTO2} />
            <Text style={styles.emptyGridTitle}>A carregar atletas...</Text>
          </View>
        )}
        {!atletasLoading && atletasFiltrados.length === 0 && (
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
  /* Modal Alta Médica */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '90%',
    maxWidth: 520,
    maxHeight: '85%',
    backgroundColor: Colors.BRANCO,
    borderRadius: 16,
    ...Platform.select({ web: { boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }, default: { elevation: 8 } }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.GRAY_900_TEXTO1,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 4,
  },
  altaImpactBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 24,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
  },
  altaImpactText: {
    flex: 1,
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  fieldLabel: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
    marginBottom: 6,
    fontWeight: '500',
  },
  fieldInput: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: Colors.GRAY_900_TEXTO1,
    backgroundColor: Colors.BRANCO,
  },
  fieldInputError: {
    borderColor: '#DC2626',
  },
  fieldTextarea: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
    color: Colors.GRAY_900_TEXTO1,
    backgroundColor: Colors.BRANCO,
  },
  fieldError: {
    fontSize: 11,
    color: '#991B1B',
    marginTop: 4,
  },
  fieldHelper: {
    fontSize: 11,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 4,
  },
  fieldHelperBlue: {
    fontSize: 11,
    color: '#1D4ED8',
    marginTop: 8,
    lineHeight: 16,
  },
  charCountRow: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  charCount: {
    fontSize: 11,
    color: Colors.GRAY_500_TEXTO2,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.GRAY_200_BORDAS,
  },
  btnCancelOutline: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
  },
  btnCancelOutlineText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.GRAY_900_TEXTO1,
  },
  btnConfirmarAlta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#ECFDF5',
  },
  btnConfirmarAltaDisabled: {
    backgroundColor: '#F1F5F9',
  },
  btnConfirmarAltaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#047857',
  },
});
