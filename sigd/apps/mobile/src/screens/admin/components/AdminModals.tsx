import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { X, ShieldAlert, AlertTriangle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { AdminUser, AuditoriaEvent, AuditLogEntry, NotificacaoFalhada, LocalTreino } from '@/services/adminService';

// ── Globais ──────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContent: { backgroundColor: Colors.BRANCO, borderRadius: 16, padding: 24, width: '90%', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '600', color: Colors.GRAY_900_TEXTO1 },
  modalMessage: { fontSize: 14, color: Colors.GRAY_500_TEXTO2, marginBottom: 24, lineHeight: 20 },
  footerRow: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end', marginTop: 24 },
  btnOutline: { borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  btnOutlineText: { fontSize: 14, fontWeight: '500', color: Colors.GRAY_900_TEXTO1 },
  btnDourado: { backgroundColor: Colors.DOURADO_CTA, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  btnDouradoText: { fontSize: 14, fontWeight: '600', color: Colors.BRANCO },
  btnDestrutivo: { backgroundColor: '#FEE2E2', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  btnDestrutivoText: { fontSize: 14, fontWeight: '600', color: '#991B1B' },
  input: { borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: Colors.GRAY_900_TEXTO1, marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: Colors.GRAY_900_TEXTO1, marginBottom: 4 },
  infoLine: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', padding: 12, borderRadius: 8, marginBottom: 16 },
  infoTextMono: { fontFamily: 'monospace', fontSize: 13, color: Colors.GRAY_900_TEXTO1, marginTop: 4, fontWeight: '600' },
  avisoBox: { backgroundColor: '#FFFBEB', padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avisoText: { color: '#B45309', fontSize: 12, flex: 1, marginLeft: 8 },
  errorInline: { color: Colors.ERRO_TEXT, fontSize: 11, marginTop: -12, marginBottom: 16 },
  badgePill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  badgeText: { fontSize: 11, fontWeight: '600' },
  grid2: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { width: '50%', marginBottom: 12 },
});

// ── 1. Bloquear Acesso ─────────────────────────────────

export function ModalBloquearAcesso({ visible, onClose, user }: { visible: boolean, onClose: () => void, user: AdminUser | null }) {
  if (!user) return null;
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modalContent, { maxWidth: 450 }]}>
          <View style={styles.modalHeader}>
             <Text style={styles.modalTitle}>Bloquear Acesso — {user.nome}</Text>
             <TouchableOpacity onPress={onClose}><X size={20} color={Colors.GRAY_500_TEXTO2} /></TouchableOpacity>
          </View>
          <Text style={styles.modalMessage}>
            Tem a certeza que deseja revogar o acesso a {user.nome}? A sessão atual será terminada imediatamente e o utilizador não poderá autenticar-se até que o acesso seja reativado.
          </Text>
          <View style={styles.footerRow}>
             <TouchableOpacity style={styles.btnOutline} onPress={onClose}><Text style={styles.btnOutlineText}>Cancelar</Text></TouchableOpacity>
             <TouchableOpacity style={styles.btnDestrutivo} onPress={onClose}><Text style={styles.btnDestrutivoText}>Confirmar e Bloquear</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── 2. Reativar Acesso ─────────────────────────────────

export function ModalReativarAcesso({ visible, onClose, user }: { visible: boolean, onClose: () => void, user: AdminUser | null }) {
  if (!user) return null;
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modalContent, { maxWidth: 450 }]}>
          <View style={styles.modalHeader}>
             <Text style={styles.modalTitle}>Reativar Acesso — {user.nome}</Text>
             <TouchableOpacity onPress={onClose}><X size={20} color={Colors.GRAY_500_TEXTO2} /></TouchableOpacity>
          </View>
          <Text style={styles.modalMessage}>
            Tem a certeza que pretende restaurar o acesso a {user.nome}? O utilizador poderá autenticar-se novamente na próxima tentativa de login.
          </Text>
          <View style={styles.footerRow}>
             <TouchableOpacity style={styles.btnOutline} onPress={onClose}><Text style={styles.btnOutlineText}>Cancelar</Text></TouchableOpacity>
             <TouchableOpacity style={styles.btnDourado} onPress={onClose}><Text style={styles.btnDouradoText}>Confirmar e Reativar</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── 3. Forçar Reset de Password ────────────────────────

export function ModalForcarReset({ visible, onClose, user }: { visible: boolean, onClose: () => void, user: AdminUser | null }) {
  const [success, setSuccess] = useState(false);
  
  if (!user) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onShow={() => setSuccess(false)}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modalContent, { maxWidth: 450 }]}>
          <View style={styles.modalHeader}>
             <Text style={styles.modalTitle}>Forçar Redefinição de Password</Text>
             <TouchableOpacity onPress={onClose}><X size={20} color={Colors.GRAY_500_TEXTO2} /></TouchableOpacity>
          </View>

          {!success ? (
            <>
              <View style={styles.infoLine}>
                 <Text style={{ fontSize: 13, color: Colors.GRAY_500_TEXTO2 }}>Será enviado um link de recuperação temporário para:</Text>
                 <Text style={styles.infoTextMono}>{user.email}</Text>
              </View>
              <View style={styles.avisoBox}>
                 <AlertTriangle size={16} color="#B45309" />
                 <Text style={styles.avisoText}>O link de recuperação expira ao fim de 24 horas.</Text>
              </View>
              <View style={styles.footerRow}>
                 <TouchableOpacity style={styles.btnOutline} onPress={onClose}><Text style={styles.btnOutlineText}>Cancelar</Text></TouchableOpacity>
                 <TouchableOpacity style={styles.btnDourado} onPress={() => setSuccess(true)}><Text style={styles.btnDouradoText}>Enviar Email de Reset</Text></TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={[styles.infoLine, { backgroundColor: '#ECFDF5', borderColor: '#047857' }]}>
                 <Text style={{ fontSize: 13, color: '#047857', fontWeight: '500' }}>Email enviado com sucesso para {user.email}.</Text>
              </View>
              <View style={styles.footerRow}>
                 <TouchableOpacity style={styles.btnOutline} onPress={onClose}><Text style={styles.btnOutlineText}>Fechar</Text></TouchableOpacity>
              </View>
            </>
          )}

        </View>
      </View>
    </Modal>
  );
}

