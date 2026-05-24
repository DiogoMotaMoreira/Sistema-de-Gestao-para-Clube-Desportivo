/**
 * ClinicaScreen — Ecrã principal do módulo Clínica (RF-16).
 *
 * Implementa navegação interna por tabs (Fila EMD, Histórico, Nova Ocorrência)
 * com sub-ecrã de detalhe gerido por estado interno (sem nested navigators).
 *
 * Visível para ROLE_MEDICO e ROLE_ADMIN.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  ClipboardList,
  FileSearch,
  Plus,
  ArrowLeft,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';

// Sub-screens
import { FilaEMDScreen } from './fila/FilaEMDScreen';
import { HistoricoAtletaScreen } from './historico/HistoricoAtletaScreen';
import { OcorrenciaDetailScreen } from './ocorrencias/OcorrenciaDetailScreen';
import { OcorrenciaCreateScreen } from './ocorrencias/OcorrenciaCreateScreen';

// ── Tipos ──────────────────────────────────────────────

type TabKey = 'fila' | 'historico' | 'criar';
type ScreenView = { type: 'tabs' } | { type: 'detail'; id: number } | { type: 'create' };

interface TabConfig {
  key: TabKey;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
}

const TABS: TabConfig[] = [
  { key: 'fila', label: 'Fila EMD', icon: ClipboardList },
  { key: 'historico', label: 'Histórico', icon: FileSearch },
  { key: 'criar', label: 'Nova Ocorrência', icon: Plus },
];

// ── Component ──────────────────────────────────────────

export function ClinicaScreen(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<TabKey>('fila');
  const [screenView, setScreenView] = useState<ScreenView>({ type: 'tabs' });

  // ── Navigation handlers ────────────────────────────────

  const handleNavigateToDetail = useCallback((id: number) => {
    setScreenView({ type: 'detail', id });
  }, []);

  const handleNavigateToCreate = useCallback(() => {
    setActiveTab('criar');
    setScreenView({ type: 'tabs' });
  }, []);

  const handleGoBack = useCallback(() => {
    setScreenView({ type: 'tabs' });
  }, []);

  const handleCreateSuccess = useCallback(() => {
    setActiveTab('fila');
    setScreenView({ type: 'tabs' });
  }, []);

  // ── Detail sub-screen ──────────────────────────────────

  if (screenView.type === 'detail') {
    return (
      <View style={styles.container}>
        {/* Back header */}
        <View style={styles.detailHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            accessibilityLabel="Voltar"
            accessibilityRole="button"
          >
            <ArrowLeft size={20} color={Colors.GRAY_900_TEXTO1} />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
        </View>
        <OcorrenciaDetailScreen
          ocorrenciaId={screenView.id}
          onGoBack={handleGoBack}
        />
      </View>
    );
  }

  // ── Tabs view ──────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const IconComponent = tab.icon;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              accessibilityLabel={tab.label}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <IconComponent
                size={18}
                color={isActive ? Colors.DOURADO_CTA : Colors.GRAY_500_TEXTO2}
              />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {activeTab === 'fila' && (
          <FilaEMDScreen
            onNavigateToDetail={handleNavigateToDetail}
            onNavigateToCreate={handleNavigateToCreate}
          />
        )}
        {activeTab === 'historico' && (
          <HistoricoAtletaScreen
            onNavigateToDetail={handleNavigateToDetail}
          />
        )}
        {activeTab === 'criar' && (
          <OcorrenciaCreateScreen
            onSuccess={handleCreateSuccess}
            onGoBack={handleGoBack}
          />
        )}
      </View>
    </View>
  );
}

// ── Estilos ────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.BRANCO,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
    position: 'relative',
  },
  tabActive: {
    backgroundColor: 'rgba(241, 196, 15, 0.04)',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.GRAY_500_TEXTO2,
  },
  tabLabelActive: {
    fontWeight: '600',
    color: Colors.GRAY_900_TEXTO1,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.DOURADO_CTA,
  },
  content: {
    flex: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.BRANCO,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.GRAY_900_TEXTO1,
  },
});
