import React from 'react';
import { LayoutDashboard } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function VisaoExecutivaScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Visão Executiva"
      subtitle="Dashboard de alto nível com KPIs financeiros, desportivos e operacionais."
      icon={<LayoutDashboard size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
