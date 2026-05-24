import React from 'react';
import { CalendarDays } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function AgendaScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Agenda"
      subtitle="Treinos e jogos do atleta — convocatórias e presença."
      icon={<CalendarDays size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
