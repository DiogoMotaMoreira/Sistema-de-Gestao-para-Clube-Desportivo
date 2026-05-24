/**
 * Modal — Overlay responsivo do SIGD
 *
 * DESIGN.md §3.6:
 * - Backdrop: Fundo escuro 40-50% opacidade + backdrop-blur.
 * - Janela: Fundo #FFFFFF, Corner Radius 12px, Drop Shadow Forte.
 * - Rodapé: Botões alinhados à direita (Cancelar → Confirmar).
 *
 * DESIGN.md §5.1 (Mobile):
 * - Modais → Bottom Sheets (deslizam de baixo, 50% do ecrã,
 *   corners superiores 16px).
 *
 * Platform.select: modal centrado (web) vs Bottom Sheet (mobile).
 */

import React from 'react';
import {
  View,
  Text,
  Modal as RNModal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  type ViewStyle,
} from 'react-native';
import { X } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Estilo extra para o container do conteúdo */
  contentStyle?: ViewStyle;
}

export function Modal({
  visible,
  onClose,
  title,
  children,
  contentStyle,
}: ModalProps): React.JSX.Element {
  const isWeb = Platform.OS === 'web';

  return (
    <RNModal
      visible={visible}
      transparent
      animationType={isWeb ? 'fade' : 'slide'}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose} accessibilityLabel="Fechar modal">
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        style={isWeb ? styles.desktopPositioner : styles.mobilePositioner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        pointerEvents="box-none"
      >
        <View
          style={[
            isWeb ? styles.desktopSheet : styles.mobileSheet,
            contentStyle,
          ]}
          accessibilityLabel={title}
        >
          {/* Handle (Mobile only) */}
          {!isWeb && (
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
          )}

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
              accessibilityLabel="Fechar"
              accessibilityRole="button"
            >
              <X size={20} color={Colors.GRAY_500_TEXTO2} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  // ── Backdrop ─────────────────────────────────────────
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },

  // ── Desktop (Web) — Modal centrado ───────────────────
  desktopPositioner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  desktopSheet: {
    backgroundColor: Colors.BRANCO,
    borderRadius: 12,
    width: '100%',
    maxWidth: 540,
    maxHeight: '80%',
    // Sombra Forte — DESIGN.md §1.3
    shadowColor: Colors.PRETO_PRIMARIO,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },

  // ── Mobile — Bottom Sheet ────────────────────────────
  mobilePositioner: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  mobileSheet: {
    backgroundColor: Colors.BRANCO,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '85%',
    // Sombra Forte
    shadowColor: Colors.PRETO_PRIMARIO,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },

  // ── Handle (Mobile) ─────────────────────────────────
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.GRAY_200_BORDAS,
  },

  // ── Header ──────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200_BORDAS,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.GRAY_900_TEXTO1,
    flex: 1,
    marginRight: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.GRAY_50_FUNDO,
  },

  // ── Body ────────────────────────────────────────────
  body: {
    flexShrink: 1,
  },
  bodyContent: {
    padding: 20,
  },
});
