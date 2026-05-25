import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Calendar, Search, CheckCircle, Clock, XCircle, AlertTriangle, ExternalLink, Info } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

// Tipos Mockados
type EstadoPreventivo = 'VALIDO' | 'A_EXPIRAR' | 'EXPIRADO';

interface AtletaMonitor {
  id: string;
  nome: string;
  escalao: string;
  dataValidade: string;
  estado: EstadoPreventivo;
  alertaEnviado: string | null;
  alertaFalhou?: boolean;
}

const MOCK_MONITOR: AtletaMonitor[] = [
  { id: '1', nome: 'João Silva', escalao: 'Sub-15', dataValidade: '20/12/2026', estado: 'VALIDO', alertaEnviado: null },
  { id: '2', nome: 'Tomás Costa', escalao: 'Sub-17', dataValidade: '30/05/2026', estado: 'A_EXPIRAR', alertaEnviado: '15/05/2026 · 10:00' },
  { id: '3', nome: 'Ricardo Oliveira', escalao: 'Seniores', dataValidade: '10/05/2026', estado: 'EXPIRADO', alertaEnviado: '26/04/2026 · 14:00' },
];

export function MonitorizacaoScreen(): React.JSX.Element {
  const [filterType, setFilterType] = useState<'TODOS' | 'A_EXPIRAR' | 'EXPIRADO'>('TODOS');
  const [search, setSearch] = useState('');

  const filtrados = MOCK_MONITOR.filter(a => {
    if (filterType === 'A_EXPIRAR' && a.estado !== 'A_EXPIRAR') return false;
    if (filterType === 'EXPIRADO' && a.estado !== 'EXPIRADO') return false;
    if (search && !a.nome.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Alerta de Reavaliações (Condicional - mock always visible for demo) */}
      <View style={styles.alertCard}>
        <View style={styles.alertHeader}>
          <Calendar size={16} color="#B45309" />
          <Text style={styles.alertTitle}>Reavaliações Clínicas nos Próximos 7 Dias</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.alertList}>
          <TouchableOpacity style={styles.alertPill}>
            <Text style={styles.alertPillName}>Dr. João Silva</Text>
            <Text style={styles.alertPillMeta}>Sub-17 · Reavaliação: 25/05/2026</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Barra de Filtros */}
      <View style={styles.filtersBar}>
        <View style={styles.toggleGroup}>
          <TouchableOpacity
            style={[styles.toggleBtn, filterType === 'TODOS' && styles.toggleBtnActiveTodos]}
            onPress={() => setFilterType('TODOS')}
          >
            <Text style={[styles.toggleText, filterType === 'TODOS' && styles.toggleTextActiveTodos]}>Todos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, filterType === 'A_EXPIRAR' && styles.toggleBtnActiveAExpirar]}
            onPress={() => setFilterType('A_EXPIRAR')}
          >
            <Text style={[styles.toggleTextExpirar, filterType === 'A_EXPIRAR' && styles.toggleTextActiveExpirar]}>A Expirar {'(< 30 dias)'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, filterType === 'EXPIRADO' && styles.toggleBtnActiveExpirados]}
            onPress={() => setFilterType('EXPIRADO')}
          >
            <Text style={[styles.toggleTextExpirados, filterType === 'EXPIRADO' && styles.toggleTextActiveExpirados]}>Expirados</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={16} color={Colors.GRAY_500_TEXTO2} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar atleta..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Tabela de Monitorização */}
      <View style={styles.tableContainer}>
        {/* Cabeçalho */}
        <View style={styles.tableHeader}>
          <Text style={[styles.th, { flex: 2 }]}>ATLETA</Text>
          <Text style={[styles.th, { flex: 2 }]}>ESCALÃO / EQUIPA</Text>
          <Text style={[styles.th, { flex: 2 }]}>DATA VALIDADE EMD</Text>
          <Text style={[styles.th, { flex: 2 }]}>ESTADO PREVENTIVO</Text>
          <Text style={[styles.th, { flex: 2 }]}>ALERTA ENVIADO</Text>
          <Text style={[styles.th, { flex: 1 }]}></Text>
        </View>

        {/* Linhas */}
        <ScrollView>
          {filtrados.map(a => (
            <View key={a.id} style={styles.tr}>
              <Text style={[styles.tdBold, { flex: 2 }]}>{a.nome}</Text>
              <Text style={[styles.td, { flex: 2 }]}>{a.escalao}</Text>
              <Text style={[styles.td, { flex: 2 }]}>{a.dataValidade}</Text>
              <View style={[styles.tdContent, { flex: 2 }]}>
                {a.estado === 'VALIDO' && (
                  <View style={[styles.badge, { backgroundColor: '#ECFDF5' }]}>
                    <CheckCircle size={12} color="#047857" />
                    <Text style={[styles.badgeText, { color: '#047857' }]}>Válido</Text>
                  </View>
                )}
                {a.estado === 'A_EXPIRAR' && (
                  <View style={[styles.badge, { backgroundColor: '#FFFBEB' }]}>
                    <Clock size={12} color="#B45309" />
                    <Text style={[styles.badgeText, { color: '#B45309' }]}>A Expirar</Text>
                  </View>
                )}
                {a.estado === 'EXPIRADO' && (
                  <View style={[styles.badge, { backgroundColor: '#FEE2E2' }]}>
                    <XCircle size={12} color="#991B1B" />
                    <Text style={[styles.badgeText, { color: '#991B1B' }]}>Expirado</Text>
                  </View>
                )}
              </View>
              <View style={[styles.tdContent, { flex: 2 }]}>
                {a.alertaEnviado ? (
                  <Text style={styles.tdMono}>{a.alertaEnviado}</Text>
                ) : (
                  <Text style={styles.td}>—</Text>
                )}
              </View>
              <View style={[styles.tdContent, { flex: 1 }]}>
                {a.estado === 'EXPIRADO' && (
                  <TouchableOpacity style={styles.actionLink}>
                    <Text style={styles.actionLinkText}>Fila EMD</Text>
                    <ExternalLink size={12} color="#1D4ED8" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Footer Info */}
      <View style={styles.footerInfo}>
        <Info size={12} color={Colors.GRAY_500_TEXTO2} />
        <Text style={styles.footerInfoText}>
          Alertas automáticos de caducidade são enviados a 30 dias de expiração · Parâmetro configurado exclusivamente pelo Administrador de Sistema (RF-14) · O envio é processado em background pelo sistema — não requer ação manual.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
    padding: 24,
  },
  alertCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#B45309',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B45309',
  },
  alertList: {
    flexDirection: 'row',
  },
  alertPill: {
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  alertPillName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
  },
  alertPillMeta: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 2,
  },
  filtersBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
  },
  toggleBtnActiveTodos: {
    backgroundColor: Colors.DOURADO_CTA,
    borderColor: Colors.DOURADO_CTA,
  },
  toggleText: {
    color: Colors.GRAY_900_TEXTO1,
    fontSize: 14,
  },
  toggleTextActiveTodos: {
    fontWeight: '600',
  },
  toggleBtnActiveAExpirar: {
    backgroundColor: '#FFFBEB',
    borderColor: '#B45309',
  },
  toggleTextExpirar: {
    color: '#B45309',
    fontSize: 14,
  },
  toggleTextActiveExpirar: {
    fontWeight: '600',
  },
  toggleBtnActiveExpirados: {
    backgroundColor: '#FEE2E2',
    borderColor: '#991B1B',
  },
  toggleTextExpirados: {
    color: '#991B1B',
    fontSize: 14,
  },
  toggleTextActiveExpirados: {
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
    paddingHorizontal: 12,
    width: 250,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.GRAY_50_FUNDO,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
  },
  th: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.GRAY_500_TEXTO2,
    textTransform: 'uppercase',
  },
  tr: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
    alignItems: 'center',
  },
  tdBold: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
  },
  td: {
    fontSize: 14,
    color: Colors.GRAY_900_TEXTO1,
  },
  tdContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tdMono: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionLinkText: {
    fontSize: 12,
    color: '#1D4ED8',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
    gap: 8,
  },
  footerInfoText: {
    flex: 1,
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
  },
});
