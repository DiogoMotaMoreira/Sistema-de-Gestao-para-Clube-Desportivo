import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ShieldCheck, Dumbbell, Trophy, AlertTriangle, Upload, XCircle, FileEdit } from 'lucide-react-native';
import { PortalHeader } from './components/PortalHeader';
import { portalService, AlertaPortal, Dependente, EventoPortal } from '@/services/portalService';

export function InicioScreen({ navigation }: any): React.JSX.Element {
  const [dependente, setDependente] = useState<Dependente | null>(null);
  const [alertas, setAlertas] = useState<AlertaPortal[]>([]);
  const [proximoEvento, setProximoEvento] = useState<EventoPortal | null>(null);

  useEffect(() => {
    if (dependente) {
      portalService.getAlertas(dependente.id).then(setAlertas);
      portalService.getEventos(dependente.id, false).then(eventos => {
        if (eventos.length > 0) setProximoEvento(eventos[0]);
        else setProximoEvento(null);
      });
    }
  }, [dependente]);

  return (
    <View style={styles.container}>
      <PortalHeader onDependenteChange={setDependente} />

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 16, gap: 16 }}>
        
        {/* Renderizar Alertas */}
        {alertas.map(alerta => {
          if (alerta.tipo === 'JUSTIFICACAO_PENDENTE') {
            return (
              <View key={alerta.id} style={[styles.cardAlert, { borderLeftColor: '#EA580C' }]}>
                 <View style={[styles.badgePill, { backgroundColor: '#FFF7ED' }]}>
                    <AlertTriangle size={12} color="#EA580C" />
                    <Text style={[styles.badgePillText, { color: '#EA580C' }]}>JUSTIFICAÇÃO PENDENTE</Text>
                 </View>
                 <Text style={styles.cardTitle}>{alerta.titulo}</Text>
                 <Text style={[styles.cardSub, { color: '#B45309' }]}>{alerta.subtitulo}</Text>
                 <TouchableOpacity style={[styles.btnFull, { backgroundColor: '#EA580C' }]} onPress={() => navigation.navigate('Agenda')}>
                    <FileEdit size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.btnFullText}>Justificar Agora</Text>
                 </TouchableOpacity>
              </View>
            );
          }
          if (alerta.tipo === 'DOCUMENTO_REJEITADO') {
            return (
              <View key={alerta.id} style={[styles.cardAlert, { borderLeftColor: '#991B1B', borderColor: '#FEE2E2' }]}>
                 <View style={[styles.badgePill, { backgroundColor: '#FEE2E2' }]}>
                    <XCircle size={12} color="#991B1B" />
                    <Text style={[styles.badgePillText, { color: '#991B1B' }]}>DOCUMENTO REJEITADO</Text>
                 </View>
                 <Text style={styles.cardTitle}>{alerta.titulo}</Text>
                 <Text style={[styles.cardSub, { color: '#991B1B', fontStyle: 'italic' }]}>{alerta.subtitulo}</Text>
                 <TouchableOpacity style={[styles.btnFullOutline, { borderColor: '#991B1B' }]} onPress={() => navigation.navigate('Docs')}>
                    <Upload size={18} color="#991B1B" style={{ marginRight: 8 }} />
                    <Text style={[styles.btnFullText, { color: '#991B1B' }]}>Submeter Novo Documento</Text>
                 </TouchableOpacity>
              </View>
            );
          }
          return null;
        })}

        {/* Card de Próximo Evento */}
        {proximoEvento ? (
           <View style={[styles.cardAlert, { borderLeftColor: proximoEvento.tipo === 'JOGO' ? '#1D4ED8' : '#047857' }]}>
              {proximoEvento.tipo === 'TREINO' ? (
                <>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <View style={[styles.badgePill, { backgroundColor: '#ECFDF5', marginBottom: 0 }]}>
                      <Dumbbell size={12} color="#047857" />
                      <Text style={[styles.badgePillText, { color: '#047857' }]}>TREINO</Text>
                    </View>
                    <Text style={{ fontSize: 13, color: '#047857', fontWeight: '700' }}>{new Date(proximoEvento.dataHora).toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>
                  <Text style={styles.cardSub}>{proximoEvento.instalacao} · {dependente?.equipa}</Text>
                </>
              ) : (
                <>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <View style={[styles.badgePill, { backgroundColor: '#EFF6FF', marginBottom: 0 }]}>
                      <Trophy size={12} color="#1D4ED8" />
                      <Text style={[styles.badgePillText, { color: '#1D4ED8' }]}>JOGO OFICIAL</Text>
                    </View>
                    <Text style={{ fontSize: 13, color: '#1D4ED8', fontWeight: '700' }}>{new Date(proximoEvento.dataHora).toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>
                  <Text style={[styles.cardTitle, { fontSize: 16 }]}>vs {proximoEvento.adversario}</Text>
                  <Text style={styles.cardSub}>{proximoEvento.quadro} · {proximoEvento.instalacao} · {proximoEvento.condicao}</Text>
                  <Text style={styles.cardSub}>Concentração: {proximoEvento.horaConcentracao} · {proximoEvento.localConcentracao}</Text>
                  {proximoEvento.isConvocado && (
                    <View style={[styles.badgePill, { backgroundColor: '#ECFDF5', marginTop: 12 }]}>
                       <ShieldCheck size={14} color="#047857" />
                       <Text style={{ fontSize: 14, color: '#047857', fontWeight: '700', marginLeft: 4 }}>{dependente?.nome} está CONVOCADO</Text>
                    </View>
                  )}
                  <TouchableOpacity style={[styles.btnFullOutline, { borderColor: '#1D4ED8', marginTop: 12 }]} onPress={() => navigation.navigate('Agenda')}>
                     <Text style={[styles.btnFullText, { color: '#1D4ED8' }]}>Ver Convocatória</Text>
                  </TouchableOpacity>
                </>
              )}
           </View>
        ) : (
           <View style={[styles.cardAlert, { borderLeftColor: '#047857' }]}>
              <ShieldCheck size={32} color="#047857" style={{ opacity: 0.8, marginBottom: 12 }} />
              <Text style={[styles.cardTitle, { color: '#047857', fontSize: 16 }]}>Tudo em ordem!</Text>
              <Text style={styles.cardSub}>{dependente?.nome} · Apto · Documentação válida</Text>
              <Text style={styles.cardSub}>Sem eventos agendados para breve.</Text>
           </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { flex: 1 },
  cardAlert: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  cardSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  btnFull: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  btnFullText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  btnFullOutline: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
});
