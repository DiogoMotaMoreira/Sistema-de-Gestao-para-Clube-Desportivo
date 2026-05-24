import React from 'react';
import { Building2 } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function EntidadesScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Entidades"
      subtitle="Gestão de sócios, atletas, EE e entidades associadas."
      icon={<Building2 size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
