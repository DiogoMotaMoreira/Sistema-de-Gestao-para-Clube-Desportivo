import React from 'react';
import { Settings } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function ConfiguracoesScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Configurações Globais"
      subtitle="Gateway de comunicações, parâmetros globais e dados de referência."
      icon={<Settings size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
