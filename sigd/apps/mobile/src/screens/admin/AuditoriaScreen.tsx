import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ShieldCheck, Download, Search } from 'lucide-react-native';
import { PageHeader } from '../../components/ui/PageHeader';
import { ModalDetalheAuditoria } from './components/AdminModals';
import { adminService, AuditLogEntry } from '@/services/adminService';
import { Colors } from '@/constants/colors';
import { SortableHeader, SortConfig } from '@/components/ui/SortableHeader';
import { sortList } from '@/utils/sort';

export function AuditoriaScreen(): React.JSX.Element {
  const [eventos, setEventos] = useState<AuditLogEntry[]>([]);
  const [eventoSelecionado, setEventoSelecionado] = useState<AuditLogEntry | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [selectedModulo, setSelectedModulo] = useState<string>('');
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');
  const [searchString, setSearchString] = useState<string>('');
  const [pesquisa, setPesquisa] = useState<string>('');
  const [moduloOpen, setModuloOpen] = useState<boolean>(false);
  const [tipoOpen, setTipoOpen] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setPesquisa(searchString);
      setPage(0);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchString]);

  const handleSort = (field: string) => {
    setSortConfig(prev => {
      if (prev?.field === field) {
        return prev.direction === 'asc' ? { field, direction: 'desc' } : null;
      }
      return { field, direction: 'asc' };
    });
  };

  useEffect(() => {
    const dIni = dataInicio && dataInicio.length === 10 ? dataInicio.split('/').reverse().join('-') : undefined;
    const dFim = dataFim && dataFim.length === 10 ? dataFim.split('/').reverse().join('-') : undefined;
    const sortBy = sortConfig?.field || 'timestamp';
    const sortDir = sortConfig?.direction || 'desc';
    
    adminService.getAuditoria(page, 10, selectedModulo || undefined, selectedTipo || undefined, dIni, dFim, sortBy, sortDir, pesquisa).then(res => {
      setEventos(res.content);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
    });
  }, [page, selectedModulo, selectedTipo, dataInicio, dataFim, sortConfig, pesquisa]);

  const getAcaoStyle = (acao: string) => {
    if (['BLOQUEAR_ACESSO', 'REVOGAR_ROLE', 'FORÇAR_RESET', 'ELIMINAR'].includes(acao)) {
      return { bg: '#FEE2E2', text: '#991B1B' };
    }
    if (acao.startsWith('CREATE_')) {
      return { bg: '#ECFDF5', text: '#047857' };
    }
    if (acao.startsWith('UPDATE_') || acao.startsWith('EDITAR_')) {
      return { bg: '#EFF6FF', text: '#1D4ED8' };
    }
    return { bg: '#F1F5F9', text: '#64748B' }; // LOGIN, LOGOUT, EXPORTAR
  };

  return (
    <View style={styles.container}>
      <PageHeader
        title="Auditoria e Segurança"
        breadcrumbs={[
          { label: 'Administração de Sistema' },
          { label: 'Auditoria' },
        ]}
      />

      <View style={styles.banner}>
         <ShieldCheck size={20} color="#1D4ED8" style={{ marginRight: 12 }} />
         <Text style={styles.bannerText}>
            Este registo é imutável (append-only). Nenhum utilizador, incluindo o Administrador, pode editar ou eliminar entradas de auditoria.
         </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        
        {/* Filtros */}
        <View style={[styles.filtersContainer, { zIndex: 50 }]}>
           <View style={{ flexDirection: 'row', gap: 12, flex: 1, flexWrap: 'wrap', zIndex: 50 }}>
              <TextInput style={styles.inputDate} placeholder="De: dd/mm/aaaa" value={dataInicio} onChangeText={setDataInicio} />
              <TextInput style={styles.inputDate} placeholder="Até: dd/mm/aaaa" value={dataFim} onChangeText={setDataFim} />
              
              {/* Módulo Filter */}
              <View style={{ zIndex: 100 }}>
                 <TouchableOpacity style={styles.dropdown} onPress={() => { setModuloOpen(!moduloOpen); setTipoOpen(false); }}>
                    <Text style={styles.dropdownText}>
                       {selectedModulo ? `Módulo: ${selectedModulo}` : 'Todos os Módulos'} ▾
                    </Text>
                 </TouchableOpacity>
                 {moduloOpen && (
                    <View style={styles.optionsList}>
                       {['', 'Atleta', 'EncarregadoEducacao', 'Ocorrencia', 'Utilizador', 'SessaoTreino', 'Convocatoria'].map(m => (
                          <TouchableOpacity 
                            key={m} 
                            style={styles.optionItem} 
                            onPress={() => {
                              setSelectedModulo(m);
                              setPage(0);
                              setModuloOpen(false);
                            }}
                          >
                             <Text style={styles.optionText}>{m || 'Todos os Módulos'}</Text>
                          </TouchableOpacity>
                       ))}
                    </View>
                 )}
              </View>

              {/* Tipo Filter */}
              <View style={{ zIndex: 90 }}>
                 <TouchableOpacity style={styles.dropdown} onPress={() => { setTipoOpen(!tipoOpen); setModuloOpen(false); }}>
                    <Text style={styles.dropdownText}>
                       {selectedTipo ? `Tipo: ${selectedTipo}` : 'Todos os Tipos'} ▾
                    </Text>
                 </TouchableOpacity>
                 {tipoOpen && (
                    <View style={styles.optionsList}>
                       {['', 'CRIAR', 'EDITAR', 'ELIMINAR', 'LOGIN'].map(t => (
                          <TouchableOpacity 
                            key={t} 
                            style={styles.optionItem} 
                            onPress={() => {
                              setSelectedTipo(t);
                              setPage(0);
                              setTipoOpen(false);
                            }}
                          >
                             <Text style={styles.optionText}>{t || 'Todos os Tipos'}</Text>
                          </TouchableOpacity>
                       ))}
                    </View>
                 )}
              </View>
              <View style={styles.searchWrapper}>
                 <Search size={16} color={Colors.GRAY_500_TEXTO2} style={{ marginLeft: 12 }} />
                 <TextInput 
                   style={styles.searchInput} 
                   placeholder="Pesquisar por nome ou ID do ator..." 
                   value={searchString}
                   onChangeText={setSearchString}
                 />
              </View>
           </View>
           <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
             {(selectedModulo || selectedTipo || dataInicio || dataFim || searchString) ? (
                <TouchableOpacity 
                  onPress={() => {
                    setSelectedModulo('');
                    setSelectedTipo('');
                    setDataInicio('');
                    setDataFim('');
                    setSearchString('');
                    setSortConfig(null);
                    setPage(0);
                  }}
                >
                  <Text style={{ color: Colors.GRAY_500_TEXTO2, fontSize: 13 }}>✕ Limpar</Text>
                </TouchableOpacity>
             ) : null}
             <TouchableOpacity style={styles.btnOutline}>
                <Download size={16} color={Colors.GRAY_900_TEXTO1} style={{ marginRight: 6 }} />
                <Text style={styles.btnOutlineText}>Exportar Logs (CSV)</Text>
             </TouchableOpacity>
           </View>
        </View>

        {/* Tabela de Auditoria */}
        <View style={styles.table}>
            <View style={styles.tableHeader}>
               <View style={{ flex: 1.5 }}><SortableHeader label="DATA / HORA" field="timestamp" sortConfig={sortConfig} onSort={handleSort} /></View>
               <View style={{ flex: 2 }}><SortableHeader label="ATOR" field="ator" sortConfig={sortConfig} onSort={handleSort} /></View>
               <View style={{ flex: 1.5 }}><SortableHeader label="AÇÃO" field="acao" sortConfig={sortConfig} onSort={handleSort} /></View>
               <View style={{ flex: 1.5 }}><SortableHeader label="MÓDULO" field="entidade" sortConfig={sortConfig} onSort={handleSort} /></View>
               <Text style={[styles.th, { flex: 1.5 }]}>ENDEREÇO IP</Text>
               <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>DETALHE</Text>
            </View>
           
           {eventos.map(e => {
              const acaoStyle = getAcaoStyle(e.acao);
              return (
                 <View key={e.id} style={styles.tableRow}>
                    <Text style={[styles.td, { flex: 1.5 }]}>{e.timestamp}</Text>
                    
                    <View style={{ flex: 2 }}>
                       <Text style={[styles.td, { fontWeight: '700' }]}>{e.ator}</Text>
                    </View>
                    
                    <View style={{ flex: 1.5, alignItems: 'flex-start' }}>
                       <View style={[styles.badgePill, { backgroundColor: acaoStyle.bg }]}>
                          <Text style={[styles.badgeText, { color: acaoStyle.text }]}>{e.acao}</Text>
                       </View>
                    </View>
                    
                    <Text style={[styles.td, { flex: 1.5 }]}>{e.entidade}</Text>
                    
                    <Text style={[styles.td, { flex: 1.5, fontFamily: 'monospace', color: Colors.GRAY_500_TEXTO2 }]}>{e.ipAddress}</Text>
                    
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                       <TouchableOpacity style={styles.btnDetalhe} onPress={() => setEventoSelecionado(e)}>
                          <Text style={styles.btnDetalheText}>Ver Detalhe</Text>
                       </TouchableOpacity>
                    </View>
                 </View>
              );
           })}
            <View style={styles.tableFooter}>
               <Text style={{ fontSize: 12, color: Colors.GRAY_500_TEXTO2 }}>
                  A mostrar {page * 10 + 1}–{Math.min((page + 1) * 10, totalElements)} de {totalElements} eventos
               </Text>
               <View style={{ flexDirection: 'row', gap: 16 }}>
                  <TouchableOpacity
                     onPress={() => setPage(p => Math.max(0, p - 1))}
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
                     onPress={() => setPage(p => p + 1)}
                     disabled={page >= totalPages - 1}
                     style={{
                       paddingHorizontal: 16,
                       paddingVertical: 8,
                       borderRadius: 8,
                       backgroundColor: page >= totalPages - 1 ? '#E5E7EB' : '#1B2B5E',
                       opacity: page >= totalPages - 1 ? 0.5 : 1,
                     }}
                  >
                     <Text style={{ color: page >= totalPages - 1 ? '#9CA3AF' : '#FFFFFF', fontWeight: '600' }}>
                        Próxima →
                     </Text>
                  </TouchableOpacity>
               </View>
            </View>
        </View>

      </ScrollView>

      <ModalDetalheAuditoria visible={!!eventoSelecionado} onClose={() => setEventoSelecionado(null)} evento={eventoSelecionado} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.GRAY_50_FUNDO },
  banner: { flexDirection: 'row', backgroundColor: '#EFF6FF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1D4ED8', alignItems: 'center' },
  bannerText: { fontSize: 13, color: '#1D4ED8', fontWeight: '500', flex: 1 },
  content: { flex: 1 },
  scrollContent: { padding: 32, gap: 24 },
  filtersContainer: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: Colors.BRANCO, borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 12, padding: 16, gap: 16 },
  inputDate: { borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, width: 120 },
  dropdown: { borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, justifyContent: 'center' },
  dropdownText: { fontSize: 13, color: Colors.GRAY_900_TEXTO1 },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, flex: 1, minWidth: 200 },
  searchInput: { paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, flex: 1, outlineStyle: 'none' as any },
  btnOutline: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8, alignSelf: 'flex-start' },
  btnOutlineText: { fontSize: 13, fontWeight: '500', color: Colors.GRAY_900_TEXTO1 },
  table: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, overflow: 'hidden', backgroundColor: Colors.BRANCO },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  th: { fontSize: 11, fontWeight: '600', color: Colors.GRAY_500_TEXTO2 },
  tableRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', alignItems: 'center' },
  td: { fontSize: 13, color: Colors.GRAY_900_TEXTO1 },
  badgePill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 10, fontWeight: '600' },
  btnDetalhe: { borderWidth: 1, borderColor: Colors.GRAY_200_BORDAS, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  btnDetalheText: { fontSize: 12, fontWeight: '500', color: Colors.GRAY_900_TEXTO1 },
  tableFooter: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  optionsList: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
    width: 200,
    shadowColor: Colors.PRETO_PRIMARIO,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 9999
  },
  optionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_100_HOVER
  },
  optionText: {
    fontSize: 13,
    color: Colors.GRAY_900_TEXTO1
  }
});
