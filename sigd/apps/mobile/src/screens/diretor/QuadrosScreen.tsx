import React from 'react';
import { Trophy } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function QuadrosScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Quadros Competitivos"
      subtitle="Gestão de competições, jornadas e resultados."
      icon={<Trophy size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
