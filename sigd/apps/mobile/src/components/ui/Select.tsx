import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Modal } from './Modal';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export function Select({
  label,
  placeholder = 'Selecione uma opção',
  options,
  selectedValue,
  onValueChange,
  error,
  required,
}: SelectProps): React.JSX.Element {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((o) => o.value === selectedValue);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.input, error && styles.inputError]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.inputText, !selectedOption && styles.inputPlaceholder]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown size={20} color={Colors.GRAY_500_TEXTO2} />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={label || 'Selecione uma opção'}
      >
        <ScrollView style={styles.optionsList} contentContainerStyle={styles.optionsContent}>
          {options.map((option) => {
            const isSelected = option.value === selectedValue;
            return (
              <TouchableOpacity
                key={option.value}
                style={styles.optionItem}
                onPress={() => {
                  onValueChange(option.value);
                  setModalVisible(false);
                }}
              >
                <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                  {option.label}
                </Text>
                {isSelected && <Check size={20} color={Colors.DOURADO_CTA} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.GRAY_900_TEXTO1,
    marginBottom: 6,
  },
  required: {
    color: Colors.ERRO_TEXT,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.BRANCO,
  },
  inputError: {
    borderColor: Colors.ERRO_TEXT,
  },
  inputText: {
    fontSize: 15,
    color: Colors.GRAY_900_TEXTO1,
    flex: 1,
  },
  inputPlaceholder: {
    color: Colors.GRAY_500_TEXTO2,
  },
  errorText: {
    fontSize: 13,
    color: Colors.ERRO_TEXT,
    marginTop: 4,
  },
  optionsList: {
    maxHeight: 400,
  },
  optionsContent: {
    paddingBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
  },
  optionLabel: {
    fontSize: 15,
    color: Colors.GRAY_900_TEXTO1,
  },
  optionLabelSelected: {
    fontWeight: '600',
    color: Colors.PRETO_PRIMARIO,
  },
});
