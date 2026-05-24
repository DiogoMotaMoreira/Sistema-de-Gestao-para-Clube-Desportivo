import React from 'react';
import { FolderOpen } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function DossiesScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Dossiês Clínicos"
      subtitle="Histórico clínico por atleta com semáforo de elegibilidade."
      icon={<FolderOpen size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
