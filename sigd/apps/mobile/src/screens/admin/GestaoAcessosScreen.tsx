import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Users, Search, Filter, CheckCircle, Lock } from 'lucide-react-native';
import { PageHeader } from '../../components/ui/PageHeader';
import { ModalBloquearAcesso, ModalReativarAcesso, ModalForcarReset, ModalEditarCamposCriticos } from './components/AdminModals';
import { adminService, AdminUser } from '@/services/adminService';
import { Colors } from '@/constants/colors';

export function GestaoAcessosScreen(): React.JSX.Element {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isNivel2, setIsNivel2] = useState(false);
  
  // Modals
  const [modalBloquear, setModalBloquear] = useState<AdminUser | null>(null);
  const [modalReativar, setModalReativar] = useState<AdminUser | null>(null);
  const [modalReset, setModalReset] = useState<AdminUser | null>(null);
  const [modalCriticos, setModalCriticos] = useState<AdminUser | null>(null);

  useEffect(() => {
    adminService.getUsers().then(setUsers);
  }, []);

  const renderBadgeRole = (role: string) => {
    const isAdmin = role === 'ROLE_ADMIN';
    const nome = role.replace('ROLE_', '').replace('_', ' ');
    return (
      <View key={role} style={[styles.badgePill, { backgroundColor: isAdmin ? '#FEE2E2' : '#EFF6FF' }]}>
        <Text style={[styles.badgeText, { color: isAdmin ? '#991B1B' : '#1D4ED8' }]}>{nome}</Text>
      </View>
    );
  };

  if (isNivel2) {
    return (
      <View style={styles.container}>
        <PageHeader title="Novo Colaborador" breadcrumbs={[{ label: 'Gestão de Acessos' }, { label: 'Novo Colaborador' }]} />
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
             <Text style={styles.cardTitle}>Dados do Colaborador</Text>
             <Text style={styles.label}>Nome Completo *</Text>
             <TextInput style={styles.input} placeholder="ex: João Silva" />
             <Text style={styles.label}>Email Institucional *</Text>
             <TextInput style={styles.input} placeholder="ex: joao.silva@boavistafc.pt" />
          </View>
          <View style={styles.card}>
             <Text style={styles.cardTitle}>Atribuição de Roles</Text>
             <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 13, color: Colors.GRAY_900_TEXTO1 }}>[ ] Administrador de Sistema</Text>
                <Text style={{ fontSize: 13, color: Colors.GRAY_900_TEXTO1 }}>[ ] Secretaria</Text>
                <Text style={{ fontSize: 13, color: Colors.GRAY_900_TEXTO1 }}>[ ] Treinador</Text>
                <Text style={{ fontSize: 13, color: Colors.GRAY_900_TEXTO1 }}>[ ] Médico / Departamento Clínico</Text>
             </View>
             <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2, marginTop: 12 }}>Um utilizador pode acumular múltiplos perfis em simultâneo.</Text>
          </View>
          <View style={styles.card}>
             <Text style={styles.cardTitle}>Segurança</Text>
             <Text style={{ fontSize: 13, color: Colors.GRAY_900_TEXTO1 }}>[ ] Obrigar a mudar password no próximo login</Text>
             <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2, marginTop: 4 }}>O utilizador será redirecionado para a página de redefinição de password na próxima autenticação.</Text>
          </View>
          <View style={styles.footerRow}>
             <TouchableOpacity style={styles.btnOutline} onPress={() => setIsNivel2(false)}><Text style={styles.btnOutlineText}>Cancelar</Text></TouchableOpacity>
             <TouchableOpacity style={styles.btnDourado} onPress={() => setIsNivel2(false)}><Text style={styles.btnDouradoText}>Criar Colaborador</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PageHeader
        title="Gestão de Acessos"
        breadcrumbs={[
          { label: 'Administração de Sistema' },
          { label: 'Gestão de Acessos' },
        ]}
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        
        {/* Barra de Sumário */}
        <Text style={styles.summaryText}>5 colaboradores  ·  1 bloqueados  ·  1 sem login registado</Text>

        {/* Barra de Filtros */}
        <View style={styles.filtersContainer}>
           <View style={styles.searchWrapper}>
              <Search size={16} color={Colors.GRAY_500_TEXTO2} style={{ marginLeft: 12 }} />
              <TextInput style={styles.searchInput} placeholder="Pesquisar por nome ou email..." />
           </View>
           <TouchableOpacity style={styles.btnOutline}>
              <Text style={styles.btnOutlineText}>Filtros ▾</Text>
           </TouchableOpacity>
           <View style={{ flex: 1 }} />
           <TouchableOpacity style={styles.btnDourado} onPress={() => setIsNivel2(true)}>
              <Text style={styles.btnDouradoText}>+ Novo Colaborador</Text>
           </TouchableOpacity>
        </View>

        {/* Tabela */}
        <View style={styles.table}>
           <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 2.5 }]}>UTILIZADOR</Text>
              <Text style={[styles.th, { flex: 2 }]}>PERFIL(ES)</Text>
              <Text style={[styles.th, { flex: 1.5 }]}>ÚLTIMO LOGIN</Text>
              <Text style={[styles.th, { flex: 1.5 }]}>ESTADO</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>AÇÕES</Text>
           </View>
           
           {users.map(u => (
              <View key={u.id} style={styles.tableRow}>
                 <View style={{ flex: 2.5 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: Colors.GRAY_900_TEXTO1 }}>{u.nome}</Text>
                    <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2 }}>{u.email}</Text>
                 </View>
                 
                 <View style={{ flex: 2, flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    {u.roles.map(r => renderBadgeRole(r))}
                 </View>

                 <View style={{ flex: 1.5 }}>
                    <Text style={{ fontSize: 13, color: u.ultimoLogin === 'Nunca' ? Colors.GRAY_500_TEXTO2 : Colors.GRAY_900_TEXTO1, fontStyle: u.ultimoLogin === 'Nunca' ? 'italic' : 'normal' }}>
                      {u.ultimoLogin}
                    </Text>
                 </View>

                 <View style={{ flex: 1.5 }}>
                    {u.estado === 'Ativo' ? (
                       <View style={[styles.badgePill, { backgroundColor: '#ECFDF5', flexDirection: 'row', alignItems: 'center' }]}>
                          <CheckCircle size={12} color="#047857" style={{ marginRight: 4 }} />
                          <Text style={{ color: '#047857', fontSize: 11, fontWeight: '600' }}>Ativo</Text>
                       </View>
                    ) : (
                       <View style={[styles.badgePill, { backgroundColor: '#FEE2E2', flexDirection: 'row', alignItems: 'center' }]}>
                          <Lock size={12} color="#991B1B" style={{ marginRight: 4 }} />
                          <Text style={{ color: '#991B1B', fontSize: 11, fontWeight: '600' }}>Bloqueado</Text>
                       </View>
                    )}
                 </View>

                 <View style={{ flex: 1, alignItems: 'center' }}>
                    <TouchableOpacity style={styles.btnAcoes} onPress={() => {
                        // Simulação de clique num menu dropdown.
                        // Para simplificar, vou abrir o primeiro modal condicionado ao estado:
                        if (u.estado === 'Ativo') setModalBloquear(u);
                        else setModalReativar(u);
                    }}>
                       <Text style={{ color: Colors.GRAY_500_TEXTO2, fontWeight: '700' }}>···</Text>
                    </TouchableOpacity>
                 </View>
              </View>
           ))}

           <View style={styles.tableFooter}>
              <Text style={{ fontSize: 12, color: Colors.INFO_TEXT, fontWeight: '500' }}>← Anterior</Text>
              <Text style={{ fontSize: 12, color: Colors.INFO_TEXT, fontWeight: '500' }}>Próxima →</Text>
           </View>
        </View>

        {/* Botoes de teste para os outros modais */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 24, opacity: 0.5 }}>
           <Text style={{ fontSize: 11 }}>Testar Modais:</Text>
           <TouchableOpacity onPress={() => setModalReset(users[0])}><Text style={{ fontSize: 11, color: Colors.INFO_TEXT }}>Forçar Reset</Text></TouchableOpacity>
           <TouchableOpacity onPress={() => setModalCriticos(users[0])}><Text style={{ fontSize: 11, color: Colors.INFO_TEXT }}>Editar Críticos</Text></TouchableOpacity>
        </View>

      </ScrollView>

      {/* Modals Injetados */}
      <ModalBloquearAcesso visible={!!modalBloquear} onClose={() => setModalBloquear(null)} user={modalBloquear} />
      <ModalReativarAcesso visible={!!modalReativar} onClose={() => setModalReativar(null)} user={modalReativar} />
      <ModalForcarReset visible={!!modalReset} onClose={() => setModalReset(null)} user={modalReset} />
      <ModalEditarCamposCriticos visible={!!modalCriticos} onClose={() => setModalCriticos(null)} user={modalCriticos} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.GRAY_50_FUNDO },
  content: { flex: 1 },
  scrollContent: { padding: 32, gap: 16 },
  summaryText: { fontSize: 12, color: Colors.GRAY_500_TEXTO2 },
  filtersContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.BRANCO, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 12, padding: 16, gap: 12 },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, flex: 1, maxWidth: 300 },
  searchInput: { paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, flex: 1, outlineStyle: 'none' as any },
  btnOutline: { borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  btnOutlineText: { fontSize: 13, fontWeight: '500', color: Colors.GRAY_900_TEXTO1 },
  btnDourado: { backgroundColor: Colors.DOURADO_CTA, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  btnDouradoText: { fontSize: 13, fontWeight: '600', color: Colors.BRANCO },
  table: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, overflow: 'hidden', backgroundColor: Colors.BRANCO },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  th: { fontSize: 11, fontWeight: '600', color: Colors.GRAY_500_TEXTO2 },
  tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', alignItems: 'center' },
  badgePill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, alignSelf: 'flex-start' },
  badgeText: { fontSize: 10, fontWeight: '600', textTransform: 'capitalize' },
  btnAcoes: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS },
  tableFooter: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  card: { backgroundColor: Colors.BRANCO, borderRadius: 12, padding: 24, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS },
  cardTitle: { fontSize: 16, fontWeight: '600', color: Colors.GRAY_900_TEXTO1, marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: Colors.GRAY_900_TEXTO1, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, marginBottom: 16 },
  footerRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 16 }
});
