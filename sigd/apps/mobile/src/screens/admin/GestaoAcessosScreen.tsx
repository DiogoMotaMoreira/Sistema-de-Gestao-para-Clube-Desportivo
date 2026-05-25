import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Users, Search, Filter, CheckCircle, Lock, ChevronLeft, ChevronRight, Loader } from 'lucide-react-native';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button, Input, Select, Checkbox } from '@/components/ui';
import { ModalForcarReset, ModalEditarCamposCriticos } from './components/AdminModals';
import { adminService, AdminUser } from '@/services/adminService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Colors } from '@/constants/colors';

export function GestaoAcessosScreen(): React.JSX.Element {
  const queryClient = useQueryClient();
  const [isNivel2, setIsNivel2] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [pesquisa, setPesquisa] = useState('');
  
  // Modals
  const [modalReset, setModalReset] = useState<AdminUser | null>(null);
  const [modalCriticos, setModalCriticos] = useState<AdminUser | null>(null);

  // Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [requirePasswordReset, setRequirePasswordReset] = useState(false);
  const [page, setPage] = useState(0);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setPesquisa(searchString);
      setPage(0);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchString]);

  // Query
  const { data: pageData, isLoading } = useQuery({
    queryKey: ['adminUsers', pesquisa, page],
    queryFn: () => adminService.getUsers(pesquisa, page, 10),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: adminService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setIsNivel2(false);
      setUsername('');
      setEmail('');
      setRole('');
    },
  });

  const bloquearMutation = useMutation({
    mutationFn: adminService.bloquearUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminUsers'] }),
  });

  const reativarMutation = useMutation({
    mutationFn: adminService.reativarUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminUsers'] }),
  });

  const ROLES_OPTIONS = [
    { label: 'Administrador de Sistema (ROLE_ADMIN)', value: 'ROLE_ADMIN' },
    { label: 'Visão Executiva (ROLE_CEO)', value: 'ROLE_CEO' },
    { label: 'Direção Executiva (ROLE_CFO)', value: 'ROLE_CFO' },
    { label: 'Secretaria (ROLE_SECRETARIA)', value: 'ROLE_SECRETARIA' },
    { label: 'Direção Técnica (ROLE_DIRETOR_TECNICO)', value: 'ROLE_DIRETOR_TECNICO' },
    { label: 'Médico / Clínica (ROLE_MEDICO)', value: 'ROLE_MEDICO' },
    { label: 'Treinador (ROLE_TREINADOR)', value: 'ROLE_TREINADOR' },
    { label: 'Encarregado (ROLE_EE)', value: 'ROLE_EE' },
    { label: 'Atleta (ROLE_ATLETA)', value: 'ROLE_ATLETA' },
  ];

  const getFormErrors = () => {
    const errs: Record<string, string> = {};
    if (username.length > 0 && (username.length < 3 || !/^[A-Za-z0-9_]+$/.test(username))) {
      errs.username = 'Mínimo 3 caracteres, apenas letras, números e underscore';
    } else if (username.length === 0) {
      errs.username = 'Campo obrigatório';
    }
    if (email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Endereço de e-mail inválido.';
    } else if (email.length === 0) {
      errs.email = 'Campo obrigatório';
    }
    if (!role) {
      errs.role = 'Selecione um perfil';
    }
    return errs;
  };

  const formErrors = getFormErrors();
  const hasFormErrors = username.length === 0 || email.length === 0 || Object.keys(formErrors).length > 0;

  const handleCreate = () => {
    if (!hasFormErrors) {
      createMutation.mutate({ username, email, role });
    }
  };

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
             <Input
                label="Username"
                placeholder="ex: joaosilva"
                value={username}
                onChangeText={setUsername}
                error={username.length > 0 ? formErrors.username : undefined}
                required
             />
             <Input
                label="Email Institucional"
                placeholder="ex: joao.silva@boavistafc.pt"
                value={email}
                onChangeText={setEmail}
                error={email.length > 0 ? formErrors.email : undefined}
                keyboardType="email-address"
                autoCapitalize="none"
                required
             />
          </View>
          <View style={styles.card}>
             <Text style={styles.cardTitle}>Atribuição de Perfil</Text>
             <Select
                label="Perfil (Role)"
                placeholder="Selecione um perfil"
                options={ROLES_OPTIONS}
                selectedValue={role}
                onValueChange={setRole}
                error={role ? formErrors.role : undefined}
                required
             />
             <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2, marginTop: 12 }}>Um utilizador só pode ter um perfil principal neste ecrã simplificado.</Text>
          </View>
          <View style={styles.card}>
             <Text style={styles.cardTitle}>Segurança</Text>
             <Checkbox
                label="Obrigar a mudar password no próximo login"
                checked={requirePasswordReset}
                onValueChange={setRequirePasswordReset}
             />
             <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2, marginTop: 4 }}>O utilizador será redirecionado para a página de redefinição de password na próxima autenticação.</Text>
          </View>
          <View style={styles.footerRow}>
             <Button variant="secondary" label="Cancelar" onPress={() => setIsNivel2(false)} />
             <Button variant="primary" label={createMutation.isPending ? "A criar..." : "Criar Colaborador"} onPress={handleCreate} disabled={hasFormErrors || createMutation.isPending} />
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
        <Text style={styles.summaryText}>
           {pageData?.totalElements || 0} colaboradores registados
        </Text>

        {/* Barra de Filtros */}
        <View style={styles.filtersContainer}>
           <View style={styles.searchWrapper}>
              <Search size={16} color={Colors.GRAY_500_TEXTO2} style={{ marginLeft: 12 }} />
              <TextInput 
                style={styles.searchInput} 
                placeholder="Pesquisar por nome ou email..." 
                value={searchString}
                onChangeText={setSearchString}
              />
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
           
           {isLoading ? (
              <View style={{ padding: 24, alignItems: 'center' }}>
                 <Loader size={24} color={Colors.GRAY_500_TEXTO2} />
              </View>
           ) : (
              pageData?.content.map(u => (
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

                    <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
                       {u.estado === 'Ativo' ? (
                           <TouchableOpacity style={[styles.btnAcoes, { borderColor: '#FEE2E2', backgroundColor: '#FEE2E2' }]} onPress={() => bloquearMutation.mutate(u.id)}>
                              <Text style={{ color: '#991B1B', fontWeight: '600', fontSize: 11 }}>Bloquear</Text>
                           </TouchableOpacity>
                       ) : (
                           <TouchableOpacity style={[styles.btnAcoes, { borderColor: '#ECFDF5', backgroundColor: '#ECFDF5' }]} onPress={() => reativarMutation.mutate(u.id)}>
                              <Text style={{ color: '#047857', fontWeight: '600', fontSize: 11 }}>Reativar</Text>
                           </TouchableOpacity>
                       )}
                    </View>
                 </View>
              ))
           )}

            <View style={[styles.tableFooter, { justifyContent: 'flex-start', gap: 16 }]}>
               <TouchableOpacity
                 onPress={() => setPage(Math.max(0, page - 1))}
                 disabled={page === 0}
                 style={{
                   paddingHorizontal: 16,
                   paddingVertical: 8,
                   borderRadius: 8,
                   backgroundColor: page === 0 ? '#E5E7EB' : '#1B2B5E',
                   opacity: page === 0 ? 0.5 : 1,
                 }}
               >
                 <Text style={{ color: page === 0 ? '#9CA3AF' : '#FFFFFF', fontWeight: '600' }}>
                   ← Anterior
                 </Text>
               </TouchableOpacity>
               <TouchableOpacity
                 onPress={() => setPage(page + 1)}
                 disabled={pageData?.last ?? true}
                 style={{
                   paddingHorizontal: 16,
                   paddingVertical: 8,
                   borderRadius: 8,
                   backgroundColor: (pageData?.last ?? true) ? '#E5E7EB' : '#1B2B5E',
                   opacity: (pageData?.last ?? true) ? 0.5 : 1,
                 }}
               >
                 <Text style={{ color: (pageData?.last ?? true) ? '#9CA3AF' : '#FFFFFF', fontWeight: '600' }}>
                   Próxima →
                 </Text>
               </TouchableOpacity>
            </View>
        </View>

        {/* Botoes de teste para os outros modais */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 24, opacity: 0.5 }}>
           <Text style={{ fontSize: 11 }}>Testar Modais:</Text>
           <TouchableOpacity onPress={() => setModalReset(pageData?.content?.[0] || null)}><Text style={{ fontSize: 11, color: Colors.INFO_TEXT }}>Forçar Reset</Text></TouchableOpacity>
           <TouchableOpacity onPress={() => setModalCriticos(pageData?.content?.[0] || null)}><Text style={{ fontSize: 11, color: Colors.INFO_TEXT }}>Editar Críticos</Text></TouchableOpacity>
        </View>

      </ScrollView>

      {/* Modals Injetados */}
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
