import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Wifi, Lock, CreditCard, Upload, Archive, User } from 'lucide-react-native';
import { portalService, Dependente } from '@/services/portalService';
import { PortalHeader } from './components/PortalHeader';

export function CartaoScreen({ navigation }: any): React.JSX.Element {
  const [dependente, setDependente] = useState<Dependente | null>(null);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    // Simulador de Regeneração do QR Code
    if (dependente?.elegibilidade === 'APTO') {
      const interval = setInterval(() => {
        setCountdown(c => (c > 0 ? c - 1 : 60));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [dependente]);

  // Se não temos dependente, não mostramos nada
  if (!dependente) return (
     <View style={[styles.container, { paddingTop: 50 }]}>
        <PortalHeader onDependenteChange={setDependente} />
     </View>
  );

  return (
    <View style={styles.container}>
      {/* Header escondido para dar imersão, mas precisamos do switcher de dependente!
          Como PORTAL.md diz "Top App Bar: Ausente", podemos ter a UI full screen, 
          mas para mudar de dependente vou mostrar o header de forma simplificada no topo ou 
          apenas renderizar a identificação central. */}
      
      {/* Identificação Superior */}
      <View style={styles.headerArea}>
         <Text style={styles.logoText}>Boavista Futebol Clube</Text>
      </View>

      <View style={styles.identificacaoArea}>
         <View style={styles.avatarGrande}>
            <User size={48} color="#64748B" />
         </View>
         <Text style={styles.nomeAtleta}>{dependente.nome}</Text>
         <Text style={styles.escalaoAtleta}>{dependente.equipa}</Text>
         <Text style={styles.socioAtleta}>N.º de Sócio: {dependente.id * 10}</Text>
      </View>

      <View style={styles.separador} />

      {/* Áreas por Elegibilidade */}
      {dependente.elegibilidade === 'APTO' && (
         <View style={styles.conteudoCentral}>
            <View style={styles.qrArea}>
               {/* Mock do QR Code */}
               <View style={styles.qrMockPlaceholder}>
                  <Text style={{ fontSize: 10, color: '#64748B' }}>[ QR CODE ]</Text>
               </View>
            </View>

            <View style={styles.countdownContainer}>
               {/* Arco simulado */}
               <View style={styles.countdownCircle}>
                  <Text style={styles.countdownText}>{countdown}s</Text>
               </View>
            </View>

            <View style={styles.badgeAtivo}>
               <Wifi size={16} color="#047857" style={{ marginRight: 8 }} />
               <Text style={styles.badgeAtivoText}>ATIVO</Text>
            </View>
         </View>
      )}

      {dependente.elegibilidade === 'BLOQUEADO' && (
         <View style={styles.conteudoCentral}>
            <View style={[styles.qrArea, { borderColor: '#E2E8F0', borderStyle: 'dashed' }]}>
               <Lock size={48} color="#991B1B" style={{ marginBottom: 16 }} />
               <Text style={styles.bloqueadoTitle}>ACESSO</Text>
               <Text style={styles.bloqueadoTitle}>BLOQUEADO</Text>
            </View>

            <View style={styles.causasArea}>
               <Text style={styles.causasLabel}>POR RESOLVER:</Text>
               <View style={styles.causaItem}>
                  <View style={styles.causaPonto} />
                  <Text style={styles.causaTexto}>2 mensalidades vencidas há mais de 30 dias</Text>
               </View>
               <View style={styles.causaItem}>
                  <View style={styles.causaPonto} />
                  <Text style={styles.causaTexto}>EMD caducado</Text>
               </View>
               
               <View style={{ marginTop: 24, gap: 12 }}>
                  <TouchableOpacity style={styles.btnOutlineVermelho} onPress={() => navigation.navigate('Conta')}>
                     <CreditCard size={16} color="#991B1B" style={{ marginRight: 8 }} />
                     <Text style={styles.btnOutlineVermelhoText}>Ver Situação Financeira</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnOutlineVermelho} onPress={() => navigation.navigate('Docs')}>
                     <Upload size={16} color="#991B1B" style={{ marginRight: 8 }} />
                     <Text style={styles.btnOutlineVermelhoText}>Submeter Documento</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </View>
      )}

      {dependente.elegibilidade === 'VINCULO_ENCERRADO' && (
         <View style={styles.conteudoCentral}>
            <View style={[styles.qrArea, { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', borderStyle: 'dashed' }]}>
               <Archive size={48} color="#64748B" style={{ marginBottom: 16 }} />
               <Text style={[styles.bloqueadoTitle, { color: '#64748B' }]}>VÍNCULO</Text>
               <Text style={[styles.bloqueadoTitle, { color: '#64748B' }]}>ENCERRADO</Text>
               <Text style={{ fontSize: 12, color: '#64748B', marginTop: 16 }}>Válido até: 01/01/2026</Text>
            </View>
            <View style={styles.badgeEncerrado}>
               <Text style={styles.badgeEncerradoText}>Vínculo Encerrado</Text>
            </View>
         </View>
      )}

      {dependente.elegibilidade === 'APTO' && (
         <View style={styles.footer}>
            <Text style={styles.footerText}>QR renovado automaticamente · Válido por 60 segundos</Text>
         </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerArea: { paddingTop: 60, paddingBottom: 20, alignItems: 'center' },
  logoText: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  identificacaoArea: { alignItems: 'center', paddingHorizontal: 20 },
  avatarGrande: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
  nomeAtleta: { fontSize: 22, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  escalaoAtleta: { fontSize: 14, color: '#64748B', marginBottom: 2 },
  socioAtleta: { fontSize: 13, color: '#64748B' },
  separador: { height: 1, backgroundColor: '#E2E8F0', marginHorizontal: 20, marginVertical: 30 },
  conteudoCentral: { flex: 1, alignItems: 'center', paddingHorizontal: 20 },
  qrArea: { width: 200, height: 200, borderWidth: 2, borderColor: '#0F172A', borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'center' },
  qrMockPlaceholder: { width: '100%', height: '100%', backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  countdownContainer: { marginTop: 24, marginBottom: 16 },
  countdownCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 3, borderColor: '#F1C40F', alignItems: 'center', justifyContent: 'center' },
  countdownText: { fontSize: 8, color: '#64748B', fontWeight: '700' },
  badgeAtivo: { flexDirection: 'row', backgroundColor: '#ECFDF5', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, alignItems: 'center' },
  badgeAtivoText: { color: '#047857', fontSize: 14, fontWeight: '700' },
  bloqueadoTitle: { fontSize: 16, fontWeight: '700', color: '#991B1B', textAlign: 'center' },
  causasArea: { width: '100%', marginTop: 24 },
  causasLabel: { fontSize: 12, color: '#64748B', fontWeight: '700', marginBottom: 12 },
  causaItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  causaPonto: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#991B1B', marginRight: 8 },
  causaTexto: { fontSize: 13, color: '#0F172A' },
  btnOutlineVermelho: { flexDirection: 'row', height: 44, borderRadius: 8, borderWidth: 1, borderColor: '#991B1B', alignItems: 'center', justifyContent: 'center' },
  btnOutlineVermelhoText: { color: '#991B1B', fontSize: 14, fontWeight: '600' },
  badgeEncerrado: { backgroundColor: '#F1F5F9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, marginTop: 24 },
  badgeEncerradoText: { color: '#64748B', fontSize: 14, fontWeight: '600' },
  footer: { paddingBottom: 24, alignItems: 'center' },
  footerText: { fontSize: 11, color: '#64748B' },
});
