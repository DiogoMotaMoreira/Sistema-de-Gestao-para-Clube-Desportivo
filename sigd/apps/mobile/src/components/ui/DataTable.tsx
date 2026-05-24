/**
 * DataTable — Tabela SaaS responsiva do SIGD
 *
 * DESIGN.md §3.5:
 * - PROIBIDO linhas verticais.
 * - Linhas horizontais separadoras: 1px #E2E8F0.
 * - Cabeçalho: background #F8FAFC, texto UPPERCASE 12px, Gray 500.
 * - Linhas com efeito de hover (web): background #F8FAFC.
 *
 * DESIGN.md §5.1 (Mobile):
 * - Tabelas clássicas → Cards verticais empilhados (Label: Valor).
 * - Scroll horizontal PROIBIDO.
 *
 * Platform.select: tabela em web, lista de Cards em mobile.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { Colors } from '@/constants/colors';

// ── Tipos ──────────────────────────────────────────────

interface Column<T> {
  key: string;
  title: string;
  /** Render customizado para a célula */
  render?: (item: T) => React.ReactNode;
  /** Largura flex relativa (default: 1) */
  flex?: number;
  /** Alinhamento do texto */
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  style?: ViewStyle;
}

// ── Tabela Desktop (Web) ───────────────────────────────

function DesktopTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage,
  style,
}: DataTableProps<T>): React.JSX.Element {
  return (
    <View style={[tableStyles.container, style]}>
      {/* Header */}
      <View style={tableStyles.headerRow}>
        {columns.map((col) => (
          <View
            key={col.key}
            style={[
              tableStyles.headerCell,
              { flex: col.flex ?? 1 },
              col.align === 'right' && tableStyles.alignRight,
              col.align === 'center' && tableStyles.alignCenter,
            ]}
          >
            <Text style={tableStyles.headerText}>{col.title}</Text>
          </View>
        ))}
      </View>

      {/* Rows */}
      {data.length === 0 ? (
        <View style={tableStyles.emptyRow}>
          <Text style={tableStyles.emptyText}>
            {emptyMessage ?? 'Sem dados para apresentar.'}
          </Text>
        </View>
      ) : (
        data.map((item) => (
          <DesktopRow
            key={keyExtractor(item)}
            item={item}
            columns={columns}
          />
        ))
      )}
    </View>
  );
}

function DesktopRow<T>({
  item,
  columns,
}: {
  item: T;
  columns: Column<T>[];
}): React.JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[
        tableStyles.dataRow,
        isHovered && tableStyles.dataRowHover,
      ]}
      accessibilityRole="none"
    >
      {columns.map((col) => {
        const cellContent = col.render
          ? col.render(item)
          : String((item as Record<string, unknown>)[col.key] ?? '');

        return (
          <View
            key={col.key}
            style={[
              tableStyles.dataCell,
              { flex: col.flex ?? 1 },
              col.align === 'right' && tableStyles.alignRight,
              col.align === 'center' && tableStyles.alignCenter,
            ]}
          >
            {typeof cellContent === 'string' ? (
              <Text style={tableStyles.cellText}>{cellContent}</Text>
            ) : (
              cellContent
            )}
          </View>
        );
      })}
    </Pressable>
  );
}

// ── Cards Mobile ───────────────────────────────────────

function MobileCards<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage,
  style,
}: DataTableProps<T>): React.JSX.Element {
  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      style={style}
      contentContainerStyle={mobileStyles.listContent}
      ListEmptyComponent={
        <View style={mobileStyles.emptyContainer}>
          <Text style={mobileStyles.emptyText}>
            {emptyMessage ?? 'Sem dados para apresentar.'}
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={mobileStyles.card}>
          {columns.map((col) => {
            const cellContent = col.render
              ? col.render(item)
              : String((item as Record<string, unknown>)[col.key] ?? '');

            return (
              <View key={col.key} style={mobileStyles.cardRow}>
                <Text style={mobileStyles.cardLabel}>{col.title}</Text>
                {typeof cellContent === 'string' ? (
                  <Text style={mobileStyles.cardValue}>{cellContent}</Text>
                ) : (
                  <View style={mobileStyles.cardValueContainer}>{cellContent}</View>
                )}
              </View>
            );
          })}
        </View>
      )}
    />
  );
}

// ── Componente Principal ───────────────────────────────

export function DataTable<T>(props: DataTableProps<T>): React.JSX.Element {
  if (Platform.OS === 'web') {
    return <DesktopTable {...props} />;
  }
  return <MobileCards {...props} />;
}

// ── Estilos Desktop ────────────────────────────────────

const tableStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BRANCO,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: Colors.GRAY_50_FUNDO,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerCell: {
    paddingHorizontal: 8,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.GRAY_500_TEXTO2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dataRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
  },
  dataRowHover: {
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  dataCell: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 14,
    color: Colors.GRAY_900_TEXTO1,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  alignCenter: {
    alignItems: 'center',
  },
  emptyRow: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.GRAY_500_TEXTO2,
    fontStyle: 'italic',
  },
});

// ── Estilos Mobile ─────────────────────────────────────

const mobileStyles = StyleSheet.create({
  listContent: {
    gap: 8,
  },
  card: {
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 12,
    padding: 16,
    // Sombra suave
    shadowColor: Colors.PRETO_PRIMARIO,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.GRAY_500_TEXTO2,
    textTransform: 'uppercase',
    flex: 1,
  },
  cardValue: {
    fontSize: 14,
    color: Colors.GRAY_900_TEXTO1,
    flex: 1,
    textAlign: 'right',
  },
  cardValueContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.GRAY_500_TEXTO2,
    fontStyle: 'italic',
  },
});
