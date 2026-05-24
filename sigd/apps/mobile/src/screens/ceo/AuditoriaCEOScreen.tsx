import React from 'react';
import { ShieldCheck } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function AuditoriaCEOScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Auditoria"
      subtitle="Acesso read-only ao histórico imutável de eventos do sistema."
      icon={<ShieldCheck size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
