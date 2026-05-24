/**
 * OcorrenciaDetailScreen — Detalhe completo de uma ocorrência clínica.
 *
 * Apresenta informação completa, card de deliberação (se existir)
 * e botão de deliberar (apenas para ROLE_ADMIN).
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  AlertTriangle,
  Calendar,
  FileText,
  User,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Gavel,
  CheckCircle,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Card, Badge, Button, Input, EmptyState } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { Role } from '@/constants/roles';
import {
  clinicaService,
  type OcorrenciaResponse,
  type GrauRestricaoDesportiva,
  type DeliberacaoRequest,
  TIPO_OCORRENCIA_LABELS,
  GRAU_LABELS,
  ESTADO_EMD_LABELS,
} from '@/services/clinicaService';

// ── Props ──────────────────────────────────────────────

interface OcorrenciaDetailScreenProps {
  ocorrenciaId: number;
  onGoBack?: () => void;
}

// ── Helpers ─────────────────────────────────────────────

function getSemaforoConfig(grau: GrauRestricaoDesportiva) {
  switch (grau) {
    case 'VERDE':
      return { variant: 'success' as const, icon: ShieldCheck, label: GRAU_LABELS.VERDE };
    case 'AMARELO':
      return { variant: 'warning' as const, icon: ShieldAlert, label: GRAU_LABELS.AMARELO };
    case 'VERMELHO':
      return { variant: 'error' as const, icon: ShieldX, label: GRAU_LABELS.VERMELHO };
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

// ── Component ──────────────────────────────────────────

export function OcorrenciaDetailScreen({
  ocorrenciaId,
  onGoBack,
}: OcorrenciaDetailScreenProps): React.JSX.Element {
  const activeRole = useAuthStore((s) => s.activeRole);
  const isAdmin = activeRole === Role.ADMIN;

  const [ocorrencia, setOcorrencia] = useState<OcorrenciaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Deliberação form state
  const [showDeliberacao, setShowDeliberacao] = useState(false);
  const [grauFinal, setGrauFinal] = useState<GrauRestricaoDesportiva>('VERDE');
  const [obsDeliberacao, setObsDeliberacao] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const data = await clinicaService.getOcorrencia(ocorrenciaId);
      setOcorrencia(data);
    } catch {
      setError('Não foi possível carregar a ocorrência');
    } finally {
      setLoading(false);
    }
  }, [ocorrenciaId]);

  React.useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // ── Deliberar ──────────────────────────────────────────

  const handleDeliberar = useCallback(async () => {
    if (!obsDeliberacao.trim()) {
      Alert.alert('Erro', 'As observações da deliberação são obrigatórias.');
      return;
    }

    try {
      setSubmitting(true);
      const payload: DeliberacaoRequest = {
        grauFinal,
        obsDeliberacao: obsDeliberacao.trim(),
      };
      const updated = await clinicaService.deliberar(ocorrenciaId, payload);
      setOcorrencia(updated);
      setShowDeliberacao(false);
      Alert.alert('Sucesso', 'Deliberação registada com sucesso.');
    } catch {
      Alert.alert('Erro', 'Não foi possível registar a deliberação.');
    } finally {
      setSubmitting(false);
    }
  }, [ocorrenciaId, grauFinal, obsDeliberacao]);

  // ── Loading / Error ────────────────────────────────────

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.DOURADO_CTA} />
        <Text style={styles.loadingText}>A carregar ocorrência...</Text>
      </View>
    );
  }

  if (error || !ocorrencia) {
    return (
      <View style={styles.centerContainer}>
        <EmptyState
          icon={AlertTriangle}
          title="Erro"
          subtitle={error ?? 'Ocorrência não encontrada'}
          ctaLabel="Voltar"
          onCtaPress={onGoBack}
        />
      </View>
    );
  }

  // ── Render ─────────────────────────────────────────────

  const semaforo = getSemaforoConfig(ocorrencia.grauRestricao);
  const isDeliberada = ocorrencia.estadoEMD === 'DELIBERADO';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header Card */}
      <Card
        leftBorderColor={
          ocorrencia.grauRestricao === 'VERMELHO' ? Colors.ERRO_TEXT
          : ocorrencia.grauRestricao === 'AMARELO' ? Colors.AVISO_TEXT
          : Colors.SUCESSO_TEXT
        }
      >
        <View style={styles.headerRow}>
          <View style={styles.headerInfo}>
            <Text style={styles.atletaNome}>{ocorrencia.atletaNome}</Text>
            <View style={styles.badgeRow}>
              <Badge
                variant={semaforo.variant}
                label={semaforo.label}
                icon={semaforo.icon}
              />
              <Badge
                variant="neutral"
                label={TIPO_OCORRENCIA_LABELS[ocorrencia.tipo]}
              />
              <Badge
                variant={
                  ocorrencia.estadoEMD === 'EM_AVALIACAO' ? 'warning'
                  : ocorrencia.estadoEMD === 'DELIBERADO' ? 'success'
                  : 'neutral'
                }
                label={ESTADO_EMD_LABELS[ocorrencia.estadoEMD]}
              />
            </View>
          </View>
        </View>
      </Card>

      {/* Info Fields */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Informação Clínica</Text>

        <View style={styles.field}>
          <View style={styles.fieldIcon}>
            <Calendar size={16} color={Colors.GRAY_500_TEXTO2} />
          </View>
          <View>
            <Text style={styles.fieldLabel}>Data da Ocorrência</Text>
            <Text style={styles.fieldValue}>{formatDate(ocorrencia.dataOcorrencia)}</Text>
          </View>
        </View>

        <View style={styles.field}>
          <View style={styles.fieldIcon}>
            <FileText size={16} color={Colors.GRAY_500_TEXTO2} />
          </View>
          <View style={styles.fieldContent}>
            <Text style={styles.fieldLabel}>Diagnóstico</Text>
            <Text style={styles.fieldValue}>{ocorrencia.diagnostico}</Text>
          </View>
        </View>

        {ocorrencia.dataReavaliacao && (
          <View style={styles.field}>
            <View style={styles.fieldIcon}>
              <Calendar size={16} color={Colors.INFO_TEXT} />
            </View>
            <View>
              <Text style={styles.fieldLabel}>Data de Reavaliação</Text>
              <Text style={[styles.fieldValue, { color: Colors.INFO_TEXT }]}>
                {formatDate(ocorrencia.dataReavaliacao)}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.field}>
          <View style={styles.fieldIcon}>
            <User size={16} color={Colors.GRAY_500_TEXTO2} />
          </View>
          <View>
            <Text style={styles.fieldLabel}>Médico Criador</Text>
            <Text style={styles.fieldValue}>{ocorrencia.medicoCriadorNome ?? '—'}</Text>
          </View>
        </View>
      </Card>

      {/* Deliberação Card */}
      {isDeliberada && (
        <Card style={styles.sectionCard} leftBorderColor={Colors.SUCESSO_TEXT}>
          <View style={styles.sectionTitleRow}>
            <Gavel size={18} color={Colors.SUCESSO_TEXT} />
            <Text style={[styles.sectionTitle, { color: Colors.SUCESSO_TEXT }]}>Deliberação</Text>
          </View>

          <View style={styles.field}>
            <View style={styles.fieldIcon}>
              <CheckCircle size={16} color={Colors.SUCESSO_TEXT} />
            </View>
            <View>
              <Text style={styles.fieldLabel}>Grau Final</Text>
              <Badge
                variant={getSemaforoConfig(ocorrencia.grauRestricao).variant}
                label={GRAU_LABELS[ocorrencia.grauRestricao]}
                icon={getSemaforoConfig(ocorrencia.grauRestricao).icon}
                style={{ marginTop: 4 }}
              />
            </View>
          </View>

          <View style={styles.field}>
            <View style={styles.fieldIcon}>
              <FileText size={16} color={Colors.GRAY_500_TEXTO2} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Observações</Text>
              <Text style={styles.fieldValue}>{ocorrencia.obsDeliberacao ?? '—'}</Text>
            </View>
          </View>

          <View style={styles.field}>
            <View style={styles.fieldIcon}>
              <User size={16} color={Colors.GRAY_500_TEXTO2} />
            </View>
            <View>
              <Text style={styles.fieldLabel}>Médico Deliberação</Text>
              <Text style={styles.fieldValue}>
                {ocorrencia.medicoDeliberacaoNome ?? '—'}
              </Text>
            </View>
          </View>

          <View style={styles.field}>
            <View style={styles.fieldIcon}>
              <Calendar size={16} color={Colors.GRAY_500_TEXTO2} />
            </View>
            <View>
              <Text style={styles.fieldLabel}>Data Deliberação</Text>
              <Text style={styles.fieldValue}>{formatDate(ocorrencia.dataDeliberacao)}</Text>
            </View>
          </View>
        </Card>
      )}

      {/* Deliberar Button (ADMIN only, if not yet deliberated) */}
      {isAdmin && !isDeliberada && (
        <View style={styles.deliberarSection}>
          {!showDeliberacao ? (
            <Button
              label="Registar Deliberação"
              onPress={() => setShowDeliberacao(true)}
              variant="primary"
              fullWidth
              icon={<Gavel size={18} color={Colors.PRETO_PRIMARIO} />}
            />
          ) : (
            <Card style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Nova Deliberação</Text>

              {/* Grau Final Selection */}
              <Text style={styles.fieldLabel}>Grau Final de Restrição</Text>
              <View style={styles.grauRadioGroup}>
                {(['VERDE', 'AMARELO', 'VERMELHO'] as GrauRestricaoDesportiva[]).map((grau) => {
                  const config = getSemaforoConfig(grau);
                  const isSelected = grauFinal === grau;
                  return (
                    <Button
                      key={grau}
                      label={config.label}
                      variant={isSelected ? 'primary' : 'secondary'}
                      onPress={() => setGrauFinal(grau)}
                      style={styles.grauRadioButton}
                    />
                  );
                })}
              </View>

              <Input
                label="Observações da Deliberação"
                placeholder="Detalhes da deliberação médica..."
                value={obsDeliberacao}
                onChangeText={setObsDeliberacao}
                multiline
                numberOfLines={4}
                required
              />

              <View style={styles.deliberarActions}>
                <Button
                  label="Cancelar"
                  variant="secondary"
                  onPress={() => setShowDeliberacao(false)}
                />
                <Button
                  label="Confirmar Deliberação"
                  variant="primary"
                  onPress={() => void handleDeliberar()}
                  loading={submitting}
                  disabled={!obsDeliberacao.trim()}
                />
              </View>
            </Card>
          )}
        </View>
      )}
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
    gap: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.GRAY_50_FUNDO,
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.GRAY_500_TEXTO2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerInfo: {
    flex: 1,
  },
  atletaNome: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  sectionCard: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.GRAY_900_TEXTO1,
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 10,
  },
  fieldIcon: {
    width: 24,
    alignItems: 'center',
    paddingTop: 2,
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.GRAY_500_TEXTO2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  fieldValue: {
    fontSize: 14,
    color: Colors.GRAY_900_TEXTO1,
    lineHeight: 20,
  },
  deliberarSection: {
    marginBottom: 24,
  },
  grauRadioGroup: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  grauRadioButton: {
    flex: 1,
    height: 40,
  },
  deliberarActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
});
