import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Wifi, Lock, CreditCard, Upload, Archive, User } from 'lucide-react-native';
import { portalService, Dependente } from '@/services/portalService';
import { PortalHeader } from './components/PortalHeader';
import { useAuthStore } from '@/stores/authStore';
import { ActivityIndicator } from 'react-native';
import { Svg, Rect } from 'react-native-svg';

function QRCodeSVG({ seed }: { seed: number }) {
  const SIZE = 21;
  const CELL = 8;
  const modules: boolean[][] = Array.from({ length: SIZE }, () =>
    Array(SIZE).fill(false)
  );

  const drawFinder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        modules[row + r][col + c] = isOuter || isInner;
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(0, SIZE - 7);
  drawFinder(SIZE - 7, 0);

  for (let i = 8; i < SIZE - 8; i++) {
    modules[6][i] = i % 2 === 0;
    modules[i][6] = i % 2 === 0;
  }

  const rng = (n: number) => {
    const x = Math.sin(n + seed) * 10000;
    return x - Math.floor(x);
  };
  
  let idx = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const inFinder =
        (r < 8 && c < 8) ||
        (r < 8 && c >= SIZE - 8) ||
        (r >= SIZE - 8 && c < 8);
      const inTiming = r === 6 || c === 6;
      if (!inFinder && !inTiming) {
        if (!modules[r][c]) modules[r][c] = rng(idx++) > 0.5;
      }
    }
  }

  const totalSize = SIZE * CELL;

  return (
    <Svg width={totalSize} height={totalSize} viewBox={`0 0 ${totalSize} ${totalSize}`}>
      <Rect width={totalSize} height={totalSize} fill="white" />
      {modules.flatMap((row, r) =>
        row.map((on, c) =>
          on ? (
            <Rect
              key={`${r}-${c}`}
              x={c * CELL + 1}
              y={r * CELL + 1}
              width={CELL - 1}
              height={CELL - 1}
              fill="#0F172A"
            />
          ) : null
        )
      )}
    </Svg>
  );
}

