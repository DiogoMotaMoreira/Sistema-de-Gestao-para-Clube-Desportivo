import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { FileText, Download } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

export type PresetPeriodo = 'Esta Semana' | 'Este Mês' | 'Trimestre' | 'Época Ativa' | 'Personalizado';

interface CeoFiltersProps {
  label: string;
  presets: PresetPeriodo[];
  activePreset: PresetPeriodo;
  onChangePreset: (preset: PresetPeriodo) => void;
  onExportPDF?: () => void;
  onExportCSV?: () => void;
  showCustomDates?: boolean;
}

export function CeoFilters({
  label,
  presets,
  activePreset,
  onChangePreset,
  onExportPDF,
  onExportCSV,
  showCustomDates = true,
}: CeoFiltersProps) {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.presetsRow}>
        {presets.map((preset) => {
          const isActive = activePreset === preset;
          return (
            <TouchableOpacity
              key={preset}
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => onChangePreset(preset)}
            >
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {preset}
              </Text>
            </TouchableOpacity>
          );
        })}

        {activePreset === 'Personalizado' && showCustomDates && (
          <View style={styles.datesContainer}>
            <TextInput
              style={styles.dateInput}
              placeholder="dd/mm/aaaa"
              value={dataInicio}
              onChangeText={setDataInicio}
            />
            <Text style={{ marginHorizontal: 4, color: Colors.GRAY_500_TEXTO2 }}>-</Text>
            <TextInput
              style={styles.dateInput}
              placeholder="dd/mm/aaaa"
              value={dataFim}
              onChangeText={setDataFim}
            />
          </View>
        )}
      </View>

      <View style={styles.actionsRow}>
        {onExportPDF && (
          <TouchableOpacity style={styles.btnOutline} onPress={onExportPDF}>
            <FileText size={16} color={Colors.GRAY_900_TEXTO1} style={{ marginRight: 6 }} />
            <Text style={styles.btnOutlineText}>Gerar Relatório (PDF)</Text>
          </TouchableOpacity>
        )}
        {onExportCSV && (
          <TouchableOpacity style={styles.btnOutline} onPress={onExportCSV}>
            <Download size={16} color={Colors.GRAY_900_TEXTO1} style={{ marginRight: 6 }} />
            <Text style={styles.btnOutlineText}>Exportar (CSV)</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
    marginRight: 16,
  },
  presetsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    backgroundColor: 'transparent',
  },
  pillActive: {
    backgroundColor: Colors.DOURADO_CTA,
    borderColor: Colors.DOURADO_CTA,
  },
  pillText: {
    fontSize: 13,
    color: Colors.GRAY_900_TEXTO1,
  },
  pillTextActive: {
    color: Colors.PRETO_PRIMARIO,
    fontWeight: '600',
  },
  datesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 13,
    backgroundColor: Colors.BRANCO,
    width: 100,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 16,
  },
  btnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  btnOutlineText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.GRAY_900_TEXTO1,
  },
});
