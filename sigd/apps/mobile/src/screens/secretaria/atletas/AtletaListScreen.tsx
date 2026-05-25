/**
 * AtletaListScreen — Lista de Atletas
 *
 * Pesquisa debounced, filtro por equipa, paginação, empty state,
 * botão CTA para criar, navegação para detalhe.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { UserCheck, Plus, ChevronLeft, ChevronRight, Eye } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { SearchInput } from '@/components/ui/SearchInput';
import { DataTable } from '@/components/ui/DataTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { secretariaService, type AtletaResponse } from '@/services/secretariaService';
import { AtletaForm } from './AtletaCreateEditScreen';

const ESTADO_BADGE_MAP: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
  APTO: 'success',
  INAPTO: 'error',
  PENDENTE_EMD: 'warning',
  BLOQUEADO_FINANCEIRO: 'error',
};

interface AtletaListScreenProps {
  onSelectAtleta?: (id: number) => void;
}

export function AtletaListScreen({
  onSelectAtleta,
}: AtletaListScreenProps): React.JSX.Element {
  const [pesquisa, setPesquisa] = useState('');
  const [page, setPage] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['atletas', pesquisa, page],
    queryFn: () => secretariaService.getAtletas(pesquisa || undefined, undefined, page, 10),
  });

  const handleSearch = useCallback((query: string) => {
    setPesquisa(query);
    setPage(0);
  }, []);

  const handleCreateSuccess = useCallback(() => {
    setShowCreateModal(false);
    void refetch();
  }, [refetch]);

  const columns = [
    {
      key: 'nomeCompleto',
      title: 'NOME',
      flex: 2,
      render: (item: AtletaResponse) => (
        <Text style={textStyles.name}>{item.nomeCompleto}</Text>
      ),
    },
    {
      key: 'dataNascimento',
      title: 'DATA NASC.',
      flex: 1,
      render: (item: AtletaResponse) => (
        <Text style={textStyles.cell}>{item.dataNascimento}</Text>
      ),
    },
    {
      key: 'equipaNome',
      title: 'EQUIPA',
      flex: 1.5,
      render: (item: AtletaResponse) => (
        <Text style={textStyles.cell}>{item.equipaNome ?? 'Sem equipa'}</Text>
      ),
    },
    {
      key: 'estadoElegibilidade',
      title: 'ESTADO',
      flex: 1,
      align: 'center' as const,
      render: (item: AtletaResponse) => (
        <Badge
          variant={ESTADO_BADGE_MAP[item.estadoElegibilidade] ?? 'neutral'}
          label={item.estadoElegibilidade}
        />
      ),
    },
    {
      key: 'encarregadoNome',
      title: 'ENCARREGADO',
      flex: 1.5,
      render: (item: AtletaResponse) => (
        <Text style={textStyles.cell}>{item.encarregadoNome}</Text>
      ),
    },
    {
      key: 'acoes',
      title: 'AÇÕES',
      flex: 0.5,
      align: 'center' as const,
      render: (item: AtletaResponse) => (
        <TouchableOpacity
          onPress={() => onSelectAtleta?.(item.id)}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          accessibilityLabel={`Ver detalhes de ${item.nomeCompleto}`}
          accessibilityRole="button"
        >
          <Eye size={18} color={Colors.INFO_TEXT} />
        </TouchableOpacity>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Atletas</Text>
          <Text style={styles.subtitle}>
            {data ? `${data.totalElements} registo(s)` : 'A carregar...'}
          </Text>
        </View>
        <Button
          label="Novo Atleta"
          onPress={() => setShowCreateModal(true)}
          variant="primary"
          icon={<Plus size={18} color={Colors.PRETO_PRIMARIO} />}
        />
      </View>

      {/* Search */}
      <SearchInput
        placeholder="Pesquisar por nome..."
        onSearch={handleSearch}
        style={styles.searchInput}
      />

      {/* Content */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={Colors.DOURADO_CTA} />
            <Text style={styles.loadingText}>A carregar atletas...</Text>
          </View>
        ) : isError ? (
          <View style={styles.centerBox}>
            <Text style={styles.errorText}>Erro ao carregar dados.</Text>
            <Button label="Tentar novamente" onPress={() => void refetch()} variant="secondary" />
          </View>
        ) : data && data.content.length > 0 ? (
          <>
            <DataTable
              columns={columns}
              data={data.content}
              keyExtractor={(item) => String(item.id)}
            />

            {/* Pagination */}
            <View style={styles.pagination}>
              <Button
                label="Anterior"
                onPress={() => setPage((p) => Math.max(0, p - 1))}
                disabled={data.first}
                variant="secondary"
                icon={<ChevronLeft size={18} color={data.first ? Colors.GRAY_200_BORDAS : Colors.GRAY_900_TEXTO1} />}
              />
              <Text style={styles.pageInfo}>
                Página {data.number + 1} de {Math.max(1, data.totalPages)}
              </Text>
              <Button
                label="Próxima"
                onPress={() => setPage((p) => p + 1)}
                disabled={data.last}
                variant="secondary"
                icon={<ChevronRight size={18} color={data.last ? Colors.GRAY_200_BORDAS : Colors.GRAY_900_TEXTO1} />}
              />
            </View>
          </>
        ) : (
          <EmptyState
            icon={UserCheck}
            title="Sem atletas"
            subtitle="Adicione o primeiro atleta para começar a gestão desportiva."
            ctaLabel="Adicionar Atleta"
            onCtaPress={() => setShowCreateModal(true)}
          />
        )}
      </ScrollView>

      {/* Create Modal */}
      <Modal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Novo Atleta"
      >
        <AtletaForm
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
  searchInput: { marginHorizontal: 24, marginBottom: 16 },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 32 },
  centerBox: { alignItems: 'center', paddingVertical: 64, gap: 12 },
  loadingText: { fontSize: 14, color: Colors.GRAY_500_TEXTO2 },
  errorText: { fontSize: 14, color: Colors.ERRO_TEXT },
  pagination: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginTop: 16, gap: 16,
  },
  pageInfo: { fontSize: 13, fontWeight: '500', color: Colors.GRAY_500_TEXTO2 },
});

const textStyles = StyleSheet.create({
  name: { fontSize: 14, fontWeight: '600', color: Colors.GRAY_900_TEXTO1 },
  cell: { fontSize: 14, color: Colors.GRAY_900_TEXTO1 },
});
