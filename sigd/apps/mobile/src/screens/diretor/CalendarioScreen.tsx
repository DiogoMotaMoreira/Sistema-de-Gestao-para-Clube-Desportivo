import React from 'react';
import { Calendar } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function CalendarioScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Calendário"
      subtitle="Planeamento de sessões de treino e jogos por escalão."
      icon={<Calendar size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
