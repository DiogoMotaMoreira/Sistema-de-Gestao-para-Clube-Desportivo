import React from 'react';
import { Home } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function InicioScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Início"
      subtitle="Alertas, próximo evento e resumo do estado do atleta."
      icon={<Home size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
