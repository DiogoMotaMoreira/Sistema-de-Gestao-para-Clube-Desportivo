/**
 * EquipaListScreen — Lista de Equipas ativas.
 *
 * Apresenta equipas com escalão, modalidade e nº atletas.
 * Botão CTA para criar nova equipa.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Shield, Plus } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { SearchInput } from '@/components/ui/SearchInput';
import { DataTable } from '@/components/ui/DataTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { secretariaService, type EquipaResponse } from '@/services/secretariaService';
import { EquipaForm } from './EquipaCreateScreen';

export function EquipaListScreen(): React.JSX.Element {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pesquisa, setPesquisa] = useState('');
  const [modalidadeFilter, setModalidadeFilter] = useState('Todas');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['equipas'],
    queryFn: () => secretariaService.getEquipas(),
  });

  const handleCreateSuccess = useCallback(() => {
    setShowCreateModal(false);
    void refetch();
  }, [refetch]);

  const handleSearch = useCallback((query: string) => {
    setPesquisa(query);
  }, []);

  const modalidades = data ? Array.from(new Set(data.map(e => e.modalidadeNome).filter(Boolean))) : [];
  
  const filteredData = data?.filter(e => {
    const matchesSearch = !pesquisa || e.nome.toLowerCase().includes(pesquisa.toLowerCase());
    const matchesModalidade = modalidadeFilter === 'Todas' || e.modalidadeNome === modalidadeFilter;
    return matchesSearch && matchesModalidade;
  });

  const columns = [
    {
      key: 'nome',
      title: 'EQUIPA',
      flex: 2,
      render: (item: EquipaResponse) => (
        <Text style={textStyles.name}>{item.nome}</Text>
      ),
    },
    {
      key: 'escalao',
      title: 'ESCALÃO',
      flex: 1.5,
      render: (item: EquipaResponse) => (
        <Text style={textStyles.cell}>{item.escalaoDesignacao ?? '—'}</Text>
      ),
    },
    {
      key: 'modalidade',
      title: 'MODALIDADE',
      flex: 1.5,
      render: (item: EquipaResponse) => (
        <Text style={textStyles.cell}>{item.modalidadeNome ?? '—'}</Text>
      ),
    },
    {
      key: 'totalAtletas',
      title: 'ATLETAS',
      flex: 0.8,
      align: 'center' as const,
      render: (item: EquipaResponse) => (
        <Badge
          variant="neutral"
          label={String(item.totalAtletas)}
        />
      ),
    },
    {
      key: 'ativa',
      title: 'ESTADO',
      flex: 0.8,
      align: 'center' as const,
      render: (item: EquipaResponse) => (
        <Badge
          variant={item.ativa ? 'success' : 'error'}
          label={item.ativa ? 'Ativa' : 'Inativa'}
        />
      ),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Equipas</Text>
          <Text style={styles.subtitle}>
            {data ? `${data.length} equipa(s) ativa(s)` : 'A carregar...'}
          </Text>
        </View>
        <Button
          label="Nova Equipa"
          onPress={() => setShowCreateModal(true)}
          variant="primary"
          icon={<Plus size={18} color={Colors.PRETO_PRIMARIO} />}
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={{ flex: 1 }}>
          <SearchInput
            placeholder="Pesquisar equipa..."
            onSearch={handleSearch}
          />
        </View>
        {modalidades.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.togglesContainer}>
            <TouchableOpacity
              style={[styles.toggleBtn, modalidadeFilter === 'Todas' && styles.toggleBtnActive]}
              onPress={() => setModalidadeFilter('Todas')}
            >
              <Text style={[styles.toggleText, modalidadeFilter === 'Todas' && styles.toggleTextActive]}>Todas</Text>
            </TouchableOpacity>
            {modalidades.map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.toggleBtn, modalidadeFilter === m && styles.toggleBtnActive]}
                onPress={() => setModalidadeFilter(m as string)}
              >
                <Text style={[styles.toggleText, modalidadeFilter === m && styles.toggleTextActive]}>{m as string}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        {(pesquisa || modalidadeFilter !== 'Todas') && (
          <TouchableOpacity 
            onPress={() => {
              handleSearch('');
              setModalidadeFilter('Todas');
            }}
            style={styles.limparBtn}
          >
            <Text style={styles.limparText}>✕ Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={Colors.DOURADO_CTA} />
            <Text style={styles.loadingText}>A carregar equipas...</Text>
          </View>
        ) : isError ? (
          <View style={styles.centerBox}>
            <Text style={styles.errorText}>Erro ao carregar dados.</Text>
            <Button label="Tentar novamente" onPress={() => void refetch()} variant="secondary" />
          </View>
        ) : data && data.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredData || []}
            keyExtractor={(item) => String(item.id)}
          />
        ) : (
          <EmptyState
            icon={Shield}
            title="Sem equipas"
            subtitle="Crie a primeira equipa para organizar os atletas por escalão."
            ctaLabel="Criar Equipa"
            onCtaPress={() => setShowCreateModal(true)}
          />
        )}
      </ScrollView>

      {/* Create Modal */}
      <Modal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nova Equipa"
      >
        <EquipaForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.GRAY_50_FUNDO },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '700', color: Colors.GRAY_900_TEXTO1 },
  subtitle: { fontSize: 13, color: Colors.GRAY_500_TEXTO2, marginTop: 2 },
  filtersContainer: { paddingHorizontal: 24, marginBottom: 16, gap: 12 },
  togglesContainer: { flexDirection: 'row', gap: 8, marginTop: 8 },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: Colors.GRAY_100_HOVER, borderWidth: 1, borderColor: 'transparent' },
  toggleBtnActive: { backgroundColor: Colors.DOURADO_CTA + '20', borderColor: Colors.DOURADO_CTA },
  toggleText: { fontSize: 12, color: Colors.GRAY_500_TEXTO2, fontWeight: '500' },
  toggleTextActive: { color: Colors.DOURADO_CTA, fontWeight: '700' },
  limparBtn: { paddingHorizontal: 12, paddingVertical: 6, justifyContent: 'center', alignSelf: 'flex-start' },
  limparText: { fontSize: 12, color: Colors.GRAY_500_TEXTO2, fontWeight: '500' },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 32 },
  centerBox: { alignItems: 'center', paddingVertical: 64, gap: 12 },
  loadingText: { fontSize: 14, color: Colors.GRAY_500_TEXTO2 },
  errorText: { fontSize: 14, color: Colors.ERRO_TEXT },
});

const textStyles = StyleSheet.create({
  name: { fontSize: 14, fontWeight: '600', color: Colors.GRAY_900_TEXTO1 },
  cell: { fontSize: 14, color: Colors.GRAY_900_TEXTO1 },
});
