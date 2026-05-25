import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search, ChevronRight, Users } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { treinadorService, AtletaPlantel, SemaforoClinico } from '@/services/treinadorService';
import { SemaforoBadge } from './components/SemaforoBadge';

export function PlantelScreen({ navigation }: any): React.JSX.Element {
  const [plantel, setPlantel] = useState<AtletaPlantel[]>([]);
  const [filterType, setFilterType] = useState<'TODOS' | 'INAPTOS'>('TODOS');
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: isSearching ? () => (
        <TextInput
          style={styles.headerSearchInput}
          placeholder="Pesquisar atleta..."
          value={search}
          onChangeText={setSearch}
          autoFocus
        />
      ) : 'Plantel',
      headerRight: () => (
        <TouchableOpacity style={styles.headerSearchBtn} onPress={() => setIsSearching(!isSearching)}>
          <Search size={24} color={Colors.GRAY_900_TEXTO1} />
        </TouchableOpacity>
      )
    });
  }, [navigation, isSearching, search]);

  useEffect(() => {
    const equipaId = 1;
    Promise.all([
      treinadorService.getPlantel(equipaId),
      treinadorService.getSemaforoPlantel(equipaId)
    ]).then(([plantelData, semaforoData]) => {
      const semaforoMap = new Map(semaforoData.map(s => [s.atletaId, s.semaforo]));
      const plantelComSemaforo = plantelData.map(atleta => {
        const semaforoReal = semaforoMap.get(atleta.id);
        
        let semaforoMapeado: SemaforoClinico = 'APTO';
        if (semaforoReal === 'AMARELO') semaforoMapeado = 'CONDICIONADO';
        else if (semaforoReal === 'VERMELHO') semaforoMapeado = 'INAPTO_EMD';
        else if (semaforoReal === 'BLOQUEADO') semaforoMapeado = 'INAPTO_LESAO';
        
        return {
          ...atleta,
          semaforo: semaforoMapeado
        };
      });
      setPlantel(plantelComSemaforo);
    }).catch(err => {
      console.error('Erro ao carregar plantel com semáforo:', err);
    });
  }, []);

  const atletasFiltrados = plantel.filter(a => {
    if (filterType === 'INAPTOS' && a.semaforo === 'APTO') return false;
    if (search && !a.nome.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const inaptosCount = plantel.filter(a => a.semaforo !== 'APTO').length;

  const navigateToPerfil = (atletaId: number) => {
    navigation.navigate('PerfilAtleta', { atletaId });
  };

  return (
    <View style={styles.container}>
      {/* Toggle Group */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleBtn, filterType === 'TODOS' && styles.toggleBtnActive]}
          onPress={() => setFilterType('TODOS')}
        >
          <Text style={[styles.toggleText, filterType === 'TODOS' && styles.toggleTextActive]}>Todos [{plantel.length}]</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleBtn, filterType === 'INAPTOS' && styles.toggleBtnActive]}
          onPress={() => setFilterType('INAPTOS')}
        >
          <Text style={[styles.toggleText, filterType === 'INAPTOS' && styles.toggleTextActive]}>Inaptos [{inaptosCount}]</Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {atletasFiltrados.length === 0 ? (
          <View style={styles.emptyState}>
            <Users size={64} color={Colors.GRAY_200_BORDAS} opacity={0.5} />
            <Text style={styles.emptyTitle}>Plantel vazio</Text>
            <Text style={styles.emptySub}>A Direção Técnica ainda não alocou atletas.</Text>
          </View>
        ) : (
          atletasFiltrados.map(atleta => {
            const isInapto = atleta.semaforo.startsWith('INAPTO');
            return (
              <TouchableOpacity 
                key={atleta.id} 
                style={[styles.card, isInapto && styles.cardInapto]}
                onPress={() => navigateToPerfil(atleta.id)}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{atleta.nome.charAt(0)}</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.atletaNome}>{atleta.nome}</Text>
                  <Text style={styles.atletaPos}>{atleta.posicao} · {atleta.idade} anos</Text>
                  <Text style={styles.atletaStats}>
                    Méd. treinos: {atleta.mediaAvaliacao?.toFixed(1) || '—'} · Assiduidade: {atleta.assiduidade ? `${atleta.assiduidade}%` : '—'}
                  </Text>
                </View>
                <View style={styles.cardRight}>
                  <SemaforoBadge estado={atleta.semaforo} size="sm" />
                  <ChevronRight size={16} color={Colors.GRAY_200_BORDAS} style={{ marginLeft: 8 }} />
                </View>
              </TouchableOpacity>
            );
          })
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
  headerSearchBtn: {
    paddingRight: 16,
  },
  headerSearchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.GRAY_900_TEXTO1,
    height: '100%',
  },
  toggleContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  toggleBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    backgroundColor: 'transparent',
    height: 36,
    justifyContent: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  toggleText: {
    fontSize: 13,
    color: '#0F172A',
  },
  toggleTextActive: {
    color: Colors.BRANCO,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 72,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardInapto: {
    opacity: 0.7,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.GRAY_200_BORDAS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.GRAY_500_TEXTO2,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  atletaNome: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  atletaPos: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 2,
  },
  atletaStats: {
    fontSize: 11,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 4,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 16,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 16,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 4,
  },
});