export function CartaoScreen({ navigation }: any): React.JSX.Element {
  const { user } = useAuthStore();
  
  const [atletaCartao, setAtletaCartao] = useState<{id?: number, nome: string, numeroSocio: string | null, elegibilidade: string, equipa: string}>({
    id: 1,
    nome: user?.name || 'A carregar...',
    numeroSocio: null,
    elegibilidade: 'BLOQUEADO',
    equipa: '-'
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    portalService.getPerfilEE().then(perfil => {
      if (perfil.dependentes && perfil.dependentes.length > 0) {
        const atleta = perfil.dependentes[0];
        setAtletaCartao({
          id: atleta.id,
          nome: atleta.nome,
          numeroSocio: atleta.numeroSocio || null,
          elegibilidade: atleta.elegibilidade,
          equipa: atleta.equipa || '-'
        });
      } else {
        setAtletaCartao({
          nome: user?.name || 'Sócio Boavista',
          numeroSocio: null,
          elegibilidade: 'BLOQUEADO',
          equipa: '-'
        });
        setErrorMsg('Nenhum dependente associado.');
      }
    }).catch(e => {

      setAtletaCartao({
        nome: user?.name || 'Sócio Boavista',
        numeroSocio: null,
        elegibilidade: 'BLOQUEADO',
        equipa: '-'
      });
      setErrorMsg('Não foi possível carregar os dados reais.');
    }).finally(() => {
      setIsLoading(false);
    });
  }, [user?.name]);

  useEffect(() => {
    // Simulador de Regeneração do QR Code
    if (atletaCartao?.elegibilidade === 'APTO') {
      const interval = setInterval(() => {
        setCountdown(c => (c > 0 ? c - 1 : 60));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [atletaCartao]);

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0F172A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header escondido para dar imersão, mas precisamos do switcher de dependente!
          Como PORTAL.md diz "Top App Bar: Ausente", podemos ter a UI full screen, 
          mas para mudar de dependente vou mostrar o header de forma simplificada no topo ou 
          apenas renderizar a identificação central. */}
      
      <View style={styles.headerArea}>
         <Text style={styles.logoText}>Boavista Futebol Clube</Text>
      </View>
      
      {errorMsg && (
         <View style={{ backgroundColor: '#FEF2F2', padding: 12, marginHorizontal: 20, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#FECACA' }}>
            <Text style={{ color: '#991B1B', fontSize: 13, textAlign: 'center' }}>{errorMsg}</Text>
         </View>
      )}

      <View style={styles.identificacaoArea}>
         <View style={styles.avatarGrande}>
            <User size={48} color="#64748B" />
         </View>
         <Text style={styles.nomeAtleta}>{atletaCartao.nome}</Text>
         <Text style={styles.escalaoAtleta}>{atletaCartao.equipa}</Text>
         <Text style={styles.socioAtleta}>N.º de Sócio: {atletaCartao.numeroSocio ? atletaCartao.numeroSocio : 'Não associado'}</Text>
      </View>

      <View style={styles.separador} />

      {/* Áreas por Elegibilidade Unificadas */}
      <View style={styles.conteudoCentral}>
         {/* QR Code Placeholder (Pedido pelo utilizador) */}
         <View style={{ width: 168, height: 168, alignItems: 'center', justifyContent: 'center', marginVertical: 16 }}>
            <QRCodeSVG seed={atletaCartao.id ?? 1} />
         </View>

         {/* Contador de validade (Pedido pelo utilizador) */}
         <View style={styles.countdownContainer}>
            <View style={styles.countdownCircle}>
               <Text style={styles.countdownText}>{countdown}s</Text>
            </View>
         </View>

         {/* Badge de estado (Pedido pelo utilizador) */}
         <View style={[
            styles.badgeAtivo, 
            atletaCartao.elegibilidade === 'APTO' ? { backgroundColor: '#ECFDF5' } : 
            atletaCartao.elegibilidade === 'CONDICIONADO' ? { backgroundColor: '#FEF3C7' } : 
            { backgroundColor: '#FEF2F2' }
         ]}>
            {atletaCartao.elegibilidade === 'APTO' && <Wifi size={16} color="#047857" style={{ marginRight: 8 }} />}
            {atletaCartao.elegibilidade === 'CONDICIONADO' && <Lock size={16} color="#B45309" style={{ marginRight: 8 }} />}
            {(atletaCartao.elegibilidade !== 'APTO' && atletaCartao.elegibilidade !== 'CONDICIONADO') && <Lock size={16} color="#991B1B" style={{ marginRight: 8 }} />}
            
            <Text style={[
               styles.badgeAtivoText,
               atletaCartao.elegibilidade === 'APTO' ? { color: '#047857' } : 
               atletaCartao.elegibilidade === 'CONDICIONADO' ? { color: '#B45309' } : 
               { color: '#991B1B' }
            ]}>
               {atletaCartao.elegibilidade === 'APTO' ? 'ATIVO' : 
                atletaCartao.elegibilidade === 'CONDICIONADO' ? 'CONDICIONADO' : 'BLOQUEADO'}
            </Text>
         </View>

         {/* Causas de Bloqueio (mantém funcionalidade original) */}
         {(atletaCartao.elegibilidade !== 'APTO' && atletaCartao.elegibilidade !== 'CONDICIONADO') && (
            <View style={styles.causasArea}>
               <Text style={styles.causasLabel}>POR RESOLVER:</Text>
               <View style={styles.causaItem}>
                  <View style={styles.causaPonto} />
                  <Text style={styles.causaTexto}>Pendências associadas à inscrição/mensalidades ou EMD</Text>
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
         )}
      </View>

      {atletaCartao.elegibilidade === 'APTO' && (
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
