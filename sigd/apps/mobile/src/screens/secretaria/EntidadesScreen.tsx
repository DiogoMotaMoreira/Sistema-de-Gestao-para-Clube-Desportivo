/**
 * EntidadesScreen — Gestão de Entidades (Secretaria)
 *
 * Tabs: Atletas | Encarregados | Equipas
 * Dados reais via secretariaService (Axios).
 * Pesquisa debounced em cada tab.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  UserCheck,
  Building2,
  Search,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Mail,
  Hash,
  Trophy,
} from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import {
  secretariaService,
  type AtletaResponse,
  type EncarregadoResponse,
  type EquipaResponse,
} from '../../services/secretariaService';

// ── Tipos ────────────────────────────────────────────────

type ActiveTab = 'atletas' | 'encarregados' | 'equipas';

const ESTADO_BADGE: Record<string, 'success' | 'error' | 'warning' | 'info' | 'neutral'> = {
  APTO: 'success',
  INAPTO: 'error',
  PENDENTE_EMD: 'warning',
  BLOQUEADO: 'error',
  CONDICIONADO: 'warning',
};

// ── Subcomponent: SearchBar ──────────────────────────────

function SearchBar({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}): React.JSX.Element {
  return (
    <View style={s.searchRow}>
      <Search size={16} color={Colors.GRAY_500_TEXTO2} />
      <TextInput
        style={s.searchInput}
        placeholder={placeholder}
        placeholderTextColor={Colors.GRAY_500_TEXTO2}
        value={value}
        onChangeText={onChange}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel={placeholder}
      />
    </View>
  );
}

// ── Subcomponent: Tab Atletas ────────────────────────────

function TabAtletas(): React.JSX.Element {
  const [pesquisa, setPesquisa] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(0);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((query: string) => {
    setPesquisa(query);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(0);
    }, 300);
  }, []);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['entidades-atletas', debouncedQuery, page],
    queryFn: () =>
      secretariaService.getAtletas(debouncedQuery || undefined, undefined, page, 15),
  });

  const atletas = data?.content ?? [];

  return (
    <View style={s.tabContent}>
      <SearchBar
        placeholder="Pesquisar atleta por nome..."
        value={pesquisa}
        onChange={handleSearch}
      />

      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={Colors.DOURADO_CTA} />
        </View>
      ) : isError ? (
        <View style={s.center}>
          <Text style={s.errorText}>Erro ao carregar atletas.</Text>
          <TouchableOpacity onPress={() => void refetch()} style={s.retryBtn}>
            <Text style={s.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : atletas.length === 0 ? (
        <View style={s.center}>
          <UserCheck size={48} color={Colors.GRAY_200_BORDAS} />
          <Text style={s.emptyTitle}>Sem resultados</Text>
          <Text style={s.emptySubtitle}>
            {debouncedQuery
              ? `Nenhum atleta encontrado para "${debouncedQuery}".`
              : 'Nenhum atleta registado.'}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={s.list}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
        >
          {atletas.map((a: AtletaResponse) => (
            <View key={a.id} style={s.card}>
              <View style={s.cardAvatar}>
                <Text style={s.avatarText}>
                  {a.nomeCompleto.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={s.cardBody}>
                <Text style={s.cardName}>{a.nomeCompleto}</Text>
                <View style={s.cardMeta}>
                  <View style={s.metaItem}>
                    <Trophy size={12} color={Colors.GRAY_500_TEXTO2} />
                    <Text style={s.metaText}>{a.equipaNome ?? 'Sem equipa'}</Text>
                  </View>
                  {a.posicao ? (
                    <View style={s.metaItem}>
                      <UserCircle size={12} color={Colors.GRAY_500_TEXTO2} />
                      <Text style={s.metaText}>{a.posicao}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <Badge
                variant={ESTADO_BADGE[a.estadoElegibilidade] ?? 'neutral'}
                label={a.estadoElegibilidade}
              />
            </View>
          ))}

          {/* Paginação */}
          {(data?.totalPages ?? 0) > 1 && (
            <View style={s.pagination}>
              <TouchableOpacity
                style={[s.pageBtn, data?.first && s.pageBtnDisabled]}
                onPress={() => setPage((p) => Math.max(0, p - 1))}
                disabled={data?.first}
                accessibilityLabel="Página anterior"
              >
                <ChevronLeft
                  size={16}
                  color={data?.first ? Colors.GRAY_200_BORDAS : Colors.GRAY_900_TEXTO1}
                />
              </TouchableOpacity>
              <Text style={s.pageInfo}>
                {(data?.number ?? 0) + 1} / {data?.totalPages ?? 1}
              </Text>
              <TouchableOpacity
                style={[s.pageBtn, data?.last && s.pageBtnDisabled]}
                onPress={() => setPage((p) => p + 1)}
                disabled={data?.last}
                accessibilityLabel="Próxima página"
              >
                <ChevronRight
                  size={16}
                  color={data?.last ? Colors.GRAY_200_BORDAS : Colors.GRAY_900_TEXTO1}
                />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

// ── Subcomponent: Tab Encarregados ───────────────────────

function TabEncarregados(): React.JSX.Element {
  const [pesquisa, setPesquisa] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(0);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((query: string) => {
    setPesquisa(query);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(0);
    }, 300);
  }, []);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['entidades-ee', debouncedQuery, page],
    queryFn: () =>
      secretariaService.getEncarregados(debouncedQuery || undefined, page, 15),
  });

  const ees = data?.content ?? [];

  return (
    <View style={s.tabContent}>
      <SearchBar
        placeholder="Pesquisar por nome ou NIF..."
        value={pesquisa}
        onChange={handleSearch}
      />

      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={Colors.DOURADO_CTA} />
        </View>
      ) : isError ? (
        <View style={s.center}>
          <Text style={s.errorText}>Erro ao carregar encarregados.</Text>
          <TouchableOpacity onPress={() => void refetch()} style={s.retryBtn}>
            <Text style={s.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : ees.length === 0 ? (
        <View style={s.center}>
          <Users size={48} color={Colors.GRAY_200_BORDAS} />
          <Text style={s.emptyTitle}>Sem resultados</Text>
          <Text style={s.emptySubtitle}>
            {debouncedQuery
              ? `Nenhum encarregado encontrado para "${debouncedQuery}".`
              : 'Nenhum encarregado registado.'}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={s.list}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
        >
          {ees.map((ee: EncarregadoResponse) => (
            <View key={ee.id} style={s.card}>
              <View style={[s.cardAvatar, s.avatarEE]}>
                <Text style={s.avatarText}>
                  {ee.nome.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={s.cardBody}>
                <Text style={s.cardName}>{ee.nome}</Text>
                <View style={s.cardMeta}>
                  {ee.nif ? (
                    <View style={s.metaItem}>
                      <Hash size={12} color={Colors.GRAY_500_TEXTO2} />
                      <Text style={s.metaText}>{ee.nif}</Text>
                    </View>
                  ) : null}
                  {ee.email ? (
                    <View style={s.metaItem}>
                      <Mail size={12} color={Colors.GRAY_500_TEXTO2} />
                      <Text style={s.metaText} numberOfLines={1}>
                        {ee.email}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <Badge variant="info" label="EE" />
            </View>
          ))}

          {(data?.totalPages ?? 0) > 1 && (
            <View style={s.pagination}>
              <TouchableOpacity
                style={[s.pageBtn, data?.first && s.pageBtnDisabled]}
                onPress={() => setPage((p) => Math.max(0, p - 1))}
                disabled={data?.first}
                accessibilityLabel="Página anterior"
              >
                <ChevronLeft
                  size={16}
                  color={data?.first ? Colors.GRAY_200_BORDAS : Colors.GRAY_900_TEXTO1}
                />
              </TouchableOpacity>
              <Text style={s.pageInfo}>
                {(data?.number ?? 0) + 1} / {data?.totalPages ?? 1}
              </Text>
              <TouchableOpacity
                style={[s.pageBtn, data?.last && s.pageBtnDisabled]}
                onPress={() => setPage((p) => p + 1)}
                disabled={data?.last}
                accessibilityLabel="Próxima página"
              >
                <ChevronRight
                  size={16}
                  color={data?.last ? Colors.GRAY_200_BORDAS : Colors.GRAY_900_TEXTO1}
                />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

// ── Subcomponent: Tab Equipas ────────────────────────────

function TabEquipas(): React.JSX.Element {
  const [pesquisa, setPesquisa] = useState('');

  const { data: equipas = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['entidades-equipas'],
    queryFn: () => secretariaService.getEquipas(),
  });

  const filtered = pesquisa.trim()
    ? equipas.filter((e) =>
        e.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
        (e.escalaoDesignacao ?? '').toLowerCase().includes(pesquisa.toLowerCase())
      )
    : equipas;

  return (
    <View style={s.tabContent}>
      <SearchBar
        placeholder="Pesquisar equipa..."
        value={pesquisa}
        onChange={setPesquisa}
      />

      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={Colors.DOURADO_CTA} />
        </View>
      ) : isError ? (
        <View style={s.center}>
          <Text style={s.errorText}>Erro ao carregar equipas.</Text>
          <TouchableOpacity onPress={() => void refetch()} style={s.retryBtn}>
            <Text style={s.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : filtered.length === 0 ? (
        <View style={s.center}>
          <Building2 size={48} color={Colors.GRAY_200_BORDAS} />
          <Text style={s.emptyTitle}>Sem equipas</Text>
          <Text style={s.emptySubtitle}>
            {pesquisa
              ? `Nenhuma equipa encontrada para "${pesquisa}".`
              : 'Nenhuma equipa registada.'}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={s.list}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filtered.map((eq: EquipaResponse) => (
            <View key={eq.id} style={s.card}>
              <View style={[s.cardAvatar, s.avatarEquipa]}>
                <Building2 size={20} color={Colors.BRANCO} />
              </View>
              <View style={s.cardBody}>
                <Text style={s.cardName}>{eq.nome}</Text>
                <View style={s.cardMeta}>
                  <View style={s.metaItem}>
                    <Trophy size={12} color={Colors.GRAY_500_TEXTO2} />
                    <Text style={s.metaText}>
                      {eq.escalaoDesignacao ?? 'Sem escalão'}
                      {eq.modalidadeNome ? ` · ${eq.modalidadeNome}` : ''}
                    </Text>
                  </View>
                  <View style={s.metaItem}>
                    <Users size={12} color={Colors.GRAY_500_TEXTO2} />
                    <Text style={s.metaText}>{eq.totalAtletas} atleta(s)</Text>
                  </View>
                </View>
              </View>
              <Badge
                variant={eq.ativa ? 'success' : 'neutral'}
                label={eq.ativa ? 'Ativa' : 'Inativa'}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// ── Main Screen ──────────────────────────────────────────

const TABS: { key: ActiveTab; label: string; icon: typeof Users }[] = [
  { key: 'atletas', label: 'Atletas', icon: UserCheck },
  { key: 'encarregados', label: 'Encarregados', icon: Users },
  { key: 'equipas', label: 'Equipas', icon: Building2 },
];

export function EntidadesScreen(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<ActiveTab>('atletas');

  return (
    <View style={s.container}>
      <PageHeader
        title="Gestão de Entidades"
        breadcrumbs={[
          { label: 'Secretaria' },
          { label: 'Gestão de Entidades' },
        ]}
      />

      {/* Tab Bar */}
      <View style={s.tabBar}>
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = activeTab === key;
          return (
            <TouchableOpacity
              key={key}
              style={[s.tab, active && s.tabActive]}
              onPress={() => setActiveTab(key)}
              accessibilityRole="tab"
              accessibilityLabel={label}
              accessibilityState={{ selected: active }}
            >
              <Icon
                size={16}
                color={active ? Colors.DOURADO_CTA : Colors.GRAY_500_TEXTO2}
              />
              <Text style={[s.tabLabel, active && s.tabLabelActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab Content */}
      {activeTab === 'atletas' && <TabAtletas />}
      {activeTab === 'encarregados' && <TabEncarregados />}
      {activeTab === 'equipas' && <TabEquipas />}
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.BRANCO,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
    paddingHorizontal: 24,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.DOURADO_CTA,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.GRAY_500_TEXTO2,
  },
  tabLabelActive: {
    color: Colors.GRAY_900_TEXTO1,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    paddingTop: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 24,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.GRAY_900_TEXTO1,
    padding: 0,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  cardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.GRAY_900_TEXTO1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarEE: {
    backgroundColor: '#1D4ED8',
  },
  avatarEquipa: {
    backgroundColor: '#047857',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.BRANCO,
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.GRAY_900_TEXTO1,
  },
  cardMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: Colors.ERRO_TEXT,
  },
  retryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
  },
  retryText: {
    fontSize: 13,
    color: Colors.GRAY_900_TEXTO1,
    fontWeight: '500',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.GRAY_500_TEXTO2,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.GRAY_500_TEXTO2,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  pageBtn: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    backgroundColor: Colors.BRANCO,
  },
  pageBtnDisabled: {
    opacity: 0.4,
  },
  pageInfo: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.GRAY_500_TEXTO2,
  },
});
