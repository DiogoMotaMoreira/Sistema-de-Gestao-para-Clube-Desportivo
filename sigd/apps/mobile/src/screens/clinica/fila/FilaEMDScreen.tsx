import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { FileText, CheckCircle, Search, FileSearch, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/ui';

interface EMD {
  id: string;
  atletaNome: string;
  escalao: string;
  origem: string;
  submetidoPor: string;
  horasPendente: number;
}

const MOCK_EMDS: EMD[] = [
  { id: '1', atletaNome: 'João Silva', escalao: 'Sub-15', origem: 'Portal B2C', submetidoPor: 'Carlos Silva [EE]', horasPendente: 2 },
  { id: '2', atletaNome: 'Tomás Costa', escalao: 'Sub-17', origem: 'Portal B2C', submetidoPor: 'Maria Costa [EE]', horasPendente: 25 },
  { id: '3', atletaNome: 'Ricardo Oliveira', escalao: 'Seniores', origem: 'Portal B2C', submetidoPor: 'Próprio', horasPendente: 50 },
];

function getSlaConfig(horas: number) {
  if (horas < 24) return { bg: '#F1F5F9', text: '#64748B', label: `Há ${horas}h` };
  if (horas < 48) return { bg: '#FFFBEB', text: '#B45309', label: `Há ${Math.floor(horas/24)} dia` };
  return { bg: '#FEE2E2', text: '#991B1B', label: `Há ${Math.floor(horas/24)} dias` };
}

export function FilaEMDScreen(): React.JSX.Element {
  const [emds, setEmds] = useState<EMD[]>(MOCK_EMDS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  
  const [validoAte, setValidoAte] = useState('');
  const [motivo, setMotivo] = useState('');

  const pendentes = emds.length;
  const selectedEMD = emds.find(e => e.id === selectedId);

  const isValidoAteValid = validoAte.length > 0; // Simplificação da validação
  const isMotivoValid = motivo.length >= 10;

  const handleAprovar = () => {
    if (selectedId) {
      setEmds(prev => prev.filter(e => e.id !== selectedId));
      setSelectedId(null);
      setValidoAte('');
      setMotivo('');
    }
  };

  const handleRejeitar = () => {
    if (selectedId) {
      setEmds(prev => prev.filter(e => e.id !== selectedId));
      setSelectedId(null);
      setValidoAte('');
      setMotivo('');
    }
  };

  return (
    <View style={styles.container}>
      {/* PAINEL ESQUERDO */}
      <View style={styles.leftPanel}>
        {/* Mini-Dashboard */}
        <View style={styles.miniDashboard}>
          <Text style={[styles.dashboardText, pendentes > 0 && { color: Colors.ERRO_TEXT }]}>
            {pendentes} Pendentes
          </Text>
          <Text style={styles.dashboardSeparator}>·</Text>
          <Text style={[styles.dashboardText, { color: Colors.SUCESSO_TEXT }]}>12 Aprovados este mês</Text>
          <Text style={styles.dashboardSeparator}>·</Text>
          <Text style={[styles.dashboardText, { color: Colors.ERRO_TEXT }]}>3 Rejeitados</Text>
        </View>

        {/* Pesquisa */}
        <View style={styles.searchContainer}>
          <Search size={16} color={Colors.GRAY_500_TEXTO2} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar atleta..."
            placeholderTextColor={Colors.GRAY_500_TEXTO2}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Lista de EMDs */}
        <ScrollView style={styles.listContainer}>
          {emds.length === 0 ? (
            <View style={styles.emptyLeft}>
              <CheckCircle size={48} color={Colors.SUCESSO_TEXT} opacity={0.3} />
              <Text style={styles.emptyLeftTitle}>Fila limpa</Text>
              <Text style={styles.emptyLeftSub}>Não há EMDs pendentes de deliberação.</Text>
            </View>
          ) : (
            emds.map(emd => {
              const sla = getSlaConfig(emd.horasPendente);
              const isSelected = selectedId === emd.id;
              return (
                <TouchableOpacity
                  key={emd.id}
                  style={[styles.card, isSelected && styles.cardSelected]}
                  onPress={() => setSelectedId(emd.id)}
                >
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardAtletaNome}>{emd.atletaNome}</Text>
                    <View style={[styles.slaBadge, { backgroundColor: sla.bg }]}>
                      <Text style={[styles.slaText, { color: sla.text }]}>{sla.label}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardDetail}>Escalão: {emd.escalao}</Text>
                  <Text style={styles.cardDetail}>Origem: {emd.origem}</Text>
                  <Text style={styles.cardDetail}>Submetido por: {emd.submetidoPor}</Text>
                  <View style={styles.cardDocRow}>
                    <FileText size={14} color={Colors.GRAY_500_TEXTO2} />
                    <Text style={styles.cardDocText}>Exame Médico-Desportivo</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>

      {/* PAINEL DIREITO */}
      <View style={styles.rightPanel}>
        {!selectedEMD ? (
          <View style={styles.emptyRight}>
            <FileSearch size={64} color={Colors.GRAY_200_BORDAS} opacity={0.5} />
            <Text style={styles.emptyRightText}>Selecione um EMD da lista para iniciar a deliberação.</Text>
          </View>
        ) : (
          <View style={styles.activeRight}>
            {/* Pré-visualização do Documento (Simulada) */}
            <View style={styles.previewArea}>
              <View style={styles.previewToolbar}>
                <View style={styles.previewZoom}>
                  <ZoomOut size={20} color={Colors.BRANCO} />
                  <ZoomIn size={20} color={Colors.BRANCO} />
                </View>
                <View style={styles.previewPage}>
                  <ChevronLeft size={20} color={Colors.BRANCO} />
                  <Text style={styles.previewPageText}>Página 1 de 2</Text>
                  <ChevronRight size={20} color={Colors.BRANCO} />
                </View>
              </View>
              <View style={styles.previewMockDoc}>
                <FileText size={48} color={Colors.GRAY_500_TEXTO2} />
                <Text style={styles.previewMockText}>EMD_digitalizado.pdf</Text>
              </View>
            </View>

            {/* Painel Inferior — Ações de Decisão */}
            <View style={styles.decisionPanel}>
              <View style={styles.decisionRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Válido até *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="dd/mm/aaaa"
                    value={validoAte}
                    onChangeText={setValidoAte}
                  />
                  <Text style={styles.helperText}>* Apenas datas futuras são permitidas</Text>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Motivo de Rejeição *</Text>
                  <TextInput
                    style={styles.textarea}
                    placeholder="Indique o motivo clínico (mín. 10 caracteres)"
                    multiline
                    numberOfLines={3}
                    value={motivo}
                    onChangeText={setMotivo}
                  />
                  <Text style={[styles.charCount, motivo.length < 10 && motivo.length > 0 && { color: Colors.ERRO_TEXT }]}>
                    [{motivo.length} / 500]
                  </Text>
                </View>
              </View>

              <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                  style={[styles.btnRejeitar, !isMotivoValid && styles.btnDisabled]}
                  disabled={!isMotivoValid}
                  onPress={handleRejeitar}
                >
                  <Text style={[styles.btnRejeitarText, !isMotivoValid && styles.btnTextDisabled]}>✕ Rejeitar EMD</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btnAprovar, !isValidoAteValid && styles.btnDisabled]}
                  disabled={!isValidoAteValid}
                  onPress={handleAprovar}
                >
                  <Text style={[styles.btnAprovarText, !isValidoAteValid && styles.btnTextDisabled]}>✓ Aprovar EMD</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  leftPanel: {
    flex: 35,
    borderRightWidth: 1,
    borderRightColor: Colors.GRAY_200_BORDAS,
    backgroundColor: Colors.GRAY_50_FUNDO,
    display: 'flex',
    flexDirection: 'column',
  },
  rightPanel: {
    flex: 65,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  miniDashboard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.BRANCO,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
    alignItems: 'center',
    gap: 8,
  },
  dashboardText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.GRAY_500_TEXTO2,
  },
  dashboardSeparator: {
    color: Colors.GRAY_200_BORDAS,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.BRANCO,
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: Colors.GRAY_900_TEXTO1,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyLeft: {
    alignItems: 'center',
    marginTop: 64,
  },
  emptyLeftTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.GRAY_900_TEXTO1,
    marginTop: 16,
  },
  emptyLeftSub: {
    fontSize: 14,
    color: Colors.GRAY_500_TEXTO2,
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.BRANCO,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    ...Platform.select({
      web: { boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
      default: { elevation: 1 },
    }),
  },
  cardSelected: {
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 4,
    borderLeftColor: Colors.DOURADO_CTA,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardAtletaNome: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
  },
  slaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  slaText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardDetail: {
    fontSize: 13,
    color: Colors.GRAY_500_TEXTO2,
    marginBottom: 4,
  },
  cardDocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  cardDocText: {
    fontSize: 13,
    color: Colors.GRAY_900_TEXTO1,
  },
  emptyRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyRightText: {
    fontSize: 16,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 16,
  },
  activeRight: {
    flex: 1,
    flexDirection: 'column',
  },
  previewArea: {
    flex: 1,
    backgroundColor: '#1E293B',
    padding: 16,
  },
  previewToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  previewZoom: {
    flexDirection: 'row',
    gap: 16,
  },
  previewPage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewPageText: {
    color: Colors.BRANCO,
    fontSize: 14,
  },
  previewMockDoc: {
    flex: 1,
    backgroundColor: Colors.BRANCO,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 32,
    marginBottom: 32,
  },
  previewMockText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.GRAY_500_TEXTO2,
  },
  decisionPanel: {
    backgroundColor: Colors.BRANCO,
    borderTopWidth: 1,
    borderTopColor: Colors.GRAY_200_BORDAS,
    padding: 16,
  },
  decisionRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.GRAY_900_TEXTO1,
  },
  textarea: {
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.GRAY_900_TEXTO1,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 11,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 4,
  },
  charCount: {
    fontSize: 11,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 4,
    textAlign: 'right',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  btnRejeitar: {
    backgroundColor: Colors.ERRO_BG,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnRejeitarText: {
    color: Colors.ERRO_TEXT,
    fontWeight: '600',
    fontSize: 14,
  },
  btnAprovar: {
    backgroundColor: Colors.SUCESSO_BG,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnAprovarText: {
    color: Colors.SUCESSO_TEXT,
    fontWeight: '600',
    fontSize: 14,
  },
  btnDisabled: {
    backgroundColor: Colors.GRAY_100_HOVER,
  },
  btnTextDisabled: {
    color: Colors.GRAY_500_TEXTO2,
  },
});
