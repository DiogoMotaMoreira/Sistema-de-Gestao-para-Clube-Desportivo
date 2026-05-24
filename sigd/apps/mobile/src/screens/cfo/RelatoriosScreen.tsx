import React from 'react';
import { FileText } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function RelatoriosScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Relatórios"
      subtitle="Exportação de relatórios financeiros e operacionais."
      icon={<FileText size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
