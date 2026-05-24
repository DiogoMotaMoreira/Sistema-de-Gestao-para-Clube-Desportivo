/**
 * Button — Componente de botão do SIGD
 *
 * DESIGN.md §3.1:
 * - Primário: Fundo #F1C40F | Texto #000000 SemiBold. Sem borda.
 * - Secundário (Outline): Fundo Transparente | Borda 1px #E2E8F0 | Texto #0F172A.
 * - Destrutivo: Fundo #FEE2E2 | Texto #991B1B SemiBold.
 *
 * Suporta estados: normal, disabled, loading.
 * fullWidth ocupa 100% da largura (padrão mobile, DESIGN.md §5.1).
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { Colors } from '@/constants/colors';

type ButtonVariant = 'primary' | 'secondary' | 'destructive';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
}: ButtonProps): React.JSX.Element {
  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle[] = [
    styles.base,
    variantStyles[variant].container,
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style as ViewStyle,
  ].filter(Boolean) as ViewStyle[];

  const textStyle: TextStyle[] = [
    styles.label,
    variantStyles[variant].label,
    isDisabled && styles.labelDisabled,
  ].filter(Boolean) as TextStyle[];

  const spinnerColor = variant === 'primary'
    ? Colors.PRETO_PRIMARIO
    : variant === 'destructive'
      ? Colors.ERRO_TEXT
      : Colors.GRAY_900_TEXTO1;

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={textStyle}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

// ── Estilos base ───────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 20,
    gap: 8,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  labelDisabled: {
    opacity: 0.7,
  },
});

// ── Variantes ──────────────────────────────────────────

const variantStyles: Record<ButtonVariant, { container: ViewStyle; label: TextStyle }> = {
  primary: {
    container: {
      backgroundColor: Colors.DOURADO_CTA,
    },
    label: {
      color: Colors.PRETO_PRIMARIO,
    },
  },
  secondary: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: Colors.GRAY_200_BORDAS,
    },
    label: {
      color: Colors.GRAY_900_TEXTO1,
    },
  },
  destructive: {
    container: {
      backgroundColor: Colors.ERRO_BG,
    },
    label: {
      color: Colors.ERRO_TEXT,
    },
  },
};
