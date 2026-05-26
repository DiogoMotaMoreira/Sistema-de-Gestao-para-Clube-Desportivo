/**
 * SearchInput — Campo de pesquisa com debounce do SIGD
 *
 * DESIGN.md §4 (Padrões Comportamentais):
 * - Debounce: Inputs de pesquisa disparam após ≥ 3 caracteres
 *   e paragem na digitação (300ms).
 *
 * AGENTS.md:
 * - Debounce pesquisa: após 3 caracteres + paragem de digitação (300ms).
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  /** Mínimo de caracteres antes de disparar (default: 3) */
  minChars?: number;
  /** Tempo de debounce em ms (default: 300) */
  debounceMs?: number;
  style?: ViewStyle;
}

export function SearchInput({
  placeholder = 'Pesquisar...',
  onSearch,
  minChars = 0,
  debounceMs = 300,
  style,
}: SearchInputProps): React.JSX.Element {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Limpar timer ao desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current != null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      setText(value);

      // Limpar timer anterior
      if (timerRef.current != null) {
        clearTimeout(timerRef.current);
      }

      // Se o campo foi limpo, notificar imediatamente
      if (value.length === 0) {
        onSearch('');
        return;
      }

      // Só disparar se >= minChars
      if (value.length >= minChars) {
        timerRef.current = setTimeout(() => {
          onSearch(value.trim());
        }, debounceMs);
      }
    },
    [onSearch, minChars, debounceMs],
  );

  const handleClear = useCallback(() => {
    setText('');
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
    }
    onSearch('');
  }, [onSearch]);

  return (
    <View
      style={[
        styles.container,
        isFocused && styles.containerFocused,
        style,
      ]}
    >
      <Search size={18} color={Colors.GRAY_500_TEXTO2} />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.GRAY_500_TEXTO2}
        value={text}
        onChangeText={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel={placeholder}
        accessibilityRole="search"
      />

      {text.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          accessibilityLabel="Limpar pesquisa"
          accessibilityRole="button"
        >
          <X size={16} color={Colors.GRAY_500_TEXTO2} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  containerFocused: {
    borderColor: Colors.DOURADO_CTA,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.GRAY_900_TEXTO1,
    height: '100%',
    padding: 0,
  },
});
