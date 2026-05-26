import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { User, Copy, CreditCard, CheckCircle, FileDown, LogOut } from 'lucide-react-native';
import { portalService, Dependente, ObrigacaoFinanceira, ResumoFinanceiro } from '@/services/portalService';
import { useAuthStore } from '@/stores/authStore';
import { PortalHeader } from './components/PortalHeader';
import { BadgeElegibilidade, BadgeFinanceiro } from './components/PortalBadges';

function formatarDataSegura(dataStr: string | undefined | null): string {
  if (!dataStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dataStr)) {
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  }
  if (dataStr.includes('T')) {
    const dataApenas = dataStr.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(dataApenas)) {
      const [ano, mes, dia] = dataApenas.split('-');
      return `${dia}/${mes}/${ano}`;
    }
  }
  try {
    const d = new Date(dataStr);
    return isNaN(d.getTime()) ? dataStr : d.toLocaleDateString('pt-PT');
  } catch (e) {
    return dataStr;
  }
}

export function ContaScreen({ navigation }: any): React.JSX.Element {
  const [dependente, setDependente] = useState<Dependente | null>(null);
  const [obrigacoes, setObrigacoes] = useState<ObrigacaoFinanceira[]>([]);
  const [perfil, setPerfil] = useState<any>(null);
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [filtro, setFiltro] = useState<'Todas' | 'Pendentes' | 'Pagas'>('Todas');
  const [showLogout, setShowLogout] = useState(false);
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    setShowLogout(false);
    logout();
  };

  useEffect(() => {
    portalService.getPerfilEE().then(perfilData => {
      setPerfil(perfilData);
      if (perfilData && perfilData.dependentes && perfilData.dependentes.length > 0) {
        portalService.getObrigacoes(perfilData.dependentes[0].id).then(setObrigacoes);
      }
    });
    portalService.getSituacaoFinanceira().then(sit => {
      setResumo({
        valorEmDivida: sit.totalDivida,
        valorPagoEsteMes: sit.totalPago,
        iban: 'PT50 0000 1111 2222 3333 4444 5',
        refSocio: '012345678'
      });
    });
  }, []);

  useEffect(() => {
    if (dependente) {
      portalService.getObrigacoes(dependente.id).then(setObrigacoes);
    }
  }, [dependente]);

  const filtradas = obrigacoes.filter(o => {
    if (filtro === 'Pendentes') return o.estado === 'PENDENTE' || o.estado === 'VENCIDO' || o.estado === 'EM_ATRASO';
    if (filtro === 'Pagas') return o.estado === 'PAGO';
    return true;
  });

  return (
    <View style={styles.container}>
      <PortalHeader onDependenteChange={setDependente} />

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 16 }}>
        
        {/* KPI Cards */}
        <View style={styles.kpiRow}>
           <View style={[styles.kpiCard, { backgroundColor: (resumo?.valorEmDivida || 0) > 0 ? '#FEE2E2' : '#ECFDF5', borderColor: (resumo?.valorEmDivida || 0) > 0 ? '#991B1B' : '#047857' }]}>
              <Text style={styles.kpiLabel}>EM DÍVIDA</Text>
              <Text style={[styles.kpiValue, { color: (resumo?.valorEmDivida || 0) > 0 ? '#991B1B' : '#047857' }]}>
                 {resumo?.valorEmDivida.toFixed(2).replace('.', ',')} €
              </Text>
           </View>
           <View style={[styles.kpiCard, { backgroundColor: '#ECFDF5', borderColor: '#047857' }]}>
              <Text style={styles.kpiLabel}>PAGO ESTE MÊS</Text>
              <Text style={[styles.kpiValue, { color: '#047857' }]}>
                 {resumo?.valorPagoEsteMes.toFixed(2).replace('.', ',')} €
              </Text>
           </View>
        </View>

        {/* Dados de Pagamento */}
        <View style={styles.dadosPagamentoCard}>
           <Text style={styles.sectionLabel}>DADOS PARA PAGAMENTO</Text>
           
           <View style={styles.linhaDado}>
              <Text style={{ fontSize: 12, color: '#64748B' }}>IBAN <Text style={{ fontSize: 13, color: '#0F172A', fontWeight: 'bold' }}>{resumo?.iban}</Text></Text>
              <TouchableOpacity style={styles.btnCopy}>
                 <Copy size={14} color="#0F172A" style={{ marginRight: 6 }} />
                 <Text style={{ fontSize: 12, color: '#0F172A' }}>Copiar</Text>
              </TouchableOpacity>
           </View>
           
           <View style={[styles.linhaDado, { borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingBottom: 16, marginBottom: 12 }]}>
              <Text style={{ fontSize: 12, color: '#64748B' }}>Ref. Sócio <Text style={{ fontSize: 13, color: '#0F172A', fontWeight: 'bold' }}>{resumo?.refSocio}</Text></Text>
              <TouchableOpacity style={styles.btnCopy}>
                 <Copy size={14} color="#0F172A" style={{ marginRight: 6 }} />
                 <Text style={{ fontSize: 12, color: '#0F172A' }}>Copiar</Text>
              </TouchableOpacity>
           </View>

           <Text style={{ fontSize: 11, color: '#64748B', fontStyle: 'italic' }}>
              O pagamento deve ser efectuado por transferência bancária ou ao balcão da secretaria. O clube não aceita pagamentos remotos por esta app.
           </Text>
        </View>

        {/* Obrigações */}
        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>OBRIGAÇÕES</Text>
        <View style={styles.filtersRow}>
           <TouchableOpacity style={[styles.pillFiltro, filtro === 'Todas' && styles.pillFiltroAtiva]} onPress={() => setFiltro('Todas')}>
              <Text style={[styles.pillFiltroText, filtro === 'Todas' && styles.pillFiltroTextAtiva]}>Todas</Text>
           </TouchableOpacity>
           <TouchableOpacity style={[styles.pillFiltro, filtro === 'Pendentes' && styles.pillFiltroAtiva]} onPress={() => setFiltro('Pendentes')}>
              <Text style={[styles.pillFiltroText, filtro === 'Pendentes' && styles.pillFiltroTextAtiva]}>Pendentes</Text>
           </TouchableOpacity>
           <TouchableOpacity style={[styles.pillFiltro, filtro === 'Pagas' && styles.pillFiltroAtiva]} onPress={() => setFiltro('Pagas')}>
              <Text style={[styles.pillFiltroText, filtro === 'Pagas' && styles.pillFiltroTextAtiva]}>Pagas</Text>
           </TouchableOpacity>
        </View>

        <View style={{ gap: 8, marginBottom: 24 }}>
           {filtradas.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                 <CheckCircle size={48} color="#047857" style={{ opacity: 0.4, marginBottom: 8 }} />
                 <Text style={{ fontSize: 14, color: '#64748B' }}>Sem obrigações neste período</Text>
              </View>
           ) : (
              filtradas.map(o => (
                 <View key={o.id} style={[
                    styles.cardObrigacao, 
                    { borderLeftColor: (o.estado === 'VENCIDO' || o.estado === 'EM_ATRASO') ? '#991B1B' : o.estado === 'PENDENTE' ? '#B45309' : '#047857' },
                    o.estado === 'PAGO' && { opacity: 0.85 }
                 ]}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 4 }}>{o.nome}</Text>
                    <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>{o.entidade} · {o.valor.toFixed(2).replace('.', ',')} €</Text>
                    
                    {(o.estado === 'VENCIDO' || o.estado === 'EM_ATRASO') && (
                       <Text style={{ fontSize: 12, color: '#991B1B', marginBottom: 8 }}>Vencido há alguns dias</Text>
                    )}
                    {o.estado === 'PENDENTE' && (
                       <Text style={{ fontSize: 12, color: '#B45309', marginBottom: 8 }}>Vence a {formatarDataSegura(o.dataVencimento)}</Text>
                    )}
                    {o.estado === 'PAGO' && (
                       <Text style={{ fontSize: 12, color: '#047857', marginBottom: 8 }}>Pago a {formatarDataSegura(o.dataPagamento || new Date().toISOString())}</Text>
                    )}

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                       <BadgeFinanceiro estado={o.estado} />
                       {o.estado === 'PAGO' && (
                          <TouchableOpacity style={styles.btnVerFatura}>
                             <FileDown size={14} color="#1D4ED8" style={{ marginRight: 4 }} />
                             <Text style={{ fontSize: 12, color: '#1D4ED8' }}>Ver Fatura</Text>
                          </TouchableOpacity>
                       )}
                    </View>
                 </View>
              ))
           )}
        </View>

        {/* Perfil */}
        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>PERFIL</Text>
        <View style={styles.perfilCard}>
           <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <View style={styles.avatarGrande}><User size={24} color="#64748B" /></View>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#0F172A' }}>{perfil?.nome || 'Encarregado Educação'}</Text>
              <Text style={{ fontSize: 13, color: '#64748B' }}>{perfil?.email || 'ee@sigd.pt'}</Text>
              <Text style={{ fontSize: 13, color: '#64748B' }}>{perfil?.telemovel || '+351 910 000 000'}</Text>
           </View>
           <Text style={{ fontSize: 11, color: '#64748B', fontStyle: 'italic', textAlign: 'center' }}>Para alterar os teus dados, contacta a secretaria do clube.</Text>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.btnLogout} onPress={() => setShowLogout(true)}>
           <LogOut size={18} color="#991B1B" style={{ marginRight: 8 }} />
           <Text style={styles.btnLogoutText}>Terminar Sessão</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom Sheet Logout */}
      <Modal visible={showLogout} transparent animationType="slide">
         <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.backdrop} onPress={() => setShowLogout(false)} />
            <View style={styles.bottomSheet}>
               <View style={styles.handle} />
               <Text style={styles.sheetTitle}>Terminar Sessão?</Text>
               <Text style={{ fontSize: 14, color: '#64748B', paddingHorizontal: 16, marginBottom: 24 }}>Terás de fazer login novamente para aceder à app.</Text>
               <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingBottom: 24 }}>
                  <TouchableOpacity style={styles.btnUploadOutline} onPress={() => setShowLogout(false)}>
                     <Text style={{ color: '#0F172A' }}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                     style={[styles.btnUploadOutline, { backgroundColor: '#FEE2E2', borderColor: '#FEE2E2' }]}
                     onPress={handleLogout}
                  >
                     <Text style={{ color: '#991B1B', fontWeight: '600' }}>Terminar Sessão</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { flex: 1 },
  kpiRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  kpiCard: { flex: 1, borderRadius: 12, padding: 16, borderWidth: 1 },
  kpiLabel: { fontSize: 10, color: '#64748B', fontWeight: '700', marginBottom: 4 },
  kpiValue: { fontSize: 24, fontWeight: '700' },
  sectionLabel: { fontSize: 11, color: '#64748B', fontWeight: '700', paddingVertical: 8, marginBottom: 8 },
  dadosPagamentoCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 16 },
  linhaDado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  btnCopy: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  filtersRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  pillFiltro: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 6 },
  pillFiltroAtiva: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  pillFiltroText: { fontSize: 13, color: '#0F172A' },
  pillFiltroTextAtiva: { color: '#FFFFFF', fontWeight: '600' },
  cardObrigacao: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderLeftWidth: 4, borderRadius: 12, padding: 14 },
  btnVerFatura: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#1D4ED8', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  perfilCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 16, marginBottom: 24 },
  avatarGrande: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  btnLogout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#991B1B', borderRadius: 12, height: 52, marginBottom: 30 },
  btnLogoutText: { color: '#991B1B', fontWeight: '600', fontSize: 15 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' },
  bottomSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  handle: { width: 32, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginTop: 12 },
  sheetTitle: { fontSize: 16, fontWeight: '600', color: '#0F172A', paddingHorizontal: 16, paddingVertical: 16 },
  btnUploadOutline: { flex: 1, height: 48, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
});
