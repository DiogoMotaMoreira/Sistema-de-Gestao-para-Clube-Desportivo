/**
 * EncarregadoCreateEditScreen — Formulário criar/editar EE.
 *
 * Exporta EncarregadoForm (para uso dentro de Modal) e a Screen completa.
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Colors } from '@/constants/colors';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { secretariaService, type EncarregadoRequest, type EncarregadoResponse } from '@/services/secretariaService';

interface EncarregadoFormProps {
  initialData?: EncarregadoResponse;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EncarregadoForm({
  initialData,
  onSuccess,
  onCancel,
}: EncarregadoFormProps): React.JSX.Element {
  const isEdit = initialData != null;

  const [nome, setNome] = useState(initialData?.nome ?? '');
  const [nif, setNif] = useState(initialData?.nif ?? '');
  const [email, setEmail] = useState(initialData?.email ?? '');
  const [telemovel, setTelemovel] = useState(initialData?.telemovel ?? '');
  const [morada, setMorada] = useState(initialData?.morada ?? '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!nome.trim()) errs.nome = 'O nome é obrigatório';
    if (email && !email.includes('@')) errs.email = 'Email inválido';
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

    const payload: EncarregadoRequest = {
      nome: nome.trim(),
      nif: nif.trim() || undefined,
      email: email.trim() || undefined,
      telemovel: telemovel.trim() || undefined,
      morada: morada.trim() || undefined,
    };

    setLoading(true);
    try {
      if (isEdit && initialData) {
        await secretariaService.updateEncarregado(initialData.id, payload);
      } else {
        await secretariaService.createEncarregado(payload);
      }
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
        label="Nome"
        placeholder="Nome completo"
        value={nome}
        onChangeText={setNome}
        error={errors.nome}
        required
      />
      <Input
        label="NIF"
        placeholder="Número de Identificação Fiscal"
        value={nif}
        onChangeText={setNif}
        keyboardType="numeric"
        maxLength={9}
      />
      <Input
        label="Email"
        placeholder="email@exemplo.com"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        label="Telemóvel"
        placeholder="9XX XXX XXX"
        value={telemovel}
        onChangeText={setTelemovel}
        keyboardType="phone-pad"
        maxLength={15}
      />
      <Input
        label="Morada"
        placeholder="Morada completa"
        value={morada}
        onChangeText={setMorada}
        multiline
        numberOfLines={2}
      />

      <View style={formStyles.actions}>
        <Button
          label="Cancelar"
          onPress={onCancel}
          variant="secondary"
        />
        <Button
          label={isEdit ? 'Guardar' : 'Criar'}
          onPress={() => void handleSubmit()}
          variant="primary"
          loading={loading}
        />
      </View>
    </View>
  );
}

const formStyles = StyleSheet.create({
  container: {
    gap: 0,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
});
