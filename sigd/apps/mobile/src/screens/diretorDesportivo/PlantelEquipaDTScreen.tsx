import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { ArrowLeft, CheckCircle, AlertTriangle, Clock, XCircle, X, ShieldAlert, User } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { diretorDesportivoService, AtletaDT } from '@/services/diretorDesportivoService';

export function PlantelEquipaDTScreen({ route, navigation }: any): React.JSX.Element {
  const { equipaId, equipaNome } = route.params || { equipaId: 1, equipaNome: 'Equipa' };
  const [atletas, setAtletas] = useState<AtletaDT[]>([]);
  const [loading, setLoading] = useState(true);
  const [atletaSelecionado, setAtletaSelecionado] = useState<AtletaDT | null>(null);
  const [ocorrencias, setOcorrencias] = useState<any[]>([]);
  const [loadingOcorrencias, setLoadingOcorrencias] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      diretorDesportivoService.getAtletasPorEquipa(equipaId),
      diretorDesportivoService.getSemaforoEquipa(equipaId)
    ])
      .then(([atletasData, semaforosData]) => {
        const atletasMapeados = atletasData.map(atleta => {
          const semaforoReal = semaforosData.find(s => s.atletaId === atleta.id);
          return {
            ...atleta,
            semaforo: semaforoReal ? semaforoReal.semaforo : 'VERDE'
          };
        });
        setAtletas(atletasMapeados);
      })
      .catch(err => {
        console.error('Erro a carregar plantel e semáforo:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [equipaId]);

  const handleAtletaClick = (atleta: AtletaDT) => {
    setAtletaSelecionado(atleta);
    setLoadingOcorrencias(true);
    diretorDesportivoService.getOcorrenciasAtleta(atleta.id)
      .then(res => {
        setOcorrencias(res);
      })
      .catch(err => {
        console.error('Erro a obter ocorrências do atleta:', err);
        setOcorrencias([]);
      })
      .finally(() => {
        setLoadingOcorrencias(false);
      });
  };

  const getSemaforoStyle = (semaforo: string) => {
    switch (semaforo) {
      case 'VERDE':
      case 'APTO':
        return { bg: Colors.SUCESSO_BG, text: Colors.SUCESSO_TEXT, label: 'Apto', icon: CheckCircle };
      case 'AMARELO':
      case 'CONDICIONADO':
        return { bg: Colors.AVISO_BG, text: Colors.AVISO_TEXT, label: 'Condicionado', icon: AlertTriangle };
      case 'VERMELHO':
      case 'INAPTO_EMD':
        return { bg: Colors.DOCUMENTAL_BG, text: Colors.DOCUMENTAL_TEXT, label: 'Falta EMD', icon: Clock };
      case 'BLOQUEADO':
      case 'INAPTO_LESAO':
        return { bg: Colors.ERRO_BG, text: Colors.ERRO_TEXT, label: 'Lesão Ativa', icon: XCircle };
      default:
        return { bg: Colors.GRAY_100_HOVER, text: Colors.GRAY_500_TEXTO2, label: 'Desconhecido', icon: Clock };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color={Colors.GRAY_900_TEXTO1} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.pageTitle}>Plantel & Prontidão Clínica</Text>
          <Text style={styles.pageSub}>{equipaNome}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.DOURADO_CTA} />
          <Text style={styles.loadingText}>A carregar plantel...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {atletas.length === 0 ? (
            <View style={styles.emptyState}>
              <User size={64} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>Nenhum atleta nesta equipa.</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {atletas.map(atleta => {
                const sStyle = getSemaforoStyle(atleta.semaforo);
                const IconComp = sStyle.icon;

                return (
                  <TouchableOpacity
                    key={atleta.id}
                    style={styles.card}
                    onPress={() => handleAtletaClick(atleta)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cardHeader}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{atleta.nome.charAt(0).toUpperCase()}</Text>
                      </View>
                      <View style={styles.athleteDetails}>
                        <Text style={styles.athleteNome} numberOfLines={1}>{atleta.nome}</Text>
                        <Text style={styles.athletePosicao}>{atleta.posicao || '-'}</Text>
                      </View>
                    </View>

                    <View style={styles.cardFooter}>
                      <View style={[styles.badge, { backgroundColor: sStyle.bg }]}>
                        <IconComp size={14} color={sStyle.text} style={{ marginRight: 6 }} />
                        <Text style={[styles.badgeText, { color: sStyle.text }]}>{sStyle.label}</Text>
                      </View>
                      <Text style={styles.btnVerOcorrencias}>Histórico Clínico →</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      )}

      <Modal
        visible={!!atletaSelecionado}
        transparent
        animationType="fade"
        onRequestClose={() => setAtletaSelecionado(null)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.backdrop} onPress={() => setAtletaSelecionado(null)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Histórico Clínico</Text>
                <Text style={styles.modalSub}>{atletaSelecionado?.nome}</Text>
              </View>
              <TouchableOpacity onPress={() => setAtletaSelecionado(null)}>
                <X size={24} color={Colors.GRAY_900_TEXTO1} />
              </TouchableOpacity>
            </View>

            {loadingOcorrencias ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="small" color={Colors.DOURADO_CTA} />
                <Text style={styles.modalLoadingText}>A carregar ocorrências...</Text>
              </View>
            ) : (
              <ScrollView style={styles.modalBody}>
                {ocorrencias.length === 0 ? (
                  <View style={styles.emptyOcorrencias}>
                    <ShieldAlert size={48} color="#CBD5E1" style={{ marginBottom: 12 }} />
                    <Text style={styles.emptyOcorrenciasText}>Nenhum registo clínico ativo ou histórico registado para este atleta.</Text>
                  </View>
                ) : (
                  <View style={styles.timeline}>
                    {ocorrencias.map((oc, index) => {
                      const oStyle = getSemaforoStyle(oc.grauRestricao);
                      return (
                        <View key={oc.id} style={styles.timelineItem}>
                          <View style={styles.timelineIndicator}>
                            <View style={[styles.timelineDot, { backgroundColor: oStyle.text }]} />
                            {index < ocorrencias.length - 1 && <View style={styles.timelineLine} />}
                          </View>
                          <View style={styles.timelineContent}>
                            <View style={styles.timelineHeader}>
                              <Text style={styles.timelineDate}>{new Date(oc.dataOcorrencia).toLocaleDateString()}</Text>
                              <View style={[styles.miniBadge, { backgroundColor: oStyle.bg }]}>
                                <Text style={[styles.miniBadgeText, { color: oStyle.text }]}>{oStyle.label}</Text>
                              </View>
                            </View>
                            <Text style={styles.timelineTipo}>{oc.tipo}</Text>
                            <Text style={styles.timelineDiag}>{oc.diagnostico}</Text>
                            {oc.obsDeliberacao ? (
                              <Text style={styles.timelineObs}>Deliberação: {oc.obsDeliberacao}</Text>
                            ) : null}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.btnClose} onPress={() => setAtletaSelecionado(null)}>
                <Text style={styles.btnCloseText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.GRAY_50_FUNDO },
  pageHeader: { backgroundColor: Colors.BRANCO, padding: 24, borderBottomWidth: 1, borderBottomColor: Colors.GRAY_200_BORDAS, flexDirection: 'row', alignItems: 'center' },
  btnVoltar: { padding: 8, marginRight: 16, borderRadius: 8, backgroundColor: Colors.GRAY_100_HOVER },
  headerInfo: { flex: 1 },
  pageTitle: { fontSize: 20, fontWeight: '700', color: Colors.GRAY_900_TEXTO1 },
  pageSub: { fontSize: 14, color: Colors.GRAY_500_TEXTO2, marginTop: 2, fontWeight: '500' },
  content: { flex: 1 },
  scrollContent: { padding: 24 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: Colors.GRAY_500_TEXTO2, fontWeight: '500' },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyTitle: { fontSize: 16, color: Colors.GRAY_500_TEXTO2, marginTop: 16, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  card: { backgroundColor: Colors.BRANCO, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 16, padding: 18, width: 280, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(241, 196, 15, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 16, fontWeight: '700', color: Colors.GRAY_900_TEXTO1 },
  athleteDetails: { flex: 1 },
  athleteNome: { fontSize: 15, fontWeight: '700', color: Colors.GRAY_900_TEXTO1 },
  athletePosicao: { fontSize: 13, color: Colors.GRAY_500_TEXTO2, marginTop: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: Colors.GRAY_200_BORDAS, paddingTop: 12 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  btnVerOcorrencias: { fontSize: 12, fontWeight: '600', color: Colors.INFO_TEXT },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContent: { backgroundColor: Colors.BRANCO, borderRadius: 16, padding: 24, width: '90%', maxWidth: 600, maxHeight: '80%', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 24, elevation: 12 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: Colors.GRAY_200_BORDAS, paddingBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.GRAY_900_TEXTO1 },
  modalSub: { fontSize: 14, color: Colors.GRAY_500_TEXTO2, marginTop: 2, fontWeight: '500' },
  modalLoading: { padding: 32, alignItems: 'center' },
  modalLoadingText: { marginTop: 12, fontSize: 13, color: Colors.GRAY_500_TEXTO2 },
  modalBody: { flex: 1, marginBottom: 20 },
  emptyOcorrencias: { alignItems: 'center', paddingVertical: 40 },
  emptyOcorrenciasText: { fontSize: 13, color: Colors.GRAY_500_TEXTO2, textAlign: 'center', lineHeight: 18 },
  modalFooter: { borderTopWidth: 1, borderTopColor: Colors.GRAY_200_BORDAS, paddingTop: 16, alignItems: 'flex-end' },
  btnClose: { borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: Colors.GRAY_50_FUNDO },
  btnCloseText: { fontSize: 14, fontWeight: '600', color: Colors.GRAY_900_TEXTO1 },
  timeline: { paddingLeft: 8, paddingTop: 8 },
  timelineItem: { flexDirection: 'row', marginBottom: 24 },
  timelineIndicator: { alignItems: 'center', marginRight: 16, width: 16 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, zIndex: 1 },
  timelineLine: { position: 'absolute', top: 12, bottom: -28, width: 2, backgroundColor: Colors.GRAY_200_BORDAS },
  timelineContent: { flex: 1, backgroundColor: Colors.GRAY_50_FUNDO, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS },
  timelineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  timelineDate: { fontSize: 12, fontWeight: '600', color: Colors.GRAY_500_TEXTO2 },
  miniBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  miniBadgeText: { fontSize: 10, fontWeight: '700' },
  timelineTipo: { fontSize: 14, fontWeight: '700', color: Colors.GRAY_900_TEXTO1, marginBottom: 4 },
  timelineDiag: { fontSize: 13, color: Colors.GRAY_900_TEXTO1, lineHeight: 18 },
  timelineObs: { fontSize: 12, color: Colors.GRAY_500_TEXTO2, marginTop: 8, fontStyle: 'italic', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 6 }
});
