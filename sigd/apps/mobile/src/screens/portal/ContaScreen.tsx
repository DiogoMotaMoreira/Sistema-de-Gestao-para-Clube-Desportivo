import React from 'react';
import { User } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function ContaScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Conta"
      subtitle="Situação financeira, dados pessoais e configurações."
      icon={<User size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
