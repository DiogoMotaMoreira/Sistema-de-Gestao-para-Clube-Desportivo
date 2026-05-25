import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onValueChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({
  label,
  checked,
  onValueChange,
  disabled,
}: CheckboxProps): React.JSX.Element {
  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={() => !disabled && onValueChange(!checked)}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Check size={16} color={Colors.DOURADO_CTA} />}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    minHeight: 48, // Touch target mínimo
  },
  box: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BRANCO,
  },
  boxChecked: {
    borderColor: Colors.DOURADO_CTA,
  },
  label: {
    marginLeft: 12,
    fontSize: 13,
    color: Colors.GRAY_900_TEXTO1,
  },
  disabled: {
    opacity: 0.5,
  },
});
