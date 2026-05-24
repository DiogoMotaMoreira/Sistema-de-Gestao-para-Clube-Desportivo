import React from 'react';
import { Home } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function HojeScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Hoje"
      subtitle="Eventos do dia — treinos, jogos e alertas de ação."
      icon={<Home size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
