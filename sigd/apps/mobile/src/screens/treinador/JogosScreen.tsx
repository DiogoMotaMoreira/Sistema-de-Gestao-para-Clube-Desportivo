import React from 'react';
import { Calendar } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function JogosScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Jogos"
      subtitle="Lista de jogos futuros e passados com estado de convocatórias e fichas."
      icon={<Calendar size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
