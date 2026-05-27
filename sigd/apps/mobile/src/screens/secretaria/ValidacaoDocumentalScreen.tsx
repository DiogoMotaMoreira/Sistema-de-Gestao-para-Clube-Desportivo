import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { FileCheck, Search, CheckCircle, AlertTriangle, XCircle, User } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { secretariaService, AtletaResponse } from '../../services/secretariaService';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';

// ── Tipos de estado documental ──────────────────────────

type EstadoDocumental = 'COMPLETO' | 'INCOMPLETO' | 'EM_FALTA';

function calcularEstadoDocumental(atleta: AtletaResponse): EstadoDocumental {
  if (atleta.estadoElegibilidade === 'PENDENTE_EMD') return 'EM_FALTA';
  if (atleta.numeroSocio) return 'COMPLETO';
  return 'INCOMPLETO';
}

function getBadgeConfig(estado: EstadoDocumental) {
  switch (estado) {
    case 'COMPLETO':
      return { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0', label: 'Completo' };
    case 'INCOMPLETO':
      return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A', label: 'Incompleto' };
    case 'EM_FALTA':
      return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA', label: 'Em Falta' };
  }
}

// ── Componente ──────────────────────────────────────────

export function ValidacaoDocumentalScreen(): React.JSX.Element {
  const [pesquisa, setPesquisa] = useState('');
  const [activeTab, setActiveTab] = useState<'TODOS' | 'COMPLETO' | 'INCOMPLETO' | 'EM_FALTA'>('TODOS');
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const showToast = (message: string, type: 'success'|'error' = 'success') => {
    setToast({message, type});
    setTimeout(() => setToast(null), 3000);
  };

  const { data: pageData, isLoading, isError, refetch } = useQuery({
    queryKey: ['atletasValidacao'],
    queryFn: () => secretariaService.getAtletas(undefined, undefined, 0, 200),
  });

  const atletas = pageData?.content ?? [];

  const atletasFiltrados = atletas.filter(a => {
    if (activeTab !== 'TODOS' && calcularEstadoDocumental(a) !== activeTab) return false;
    if (pesquisa.trim() && !a.nomeCompleto.toLowerCase().includes(pesquisa.toLowerCase())) return false;
    return true;
  });

  // Contadores para o resumo
  const completos = atletas.filter(a => calcularEstadoDocumental(a) === 'COMPLETO').length;
  const incompletos = atletas.filter(a => calcularEstadoDocumental(a) === 'INCOMPLETO').length;
  const emFalta = atletas.filter(a => calcularEstadoDocumental(a) === 'EM_FALTA').length;

  const handleMarcarValidado = (atleta: AtletaResponse) => {
    Alert.alert(
      'Confirmar Validação',
      `Confirmar que a documentação de ${atleta.nomeCompleto} está validada?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await secretariaService.validarDocumentos(atleta.id);
              showToast('Documentação validada com sucesso!');
              void refetch();
            } catch (err) {
              showToast('Erro ao validar documentação do atleta.', 'error');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <PageHeader
        title="Validação Documental"
        breadcrumbs={[{ label: 'Secretaria' }, { label: 'Validação Documental' }]}
      />

      {/* Resumo por estado */}
      <View style={styles.summaryRow}>
        <TouchableOpacity style={[styles.summaryCard, activeTab === 'TODOS' && styles.summaryCardActive]} onPress={() => setActiveTab('TODOS')}>
          <Text style={[styles.summaryCount, { color: Colors.GRAY_900_TEXTO1 }]}>{atletas.length}</Text>
          <Text style={styles.summaryLabel}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.summaryCard, { borderColor: '#A7F3D0' }, activeTab === 'COMPLETO' && styles.summaryCardActive]} onPress={() => setActiveTab('COMPLETO')}>
          <CheckCircle size={20} color="#047857" />
          <Text style={[styles.summaryCount, { color: '#047857' }]}>{completos}</Text>
          <Text style={styles.summaryLabel}>Completos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.summaryCard, { borderColor: '#FDE68A' }, activeTab === 'INCOMPLETO' && styles.summaryCardActive]} onPress={() => setActiveTab('INCOMPLETO')}>
          <AlertTriangle size={20} color="#B45309" />
          <Text style={[styles.summaryCount, { color: '#B45309' }]}>{incompletos}</Text>
          <Text style={styles.summaryLabel}>Incompletos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.summaryCard, { borderColor: '#FECACA' }, activeTab === 'EM_FALTA' && styles.summaryCardActive]} onPress={() => setActiveTab('EM_FALTA')}>
          <XCircle size={20} color="#991B1B" />
          <Text style={[styles.summaryCount, { color: '#991B1B' }]}>{emFalta}</Text>
          <Text style={styles.summaryLabel}>Em Falta</Text>
        </TouchableOpacity>
      </View>

      {/* Pesquisa */}
      <View style={styles.searchWrapper}>
        <Search size={18} color={Colors.GRAY_500_TEXTO2} style={{ marginLeft: 12 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar atleta por nome..."
          value={pesquisa}
          onChangeText={setPesquisa}
        />
      </View>

      {/* Lista */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.GRAY_900_TEXTO1} style={{ marginTop: 48 }} />
        ) : isError ? (
          <View style={styles.emptyState}>
            <XCircle size={48} color={Colors.GRAY_200_BORDAS} />
            <Text style={styles.emptyTitle}>Erro ao carregar atletas</Text>
          </View>
        ) : atletasFiltrados.length === 0 ? (
          <View style={styles.emptyState}>
            <FileCheck size={48} color={Colors.GRAY_200_BORDAS} />
            <Text style={styles.emptyTitle}>Nenhum atleta encontrado</Text>
            <Text style={styles.emptySubtitle}>Experimente ajustar a pesquisa.</Text>
          </View>
        ) : (
          atletasFiltrados.map(atleta => {
            const estado = calcularEstadoDocumental(atleta);
            const badge = getBadgeConfig(estado);

            return (
              <View key={atleta.id} style={styles.card}>
                {/* Cabeçalho do card */}
                <View style={styles.cardHeader}>
                  <View style={styles.avatarMini}>
                    <User size={16} color={Colors.GRAY_500_TEXTO2} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.atletaNome}>{atleta.nomeCompleto}</Text>
                    <Text style={styles.atletaMeta}>
                      {atleta.equipaNome ?? 'Sem equipa'}
                      {atleta.numeroSocio ? ` · Sócio nº ${atleta.numeroSocio}` : ' · Sem nº de sócio'}
                    </Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
                    <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
                  </View>
                </View>

                {/* Documentos esperados */}
                <View style={styles.docsRow}>
                  <DocItem label="Cartão de Cidadão" ok={!!atleta.nif} />
                  <DocItem label="Fotografia" ok={!!atleta.numeroSocio} />
                  <DocItem label="Comprovativo Morada" ok={estado === 'COMPLETO'} />
                </View>

                {/* Rodapé */}
                {estado !== 'COMPLETO' && (
                  <TouchableOpacity
                    style={styles.btnValidar}
                    onPress={() => handleMarcarValidado(atleta)}
                  >
                    <CheckCircle size={16} color={Colors.BRANCO} />
                    <Text style={styles.btnValidarText}>Marcar como Validado</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Toast de Feedback Visual */}
      {toast && (
        <View style={[styles.toastContainer, { backgroundColor: toast.type === 'success' ? '#047857' : '#991B1B' }]}>
          {toast.type === 'success' ? <CheckCircle size={20} color="#FFF" /> : <XCircle size={20} color="#FFF" />}
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      )}
    </View>
  );
}

// ── Sub-componente: item de documento ───────────────────

function DocItem({ label, ok }: { label: string; ok: boolean }) {
  return (
    <View style={docItemStyles.row}>
      {ok ? (
        <CheckCircle size={14} color="#047857" />
      ) : (
        <XCircle size={14} color="#991B1B" />
      )}
      <Text style={[docItemStyles.label, { color: ok ? '#047857' : '#991B1B' }]}>{label}</Text>
    </View>
  );
}

const docItemStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 16 },
  label: { fontSize: 12, fontWeight: '500' },
});

// ── Estilos ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.GRAY_50_FUNDO },

  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.BRANCO,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  summaryCardActive: {
    backgroundColor: Colors.BRANCO,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryCount: { fontSize: 22, fontWeight: '700' },
  summaryLabel: { fontSize: 11, color: Colors.GRAY_500_TEXTO2, fontWeight: '500' },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    backgroundColor: Colors.BRANCO,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
  },
  searchInput: {
    flex: 1,
    padding: 14,
    fontSize: 15,
    color: Colors.GRAY_900_TEXTO1,
    outlineStyle: 'none' as any,
  },

  list: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingBottom: 80 },

  card: {
    backgroundColor: Colors.BRANCO,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  avatarMini: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  atletaNome: { fontSize: 15, fontWeight: '700', color: Colors.GRAY_900_TEXTO1 },
  atletaMeta: { fontSize: 13, color: Colors.GRAY_500_TEXTO2, marginTop: 2 },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 11, fontWeight: '700' },

  docsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.GRAY_200_BORDAS,
    marginBottom: 12,
  },

  btnValidar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B2B5E',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  btnValidarText: { color: Colors.BRANCO, fontWeight: '600', fontSize: 14 },

  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 64 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: Colors.GRAY_900_TEXTO1, marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: Colors.GRAY_500_TEXTO2, marginTop: 8 },

  toastContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  toastText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
