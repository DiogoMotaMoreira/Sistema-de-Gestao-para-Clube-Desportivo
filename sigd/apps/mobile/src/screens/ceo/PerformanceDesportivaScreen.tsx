import React from 'react';
import { Trophy } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function PerformanceDesportivaScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Performance Desportiva"
      subtitle="Resultados desportivos agregados por escalão."
      icon={<Trophy size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
