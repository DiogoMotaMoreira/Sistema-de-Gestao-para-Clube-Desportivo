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

  const getErrors = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!nome.trim() || nome.trim().length < 3 || !/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(nome)) {
      errs.nome = 'Apenas letras e espaços, mínimo 3 caracteres';
    }
    if (!nif.trim() || !/^\d{9}$/.test(nif)) {
      errs.nif = 'Apenas 9 dígitos numéricos';
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Email inválido';
    }
    if (!telemovel.trim() || !/^9\d{8}$/.test(telemovel)) {
      errs.telemovel = 'Deve começar por 9 e ter 9 dígitos';
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

    const payload: EncarregadoRequest = {
      nome: nome.trim(),
      nif: nif.trim(),
      email: email.trim(),
      telemovel: telemovel.trim(),
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
        error={nif.length > 0 ? errors.nif : undefined}
        keyboardType="numeric"
        maxLength={9}
        required
      />
      <Input
        label="Email"
        placeholder="email@exemplo.com"
        value={email}
        onChangeText={setEmail}
        error={email.length > 0 ? errors.email : undefined}
        keyboardType="email-address"
        autoCapitalize="none"
        required
      />
      <Input
        label="Telemóvel"
        placeholder="9XX XXX XXX"
        value={telemovel}
        onChangeText={setTelemovel}
        error={telemovel.length > 0 ? errors.telemovel : undefined}
        keyboardType="phone-pad"
        maxLength={15}
        required
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
          disabled={hasErrors}
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
