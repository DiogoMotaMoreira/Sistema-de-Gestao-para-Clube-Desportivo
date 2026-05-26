import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/colors';
import { treinadorService, EventoTreinador } from '@/services/treinadorService';
import { Users, ClipboardList } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { Alert } from 'react-native';

export function DetalheJogoScreen({ route, navigation }: any): React.JSX.Element {
  const { eventoId } = route.params;
  const [jogo, setJogo] = useState<EventoTreinador | null>(null);

  useEffect(() => {
    navigation.setOptions({ title: 'Detalhe do Jogo' });
    
    // Mock get jogo
    treinadorService.getJogos(1).then(jogos => {
      const j = jogos.find(x => x.id === eventoId);
      if (j) setJogo(j);
    });
  }, [eventoId, navigation]);

  if (!jogo) return <View style={styles.container} />;

  const s = jogo.subEstadoJogo;

  async function downloadPdf(convocatoriaId: number) {
    try {
      const token = useAuthStore.getState().token;
      const response = await fetch(
        `http://localhost:8080/api/v1/treinador/convocatorias/${convocatoriaId}/pdf`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (!response.ok) throw new Error('Erro ao gerar PDF');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o PDF');
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={{ padding: 16 }}>
        {/* Bloco de Info */}
        <View style={styles.infoCard}>
          <Text style={styles.adversario}>{jogo.adversario}</Text>
          <Text style={styles.dataHora}>
            {new Date(jogo.dataHora).toLocaleDateString()} · {new Date(jogo.dataHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Text>
          <Text style={styles.meta}>{jogo.local}</Text>
          <Text style={styles.meta}>{jogo.quadroCompetitivo}</Text>
        </View>
      </ScrollView>

      {/* Área de Ação Fixa */}
      <View style={styles.footer}>
        {s === 'FUTURO_SEM_CONVOCATORIA' && (
          <TouchableOpacity 
            style={styles.btnDourado} 
            onPress={() => navigation.navigate('ConvocatoriaFlow', { eventoId: jogo.id, equipaId: jogo.equipaId || 1 })}
          >
            <Users size={18} color="#000000" style={{ marginRight: 8 }} />
            <Text style={styles.btnDouradoText}>Criar Convocatória</Text>
          </TouchableOpacity>
        )}

        {s === 'FUTURO_RASCUNHO' && (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity style={[styles.btnOutline, { flex: 1, borderColor: '#991B1B' }]}>
               <Text style={{ color: '#991B1B', fontWeight: '600' }}>Descartar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.btnDourado, { flex: 1, height: 48 }]}
              onPress={() => navigation.navigate('ConvocatoriaFlow', { eventoId: jogo.id, equipaId: jogo.equipaId || 1 })}
            >
               <Text style={styles.btnDouradoText}>Continuar Rascunho</Text>
            </TouchableOpacity>
          </View>
        )}

        {s === 'FUTURO_PUBLICADA' && jogo.convocatoriaId && (
          <TouchableOpacity 
            style={styles.btnDourado} 
            onPress={() => downloadPdf(jogo.convocatoriaId!)}
          >
            <ClipboardList size={18} color="#000000" style={{ marginRight: 8 }} />
            <Text style={styles.btnDouradoText}>Descarregar PDF</Text>
          </TouchableOpacity>
        )}

        {s === 'PASSADO_FICHA_PENDENTE' && (
          <TouchableOpacity 
            style={styles.btnErro} 
            onPress={() => navigation.navigate('FichaJogoFlow', { eventoId: jogo.id })}
          >
            <ClipboardList size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.btnErroText}>Preencher Ficha de Jogo</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  content: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#1D4ED8',
    borderRadius: 12,
    padding: 16,
  },
  adversario: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  dataHora: {
    fontSize: 14,
    color: '#1D4ED8',
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: Colors.GRAY_500_TEXTO2,
    marginBottom: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.BRANCO,
    borderTopWidth: 1,
    borderTopColor: Colors.GRAY_200_BORDAS,
    padding: 16,
  },
  btnDourado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.DOURADO_CTA,
    height: 52,
    borderRadius: 12,
  },
  btnDouradoText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  btnOutline: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    height: 48,
    borderRadius: 12,
  },
  btnErro: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#991B1B',
    height: 52,
    borderRadius: 12,
  },
  btnErroText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
