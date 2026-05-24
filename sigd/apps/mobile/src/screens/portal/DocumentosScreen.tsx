import React from 'react';
import { FileText } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function DocumentosScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Documentos"
      subtitle="Submissão e acompanhamento de EMDs e documentos civis."
      icon={<FileText size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
