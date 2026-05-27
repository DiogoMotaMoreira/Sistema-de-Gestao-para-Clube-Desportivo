import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Users, Calendar, User } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Colors } from '../constants/colors';

// ── Screens ────────────────────────────────────────────
import { HojeScreen } from '../screens/treinador/HojeScreen';
import { PlantelScreen } from '../screens/treinador/PlantelScreen';
import { JogosScreen } from '../screens/treinador/JogosScreen';
import { PerfilScreen } from '../screens/treinador/PerfilScreen';

// Flows
import { PerfilAtletaScreen } from '../screens/treinador/flows/PerfilAtletaScreen';
import { ChamadaScreen } from '../screens/treinador/flows/ChamadaScreen';
import { AvaliacaoSessaoScreen } from '../screens/treinador/flows/AvaliacaoSessaoScreen';
import { DetalheJogoScreen } from '../screens/treinador/flows/DetalheJogoScreen';
import { ConvocatoriaFlowScreen } from '../screens/treinador/flows/ConvocatoriaFlowScreen';
import { FichaJogoFlowScreen } from '../screens/treinador/flows/FichaJogoFlowScreen';
import { DetalheSessaoScreen } from '../screens/treinador/flows/DetalheSessaoScreen';

// ── Tipos ──────────────────────────────────────────────

export type TreinadorTabParamList = {
  Hoje: undefined;
  Plantel: undefined;
  Jogos: undefined;
  Eu: undefined;
};

export type TreinadorStackParamList = {
  Tabs: undefined;
  PerfilAtleta: { atletaId: number };
  Chamada: { eventoId: number };
  AvaliacaoSessao: { eventoId: number };
  DetalheJogo: { eventoId: number };
  ConvocatoriaFlow: { eventoId: number };
  FichaJogoFlow: { eventoId: number; adversario?: string };
  DetalheSessao: { sessaoId: number };
};

const Tab = createBottomTabNavigator<TreinadorTabParamList>();
const Stack = createNativeStackNavigator<TreinadorStackParamList>();

// ── Mapeamento de ícones ───────────────────────────────

const TAB_ICONS: Record<keyof TreinadorTabParamList, LucideIcon> = {
  Hoje: Home,
  Plantel: Users,
  Jogos: Calendar,
  Eu: User,
};

// ── Bottom Tabs Navigator ──────────────────────────────

function TreinadorTabs() {
  // Mock badges logic
  const hasConvocatoriaPendente = true; // For simulation
  const hasFichaPendente = true; // For simulation

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const IconComponent = TAB_ICONS[route.name];
          return (
            <View>
               <IconComponent size={size} color={color} />
               {route.name === 'Hoje' && hasConvocatoriaPendente && (
                  <View style={styles.badgeAmbar} />
               )}
               {route.name === 'Jogos' && hasFichaPendente && (
                  <View style={styles.badgeRed}>
                    <Text style={styles.badgeRedText}>1</Text>
                  </View>
               )}
            </View>
          );
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
      <Tab.Screen name="Hoje" component={HojeScreen} options={{ title: 'Hoje' }} />
      <Tab.Screen name="Plantel" component={PlantelScreen} options={{ title: 'Plantel' }} />
      <Tab.Screen name="Jogos" component={JogosScreen} options={{ title: 'Jogos' }} />
      <Tab.Screen name="Eu" component={PerfilScreen} options={{ title: 'Eu' }} />
    </Tab.Navigator>
  );
}

// ── Root Stack Navigator ───────────────────────────────

export function TreinadorNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
       screenOptions={{
         headerStyle: styles.header,
         headerTitleStyle: styles.headerTitle,
         headerTintColor: Colors.GRAY_900_TEXTO1,
       }}
    >
      <Stack.Screen 
        name="Tabs" 
        component={TreinadorTabs} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen name="PerfilAtleta" component={PerfilAtletaScreen} />
      <Stack.Screen name="Chamada" component={ChamadaScreen} />
      <Stack.Screen name="AvaliacaoSessao" component={AvaliacaoSessaoScreen} />
      <Stack.Screen name="DetalheJogo" component={DetalheJogoScreen} />
      <Stack.Screen name="ConvocatoriaFlow" component={ConvocatoriaFlowScreen} />
      <Stack.Screen name="FichaJogoFlow" component={FichaJogoFlowScreen} />
      <Stack.Screen name="DetalheSessao" component={DetalheSessaoScreen} />
    </Stack.Navigator>
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
  badgeAmbar: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B45309',
  },
  badgeRed: {
    position: 'absolute',
    top: -6,
    right: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#991B1B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRedText: {
    color: Colors.BRANCO,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
