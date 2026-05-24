import React from 'react';
import { Settings } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function ConfiguracoesSecScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Configurações"
      subtitle="Configurações específicas do módulo de Secretaria."
      icon={<Settings size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
