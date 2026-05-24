/**
 * Input — Campo de texto do SIGD
 *
 * DESIGN.md §3.2:
 * - Background: #FFFFFF
 * - Borda: 1px #E2E8F0. Corner Radius: 8px.
 * - Focus: Borda muda para Dourado #F1C40F.
 * - Erro: Borda muda para Vermelho #DC2626.
 *
 * Suporta estados: normal, focus, error, disabled.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type ViewStyle,
  type KeyboardTypeOptions,
} from 'react-native';
import { Colors } from '@/constants/colors';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  required?: boolean;
  style?: ViewStyle;
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helperText,
  disabled = false,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize,
  multiline = false,
  numberOfLines,
  maxLength,
  required = false,
  style,
}: InputProps): React.JSX.Element {
  const [isFocused, setIsFocused] = useState(false);

  const hasError = error != null && error.length > 0;

  const inputBorderColor = hasError
    ? Colors.ERRO_BORDA_FOCUS
    : isFocused
      ? Colors.DOURADO_CTA
      : Colors.GRAY_200_BORDAS;

  return (
    <View style={[styles.wrapper, style]}>
      {label != null && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.requiredMark}> *</Text>}
        </Text>
      )}

      <TextInput
        style={[
          styles.input,
          { borderColor: inputBorderColor },
          disabled && styles.inputDisabled,
          multiline && styles.inputMultiline,
          multiline && numberOfLines != null && { minHeight: numberOfLines * 24 },
        ]}
        placeholder={placeholder}
        placeholderTextColor={Colors.GRAY_500_TEXTO2}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        editable={!disabled}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        accessibilityLabel={label ?? placeholder}
        accessibilityState={{ disabled }}
      />

      {hasError && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {!hasError && helperText != null && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}

      {maxLength != null && (
        <Text style={[
          styles.charCount,
          value.length >= maxLength && styles.charCountLimit,
        ]}>
          {value.length} / {maxLength}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.GRAY_500_TEXTO2,
    marginBottom: 6,
  },
  requiredMark: {
    color: Colors.ERRO_BORDA_FOCUS,
  },
  input: {
    height: 48,
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
    color: Colors.GRAY_900_TEXTO1,
  },
  inputDisabled: {
    backgroundColor: Colors.GRAY_50_FUNDO,
    opacity: 0.6,
  },
  inputMultiline: {
    height: undefined,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 11,
    color: Colors.ERRO_BORDA_FOCUS,
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
    marginTop: 4,
  },
  charCount: {
    fontSize: 11,
    color: Colors.GRAY_500_TEXTO2,
    textAlign: 'right',
    marginTop: 2,
  },
  charCountLimit: {
    color: Colors.ERRO_TEXT,
  },
});
