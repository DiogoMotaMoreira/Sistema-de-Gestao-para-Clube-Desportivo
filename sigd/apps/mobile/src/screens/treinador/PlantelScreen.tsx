import React from 'react';
import { Users } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function PlantelScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Plantel"
      subtitle="Lista de atletas da equipa com semáforo clínico e métricas."
      icon={<Users size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
