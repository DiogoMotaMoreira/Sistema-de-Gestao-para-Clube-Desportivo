/**
 * SecretariaScreen — Container com Bottom Tabs para o módulo Secretaria.
 *
 * 3 tabs: Encarregados, Atletas, Equipas.
 * Cada tab mantém estado de navegação interna (list → detail).
 * Usa o design system SIGD com dourado CTA para tab ativa.
 * Faixa de KPIs reais no topo: Total Atletas, Total EEs, Dívida Activa.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Users, UserCheck, Shield } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { secretariaService } from '@/services/secretariaService';
import { cfoService } from '@/services/cfoService';
import { EncarregadoListScreen } from './encarregados/EncarregadoListScreen';
import { EncarregadoDetailScreen } from './encarregados/EncarregadoDetailScreen';
import { AtletaListScreen } from './atletas/AtletaListScreen';
import { AtletaDetailScreen } from './atletas/AtletaDetailScreen';
import { EquipaListScreen } from './equipas/EquipaListScreen';

type TabKey = 'encarregados' | 'atletas' | 'equipas';

interface TabConfig {
  key: TabKey;
  label: string;
  icon: LucideIcon;
}

const TABS: TabConfig[] = [
  { key: 'encarregados', label: 'Encarregados', icon: Users },
  { key: 'atletas', label: 'Atletas', icon: UserCheck },
  { key: 'equipas', label: 'Equipas', icon: Shield },
];

export function SecretariaScreen(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<TabKey>('encarregados');
  const [selectedEncarregadoId, setSelectedEncarregadoId] = useState<number | null>(null);
  const [selectedAtletaId, setSelectedAtletaId] = useState<number | null>(null);

  // KPI state
  const [kpiAtletas, setKpiAtletas] = useState<number | null>(null);
  const [kpiEEs, setKpiEEs] = useState<number | null>(null);
  const [kpiDivida, setKpiDivida] = useState<number | null>(null);

  useEffect(() => {
    secretariaService.getAtletas(undefined, undefined, 0, 1)
      .then(d => setKpiAtletas(d.totalElements))
      .catch(() => {});
    secretariaService.getEncarregados(undefined, 0, 1)
      .then(d => setKpiEEs(d.totalElements))
      .catch(() => {});
    cfoService.getResumoFinanceiro()
      .then(r => setKpiDivida(r.global.divida))
      .catch(() => {});
  }, []);

  const fmtEur = (v: number): string =>
    new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

  const handleTabChange = (tab: TabKey): void => {
    setActiveTab(tab);
    setSelectedEncarregadoId(null);
    setSelectedAtletaId(null);
  };

  // Render active screen content
  const renderContent = (): React.JSX.Element => {
    switch (activeTab) {
      case 'encarregados':
        if (selectedEncarregadoId != null) {
          return (
            <EncarregadoDetailScreen
              encarregadoId={selectedEncarregadoId}
              onBack={() => setSelectedEncarregadoId(null)}
            />
          );
        }
        return (
          <EncarregadoListScreen
            onSelectEncarregado={(id) => setSelectedEncarregadoId(id)}
          />
        );

      case 'atletas':
        if (selectedAtletaId != null) {
          return (
            <AtletaDetailScreen
              atletaId={selectedAtletaId}
              onBack={() => setSelectedAtletaId(null)}
            />
          );
        }
        return (
          <AtletaListScreen
            onSelectAtleta={(id) => setSelectedAtletaId(id)}
          />
        );

      case 'equipas':
        return <EquipaListScreen />;

      default:
        return <EncarregadoListScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {/* KPI Strip — dados reais */}
      <View style={styles.kpiStrip}>
        <View style={styles.kpiItem}>
          <Text style={styles.kpiValue}>{kpiAtletas !== null ? kpiAtletas : '—'}</Text>
          <Text style={styles.kpiLabel}>Atletas</Text>
        </View>
        <View style={styles.kpiDivider} />
        <View style={styles.kpiItem}>
          <Text style={styles.kpiValue}>{kpiEEs !== null ? kpiEEs : '—'}</Text>
          <Text style={styles.kpiLabel}>Encarregados</Text>
        </View>
        <View style={styles.kpiDivider} />
        <View style={styles.kpiItem}>
          <Text style={[styles.kpiValue, kpiDivida !== null && kpiDivida > 0 ? { color: Colors.ERRO_TEXT } : {}]}>
            {kpiDivida !== null ? fmtEur(kpiDivida) : '—'}
          </Text>
          <Text style={styles.kpiLabel}>Dívida Activa</Text>
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        {renderContent()}
      </View>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const IconComponent = tab.icon;

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => handleTabChange(tab.key)}
              activeOpacity={0.7}
              accessibilityLabel={`Tab ${tab.label}`}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              {isActive && <View style={styles.tabActiveIndicator} />}
              <IconComponent
                size={22}
                color={isActive ? Colors.DOURADO_CTA : Colors.GRAY_500_TEXTO2}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  kpiStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.BRANCO,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  kpiItem: {
    flex: 1,
    alignItems: 'center',
  },
  kpiDivider: {
    width: 1,
    backgroundColor: Colors.GRAY_200_BORDAS,
    marginVertical: 2,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
  },
  kpiLabel: {
    fontSize: 10,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 2,
  },
  contentArea: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.BRANCO,
    borderTopWidth: 1,
    borderTopColor: Colors.GRAY_200_BORDAS,
    paddingBottom: 4,
    shadowColor: Colors.PRETO_PRIMARIO,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  tabActiveIndicator: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.DOURADO_CTA,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 4,
  },
  tabLabelActive: {
    color: Colors.DOURADO_CTA,
    fontWeight: '600',
  },
});
