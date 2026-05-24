import React from 'react';
import { ClipboardList } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function FilaEMDsScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Fila de EMDs"
      subtitle="Exames médico-desportivos pendentes de validação."
      icon={<ClipboardList size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
