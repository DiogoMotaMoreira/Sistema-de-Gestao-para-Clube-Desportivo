import React from 'react';
import { Activity } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function MonitorizacaoScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Monitorização"
      subtitle="Dashboard de saúde clínica global — EMDs a caducar, ocorrências ativas."
      icon={<Activity size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
