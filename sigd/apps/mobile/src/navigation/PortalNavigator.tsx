/**
 * PortalNavigator — Bottom Tab Navigator (5 itens)
 *
 * Layout conforme PORTAL.md:
 * - Fundo #FFFFFF, borda superior 1px #E2E8F0, 64px altura
 * - Item ativo: ícone + label #F1C40F
 * - Item inativo: ícone + label #64748B
 * - Item central (Cartão): círculo dourado 48×48px elevado (translateY -8px)
 * - Touch target mínimo: 44×44px (RNF-15)
 *
 * Tabs: Início | Agenda | Cartão | Docs | Conta
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, CalendarDays, CreditCard, FileText, User } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Colors } from '../constants/colors';

// ── Screens ────────────────────────────────────────────
import { InicioScreen } from '../screens/portal/InicioScreen';
import { AgendaScreen } from '../screens/portal/AgendaScreen';
import { CartaoScreen } from '../screens/portal/CartaoScreen';
import { DocumentosScreen } from '../screens/portal/DocumentosScreen';
import { ContaScreen } from '../screens/portal/ContaScreen';

// ── Tipos ──────────────────────────────────────────────

export type PortalTabParamList = {
  Inicio: undefined;
  Agenda: undefined;
  Cartao: undefined;
  Docs: undefined;
  Conta: undefined;
};

const Tab = createBottomTabNavigator<PortalTabParamList>();

// ── Mapeamento de ícones ───────────────────────────────

const TAB_ICONS: Record<keyof PortalTabParamList, LucideIcon> = {
  Inicio: Home,
  Agenda: CalendarDays,
  Cartao: CreditCard,
  Docs: FileText,
  Conta: User,
};

// ── Custom Tab Bar Icon para o Cartão (elevado) ────────

function CartaoTabIcon({ focused }: { focused: boolean }): React.JSX.Element {
  return (
    <View style={[
      cartaoStyles.circle,
      !focused && cartaoStyles.circleInactive,
    ]}>
      <CreditCard
        size={28}
        color={focused ? Colors.PRETO_PRIMARIO : Colors.GRAY_500_TEXTO2}
      />
    </View>
  );
}

const cartaoStyles = StyleSheet.create({
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.DOURADO_CTA,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
    shadowColor: Colors.PRETO_PRIMARIO,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  circleInactive: {
    backgroundColor: Colors.GRAY_100_HOVER,
  },
});

// ── Navigator ──────────────────────────────────────────

export function PortalNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          // Cartão tem tratamento especial
          if (route.name === 'Cartao') {
            return <CartaoTabIcon focused={focused} />;
          }
          const IconComponent = TAB_ICONS[route.name];
          return <IconComponent size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.DOURADO_CTA,
        tabBarInactiveTintColor: Colors.GRAY_500_TEXTO2,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: Colors.GRAY_900_TEXTO1,
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={InicioScreen}
        options={{ title: 'Início', tabBarLabel: 'Início' }}
      />
      <Tab.Screen
        name="Agenda"
        component={AgendaScreen}
        options={{ title: 'Agenda' }}
      />
      <Tab.Screen
        name="Cartao"
        component={CartaoScreen}
        options={{
          title: 'Cartão',
          tabBarLabel: 'Cartão',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Docs"
        component={DocumentosScreen}
        options={{ title: 'Documentos', tabBarLabel: 'Docs' }}
      />
      <Tab.Screen
        name="Conta"
        component={ContaScreen}
        options={{ title: 'Conta' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.BRANCO,
    borderTopWidth: 1,
    borderTopColor: Colors.GRAY_200_BORDAS,
    height: 64,
    paddingBottom: 6,
    paddingTop: 4,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  tabItem: {
    minHeight: 44,
    minWidth: 44,
  },
  header: {
    backgroundColor: Colors.BRANCO,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
    height: 56,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.GRAY_900_TEXTO1,
  },
});
