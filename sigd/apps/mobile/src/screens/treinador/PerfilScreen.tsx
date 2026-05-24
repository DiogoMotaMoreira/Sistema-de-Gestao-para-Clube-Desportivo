import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User as UserIcon } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';

export function PerfilScreen(): React.JSX.Element {
  const { user, activeRole, logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <UserIcon size={40} color={Colors.GRAY_500_TEXTO2} />
        </View>
        <Text style={styles.name}>{user?.name || 'Utilizador'}</Text>
        <Text style={styles.role}>{activeRole || 'Sem Role'}</Text>
      </View>

      <View style={styles.content}>
        {/* Futuras definições ou dados do utilizador */}
      </View>

      <View style={styles.footer}>
        <Button
          label="Terminar Sessão"
          variant="destructive"
          onPress={logout}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: Colors.BRANCO,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.GRAY_100_HOVER,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.GRAY_900_TEXTO1,
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: Colors.GRAY_500_TEXTO2,
  },
  content: {
    flex: 1,
  },
  footer: {
    paddingBottom: 24,
  },
});
