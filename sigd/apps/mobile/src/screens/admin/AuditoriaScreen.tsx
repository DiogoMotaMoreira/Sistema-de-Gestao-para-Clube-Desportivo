import React from 'react';
import { ShieldCheck } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function AuditoriaScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Auditoria e Segurança"
      subtitle="Registo imutável de todos os eventos críticos do sistema."
      icon={<ShieldCheck size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
