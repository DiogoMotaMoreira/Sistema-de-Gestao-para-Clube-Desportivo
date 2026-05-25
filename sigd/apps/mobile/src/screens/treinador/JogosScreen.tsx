import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar, ChevronRight, XCircle, Clock, CheckCircle, AlertCircle, CalendarX, Ban } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { treinadorService, EventoTreinador, SubEstadoJogo } from '@/services/treinadorService';

export function JogosScreen({ navigation }: any): React.JSX.Element {
  const [jogos, setJogos] = useState<EventoTreinador[]>([]);

  useEffect(() => {
    treinadorService.getJogos(1).then(setJogos);
  }, []);

  const renderCard = (jogo: EventoTreinador) => {
    const s = jogo.subEstadoJogo;

    if (s === 'FUTURO_SEM_CONVOCATORIA') {
      return (
        <TouchableOpacity key={jogo.id} style={[styles.card, styles.cardFuturo, { borderLeftColor: '#1D4ED8' }]} onPress={() => navigation.navigate('DetalheJogo', { eventoId: jogo.id })}>
          <View style={styles.cardHeader}>
            <View style={[styles.badge, { backgroundColor: '#EFF6FF' }]}>
              <Calendar size={12} color="#1D4ED8" />
              <Text style={[styles.badgeText, { color: '#1D4ED8' }]}>JOGO FUTURO</Text>
            </View>
            <Text style={[styles.cardTime, { color: '#1D4ED8' }]}>{new Date(jogo.dataHora).toLocaleDateString()} {new Date(jogo.dataHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
          </View>
          <Text style={styles.cardTitle}>{jogo.adversario}</Text>
          <Text style={styles.cardSub}>{jogo.quadroCompetitivo} · {jogo.local} · {jogo.casaFora}</Text>
          <View style={styles.cardFooter}>
            <XCircle size={12} color="#991B1B" />
            <Text style={[styles.footerText, { color: '#991B1B' }]}>Convocatória: Não criada</Text>
            <View style={{ flex: 1 }} />
            <ChevronRight size={16} color={Colors.GRAY_200_BORDAS} />
          </View>
        </TouchableOpacity>
      );
    }

    if (s === 'FUTURO_RASCUNHO') {
      return (
        <TouchableOpacity key={jogo.id} style={[styles.card, styles.cardFuturo, { borderLeftColor: '#B45309' }]} onPress={() => navigation.navigate('DetalheJogo', { eventoId: jogo.id })}>
          {/* ... similar to above but with rascunho status ... */}
          <View style={styles.cardHeader}>
            <View style={[styles.badge, { backgroundColor: '#EFF6FF' }]}>
              <Calendar size={12} color="#1D4ED8" />
              <Text style={[styles.badgeText, { color: '#1D4ED8' }]}>JOGO FUTURO</Text>
            </View>
            <Text style={[styles.cardTime, { color: '#1D4ED8' }]}>{new Date(jogo.dataHora).toLocaleDateString()} {new Date(jogo.dataHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
          </View>
          <Text style={styles.cardTitle}>{jogo.adversario}</Text>
          <Text style={styles.cardSub}>{jogo.quadroCompetitivo} · {jogo.local} · {jogo.casaFora}</Text>
          <View style={styles.cardFooter}>
            <Clock size={12} color="#B45309" />
            <Text style={[styles.footerText, { color: '#B45309' }]}>Convocatória: Rascunho guardado</Text>
            <View style={{ flex: 1 }} />
            <ChevronRight size={16} color={Colors.GRAY_200_BORDAS} />
          </View>
        </TouchableOpacity>
      );
    }

    if (s === 'PASSADO_FICHA_PENDENTE') {
      return (
        <TouchableOpacity key={jogo.id} style={[styles.card, styles.cardPendente, { borderLeftColor: '#991B1B' }]} onPress={() => navigation.navigate('DetalheJogo', { eventoId: jogo.id })}>
          <View style={styles.cardHeader}>
            <View style={[styles.badge, { backgroundColor: '#FEE2E2' }]}>
              <AlertCircle size={12} color="#991B1B" />
              <Text style={[styles.badgeText, { color: '#991B1B' }]}>FICHA PENDENTE</Text>
            </View>
            <Text style={[styles.cardTime, { color: '#991B1B' }]}>{new Date(jogo.dataHora).toLocaleDateString()} {new Date(jogo.dataHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
          </View>
          <Text style={styles.cardTitle}>{jogo.adversario}</Text>
          <Text style={styles.cardSub}>{jogo.quadroCompetitivo} · {jogo.local} · {jogo.casaFora}</Text>
          <View style={[styles.cardFooter, { marginTop: 12 }]}>
            <View style={styles.countdown}>
              <Clock size={14} color="#991B1B" />
              <Text style={styles.countdownText}>Expira em {jogo.expiraEmHoras}h</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    if (s === 'PASSADO_FICHA_SUBMETIDA') {
      return (
        <TouchableOpacity key={jogo.id} style={[styles.card, styles.cardSubmetida, { borderLeftColor: '#64748B' }]} onPress={() => navigation.navigate('DetalheJogo', { eventoId: jogo.id })}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTime, { color: Colors.GRAY_900_TEXTO1 }]}>{new Date(jogo.dataHora).toLocaleDateString()}</Text>
          </View>
          <Text style={styles.cardTitle}>{jogo.adversario}</Text>
          <Text style={styles.cardSub}>{jogo.quadroCompetitivo} · {jogo.local} · {jogo.casaFora}</Text>
          <View style={styles.cardFooter}>
            <CheckCircle size={12} color={Colors.GRAY_500_TEXTO2} />
            <Text style={[styles.footerText, { color: Colors.GRAY_500_TEXTO2 }]}>Ficha submetida</Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (s === 'PASSADO_EXPIRADO') {
      return (
        <View key={jogo.id} style={[styles.card, styles.cardExpirado, { borderLeftColor: Colors.GRAY_200_BORDAS }]}>
          <View style={styles.cardHeader}>
             <Text style={[styles.cardTime, { color: Colors.GRAY_500_TEXTO2 }]}>{new Date(jogo.dataHora).toLocaleDateString()}</Text>
          </View>
          <Text style={[styles.cardTitle, { color: Colors.GRAY_500_TEXTO2 }]}>{jogo.adversario}</Text>
          <Text style={styles.cardSub}>{jogo.quadroCompetitivo} · {jogo.local} · {jogo.casaFora}</Text>
          <View style={styles.cardFooter}>
            <Ban size={12} color="#991B1B" />
            <Text style={[styles.footerText, { color: '#991B1B' }]}>Prazo expirado — ficha não submetida</Text>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {jogos.length === 0 ? (
        <View style={styles.emptyState}>
          <CalendarX size={64} color={Colors.GRAY_200_BORDAS} opacity={0.5} />
          <Text style={styles.emptyTitle}>Sem jogos agendados</Text>
          <Text style={styles.emptySub}>Os jogos são agendados pela Direção Técnica.</Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>PRÓXIMOS JOGOS</Text>
          {jogos.filter(j => j.tipo === 'JOGO' && j.dataHora > new Date().toISOString()).map(renderCard)}
          
          <Text style={styles.sectionTitle}>JOGOS ANTERIORES</Text>
          {jogos.filter(j => j.tipo === 'JOGO' && j.dataHora <= new Date().toISOString()).map(renderCard)}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.GRAY_500_TEXTO2,
    textTransform: 'uppercase',
    paddingVertical: 12,
    marginTop: 8,
  },
  card: {
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardFuturo: {
    borderColor: Colors.GRAY_200_BORDAS,
  },
  cardPendente: {
    borderColor: '#991B1B',
  },
  cardSubmetida: {
    opacity: 0.85,
  },
  cardExpirado: {
    backgroundColor: Colors.GRAY_50_FUNDO,
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
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
    fontSize: 13,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  footerText: {
    fontSize: 12,
  },
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#991B1B',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  countdownText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991B1B',
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
