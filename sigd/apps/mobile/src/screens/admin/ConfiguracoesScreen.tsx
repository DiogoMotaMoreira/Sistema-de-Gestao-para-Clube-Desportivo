import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Wifi, WifiOff, HelpCircle, Eye, EyeOff, MapPin, MailCheck } from 'lucide-react-native';
import { PageHeader } from '../../components/ui/PageHeader';
import { ModalDetalheNotificacaoFalhada, ModalCorrigirContacto, ModalNovoLocalTreino } from './components/AdminModals';
import { adminService, NotificacaoFalhada, LocalTreino } from '@/services/adminService';
import { Colors } from '@/constants/colors';

export function ConfiguracoesScreen(): React.JSX.Element {
  const [falhas, setFalhas] = useState<NotificacaoFalhada[]>([]);
  const [locais, setLocais] = useState<LocalTreino[]>([]);

  // Estado do Teste de Ligação
  const [statusLigacao, setStatusLigacao] = useState<'online' | 'offline' | 'unknown'>('unknown');
  const [isTesting, setIsTesting] = useState(false);

  // Modals
  const [modalNotif, setModalNotif] = useState<NotificacaoFalhada | null>(null);
  const [modalContacto, setModalContacto] = useState<NotificacaoFalhada | null>(null);
  const [modalLocal, setModalLocal] = useState<{ visible: boolean, data: LocalTreino | null }>({ visible: false, data: null });

  const [showPwdApi, setShowPwdApi] = useState(false);
  const [showPwdSmtp, setShowPwdSmtp] = useState(false);

  useEffect(() => {
    adminService.getNotificacoesFalhadas().then(setFalhas);
    adminService.getLocaisTreino().then(setLocais);
  }, []);

  const handleTestarLigacao = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setStatusLigacao('online');
    }, 1500);
  };

  const getStatusBadge = () => {
    if (statusLigacao === 'online') {
      return (
        <View style={[styles.badgePill, { backgroundColor: '#ECFDF5', flexDirection: 'row', alignItems: 'center' }]}>
          <Wifi size={14} color="#047857" style={{ marginRight: 6 }} />
          <Text style={{ color: '#047857', fontSize: 13, fontWeight: '600' }}>Online — Gateway Operacional</Text>
        </View>
      );
    }
    if (statusLigacao === 'offline') {
      return (
        <View style={[styles.badgePill, { backgroundColor: '#FEE2E2', flexDirection: 'row', alignItems: 'center' }]}>
          <WifiOff size={14} color="#991B1B" style={{ marginRight: 6 }} />
          <Text style={{ color: '#991B1B', fontSize: 13, fontWeight: '600' }}>Offline — Falha na Ligação</Text>
        </View>
      );
    }
    return (
      <View style={[styles.badgePill, { backgroundColor: '#F1F5F9', flexDirection: 'row', alignItems: 'center' }]}>
        <HelpCircle size={14} color="#64748B" style={{ marginRight: 6 }} />
        <Text style={{ color: '#64748B', fontSize: 13, fontWeight: '600' }}>Estado desconhecido — Execute um teste</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <PageHeader
        title="Configurações Globais"
        breadcrumbs={[
          { label: 'Administração de Sistema' },
          { label: 'Configurações' },
        ]}
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.panelsContainer}>
           
           {/* PAINEL A - GATEWAY */}
           <View style={styles.panel}>
              <Text style={styles.panelTitle}>Gateway de Comunicações (SMTP/Push)</Text>
              <Text style={styles.panelSub}>Configurado atualmente: Mailtrap (Ambiente de Desenvolvimento)</Text>
              
              <View style={styles.formGroup}>
                 <Text style={styles.label}>API Key</Text>
                 <View style={styles.inputWrapper}>
                    <TextInput style={styles.inputFlex} secureTextEntry={!showPwdApi} placeholder="••••••••••••••••" defaultValue="d82b3d8f28d8b98s8a" />
                    <TouchableOpacity onPress={() => setShowPwdApi(!showPwdApi)} style={styles.inputIcon}>
                       {showPwdApi ? <EyeOff size={20} color={Colors.GRAY_500_TEXTO2} /> : <Eye size={20} color={Colors.GRAY_500_TEXTO2} />}
                    </TouchableOpacity>
                 </View>
              </View>

              <View style={styles.formGroup}>
                 <Text style={styles.label}>SMTP Password</Text>
                 <View style={styles.inputWrapper}>
                    <TextInput style={styles.inputFlex} secureTextEntry={!showPwdSmtp} placeholder="••••••••••••••••" defaultValue="mypassword123" />
                    <TouchableOpacity onPress={() => setShowPwdSmtp(!showPwdSmtp)} style={styles.inputIcon}>
                       {showPwdSmtp ? <EyeOff size={20} color={Colors.GRAY_500_TEXTO2} /> : <Eye size={20} color={Colors.GRAY_500_TEXTO2} />}
                    </TouchableOpacity>
                 </View>
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Estado da Ligação</Text>
              <View style={styles.statusRow}>
                 {getStatusBadge()}
                 <TouchableOpacity style={styles.btnOutline} onPress={handleTestarLigacao} disabled={isTesting}>
                    {isTesting ? <ActivityIndicator size="small" color={Colors.GRAY_900_TEXTO1} style={{ marginRight: 8 }} /> : null}
                    <Text style={styles.btnOutlineText}>{isTesting ? 'A testar...' : 'Testar Ligação'}</Text>
                 </TouchableOpacity>
              </View>

              {statusLigacao === 'online' && (
                 <View style={[styles.infoBanner, { backgroundColor: '#ECFDF5', borderColor: '#047857' }]}>
                    <Text style={{ color: '#047857', fontSize: 13 }}>Ligação estabelecida com sucesso. Resposta em 142ms.</Text>
                 </View>
              )}

              <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Registos de Envios Falhados</Text>
              
              {falhas.length > 0 ? (
                 <View style={styles.table}>
                    <View style={styles.tableHeader}>
                       <Text style={[styles.th, { flex: 2 }]}>NOTIFICAÇÃO</Text>
                       <Text style={[styles.th, { flex: 2 }]}>DESTINATÁRIO</Text>
                       <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>TENTATIVAS</Text>
                       <Text style={[styles.th, { flex: 2 }]}>ÚLTIMO ERRO</Text>
                       <Text style={[styles.th, { flex: 1.5 }]}>ESTADO</Text>
                       <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>AÇÕES</Text>
                    </View>
                    {falhas.map(f => (
                       <View key={f.id} style={styles.tableRow}>
                          <View style={{ flex: 2 }}>
                             <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.GRAY_900_TEXTO1 }}>{f.tipo}</Text>
                             <Text style={{ fontSize: 11, color: Colors.GRAY_500_TEXTO2 }}>{f.modulo}</Text>
                          </View>
                          <View style={{ flex: 2 }}>
                             <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.GRAY_900_TEXTO1 }}>{f.destinatarioNome}</Text>
                             <Text style={{ fontSize: 11, color: Colors.GRAY_500_TEXTO2, fontFamily: 'monospace' }}>{f.destinatarioEmail}</Text>
                          </View>
                          <View style={{ flex: 1, alignItems: 'center' }}>
                             {f.tentativas >= 3 ? (
                                <View style={[styles.badgePillMini, { backgroundColor: '#FEE2E2' }]}><Text style={{ color: '#991B1B', fontSize: 11, fontWeight: '600' }}>{f.tentativas}</Text></View>
                             ) : (
                                <Text style={{ fontSize: 13, color: Colors.GRAY_900_TEXTO1 }}>{f.tentativas}</Text>
                             )}
                          </View>
                          <Text style={{ flex: 2, fontSize: 11, fontFamily: 'monospace', color: Colors.GRAY_900_TEXTO1 }}>{f.ultimoErro}</Text>
                          <View style={{ flex: 1.5 }}>
                             <View style={[styles.badgePillMini, { backgroundColor: f.estado === 'Reenvio em Curso' ? '#FFFBEB' : '#FEE2E2' }]}>
                                <Text style={{ color: f.estado === 'Reenvio em Curso' ? '#B45309' : '#991B1B', fontSize: 11, fontWeight: '600' }}>{f.estado}</Text>
                             </View>
                          </View>
                          <View style={{ flex: 1, alignItems: 'center' }}>
                             <TouchableOpacity style={styles.btnAcoes} onPress={() => setModalContacto(f)}><Text style={{ color: Colors.GRAY_500_TEXTO2, fontWeight: '700' }}>···</Text></TouchableOpacity>
                          </View>
                       </View>
                    ))}
                    <View style={styles.tableFooter}>
                        <TouchableOpacity
                           style={{
                             paddingHorizontal: 16,
                             paddingVertical: 8,
                             borderRadius: 8,
                             backgroundColor: '#E5E7EB',
                             opacity: 0.5,
                           }}
                           disabled={true}
                        >
                           <Text style={{ color: '#9CA3AF', fontWeight: '600' }}>← Anterior</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                           style={{
                             paddingHorizontal: 16,
                             paddingVertical: 8,
                             borderRadius: 8,
                             backgroundColor: '#E5E7EB',
                             opacity: 0.5,
                           }}
                           disabled={true}
                        >
                           <Text style={{ color: '#9CA3AF', fontWeight: '600' }}>Próxima →</Text>
                        </TouchableOpacity>
                     </View>
                 </View>
              ) : (
                 <View style={{ alignItems: 'center', padding: 32, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8 }}>
                    <MailCheck size={40} color={Colors.GRAY_200_BORDAS} style={{ opacity: 0.5, marginBottom: 12 }} />
                    <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.GRAY_900_TEXTO1 }}>Nenhuma falha de expedição registada</Text>
                    <Text style={{ fontSize: 13, color: Colors.GRAY_500_TEXTO2, marginTop: 4 }}>Todas as notificações foram entregues com sucesso.</Text>
                 </View>
              )}
           </View>

           {/* PAINEL B - PARÂMETROS */}
           <View style={styles.panel}>
              <Text style={styles.panelTitle}>Parâmetros Globais & Dados de Referência</Text>
              
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Limiar de Alerta de Caducidade Documental [RF-14]</Text>
              <View style={styles.formGroup}>
                 <Text style={styles.label}>Limiar de Alerta de Caducidade Documental (dias)</Text>
                 <TextInput style={[styles.inputFlex, { borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, padding: 10, width: 150 }]} placeholder="30" defaultValue="30" keyboardType="numeric" />
                 <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2, marginTop: 8 }}>
                    Valor aplicado nas rotinas automáticas de varrimento de EMDs e documentos civis. Qualquer alteração a este parâmetro é registada no Audit Trail com nível de severidade elevado.
                 </Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, marginBottom: 16 }}>
                 <Text style={styles.sectionTitle}>Locais de Treino e Infraestruturas</Text>
                 <TouchableOpacity style={styles.btnOutline} onPress={() => setModalLocal({ visible: true, data: null })}>
                    <Text style={styles.btnOutlineText}>+ Novo Local</Text>
                 </TouchableOpacity>
              </View>

              <View style={styles.table}>
                 <View style={styles.tableHeader}>
                    <Text style={[styles.th, { flex: 2.5 }]}>NOME</Text>
                    <Text style={[styles.th, { flex: 1.5 }]}>TIPO</Text>
                    <Text style={[styles.th, { flex: 1 }]}>ESTADO</Text>
                    <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>AÇÕES</Text>
                 </View>
                 {locais.map(loc => (
                    <View key={loc.id} style={styles.tableRow}>
                       <Text style={[styles.td, { flex: 2.5, fontWeight: '600' }]}>{loc.nome}</Text>
                       <View style={{ flex: 1.5 }}>
                          <View style={[styles.badgePillMini, { backgroundColor: '#F1F5F9' }]}><Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>{loc.tipo}</Text></View>
                       </View>
                       <View style={{ flex: 1 }}>
                          <View style={[styles.badgePillMini, { backgroundColor: loc.estado === 'Ativo' ? '#ECFDF5' : '#F1F5F9' }]}>
                             <Text style={{ color: loc.estado === 'Ativo' ? '#047857' : '#64748B', fontSize: 11, fontWeight: '600' }}>{loc.estado}</Text>
                          </View>
                       </View>
                       <View style={{ flex: 1, alignItems: 'center' }}>
                          <TouchableOpacity style={styles.btnAcoes} onPress={() => setModalLocal({ visible: true, data: loc })}>
                             <Text style={{ color: Colors.GRAY_500_TEXTO2, fontWeight: '700' }}>···</Text>
                          </TouchableOpacity>
                       </View>
                    </View>
                 ))}
                 <View style={styles.tableFooter}>
                    <TouchableOpacity
                       style={{
                         paddingHorizontal: 16,
                         paddingVertical: 8,
                         borderRadius: 8,
                         backgroundColor: '#E5E7EB',
                         opacity: 0.5,
                       }}
                       disabled={true}
                    >
                       <Text style={{ color: '#9CA3AF', fontWeight: '600' }}>← Anterior</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                       style={{
                         paddingHorizontal: 16,
                         paddingVertical: 8,
                         borderRadius: 8,
                         backgroundColor: '#E5E7EB',
                         opacity: 0.5,
                       }}
                       disabled={true}
                    >
                       <Text style={{ color: '#9CA3AF', fontWeight: '600' }}>Próxima →</Text>
                    </TouchableOpacity>
                 </View>
              </View>

           </View>
        </View>

        <View style={styles.footerGlobal}>
           <TouchableOpacity style={[styles.btnOutline, { paddingVertical: 12, paddingHorizontal: 24 }]}><Text style={styles.btnOutlineText}>Cancelar</Text></TouchableOpacity>
           <TouchableOpacity style={[styles.btnDourado, { paddingVertical: 12, paddingHorizontal: 24 }]}><Text style={styles.btnDouradoText}>Guardar Configurações</Text></TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals Injetados */}
      <ModalDetalheNotificacaoFalhada visible={!!modalNotif} onClose={() => setModalNotif(null)} notif={modalNotif} />
      <ModalCorrigirContacto visible={!!modalContacto} onClose={() => setModalContacto(null)} notif={modalContacto} />
      <ModalNovoLocalTreino visible={modalLocal.visible} onClose={() => setModalLocal({ visible: false, data: null })} local={modalLocal.data} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.GRAY_50_FUNDO },
  content: { flex: 1 },
  scrollContent: { padding: 32 },
  panelsContainer: { flexDirection: 'row', gap: 24 }, // Lado a lado em Desktop
  panel: { flex: 1, backgroundColor: Colors.BRANCO, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS },
  panelTitle: { fontSize: 18, fontWeight: '700', color: Colors.GRAY_900_TEXTO1, marginBottom: 4 },
  panelSub: { fontSize: 12, color: Colors.GRAY_500_TEXTO2, marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.GRAY_900_TEXTO1, marginBottom: 12, textTransform: 'uppercase' },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: Colors.GRAY_900_TEXTO1, marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, backgroundColor: Colors.BRANCO },
  inputFlex: { flex: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, outlineStyle: 'none' as any },
  inputIcon: { padding: 10 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  badgePill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  infoBanner: { padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 16 },
  btnOutline: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  btnOutlineText: { fontSize: 13, fontWeight: '600', color: Colors.GRAY_900_TEXTO1 },
  btnDourado: { backgroundColor: Colors.DOURADO_CTA, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  btnDouradoText: { fontSize: 13, fontWeight: '600', color: Colors.BRANCO },
  table: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, overflow: 'hidden', backgroundColor: Colors.BRANCO },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  th: { fontSize: 11, fontWeight: '600', color: Colors.GRAY_500_TEXTO2 },
  tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', alignItems: 'center' },
  td: { fontSize: 13, color: Colors.GRAY_900_TEXTO1 },
  badgePillMini: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  btnAcoes: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS },
  tableFooter: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  footerGlobal: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16, marginTop: 32, paddingTop: 32, borderTopWidth: 1, borderTopColor: Colors.GRAY_200_BORDAS }
});
