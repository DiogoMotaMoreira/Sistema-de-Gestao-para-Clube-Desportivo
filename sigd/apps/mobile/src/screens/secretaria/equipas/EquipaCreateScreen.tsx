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
import { secretariaService, type EquipaRequest } from '@/services/secretariaService';

interface EquipaFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function EquipaForm({
  onSuccess,
  onCancel,
}: EquipaFormProps): React.JSX.Element {
  const [nome, setNome] = useState('');
  const [escalaoId, setEscalaoId] = useState('');
  const [modalidadeId, setModalidadeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!nome.trim()) errs.nome = 'O nome é obrigatório';
    if (!escalaoId.trim()) errs.escalaoId = 'O escalão é obrigatório';
    if (!modalidadeId.trim()) errs.modalidadeId = 'A modalidade é obrigatória';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const showAlert = (title: string, message: string): void => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validate()) return;

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
      <Input
        label="ID Escalão"
        placeholder="ID do escalão"
        value={escalaoId}
        onChangeText={setEscalaoId}
        error={errors.escalaoId}
        keyboardType="numeric"
        required
      />
      <Input
        label="ID Modalidade"
        placeholder="ID da modalidade"
        value={modalidadeId}
        onChangeText={setModalidadeId}
        error={errors.modalidadeId}
        keyboardType="numeric"
        required
      />

      <View style={formStyles.actions}>
        <Button label="Cancelar" onPress={onCancel} variant="secondary" />
        <Button
          label="Criar"
          onPress={() => void handleSubmit()}
          variant="primary"
          loading={loading}
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
