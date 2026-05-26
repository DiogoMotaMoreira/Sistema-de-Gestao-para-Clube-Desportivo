/**
 * EncarregadoListScreen — Lista de Encarregados de Educação
 *
 * Pesquisa debounced por nome/NIF, paginação, empty state,
 * botão CTA para criar novo EE, e navegação para detalhe.
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
import { Users, Plus, ChevronLeft, ChevronRight, Eye } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { SearchInput } from '@/components/ui/SearchInput';
import { DataTable } from '@/components/ui/DataTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { secretariaService, type EncarregadoResponse } from '@/services/secretariaService';
import { EncarregadoForm } from './EncarregadoCreateEditScreen';
import { SortableHeader, SortConfig } from '@/components/ui/SortableHeader';
import { sortList } from '@/utils/sort';

interface EncarregadoListScreenProps {
  onSelectEncarregado?: (id: number) => void;
}

export function EncarregadoListScreen({
  onSelectEncarregado,
}: EncarregadoListScreenProps): React.JSX.Element {
  const [pesquisa, setPesquisa] = useState('');
  const [page, setPage] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const handleSort = useCallback((field: string) => {
    setSortConfig(prev => {
      if (prev?.field === field) {
        return prev.direction === 'asc' ? { field, direction: 'desc' } : null;
      }
      return { field, direction: 'asc' };
    });
  }, []);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['encarregados', pesquisa, page],
    queryFn: () => secretariaService.getEncarregados(pesquisa || undefined, page, 10),
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
      key: 'nome',
      title: <SortableHeader label="NOME" field="nome" sortConfig={sortConfig} onSort={handleSort} />,
      flex: 2,
      render: (item: EncarregadoResponse) => (
        <Text style={tableTextStyles.name}>{item.nome}</Text>
      ),
    },
    {
      key: 'nif',
      title: <SortableHeader label="NIF" field="nif" sortConfig={sortConfig} onSort={handleSort} />,
      flex: 1,
      render: (item: EncarregadoResponse) => (
        <Text style={tableTextStyles.cell}>{item.nif ?? '—'}</Text>
      ),
    },
    {
      key: 'email',
      title: <SortableHeader label="EMAIL" field="email" sortConfig={sortConfig} onSort={handleSort} />,
      flex: 2,
      render: (item: EncarregadoResponse) => (
        <Text style={tableTextStyles.cell}>{item.email ?? '—'}</Text>
      ),
    },
    {
      key: 'telemovel',
      title: 'TELEMÓVEL',
      flex: 1,
      render: (item: EncarregadoResponse) => (
        <Text style={tableTextStyles.cell}>{item.telemovel ?? '—'}</Text>
      ),
    },
    {
      key: 'acoes',
      title: 'AÇÕES',
      flex: 0.5,
      align: 'center' as const,
      render: (item: EncarregadoResponse) => (
        <TouchableOpacity
          onPress={() => onSelectEncarregado?.(item.id)}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          accessibilityLabel={`Ver detalhes de ${item.nome}`}
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
          <Text style={styles.title}>Encarregados de Educação</Text>
          <Text style={styles.subtitle}>
            {data ? `${data.totalElements} registo(s)` : 'A carregar...'}
          </Text>
        </View>
        <Button
          label="Novo EE"
          onPress={() => setShowCreateModal(true)}
          variant="primary"
          icon={<Plus size={18} color={Colors.PRETO_PRIMARIO} />}
        />
      </View>

      {/* Search */}
      <View style={styles.filtersContainer}>
        <View style={{ flex: 1 }}>
          <SearchInput
            placeholder="Pesquisar por nome ou NIF..."
            onSearch={handleSearch}
          />
        </View>
        {pesquisa ? (
          <TouchableOpacity 
            onPress={() => {
              handleSearch('');
              setSortConfig(null);
              setPage(0);
            }}
            style={styles.limparBtn}
          >
            <Text style={styles.limparText}>✕ Limpar</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.DOURADO_CTA} />
            <Text style={styles.loadingText}>A carregar encarregados...</Text>
          </View>
        ) : isError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Erro ao carregar dados.</Text>
            <Button label="Tentar novamente" onPress={() => void refetch()} variant="secondary" />
          </View>
        ) : data && data.content.length > 0 ? (
          <>
            <DataTable
              columns={columns}
              data={sortList(data.content, sortConfig)}
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
            icon={Users}
            title="Sem encarregados"
            subtitle="Adicione o primeiro encarregado de educação para começar."
            ctaLabel="Adicionar Encarregado"
            onCtaPress={() => setShowCreateModal(true)}
          />
        )}
      </ScrollView>

      {/* Create Modal */}
      <Modal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Novo Encarregado de Educação"
      >
        <EncarregadoForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 2,
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  limparBtn: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  limparText: {
    fontSize: 13,
    color: Colors.GRAY_500_TEXTO2,
    fontWeight: '500',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 64,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.GRAY_500_TEXTO2,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 64,
    gap: 16,
  },
  errorText: {
    fontSize: 14,
    color: Colors.ERRO_TEXT,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 16,
  },
  pageInfo: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.GRAY_500_TEXTO2,
  },
});

const tableTextStyles = StyleSheet.create({
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.GRAY_900_TEXTO1,
  },
  cell: {
    fontSize: 14,
    color: Colors.GRAY_900_TEXTO1,
  },
});
