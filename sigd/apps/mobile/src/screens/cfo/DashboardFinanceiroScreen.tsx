import React from 'react';
import { BarChart3 } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function DashboardFinanceiroScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Dashboard Financeiro"
      subtitle="Visão financeira detalhada com análise de receitas e dívidas."
      icon={<BarChart3 size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
