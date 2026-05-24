import React from 'react';
import { CreditCard } from 'lucide-react-native';
import { PlaceholderScreen } from '../../components/ui/PlaceholderScreen';
import { Colors } from '../../constants/colors';

export function CartaoScreen(): React.JSX.Element {
  return (
    <PlaceholderScreen
      title="Cartão Digital"
      subtitle="Cartão de identificação do atleta com QR Code rotativo."
      icon={<CreditCard size={64} color={Colors.GRAY_200_BORDAS} />}
    />
  );
}
