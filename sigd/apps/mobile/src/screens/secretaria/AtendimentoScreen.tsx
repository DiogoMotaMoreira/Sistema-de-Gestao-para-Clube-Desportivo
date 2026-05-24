import React from 'react';
import { Headphones } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function AtendimentoScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Atendimento"
      subtitle="Gestão de atendimento presencial e registo de interações."
      icon={<Headphones size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
