import React from 'react';
import { BarChart3 } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function AnaliseScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Análise"
      subtitle="Análise de desempenho por escalão e métricas de rendimento."
      icon={<BarChart3 size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
