import React from 'react';
import { Shield } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function GestaoAcessosScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Gestão de Acessos"
      subtitle="Controlo do diretório de contas e atribuição de perfis de permissão (RBAC)."
      icon={<Shield size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
