/**
 * EquipaCreateScreen — Formulário para criar nova equipa.
 *
 * Exporta EquipaForm (para uso dentro de Modal).
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Colors } from '@/constants/colors';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { secretariaService, type EquipaRequest } from '@/services/secretariaService';

interface EquipaFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const ESCALOES_OPTIONS = [
  { label: 'Sub-10', value: '1' },
  { label: 'Sub-12', value: '2' },
  { label: 'Sub-15', value: '3' },
  { label: 'Sub-19', value: '4' },
  { label: 'Seniores', value: '5' },
];

const MODALIDADES_OPTIONS = [
  { label: 'Futebol', value: '1' },
  { label: 'Futsal', value: '2' },
];

export function EquipaForm({
  onSuccess,
  onCancel,
}: EquipaFormProps): React.JSX.Element {
  const [nome, setNome] = useState('');
  const [escalaoId, setEscalaoId] = useState('');
  const [modalidadeId, setModalidadeId] = useState('');
  const [loading, setLoading] = useState(false);

  const getErrors = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!nome.trim() || nome.trim().length < 3) {
      errs.nome = 'Mínimo 3 caracteres, não vazio';
    }
    if (!escalaoId.trim()) {
      errs.escalaoId = 'O escalão é obrigatório';
    }
    if (!modalidadeId.trim()) {
      errs.modalidadeId = 'A modalidade é obrigatória';
    }
    return errs;
  };

  const errors = getErrors();
  const hasErrors = Object.keys(errors).length > 0;

  const showAlert = (title: string, message: string): void => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (hasErrors) return;

    const payload: EquipaRequest = {
      nome: nome.trim(),
      escalaoId: Number(escalaoId),
      modalidadeId: Number(modalidadeId),
    };

    setLoading(true);
    try {
      await secretariaService.createEquipa(payload);
      onSuccess();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Erro inesperado';
      showAlert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={formStyles.container}>
      <Input
        label="Nome da Equipa"
        placeholder="Ex: Juniores A"
        value={nome}
        onChangeText={setNome}
        error={errors.nome}
        required
      />
      <Select
        label="Escalão"
        placeholder="Selecione o escalão"
        options={ESCALOES_OPTIONS}
        selectedValue={escalaoId}
        onValueChange={setEscalaoId}
        error={errors.escalaoId}
        required
      />
      <Select
        label="Modalidade"
        placeholder="Selecione a modalidade"
        options={MODALIDADES_OPTIONS}
        selectedValue={modalidadeId}
        onValueChange={setModalidadeId}
        error={errors.modalidadeId}
        required
      />

      <View style={formStyles.actions}>
        <Button label="Cancelar" onPress={onCancel} variant="secondary" />
        <Button
          label="Criar"
          onPress={() => void handleSubmit()}
          variant="primary"
          loading={loading}
          disabled={hasErrors}
        />
      </View>
    </View>
  );
}

const formStyles = StyleSheet.create({
  container: { gap: 0 },
  actions: {
    flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8,
  },
});