// ── 4. Detalhe de Auditoria ─────────────────────────────

export function ModalDetalheAuditoria({ visible, onClose, evento }: { visible: boolean, onClose: () => void, evento: AuditLogEntry | null }) {
  if (!evento) return null;
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modalContent, { maxWidth: 700 }]}>
          <View style={styles.modalHeader}>
             <Text style={styles.modalTitle}>Detalhe do Evento de Auditoria</Text>
             <TouchableOpacity onPress={onClose}><X size={20} color={Colors.GRAY_500_TEXTO2} /></TouchableOpacity>
          </View>
          
          <View style={styles.infoLine}>
             <Text style={{ fontSize: 12, color: Colors.GRAY_900_TEXTO1 }}>ID do Evento: <Text style={{ fontFamily: 'monospace' }}>{evento.id}</Text>  ·  {evento.timestamp}  ·  Ator: {evento.ator}  ·  IP: <Text style={{ fontFamily: 'monospace' }}>{evento.ipAddress}</Text></Text>
          </View>

          <ScrollView style={{ backgroundColor: '#1E293B', padding: 16, borderRadius: 8, maxHeight: 300 }}>
             <Text style={{ color: '#F8FAFC', fontSize: 13, fontFamily: 'monospace' }}>{evento.detalhes}</Text>
          </ScrollView>

          <View style={styles.footerRow}>
             <TouchableOpacity style={styles.btnOutline} onPress={onClose}><Text style={styles.btnOutlineText}>Fechar</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── 5. Editar Campos Críticos ───────────────────────────

export function ModalEditarCamposCriticos({ visible, onClose, user }: { visible: boolean, onClose: () => void, user: AdminUser | null }) {
  if (!user) return null;
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modalContent, { maxWidth: 500 }]}>
          <View style={styles.modalHeader}>
             <Text style={styles.modalTitle}>Editar Campos Biográficos Críticos</Text>
             <TouchableOpacity onPress={onClose}><X size={20} color={Colors.GRAY_500_TEXTO2} /></TouchableOpacity>
          </View>

          <View style={[styles.avisoBox, { backgroundColor: '#FEE2E2' }]}>
             <ShieldAlert size={16} color="#991B1B" />
             <Text style={[styles.avisoText, { color: '#991B1B' }]}>Esta operação sobrepõe as restrições da Secretaria e gera um alerta de auditoria de nível SEVERO. Prossiga apenas com autorização formal.</Text>
          </View>

          <Text style={styles.label}>Nome Completo *</Text>
          <TextInput style={styles.input} defaultValue={user.nome} placeholder="Nome completo atual do atleta" />
          
          <Text style={styles.label}>Data de Nascimento *</Text>
          <TextInput style={styles.input} placeholder="dd/mm/aaaa" />

          <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2, marginTop: 8 }}>
            Apenas o Administrador de Sistema tem permissão para modificar estes campos. A alteração ficará registada no Audit Trail com o identificador do ator responsável.
          </Text>

          <View style={styles.footerRow}>
             <TouchableOpacity style={styles.btnOutline} onPress={onClose}><Text style={styles.btnOutlineText}>Cancelar</Text></TouchableOpacity>
             <TouchableOpacity style={styles.btnDestrutivo} onPress={onClose}><Text style={styles.btnDestrutivoText}>Confirmar Alteração Crítica</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── 6. Detalhe de Notificação Falhada ───────────────────

