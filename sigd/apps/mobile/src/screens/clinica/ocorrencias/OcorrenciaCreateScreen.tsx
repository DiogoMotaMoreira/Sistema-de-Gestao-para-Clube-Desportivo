/**
 * OcorrenciaCreateScreen — Formulário de registo de nova ocorrência clínica.
 *
 * Campos: Atleta (dropdown), Data, Tipo, Diagnóstico, Grau Restrição, Data Reavaliação.
 * Validação completa antes de submit.
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ChevronDown,
  Plus,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Card, Button, Input } from '@/components/ui';
import { secretariaService, type AtletaResponse } from '@/services/secretariaService';
import {
  clinicaService,
  type TipoOcorrencia,
  type GrauRestricaoDesportiva,
  type OcorrenciaRequest,
  TIPO_OCORRENCIA_LABELS,
  GRAU_LABELS,
} from '@/services/clinicaService';

// ── Props ──────────────────────────────────────────────

interface OcorrenciaCreateScreenProps {
  onSuccess?: () => void;
  onGoBack?: () => void;
}

// ── Tipos ──────────────────────────────────────────────

const TIPOS: TipoOcorrencia[] = ['LESAO', 'DOENCA', 'TRAUMA', 'CONTUSAO', 'FRATURA', 'OUTRAS'];
const GRAUS: GrauRestricaoDesportiva[] = ['VERDE', 'AMARELO', 'VERMELHO'];

const GRAU_COLORS: Record<GrauRestricaoDesportiva, string> = {
  VERDE: Colors.SUCESSO_TEXT,
  AMARELO: Colors.AVISO_TEXT,
  VERMELHO: Colors.ERRO_TEXT,
};

const GRAU_BG: Record<GrauRestricaoDesportiva, string> = {
  VERDE: Colors.SUCESSO_BG,
  AMARELO: Colors.AVISO_BG,
  VERMELHO: Colors.ERRO_BG,
};

const GRAU_ICONS = {
  VERDE: ShieldCheck,
  AMARELO: ShieldAlert,
  VERMELHO: ShieldX,
};

// ── Component ──────────────────────────────────────────

export function OcorrenciaCreateScreen({
  onSuccess,
  onGoBack,
}: OcorrenciaCreateScreenProps): React.JSX.Element {
  // Form state
  const [atletaId, setAtletaId] = useState<number | null>(null);
  const [atletaNome, setAtletaNome] = useState('');
  const [dataOcorrencia, setDataOcorrencia] = useState('');
  const [tipo, setTipo] = useState<TipoOcorrencia | null>(null);
  const [diagnostico, setDiagnostico] = useState('');
  const [grauRestricao, setGrauRestricao] = useState<GrauRestricaoDesportiva | null>(null);
  const [dataReavaliacao, setDataReavaliacao] = useState('');

  // UI state
  const [atletas, setAtletas] = useState<AtletaResponse[]>([]);
  const [loadingAtletas, setLoadingAtletas] = useState(true);
  const [showAtletaDropdown, setShowAtletaDropdown] = useState(false);
  const [showTipoDropdown, setShowTipoDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Carregar atletas ───────────────────────────────────

  useEffect(() => {
    const loadAtletas = async () => {
      try {
        const response = await secretariaService.getAtletas(undefined, undefined, 0, 100);
        setAtletas(response.content);
      } catch {
        // silently fail
      } finally {
        setLoadingAtletas(false);
      }
    };
    void loadAtletas();
  }, []);

  // ── Validação ──────────────────────────────────────────

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!atletaId) newErrors.atleta = 'Selecione um atleta';
    if (!dataOcorrencia.trim()) newErrors.data = 'A data é obrigatória';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(dataOcorrencia)) newErrors.data = 'Formato: AAAA-MM-DD';
    if (!tipo) newErrors.tipo = 'Selecione o tipo de ocorrência';
    if (!diagnostico.trim()) newErrors.diagnostico = 'O diagnóstico é obrigatório';
    if (!grauRestricao) newErrors.grau = 'Selecione o grau de restrição';
    if (dataReavaliacao && !/^\d{4}-\d{2}-\d{2}$/.test(dataReavaliacao)) {
      newErrors.dataReavaliacao = 'Formato: AAAA-MM-DD';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [atletaId, dataOcorrencia, tipo, diagnostico, grauRestricao, dataReavaliacao]);

  // ── Submit ─────────────────────────────────────────────

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);
      const payload: OcorrenciaRequest = {
        atletaId: atletaId!,
        dataOcorrencia,
        tipo: tipo!,
        diagnostico: diagnostico.trim(),
        grauRestricao: grauRestricao!,
        dataReavaliacao: dataReavaliacao || null,
      };
      await clinicaService.registarOcorrencia(payload);
      Alert.alert('Sucesso', 'Ocorrência registada com sucesso.', [
        { text: 'OK', onPress: onSuccess },
      ]);
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'Não foi possível registar a ocorrência.';
      Alert.alert('Erro', message);
    } finally {
      setSubmitting(false);
    }
  }, [validate, atletaId, dataOcorrencia, tipo, diagnostico, grauRestricao, dataReavaliacao, onSuccess]);

  // ── Render ─────────────────────────────────────────────

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Card>
        <Text style={styles.formTitle}>Nova Ocorrência Clínica</Text>

        {/* Atleta Dropdown */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabel}>
            Atleta <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.dropdown, errors.atleta ? styles.dropdownError : null]}
            onPress={() => setShowAtletaDropdown(!showAtletaDropdown)}
            accessibilityLabel="Selecionar atleta"
            accessibilityRole="button"
          >
            <Text style={atletaId ? styles.dropdownText : styles.dropdownPlaceholder}>
              {atletaNome || 'Selecionar atleta...'}
            </Text>
            {loadingAtletas ? (
              <ActivityIndicator size="small" color={Colors.GRAY_500_TEXTO2} />
            ) : (
              <ChevronDown size={18} color={Colors.GRAY_500_TEXTO2} />
            )}
          </TouchableOpacity>
          {errors.atleta && <Text style={styles.errorText}>{errors.atleta}</Text>}

          {showAtletaDropdown && (
            <View style={styles.dropdownList}>
              {atletas.map((a) => (
                <TouchableOpacity
                  key={a.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setAtletaId(a.id);
                    setAtletaNome(a.nomeCompleto);
                    setShowAtletaDropdown(false);
                    setErrors((prev) => { const n = { ...prev }; delete n.atleta; return n; });
                  }}
                >
                  <Text style={styles.dropdownItemText}>{a.nomeCompleto}</Text>
                  <Text style={styles.dropdownItemSub}>{a.equipaNome ?? 'Sem equipa'}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Data Ocorrência */}
        <Input
          label="Data da Ocorrência"
          placeholder="AAAA-MM-DD"
          value={dataOcorrencia}
          onChangeText={(v) => {
            setDataOcorrencia(v);
            setErrors((prev) => { const n = { ...prev }; delete n.data; return n; });
          }}
          error={errors.data}
          required
        />

        {/* Tipo Dropdown */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabel}>
            Tipo de Ocorrência <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.dropdown, errors.tipo ? styles.dropdownError : null]}
            onPress={() => setShowTipoDropdown(!showTipoDropdown)}
            accessibilityLabel="Selecionar tipo"
            accessibilityRole="button"
          >
            <Text style={tipo ? styles.dropdownText : styles.dropdownPlaceholder}>
              {tipo ? TIPO_OCORRENCIA_LABELS[tipo] : 'Selecionar tipo...'}
            </Text>
            <ChevronDown size={18} color={Colors.GRAY_500_TEXTO2} />
          </TouchableOpacity>
          {errors.tipo && <Text style={styles.errorText}>{errors.tipo}</Text>}

          {showTipoDropdown && (
            <View style={styles.dropdownList}>
              {TIPOS.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setTipo(t);
                    setShowTipoDropdown(false);
                    setErrors((prev) => { const n = { ...prev }; delete n.tipo; return n; });
                  }}
                >
                  <Text style={styles.dropdownItemText}>{TIPO_OCORRENCIA_LABELS[t]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Diagnóstico */}
        <Input
          label="Diagnóstico"
          placeholder="Descreva o diagnóstico clínico..."
          value={diagnostico}
          onChangeText={(v) => {
            setDiagnostico(v);
            setErrors((prev) => { const n = { ...prev }; delete n.diagnostico; return n; });
          }}
          multiline
          numberOfLines={4}
          error={errors.diagnostico}
          required
        />

        {/* Grau de Restrição */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.fieldLabel}>
            Grau de Restrição Desportiva <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.grauGrid}>
            {GRAUS.map((g) => {
              const isSelected = grauRestricao === g;
              const IconComp = GRAU_ICONS[g];
              return (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.grauOption,
                    { borderColor: isSelected ? GRAU_COLORS[g] : Colors.GRAY_200_BORDAS },
                    isSelected && { backgroundColor: GRAU_BG[g] },
                  ]}
                  onPress={() => {
                    setGrauRestricao(g);
                    setErrors((prev) => { const n = { ...prev }; delete n.grau; return n; });
                  }}
                  accessibilityLabel={`Grau ${GRAU_LABELS[g]}`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <IconComp size={20} color={GRAU_COLORS[g]} />
                  <Text style={[styles.grauLabel, { color: GRAU_COLORS[g] }]}>
                    {GRAU_LABELS[g]}
                  </Text>
                  {isSelected && (
                    <View style={[styles.grauDot, { backgroundColor: GRAU_COLORS[g] }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.grau && <Text style={styles.errorText}>{errors.grau}</Text>}
        </View>

        {/* Data Reavaliação (optional) */}
        <Input
          label="Data de Reavaliação"
          placeholder="AAAA-MM-DD (opcional)"
          value={dataReavaliacao}
          onChangeText={(v) => {
            setDataReavaliacao(v);
            setErrors((prev) => { const n = { ...prev }; delete n.dataReavaliacao; return n; });
          }}
          error={errors.dataReavaliacao}
          helperText="Deixe em branco se não houver data prevista"
        />

        {/* Actions */}
        <View style={styles.actions}>
          {onGoBack && (
            <Button
              label="Cancelar"
              variant="secondary"
              onPress={onGoBack}
            />
          )}
          <Button
            label="Registar Ocorrência"
            variant="primary"
            onPress={() => void handleSubmit()}
            loading={submitting}
            icon={<Plus size={18} color={Colors.PRETO_PRIMARIO} />}
            style={{ flex: 1 }}
          />
        </View>
      </Card>
    </ScrollView>
  );
}

// ── Estilos ────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  scrollContent: {
    padding: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
    marginBottom: 20,
  },
  fieldWrapper: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.GRAY_500_TEXTO2,
    marginBottom: 6,
  },
  required: {
    color: Colors.ERRO_BORDA_FOCUS,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
    paddingHorizontal: 14,
  },
  dropdownError: {
    borderColor: Colors.ERRO_BORDA_FOCUS,
  },
  dropdownText: {
    fontSize: 15,
    color: Colors.GRAY_900_TEXTO1,
  },
  dropdownPlaceholder: {
    fontSize: 15,
    color: Colors.GRAY_500_TEXTO2,
  },
  dropdownList: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
    backgroundColor: Colors.BRANCO,
    maxHeight: 200,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_100_HOVER,
  },
  dropdownItemText: {
    fontSize: 14,
    color: Colors.GRAY_900_TEXTO1,
    fontWeight: '500',
  },
  dropdownItemSub: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 2,
  },
  errorText: {
    fontSize: 11,
    color: Colors.ERRO_BORDA_FOCUS,
    marginTop: 4,
  },
  grauGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  grauOption: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    gap: 6,
    position: 'relative',
  },
  grauLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  grauDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
});
