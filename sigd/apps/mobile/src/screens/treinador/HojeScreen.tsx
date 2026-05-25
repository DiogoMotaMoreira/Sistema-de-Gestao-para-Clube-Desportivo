import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AlertTriangle, ChevronRight, Dumbbell, Activity, Trophy, Clock, CheckCircle, AlertCircle, CalendarCheck, ClipboardCheck, Star, ClipboardList, User, XCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/stores/authStore';
import { treinadorService, EventoTreinador, EquipaTreinador } from '@/services/treinadorService';

const formatarData = (dataStr?: string) => {
  if (!dataStr) return '';
  const parts = dataStr.split('-');
  if (parts.length !== 3) return dataStr;
  const [ano, mes, dia] = parts;
  return `${dia}/${mes}/${ano}`;
};

export function HojeScreen({ navigation }: any): React.JSX.Element {
  const user = useAuthStore(s => s.user);
  const [equipas, setEquipas] = useState<EquipaTreinador[]>([]);
  const [activeEquipa, setActiveEquipa] = useState<EquipaTreinador | null>(null);
  const [eventos, setEventos] = useState<EventoTreinador[]>([]);

  useEffect(() => {
    // Top Bar Customization
    navigation.setOptions({
      title: `Bom dia, ${user?.name?.split(' ')[0] || 'Treinador'}`,
      headerRight: () => (
        <TouchableOpacity style={styles.headerAvatar} onPress={() => navigation.navigate('Eu')}>
          <User size={20} color={Colors.GRAY_900_TEXTO1} />
        </TouchableOpacity>
      ),
    });

    // Fetch Initial Data
    treinadorService.getEquipas().then(eq => {
      setEquipas(eq);
      if (eq.length > 0) setActiveEquipa(eq[0]);
    });
  }, [navigation, user]);

  useEffect(() => {
    if (activeEquipa) {
      treinadorService.getEventosHoje(activeEquipa.id).then(setEventos);
    }
  }, [activeEquipa]);

  const temConvocatoriaPendente = eventos.some(e => e.tipo === 'JOGO' && (e.subEstadoJogo === 'FUTURO_SEM_CONVOCATORIA' || e.subEstadoJogo === 'FUTURO_RASCUNHO'));

  const handleTreinoAction = (evento: EventoTreinador) => {
    if (evento.subEstadoTreino === 'CHAMADA_PENDENTE' || evento.subEstadoTreino === 'CHAMADA_CURSO') {
      navigation.navigate('Chamada', { eventoId: evento.id });
    } else if (evento.subEstadoTreino === 'AVALIACAO_PENDENTE') {
      navigation.navigate('AvaliacaoSessao', { eventoId: evento.id });
    }
  };

  const renderEventCard = (evento: EventoTreinador) => {
    if (evento.isSessao) {
      const isAvaliacao = evento.subEstadoTreino === 'AVALIACAO_PENDENTE';
      return (
        <View key={evento.id} style={[styles.card, { borderLeftColor: '#047857' }]}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.badgePill, { backgroundColor: '#ECFDF5' }]}>
              <Dumbbell size={12} color="#047857" />
              <Text style={[styles.badgeText, { color: '#047857' }]}>{(evento.tipo || 'SESSÃO').toUpperCase()} HOJE</Text>
            </View>
            <Text style={styles.cardTime}>{evento.hora || '17:00'}</Text>
          </View>
          <Text style={styles.cardSubTitle}>{evento.local} · {evento.equipaNome}</Text>
          <TouchableOpacity 
            style={[styles.btnFull, isAvaliacao && styles.btnAvaliacao]} 
            onPress={() => handleTreinoAction(evento)}
          >
            {isAvaliacao ? <Star size={18} color={Colors.PRETO_PRIMARIO} /> : <ClipboardCheck size={18} color={Colors.PRETO_PRIMARIO} />}
            <Text style={styles.btnFullText}>{isAvaliacao ? 'Avaliar Sessão' : 'Iniciar Chamada'}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (evento.tipo === 'JOGO') {
      const isFichaPendente = evento.subEstadoJogo === 'PASSADO_FICHA_PENDENTE';
      
      if (isFichaPendente) {
        return (
          <View key={evento.id} style={[styles.card, { borderLeftColor: '#991B1B', borderColor: '#991B1B' }]}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.badgePill, { backgroundColor: '#FEE2E2' }]}>
                <AlertCircle size={12} color="#991B1B" />
                <Text style={[styles.badgeText, { color: '#991B1B' }]}>FICHA PENDENTE</Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>{evento.adversario}</Text>
            <Text style={styles.cardSubTitle}>{formatarData(evento.data)} · {evento.hora}</Text>
            <TouchableOpacity style={styles.btnErro} onPress={() => navigation.navigate('FichaJogoFlow', { eventoId: evento.id })}>
              <ClipboardList size={18} color={Colors.BRANCO} />
              <Text style={styles.btnErroText}>Preencher Ficha de Jogo</Text>
            </TouchableOpacity>
          </View>
        );
      }

      // Futuro Jogo
      return (
        <View key={evento.id} style={[styles.card, { borderLeftColor: '#1D4ED8' }]}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.badgePill, { backgroundColor: '#EFF6FF' }]}>
              <Trophy size={12} color="#1D4ED8" />
              <Text style={[styles.badgeText, { color: '#1D4ED8' }]}>JOGO</Text>
            </View>
            <Text style={[styles.cardTime, { color: '#1D4ED8' }]}>{formatarData(evento.data)}</Text>
          </View>
          <Text style={styles.cardTitle}>{evento.adversario}</Text>
          <Text style={styles.cardSubTitle}>{evento.quadroCompetitivo} · {evento.local} · {evento.casaFora}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 4 }}>
            <XCircle size={12} color="#991B1B" />
            <Text style={{ fontSize: 12, color: '#991B1B' }}>Convocatória: Não criada</Text>
          </View>
          <TouchableOpacity style={[styles.btnFull, { marginTop: 16 }]} onPress={() => navigation.navigate('DetalheJogo', { eventoId: evento.id })}>
            <Text style={styles.btnFullText}>Criar Convocatória</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Equipas Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.equipasContainer}>
        {equipas.map(eq => (
          <TouchableOpacity 
            key={eq.id} 
            style={[styles.equipaPill, activeEquipa?.id === eq.id && styles.equipaPillActive]}
            onPress={() => setActiveEquipa(eq)}
          >
            <Text style={[styles.equipaPillText, activeEquipa?.id === eq.id && styles.equipaPillTextActive]}>
              {eq.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Alerta Persistente */}
      {temConvocatoriaPendente && (
        <TouchableOpacity style={styles.alertaConvocatoria} onPress={() => navigation.navigate('Jogos')}>
          <AlertTriangle size={16} color="#B45309" />
          <View style={styles.alertaContent}>
            <Text style={styles.alertaTitle}>Convocatória por publicar</Text>
            <Text style={styles.alertaSubTitle}>FC Rival — Sábado às 15:00</Text>
          </View>
          <ChevronRight size={16} color="#B45309" />
        </TouchableOpacity>
      )}

      {/* Cartões */}
      <View style={styles.cardsContainer}>
        {eventos.length === 0 ? (
          <View style={styles.emptyState}>
            <CalendarCheck size={48} color={Colors.GRAY_200_BORDAS} />
            <Text style={styles.emptyTitle}>Sem eventos para hoje</Text>
            <Text style={styles.emptySub}>Próximo evento: Jogo — Sábado, 15/06</Text>
          </View>
        ) : (
          eventos.map(renderEventCard)
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  content: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 80, // Safe area Bottom Nav
  },
  headerAvatar: {
    marginRight: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.GRAY_200_BORDAS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equipasContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  equipaPill: {
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  equipaPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  equipaPillText: {
    fontSize: 12,
    color: '#0F172A',
  },
  equipaPillTextActive: {
    color: '#F1C40F',
    fontWeight: '600',
  },
  alertaConvocatoria: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#B45309',
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  alertaContent: {
    flex: 1,
    marginLeft: 12,
  },
  alertaTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B45309',
  },
  alertaSubTitle: {
    fontSize: 12,
    color: '#B45309',
  },
  cardsContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 16,
    // Sombra suave (React Native / Web)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardTime: {
    fontSize: 16,
    fontWeight: '700',
    color: '#047857',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
    marginBottom: 4,
  },
  cardSubTitle: {
    fontSize: 13,
    color: Colors.GRAY_500_TEXTO2,
  },
  btnFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.DOURADO_CTA,
    height: 48,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  btnFullText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.PRETO_PRIMARIO,
  },
  btnAvaliacao: {
    backgroundColor: Colors.DOURADO_CTA,
  },
  btnErro: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#991B1B',
    height: 52,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  btnErroText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.BRANCO,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    backgroundColor: Colors.BRANCO,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 16,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 4,
  },
});
