import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Search, ChevronLeft, Check, User, Calendar, CreditCard, Banknote, Smartphone } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { secretariaService, EncarregadoResponse, ObrigacaoResponse } from '../../services/secretariaService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';

type ViewState = 'SEARCH' | 'PROFILE' | 'CHECKOUT';

export function AtendimentoScreen(): React.JSX.Element {
  const [view, setView] = useState<ViewState>('SEARCH');
  const [pesquisa, setPesquisa] = useState('');
  const [debouncedPesquisa, setDebouncedPesquisa] = useState('');
  const [selectedEE, setSelectedEE] = useState<EncarregadoResponse | null>(null);
  
  const [selectedObrigacoes, setSelectedObrigacoes] = useState<number[]>([]);
  const [metodoPagamento, setMetodoPagamento] = useState<'NUMERARIO' | 'MULTIBANCO' | 'MBWAY'>('NUMERARIO');

  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedPesquisa(pesquisa), 300);
    return () => clearTimeout(timer);
  }, [pesquisa]);

  const { data: searchData, isLoading: isSearchLoading } = useQuery({
    queryKey: ['atendimentoEE', debouncedPesquisa],
    queryFn: () => secretariaService.getEncarregados(debouncedPesquisa, 0, 10),
  });

  const { data: obrigacoes, isLoading: isObrigacoesLoading } = useQuery({
    queryKey: ['obrigacoesEE', selectedEE?.id],
    queryFn: () => selectedEE ? secretariaService.getObrigacoesEncarregado(selectedEE.id) : Promise.resolve([]),
    enabled: !!selectedEE && (view === 'PROFILE' || view === 'CHECKOUT'),
  });

  const pendentes = obrigacoes?.filter(o => o.estado !== 'PAGO') || [];

  const pagarMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      for (const id of ids) {
        await secretariaService.registarPagamento(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obrigacoesEE', selectedEE?.id] });
      Alert.alert('Sucesso', 'Pagamento registado com sucesso!');
      setView('SEARCH');
      setSelectedEE(null);
      setSelectedObrigacoes([]);
    },
    onError: () => Alert.alert('Erro', 'Ocorreu um erro ao registar os pagamentos.')
  });

  const handleSelectEE = (ee: EncarregadoResponse) => {
    setSelectedEE(ee);
    setView('PROFILE');
  };

  const toggleObrigacao = (id: number) => {
    setSelectedObrigacoes(prev => 
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
  };

  const total = pendentes
    .filter(o => selectedObrigacoes.includes(o.id))
    .reduce((acc, curr) => acc + curr.valor, 0);

  const getBadgeStyle = (estado: string) => {
    if (estado === 'PAGO') return { bg: '#ECFDF5', text: '#047857' };
    if (estado === 'EM_ATRASO') return { bg: '#FEE2E2', text: '#991B1B' };
    return { bg: '#FEF3C7', text: '#B45309' };
  };

  return (
    <View style={styles.container}>
      {view === 'SEARCH' && (
        <PageHeader title="Atendimento ao Balcão" breadcrumbs={[{ label: 'Secretaria' }, { label: 'Atendimento' }]} />
      )}
      {view === 'PROFILE' && selectedEE && (
        <PageHeader 
          title={selectedEE.nome} 
          breadcrumbs={[
            { label: 'Secretaria' }, 
            { label: 'Atendimento' },
            { label: selectedEE.nome }
          ]} 
        />
      )}
      {view === 'CHECKOUT' && selectedEE && (
        <PageHeader 
          title="Nova Liquidação" 
          breadcrumbs={[
            { label: 'Atendimento' }, 
            { label: selectedEE.nome },
            { label: 'Checkout' }
          ]} 
        />
      )}

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* VISTA SEARCH */}
        {view === 'SEARCH' && (
          <View>
            <View style={styles.searchWrapper}>
              <Search size={20} color={Colors.GRAY_500_TEXTO2} style={{ marginLeft: 12 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar por NIF, nome ou e-mail do Encarregado..."
                value={pesquisa}
                onChangeText={setPesquisa}
              />
            </View>

            {isSearchLoading ? (
              <ActivityIndicator size="large" color={Colors.GRAY_900_TEXTO1} style={{ marginTop: 32 }} />
            ) : (
              <View style={{ marginTop: 24 }}>
                {searchData?.content.map(ee => (
                  <TouchableOpacity key={ee.id} style={styles.card} onPress={() => handleSelectEE(ee)}>
                    <View style={styles.avatarMini}><User size={16} color={Colors.GRAY_500_TEXTO2} /></View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.nome}>{ee.nome}</Text>
                      <Text style={styles.meta}>NIF: {ee.nif} • {ee.email}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
                {searchData?.content.length === 0 && (
                  <Text style={{ textAlign: 'center', marginTop: 32, color: Colors.GRAY_500_TEXTO2 }}>Nenhum encarregado encontrado.</Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* VISTA PROFILE */}
        {view === 'PROFILE' && selectedEE && (
          <View>
            <TouchableOpacity onPress={() => setView('SEARCH')} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <ChevronLeft size={20} color={Colors.GRAY_500_TEXTO2} />
              <Text style={{ color: Colors.GRAY_500_TEXTO2, marginLeft: 4 }}>Voltar à Pesquisa</Text>
            </TouchableOpacity>

            <View style={[styles.card, { marginBottom: 24, padding: 24 }]}>
              <Text style={styles.sectionTitle}>Dados do Encarregado</Text>
              <Text style={styles.metaLabel}>Nome: <Text style={styles.metaValue}>{selectedEE.nome}</Text></Text>
              <Text style={styles.metaLabel}>NIF: <Text style={styles.metaValue}>{selectedEE.nif}</Text></Text>
              <Text style={styles.metaLabel}>Contacto: <Text style={styles.metaValue}>{selectedEE.telemovel}</Text></Text>
              <Text style={styles.metaLabel}>Email: <Text style={styles.metaValue}>{selectedEE.email}</Text></Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={styles.sectionTitle}>Obrigações Financeiras</Text>
              <TouchableOpacity 
                style={[styles.btnPrimary, pendentes.length === 0 && { opacity: 0.5 }]} 
                onPress={() => setView('CHECKOUT')}
                disabled={pendentes.length === 0}
              >
                <Text style={styles.btnPrimaryText}>Ir para Pagamento</Text>
              </TouchableOpacity>
            </View>

            {isObrigacoesLoading ? (
              <ActivityIndicator size="large" color={Colors.GRAY_900_TEXTO1} />
            ) : (
              obrigacoes?.map(ob => {
                const badge = getBadgeStyle(ob.estado);
                return (
                  <View key={ob.id} style={styles.card}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.obTitle}>{ob.tipo}{ob.atletaNome ? ` — ${ob.atletaNome}` : ''}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 12 }}>
                        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                          <Text style={[styles.badgeText, { color: badge.text }]}>{ob.estado}</Text>
                        </View>
                        <Text style={styles.obValidade}>Vence a: {ob.dataVencimento}</Text>
                      </View>
                    </View>
                    <Text style={styles.obValor}>{ob.valor.toFixed(2)}€</Text>
                  </View>
                );
              })
            )}
            {obrigacoes?.length === 0 && (
              <Text style={{ textAlign: 'center', marginTop: 32, color: Colors.GRAY_500_TEXTO2 }}>Nenhuma obrigação encontrada.</Text>
            )}
          </View>
        )}

        {/* VISTA CHECKOUT */}
        {view === 'CHECKOUT' && selectedEE && (
          <View>
            <TouchableOpacity onPress={() => setView('PROFILE')} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <ChevronLeft size={20} color={Colors.GRAY_500_TEXTO2} />
              <Text style={{ color: Colors.GRAY_500_TEXTO2, marginLeft: 4 }}>Voltar ao Perfil</Text>
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Selecione as obrigações a liquidar</Text>
            {pendentes.map(ob => (
              <TouchableOpacity 
                key={ob.id} 
                style={[styles.card, { flexDirection: 'row', alignItems: 'center' }, selectedObrigacoes.includes(ob.id) && { borderColor: '#1D4ED8', backgroundColor: '#EFF6FF' }]}
                onPress={() => toggleObrigacao(ob.id)}
              >
                <View style={[styles.checkbox, selectedObrigacoes.includes(ob.id) && styles.checkboxSelected]}>
                  {selectedObrigacoes.includes(ob.id) && <Check size={16} color={Colors.BRANCO} />}
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={styles.obTitle}>{ob.tipo}{ob.atletaNome ? ` — ${ob.atletaNome}` : ''}</Text>
                  <Text style={styles.obValidade}>Vence a: {ob.dataVencimento}</Text>
                </View>
                <Text style={styles.obValor}>{ob.valor.toFixed(2)}€</Text>
              </TouchableOpacity>
            ))}

            <Text style={[styles.sectionTitle, { marginTop: 32, marginBottom: 16 }]}>Método de Pagamento</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity style={[styles.methodCard, metodoPagamento === 'NUMERARIO' && styles.methodCardSelected]} onPress={() => setMetodoPagamento('NUMERARIO')}>
                <Banknote size={24} color={metodoPagamento === 'NUMERARIO' ? '#1D4ED8' : Colors.GRAY_500_TEXTO2} />
                <Text style={[styles.methodText, metodoPagamento === 'NUMERARIO' && styles.methodTextSelected]}>Numerário</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.methodCard, metodoPagamento === 'MULTIBANCO' && styles.methodCardSelected]} onPress={() => setMetodoPagamento('MULTIBANCO')}>
                <CreditCard size={24} color={metodoPagamento === 'MULTIBANCO' ? '#1D4ED8' : Colors.GRAY_500_TEXTO2} />
                <Text style={[styles.methodText, metodoPagamento === 'MULTIBANCO' && styles.methodTextSelected]}>Multibanco</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.methodCard, metodoPagamento === 'MBWAY' && styles.methodCardSelected]} onPress={() => setMetodoPagamento('MBWAY')}>
                <Smartphone size={24} color={metodoPagamento === 'MBWAY' ? '#1D4ED8' : Colors.GRAY_500_TEXTO2} />
                <Text style={[styles.methodText, metodoPagamento === 'MBWAY' && styles.methodTextSelected]}>MBWay</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.checkoutFooter}>
              <View>
                <Text style={styles.totalLabel}>Total a liquidar</Text>
                <Text style={styles.totalValue}>{total.toFixed(2)}€</Text>
              </View>
              <TouchableOpacity 
                style={[styles.btnConfirm, selectedObrigacoes.length === 0 && { opacity: 0.5 }]} 
                onPress={() => pagarMutation.mutate(selectedObrigacoes)}
                disabled={selectedObrigacoes.length === 0 || pagarMutation.isPending}
              >
                {pagarMutation.isPending ? <ActivityIndicator color={Colors.BRANCO} /> : <Text style={styles.btnConfirmText}>Confirmar Pagamento</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.GRAY_50_FUNDO },
  content: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 80 },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.BRANCO, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 12 },
  searchInput: { flex: 1, padding: 16, fontSize: 16, outlineStyle: 'none' as any },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.BRANCO, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS },
  avatarMini: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  nome: { fontSize: 16, fontWeight: '600', color: Colors.GRAY_900_TEXTO1 },
  meta: { fontSize: 13, color: Colors.GRAY_500_TEXTO2, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.GRAY_900_TEXTO1, marginBottom: 16 },
  metaLabel: { fontSize: 14, color: Colors.GRAY_500_TEXTO2, marginBottom: 8 },
  metaValue: { fontWeight: '600', color: Colors.GRAY_900_TEXTO1 },
  btnPrimary: { backgroundColor: '#1B2B5E', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  btnPrimaryText: { color: Colors.BRANCO, fontWeight: '600', fontSize: 14 },
  obTitle: { fontSize: 15, fontWeight: '600', color: Colors.GRAY_900_TEXTO1 },
  obValidade: { fontSize: 13, color: Colors.GRAY_500_TEXTO2 },
  obValor: { fontSize: 18, fontWeight: '700', color: Colors.GRAY_900_TEXTO1 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: Colors.GRAY_200_BORDAS, alignItems: 'center', justifyContent: 'center' },
  checkboxSelected: { backgroundColor: '#1D4ED8', borderColor: '#1D4ED8' },
  methodCard: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.BRANCO, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 12, padding: 16, gap: 8 },
  methodCardSelected: { borderColor: '#1D4ED8', backgroundColor: '#EFF6FF' },
  methodText: { fontSize: 14, fontWeight: '500', color: Colors.GRAY_500_TEXTO2 },
  methodTextSelected: { color: '#1D4ED8', fontWeight: '700' },
  checkoutFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, padding: 24, backgroundColor: Colors.BRANCO, borderRadius: 12, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS },
  totalLabel: { fontSize: 14, color: Colors.GRAY_500_TEXTO2 },
  totalValue: { fontSize: 24, fontWeight: '700', color: Colors.GRAY_900_TEXTO1 },
  btnConfirm: { backgroundColor: '#047857', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 8 },
  btnConfirmText: { color: Colors.BRANCO, fontWeight: '700', fontSize: 16 }
});
