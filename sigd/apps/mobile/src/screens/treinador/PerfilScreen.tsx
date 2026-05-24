import React from 'react';
import { User } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function PerfilScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Perfil"
      subtitle="Dados pessoais e configurações de conta."
      icon={<User size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
