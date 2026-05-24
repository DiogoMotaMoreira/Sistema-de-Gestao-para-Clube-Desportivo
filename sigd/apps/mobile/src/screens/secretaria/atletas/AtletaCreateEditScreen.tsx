/**
 * AtletaCreateEditScreen — Formulário criar/editar Atleta.
 *
 * Exporta AtletaForm (para uso dentro de Modal).
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Colors } from '@/constants/colors';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { secretariaService, type AtletaRequest, type AtletaResponse } from '@/services/secretariaService';

interface AtletaFormProps {
  initialData?: AtletaResponse;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AtletaForm({
  initialData,
  onSuccess,
  onCancel,
}: AtletaFormProps): React.JSX.Element {
  const isEdit = initialData != null;

  const [nomeCompleto, setNomeCompleto] = useState(initialData?.nomeCompleto ?? '');
  const [dataNascimento, setDataNascimento] = useState(initialData?.dataNascimento ?? '');
  const [nif, setNif] = useState(initialData?.nif ?? '');
  const [numeroSocio, setNumeroSocio] = useState(initialData?.numeroSocio ?? '');
  const [posicao, setPosicao] = useState(initialData?.posicao ?? '');
  const [encarregadoId, setEncarregadoId] = useState(
    initialData?.encarregadoId ? String(initialData.encarregadoId) : '',
  );
  const [equipaId, setEquipaId] = useState(
    initialData?.equipaId ? String(initialData.equipaId) : '',
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!nomeCompleto.trim()) errs.nomeCompleto = 'O nome é obrigatório';
    if (!dataNascimento.trim()) errs.dataNascimento = 'A data de nascimento é obrigatória';
    if (!encarregadoId.trim()) errs.encarregadoId = 'O encarregado é obrigatório';
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

    const payload: AtletaRequest = {
      nomeCompleto: nomeCompleto.trim(),
      dataNascimento: dataNascimento.trim(),
      nif: nif.trim() || undefined,
      numeroSocio: numeroSocio.trim() || undefined,
      posicao: posicao.trim() || undefined,
      encarregadoId: Number(encarregadoId),
      equipaId: equipaId ? Number(equipaId) : undefined,
    };

    setLoading(true);
    try {
      if (isEdit && initialData) {
        await secretariaService.updateAtleta(initialData.id, payload);
      } else {
        await secretariaService.createAtleta(payload);
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
        label="Nome Completo"
        placeholder="Nome completo do atleta"
        value={nomeCompleto}
        onChangeText={setNomeCompleto}
        error={errors.nomeCompleto}
        required
      />
      <Input
        label="Data de Nascimento"
        placeholder="AAAA-MM-DD"
        value={dataNascimento}
        onChangeText={setDataNascimento}
        error={errors.dataNascimento}
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
        label="Número de Sócio"
        placeholder="Nº de sócio (se aplicável)"
        value={numeroSocio}
        onChangeText={setNumeroSocio}
      />
      <Input
        label="Posição"
        placeholder="Ex: Avançado, Defesa, Guarda-redes"
        value={posicao}
        onChangeText={setPosicao}
      />
      <Input
        label="ID Encarregado"
        placeholder="ID do encarregado de educação"
        value={encarregadoId}
        onChangeText={setEncarregadoId}
        error={errors.encarregadoId}
        keyboardType="numeric"
        required
      />
      <Input
        label="ID Equipa"
        placeholder="ID da equipa (opcional)"
        value={equipaId}
        onChangeText={setEquipaId}
        keyboardType="numeric"
      />

      <View style={formStyles.actions}>
        <Button label="Cancelar" onPress={onCancel} variant="secondary" />
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
  container: { gap: 0 },
  actions: {
    flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8,
  },
});
