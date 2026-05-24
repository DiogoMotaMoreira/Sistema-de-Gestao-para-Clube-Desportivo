import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { LogIn } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { useAuthStore } from '../../stores/authStore';
import { Role } from '../../constants/roles';

export function LoginScreen(): React.JSX.Element {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const setAuth = useAuthStore((s) => s.setAuth);

  const handleLogin = async (): Promise<void> => {
    if (!email.trim() || !password.trim()) {
      setError('Preenche o email e a password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Substituir pelo call real à API via Axios
      // Simulação temporária para teste de navegação
      const mockUser = {
        id: 1,
        name: 'Utilizador Teste',
        email: email.trim(),
        roles: [Role.TREINADOR] as Role[],
      };

      setAuth('mock-access-token', 'mock-refresh-token', mockUser);
    } catch {
      setError('Credenciais inválidas. Tenta novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        {/* Logo Area */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>BFC</Text>
          </View>
          <Text style={styles.appName}>SIGD</Text>
          <Text style={styles.appSubtitle}>Sistema Integrado de Gestão Desportiva</Text>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="nome@boavistafc.pt"
            placeholderTextColor={Colors.GRAY_500_TEXTO2}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            accessibilityLabel="Campo de email"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={Colors.GRAY_500_TEXTO2}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            accessibilityLabel="Campo de password"
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={() => void handleLogin()}
            disabled={isLoading}
            activeOpacity={0.8}
            accessibilityLabel="Botão de login"
            accessibilityRole="button"
          >
            <LogIn size={18} color={Colors.PRETO_PRIMARIO} />
            <Text style={styles.buttonText}>
              {isLoading ? 'A entrar...' : 'Entrar'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Boavista FC · Época 2025/2026</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.PRETO_PRIMARIO,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.DOURADO_CTA,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.GRAY_500_TEXTO2,
  },
  formCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.BRANCO,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    shadowColor: Colors.PRETO_PRIMARIO,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  errorBanner: {
    backgroundColor: Colors.ERRO_BG,
    borderWidth: 1,
    borderColor: Colors.ERRO_TEXT,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    color: Colors.ERRO_TEXT,
    fontWeight: '500',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.GRAY_500_TEXTO2,
    marginBottom: 6,
    marginTop: 12,
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
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    backgroundColor: Colors.DOURADO_CTA,
    borderRadius: 8,
    marginTop: 24,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.PRETO_PRIMARIO,
  },
  footer: {
    marginTop: 32,
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
  },
});
