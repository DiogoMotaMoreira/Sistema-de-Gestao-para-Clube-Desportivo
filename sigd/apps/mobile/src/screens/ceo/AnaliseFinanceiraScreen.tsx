import React from 'react';
import { TrendingUp } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function AnaliseFinanceiraScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Análise Financeira"
      subtitle="Tesouraria, incumprimento e análise Clube vs. SAD."
      icon={<TrendingUp size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
