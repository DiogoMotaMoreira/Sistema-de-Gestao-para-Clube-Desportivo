/**
 * LoginScreen — Ecrã de autenticação do SIGD
 *
 * Utiliza componentes do Design System (Input, Button) conforme DESIGN.md v2.2.
 * Autentica via authStore.login() → authService → POST /api/v1/auth/login.
 *
 * Fluxo:
 * 1. Utilizador insere username + password
 * 2. Clica "Entrar" → chama login() da store
 * 3. Sucesso → tokens guardados, AppNavigator navega automaticamente via RBAC
 * 4. Erro 401 → toast "Utilizador ou password incorretos"
 * 5. Erro 500 → toast "Erro no servidor"
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LogIn } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { useAuthStore, AuthError } from '../../stores/authStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function LoginScreen(): React.JSX.Element {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const login = useAuthStore((s) => s.login);

  const handleLogin = async (): Promise<void> => {
    if (!username.trim() || !password.trim()) {
      setError('Preenche o username e a password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login(username.trim(), password);
      // Sucesso → AppNavigator deteta isAuthenticated=true e navega automaticamente
    } catch (err) {
      if (err instanceof AuthError) {
        if (err.statusCode === 401) {
          setError('Utilizador ou password incorretos');
        } else if (err.statusCode >= 500) {
          setError('Erro no servidor. Tenta novamente mais tarde.');
        } else if (err.statusCode === 0) {
          setError('Não foi possível contactar o servidor');
        } else if (err.message.toLowerCase().includes('bloqueada')) {
          setError('Conta bloqueada. Contacte o administrador.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Ocorreu um erro inesperado. Tenta novamente.');
      }
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

          <Input
            label="Username"
            placeholder="ex: medico"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            label={isLoading ? 'A entrar...' : 'Entrar'}
            onPress={() => void handleLogin()}
            variant="primary"
            loading={isLoading}
            disabled={isLoading}
            fullWidth
            icon={
              !isLoading ? (
                <LogIn size={18} color={Colors.PRETO_PRIMARIO} />
              ) : undefined
            }
            style={styles.loginButton}
          />
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
  loginButton: {
    marginTop: 8,
  },
  footer: {
    marginTop: 32,
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
  },
});
