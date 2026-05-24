import React from 'react';
import { Users } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function PlanteisScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Plantéis"
      subtitle="Gestão de equipas, escalões e alocação de atletas."
      icon={<Users size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
