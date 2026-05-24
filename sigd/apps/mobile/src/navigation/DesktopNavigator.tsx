/**
 * DesktopNavigator — Drawer Navigator (Sidebar) para roles Desktop.
 *
 * Layout conforme DESIGN.md §2.1:
 * - Sidebar fixa à esquerda, 280px, fundo #000000
 * - Item ativo: fundo suave com barra vertical dourada à esquerda
 * - Page Header: #FFFFFF com breadcrumbs
 * - Content Area: #F8FAFC
 *
 * Os itens da sidebar são filtrados dinamicamente pelo activeRole.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {
  Shield,
  ShieldCheck,
  Settings,
  LayoutDashboard,
  TrendingUp,
  Trophy,
  Users,
  Headphones,
  Building2,
  FileCheck,
  Calendar,
  ClipboardList,
  FolderOpen,
  Activity,
  BarChart3,
  FileText,
  LogOut,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { Role, RoleLabels } from '../constants/roles';
import { useAuthStore } from '../stores/authStore';

// ── Screens ────────────────────────────────────────────
import { GestaoAcessosScreen } from '../screens/admin/GestaoAcessosScreen';
import { AuditoriaScreen } from '../screens/admin/AuditoriaScreen';
import { ConfiguracoesScreen } from '../screens/admin/ConfiguracoesScreen';
import { VisaoExecutivaScreen } from '../screens/ceo/VisaoExecutivaScreen';
import { AnaliseFinanceiraScreen } from '../screens/ceo/AnaliseFinanceiraScreen';
import { PerformanceDesportivaScreen } from '../screens/ceo/PerformanceDesportivaScreen';
import { BaseAssociativaScreen } from '../screens/ceo/BaseAssociativaScreen';
import { AuditoriaCEOScreen } from '../screens/ceo/AuditoriaCEOScreen';
import { DashboardFinanceiroScreen } from '../screens/cfo/DashboardFinanceiroScreen';
import { RelatoriosScreen } from '../screens/cfo/RelatoriosScreen';
import { AtendimentoScreen } from '../screens/secretaria/AtendimentoScreen';
import { SecretariaScreen } from '../screens/secretaria/SecretariaScreen';
import { ValidacaoDocumentalScreen } from '../screens/secretaria/ValidacaoDocumentalScreen';
import { ConfiguracoesSecScreen } from '../screens/secretaria/ConfiguracoesSecScreen';
import { CalendarioScreen } from '../screens/diretor/CalendarioScreen';
import { PlanteisScreen } from '../screens/diretor/PlanteisScreen';
import { QuadrosScreen } from '../screens/diretor/QuadrosScreen';
import { AnaliseScreen } from '../screens/diretor/AnaliseScreen';
import { FilaEMDsScreen } from '../screens/medico/FilaEMDsScreen';
import { DossiesScreen } from '../screens/medico/DossiesScreen';
import { MonitorizacaoScreen } from '../screens/medico/MonitorizacaoScreen';

// ── Tipos ──────────────────────────────────────────────

interface DrawerItem {
  name: string;
  label: string;
  component: React.ComponentType;
  icon: LucideIcon;
}

// ── Configuração de itens por role ─────────────────────

const DRAWER_ITEMS_BY_ROLE: Record<string, DrawerItem[]> = {
  [Role.ADMIN]: [
    { name: 'GestaoAcessos', label: 'Gestão de Acessos', component: GestaoAcessosScreen, icon: Shield },
    { name: 'Auditoria', label: 'Auditoria e Segurança', component: AuditoriaScreen, icon: ShieldCheck },
    { name: 'Configuracoes', label: 'Configurações Globais', component: ConfiguracoesScreen, icon: Settings },
  ],
  [Role.CEO]: [
    { name: 'VisaoExecutiva', label: 'Visão Executiva', component: VisaoExecutivaScreen, icon: LayoutDashboard },
    { name: 'AnaliseFinanceira', label: 'Análise Financeira', component: AnaliseFinanceiraScreen, icon: TrendingUp },
    { name: 'PerformanceDesportiva', label: 'Performance Desportiva', component: PerformanceDesportivaScreen, icon: Trophy },
    { name: 'BaseAssociativa', label: 'Base Associativa', component: BaseAssociativaScreen, icon: Users },
    { name: 'AuditoriaCEO', label: 'Auditoria', component: AuditoriaCEOScreen, icon: ShieldCheck },
  ],
  [Role.CFO]: [
    { name: 'DashboardFinanceiro', label: 'Dashboard Financeiro', component: DashboardFinanceiroScreen, icon: BarChart3 },
    { name: 'Relatorios', label: 'Relatórios', component: RelatoriosScreen, icon: FileText },
  ],
  [Role.SECRETARIA]: [
    { name: 'Atendimento', label: 'Atendimento', component: AtendimentoScreen, icon: Headphones },
    { name: 'Entidades', label: 'Entidades', component: SecretariaScreen, icon: Building2 },
    { name: 'ValidacaoDocumental', label: 'Validação Documental', component: ValidacaoDocumentalScreen, icon: FileCheck },
    { name: 'ConfiguracoesSec', label: 'Configurações', component: ConfiguracoesSecScreen, icon: Settings },
  ],
  [Role.DIRETOR_TECNICO]: [
    { name: 'Calendario', label: 'Calendário', component: CalendarioScreen, icon: Calendar },
    { name: 'Planteis', label: 'Plantéis', component: PlanteisScreen, icon: Users },
    { name: 'Quadros', label: 'Quadros Competitivos', component: QuadrosScreen, icon: Trophy },
    { name: 'Analise', label: 'Análise', component: AnaliseScreen, icon: BarChart3 },
  ],
  [Role.MEDICO]: [
    { name: 'FilaEMDs', label: 'Fila de EMDs', component: FilaEMDsScreen, icon: ClipboardList },
    { name: 'Dossies', label: 'Dossiês Clínicos', component: DossiesScreen, icon: FolderOpen },
    { name: 'Monitorizacao', label: 'Monitorização', component: MonitorizacaoScreen, icon: Activity },
  ],
};

// ── Custom Drawer Content ──────────────────────────────

function CustomDrawerContent(props: DrawerContentComponentProps): React.JSX.Element {
  const { state, navigation } = props;
  const user = useAuthStore((s) => s.user);
  const activeRole = useAuthStore((s) => s.activeRole);
  const logout = useAuthStore((s) => s.logout);

  const items = activeRole ? (DRAWER_ITEMS_BY_ROLE[activeRole] ?? []) : [];

  return (
    <View style={drawerStyles.container}>
      {/* Header com info do utilizador */}
      <View style={drawerStyles.header}>
        <View style={drawerStyles.avatarCircle}>
          <Text style={drawerStyles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
          </Text>
        </View>
        <Text style={drawerStyles.userName} numberOfLines={1}>
          {user?.name ?? 'Utilizador'}
        </Text>
        <Text style={drawerStyles.userRole} numberOfLines={1}>
          {activeRole ? RoleLabels[activeRole] : ''}
        </Text>
      </View>

      {/* Navigation Items */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={drawerStyles.scrollContent}
      >
        {items.map((item, index) => {
          const isActive = state.index === index;
          const IconComponent = item.icon;

          return (
            <TouchableOpacity
              key={item.name}
              style={[
                drawerStyles.item,
                isActive && drawerStyles.itemActive,
              ]}
              onPress={() => navigation.navigate(item.name)}
              activeOpacity={0.7}
              accessibilityLabel={`Navegar para ${item.label}`}
              accessibilityRole="button"
            >
              {isActive && <View style={drawerStyles.activeIndicator} />}
              <IconComponent
                size={20}
                color={isActive ? Colors.DOURADO_CTA : Colors.GRAY_500_TEXTO2}
              />
              <Text
                style={[
                  drawerStyles.itemLabel,
                  isActive && drawerStyles.itemLabelActive,
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </DrawerContentScrollView>

      {/* Logout */}
      <TouchableOpacity
        style={drawerStyles.logoutButton}
        onPress={logout}
        activeOpacity={0.7}
        accessibilityLabel="Terminar sessão"
        accessibilityRole="button"
      >
        <LogOut size={20} color={Colors.ERRO_TEXT} />
        <Text style={drawerStyles.logoutText}>Terminar Sessão</Text>
      </TouchableOpacity>
    </View>
  );
}

const drawerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PRETO_PRIMARIO,
  },
  header: {
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.DOURADO_CTA,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.PRETO_PRIMARIO,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.BRANCO,
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.GRAY_500_TEXTO2,
  },
  scrollContent: {
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 2,
    position: 'relative',
  },
  itemActive: {
    backgroundColor: 'rgba(241, 196, 15, 0.08)',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    borderRadius: 2,
    backgroundColor: Colors.DOURADO_CTA,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.GRAY_500_TEXTO2,
    marginLeft: 12,
    flex: 1,
  },
  itemLabelActive: {
    color: Colors.BRANCO,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.ERRO_TEXT,
    marginLeft: 12,
  },
});

// ── Drawer Navigator ───────────────────────────────────

const Drawer = createDrawerNavigator();

export function DesktopNavigator(): React.JSX.Element {
  const activeRole = useAuthStore((s) => s.activeRole);
  const items = activeRole ? (DRAWER_ITEMS_BY_ROLE[activeRole] ?? []) : [];

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: 'permanent',
        drawerStyle: {
          width: 280,
          backgroundColor: Colors.PRETO_PRIMARIO,
        },
        headerStyle: {
          backgroundColor: Colors.BRANCO,
          height: 64,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.GRAY_200_BORDAS,
        },
        headerTintColor: Colors.GRAY_900_TEXTO1,
        headerTitleStyle: {
          fontSize: 16,
          fontWeight: '600',
        },
      }}
    >
      {items.map((item) => (
        <Drawer.Screen
          key={item.name}
          name={item.name}
          component={item.component}
          options={{
            title: item.label,
          }}
        />
      ))}
    </Drawer.Navigator>
  );
}
