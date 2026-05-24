import React from 'react';
import { Users } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function BaseAssociativaScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Base Associativa"
      subtitle="Monitorização read-only da base de sócios e atletas."
      icon={<Users size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
