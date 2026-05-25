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
import { Select } from '@/components/ui/Select';
import { useQuery } from '@tanstack/react-query';
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
  const { data: encarregadosData } = useQuery({
    queryKey: ['encarregados-dropdown'],
    queryFn: () => secretariaService.getEncarregados(undefined, 0, 1000),
  });

  const { data: equipasData } = useQuery({
    queryKey: ['equipas-dropdown'],
    queryFn: () => secretariaService.getEquipas(),
  });

  const encarregadosOptions = encarregadosData?.content.map((ee) => ({
    label: `${ee.nome} (${ee.nif ?? 'Sem NIF'})`,
    value: String(ee.id),
  })) || [];

  const equipasOptions = equipasData?.map((eq) => ({
    label: eq.nome,
    value: String(eq.id),
  })) || [];

  const [loading, setLoading] = useState(false);

  const getErrors = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!nomeCompleto.trim() || nomeCompleto.trim().length < 3 || !/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(nomeCompleto)) {
      errs.nomeCompleto = 'Apenas letras e espaços, mínimo 3 caracteres';
    }
    
    if (!dataNascimento.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(dataNascimento)) {
      errs.dataNascimento = 'Formato inválido (AAAA-MM-DD)';
    } else {
      const dataNasc = new Date(dataNascimento);
      if (isNaN(dataNasc.getTime())) {
        errs.dataNascimento = 'Data inválida';
      } else if (dataNasc > new Date()) {
        errs.dataNascimento = 'A data não pode ser no futuro';
      }
    }

    if (nif && !/^\d{9}$/.test(nif)) {
      errs.nif = 'Apenas 9 dígitos numéricos';
    }

    if (numeroSocio && !/^[A-Za-z0-9]+$/.test(numeroSocio)) {
      errs.numeroSocio = 'Deve ser alfanumérico';
    }

    if (!encarregadoId.trim()) {
      errs.encarregadoId = 'O encarregado é obrigatório';
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
        error={nif.length > 0 ? errors.nif : undefined}
        keyboardType="numeric"
        maxLength={9}
      />
      <Input
        label="Número de Sócio"
        placeholder="Nº de sócio (se aplicável)"
        value={numeroSocio}
        onChangeText={setNumeroSocio}
        error={numeroSocio.length > 0 ? errors.numeroSocio : undefined}
      />
      <Input
        label="Posição"
        placeholder="Ex: Avançado, Defesa, Guarda-redes"
        value={posicao}
        onChangeText={setPosicao}
      />
      <Select
        label="ID Encarregado"
        placeholder="Selecione um encarregado"
        options={encarregadosOptions}
        selectedValue={encarregadoId}
        onValueChange={setEncarregadoId}
        error={errors.encarregadoId}
        required
      />
      <Select
        label="ID Equipa"
        placeholder="Selecione a equipa (opcional)"
        options={equipasOptions}
        selectedValue={equipaId}
        onValueChange={setEquipaId}
      />

      <View style={formStyles.actions}>
        <Button label="Cancelar" onPress={onCancel} variant="secondary" />
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
  container: { gap: 0 },
  actions: {
    flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8,
  },
});