export function ModalDetalheNotificacaoFalhada({ visible, onClose, notif }: { visible: boolean, onClose: () => void, notif: NotificacaoFalhada | null }) {
  if (!notif) return null;
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modalContent, { maxWidth: 600 }]}>
          <View style={styles.modalHeader}>
             <Text style={styles.modalTitle}>Detalhe da Notificação Falhada</Text>
             <TouchableOpacity onPress={onClose}><X size={20} color={Colors.GRAY_500_TEXTO2} /></TouchableOpacity>
          </View>

          <View style={[styles.infoLine, { padding: 16 }]}>
             <View style={styles.grid2}>
                <View style={styles.gridItem}><Text style={styles.label}>Tipo de Notificação:</Text><Text style={{ fontSize: 13, color: Colors.GRAY_900_TEXTO1 }}>{notif.tipo}</Text></View>
                <View style={styles.gridItem}><Text style={styles.label}>Módulo de Origem:</Text><Text style={{ fontSize: 13, color: Colors.GRAY_900_TEXTO1 }}>{notif.modulo}</Text></View>
                <View style={styles.gridItem}><Text style={styles.label}>Destinatário:</Text><Text style={{ fontSize: 13, color: Colors.GRAY_900_TEXTO1 }}>{notif.destinatarioNome}</Text></View>
                <View style={styles.gridItem}><Text style={styles.label}>Email:</Text><Text style={styles.infoTextMono}>{notif.destinatarioEmail}</Text></View>
                <View style={styles.gridItem}><Text style={styles.label}>Data da Primeira Tentativa:</Text><Text style={{ fontSize: 13, color: Colors.GRAY_900_TEXTO1 }}>{notif.dataPrimeiraTentativa}</Text></View>
                <View style={styles.gridItem}><Text style={styles.label}>Número de Tentativas:</Text><Text style={{ fontSize: 13, color: Colors.GRAY_900_TEXTO1 }}>{notif.tentativas}</Text></View>
                <View style={styles.gridItem}><Text style={styles.label}>Código de Erro:</Text><Text style={styles.infoTextMono}>{notif.ultimoErro}</Text></View>
             </View>
          </View>

          <View style={styles.footerRow}>
             <TouchableOpacity style={styles.btnOutline} onPress={onClose}><Text style={styles.btnOutlineText}>Cancelar</Text></TouchableOpacity>
             <TouchableOpacity style={styles.btnDourado} onPress={onClose}><Text style={styles.btnDouradoText}>Reenviar Manualmente</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── 7. Corrigir Contacto do Destinatário ────────────────

export function ModalCorrigirContacto({ visible, onClose, notif }: { visible: boolean, onClose: () => void, notif: NotificacaoFalhada | null }) {
  if (!notif) return null;
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modalContent, { maxWidth: 450 }]}>
          <View style={styles.modalHeader}>
             <Text style={styles.modalTitle}>Corrigir Dados de Contacto</Text>
             <TouchableOpacity onPress={onClose}><X size={20} color={Colors.GRAY_500_TEXTO2} /></TouchableOpacity>
          </View>

          <View style={styles.infoLine}>
             <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2 }}>Email atual: <Text style={styles.infoTextMono}>{notif.destinatarioEmail}</Text></Text>
          </View>

          <Text style={styles.label}>Novo Email do Destinatário *</Text>
          <TextInput style={styles.input} placeholder="novo.email@dominio.com" defaultValue={notif.destinatarioEmail} />

          <View style={styles.avisoBox}>
             <AlertTriangle size={16} color="#B45309" />
             <Text style={styles.avisoText}>A correção atualiza permanentemente os dados de contacto no perfil do utilizador no sistema.</Text>
          </View>

          <View style={styles.footerRow}>
             <TouchableOpacity style={styles.btnOutline} onPress={onClose}><Text style={styles.btnOutlineText}>Cancelar</Text></TouchableOpacity>
             <TouchableOpacity style={styles.btnDourado} onPress={onClose}><Text style={styles.btnDouradoText}>Guardar e Reenviar</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ── 8. Novo / Editar Local de Treino ────────────────────

export function ModalNovoLocalTreino({ visible, onClose, local }: { visible: boolean, onClose: () => void, local: LocalTreino | null }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={[styles.modalContent, { maxWidth: 500 }]}>
          <View style={styles.modalHeader}>
             <Text style={styles.modalTitle}>{local ? 'Editar Local de Treino' : 'Adicionar Local de Treino'}</Text>
             <TouchableOpacity onPress={onClose}><X size={20} color={Colors.GRAY_500_TEXTO2} /></TouchableOpacity>
          </View>

          <Text style={styles.label}>Nome do Local *</Text>
          <TextInput style={styles.input} placeholder="ex: Campo Principal João Cardoso" defaultValue={local?.nome} />

          <Text style={styles.label}>Tipo *</Text>
          <View style={[styles.input, { justifyContent: 'center' }]}><Text style={{ color: local ? Colors.GRAY_900_TEXTO1 : Colors.GRAY_500_TEXTO2 }}>{local ? local.tipo : 'Selecione o tipo...'}</Text></View>

          <Text style={styles.label}>Capacidade (Nº de pessoas)</Text>
          <TextInput style={styles.input} placeholder="ex: 200" keyboardType="numeric" defaultValue={local?.capacidade?.toString()} />

          <View style={styles.footerRow}>
             <TouchableOpacity style={styles.btnOutline} onPress={onClose}><Text style={styles.btnOutlineText}>Cancelar</Text></TouchableOpacity>
             <TouchableOpacity style={styles.btnDourado} onPress={onClose}><Text style={styles.btnDouradoText}>Guardar Local</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
