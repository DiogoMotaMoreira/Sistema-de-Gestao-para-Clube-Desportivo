import React from 'react';
import { FileCheck } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function ValidacaoDocumentalScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Validação Documental"
      subtitle="Fila de aprovação de documentos civis e EMDs."
      icon={<FileCheck size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
