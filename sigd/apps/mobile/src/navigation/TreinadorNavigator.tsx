/**
 * TreinadorNavigator — Bottom Tab Navigator (4 itens)
 *
 * Layout conforme TREINADOR.md:
 * - Fundo #FFFFFF, borda superior 1px #E2E8F0, 56px altura
 * - Item ativo: ícone + label #F1C40F
 * - Item inativo: ícone + label #64748B (Gray 500)
 * - Touch target mínimo: 44×44px (RNF-15)
 *
 * Tabs: Hoje | Plantel | Jogos | Eu
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Users, Calendar, User } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Colors } from '../constants/colors';

// ── Screens ────────────────────────────────────────────
import { HojeScreen } from '../screens/treinador/HojeScreen';
import { PlantelScreen } from '../screens/treinador/PlantelScreen';
import { JogosScreen } from '../screens/treinador/JogosScreen';
import { PerfilScreen } from '../screens/treinador/PerfilScreen';

// ── Tipos ──────────────────────────────────────────────

export type TreinadorTabParamList = {
  Hoje: undefined;
  Plantel: undefined;
  Jogos: undefined;
  Eu: undefined;
};

const Tab = createBottomTabNavigator<TreinadorTabParamList>();

// ── Mapeamento de ícones ───────────────────────────────

const TAB_ICONS: Record<keyof TreinadorTabParamList, LucideIcon> = {
  Hoje: Home,
  Plantel: Users,
  Jogos: Calendar,
  Eu: User,
};

// ── Navigator ──────────────────────────────────────────

export function TreinadorNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
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
        name="Hoje"
        component={HojeScreen}
        options={{ title: 'Hoje' }}
      />
      <Tab.Screen
        name="Plantel"
        component={PlantelScreen}
        options={{ title: 'Plantel' }}
      />
      <Tab.Screen
        name="Jogos"
        component={JogosScreen}
        options={{ title: 'Jogos' }}
      />
      <Tab.Screen
        name="Eu"
        component={PerfilScreen}
        options={{ title: 'Eu' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.BRANCO,
    borderTopWidth: 1,
    borderTopColor: Colors.GRAY_200_BORDAS,
    height: 56,
    paddingBottom: 4,
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
