import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Bell, ChevronDown, CheckCircle, User } from 'lucide-react-native';
import { portalService, Dependente, NotificacaoPortal } from '@/services/portalService';
import { BadgeElegibilidade } from './PortalBadges';

interface PortalHeaderProps {
  onDependenteChange?: (dependente: Dependente) => void;
}

export function PortalHeader({ onDependenteChange }: PortalHeaderProps) {
  const [dependentes, setDependentes] = useState<Dependente[]>([]);
  const [ativo, setAtivo] = useState<Dependente | null>(null);
  const [notificacoes, setNotificacoes] = useState<NotificacaoPortal[]>([]);
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    portalService.getDependentes().then(deps => {
      setDependentes(deps);
      if (deps.length > 0) {
        setAtivo(deps[0]);
        onDependenteChange?.(deps[0]);
      }
    });
    portalService.getNotificacoes().then(setNotificacoes);
  }, []);

  const unreadCount = notificacoes.filter(n => !n.lida).length;

  const handleSelect = (dep: Dependente) => {
    setAtivo(dep);
    setShowSelector(false);
    onDependenteChange?.(dep);
  };

  if (!ativo) return <View style={styles.container} />;

  return (
    <>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
           <User size={20} color="#64748B" />
        </View>

        <View style={styles.infoCol}>
          {dependentes.length > 1 ? (
             <TouchableOpacity style={styles.pillSelector} onPress={() => setShowSelector(true)}>
                <Text style={styles.nomeText}>{ativo.nome}</Text>
                <ChevronDown size={14} color="#64748B" style={{ marginLeft: 4 }} />
             </TouchableOpacity>
          ) : (
             <Text style={styles.nomeText}>{ativo.nome}</Text>
          )}

          <View style={styles.statusRow}>
             <Text style={styles.contextText}>{ativo.equipa}</Text>
             <BadgeElegibilidade estado={ativo.elegibilidade} />
          </View>
        </View>

        <TouchableOpacity style={styles.bellBtn}>
           <Bell size={24} color="#0F172A" />
           {unreadCount > 0 && (
             <View style={styles.badgeUnread}>
                <Text style={styles.badgeUnreadText}>{unreadCount}</Text>
             </View>
           )}
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet Modal: Selecionar Dependente */}
      <Modal visible={showSelector} transparent animationType="slide">
         <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.backdrop} onPress={() => setShowSelector(false)} />
            <View style={styles.bottomSheet}>
               <View style={styles.handle} />
               <Text style={styles.sheetTitle}>Selecionar Atleta</Text>
               <ScrollView style={{ maxHeight: 300 }}>
                  {dependentes.map(dep => (
                    <TouchableOpacity 
                      key={dep.id} 
                      style={styles.depItem}
                      onPress={() => handleSelect(dep)}
                    >
                       <View style={styles.avatarContainer}><User size={20} color="#64748B" /></View>
                       <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={styles.depNome}>{dep.nome}</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                             <Text style={{ fontSize: 12, color: '#64748B' }}>{dep.equipa}</Text>
                             <BadgeElegibilidade estado={dep.elegibilidade} />
                          </View>
                       </View>
                       {ativo.id === dep.id ? (
                          <CheckCircle size={20} color="#F1C40F" />
                       ) : (
                          <View style={styles.emptyCircle} />
                       )}
                    </TouchableOpacity>
                  ))}
               </ScrollView>
            </View>
         </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
    marginLeft: 10,
  },
  pillSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nomeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 6,
  },
  contextText: {
    fontSize: 12,
    color: '#64748B',
  },
  bellBtn: {
    padding: 4,
    position: 'relative',
  },
  badgeUnread: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#991B1B',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeUnreadText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.4)' },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
  },
  handle: {
    width: 32,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    padding: 16,
  },
  depItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  depNome: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptyCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
});
