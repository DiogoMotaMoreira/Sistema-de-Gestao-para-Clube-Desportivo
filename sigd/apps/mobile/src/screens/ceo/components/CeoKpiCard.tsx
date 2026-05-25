import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrendingUp, AlertCircle, PieChart, Banknote, Trophy, ClipboardCheck, UserX, Users, ShieldCheck, FileCheck, ArrowUpRight, ArrowDownRight, Minus, ChevronRight, LucideIcon } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface CeoKpiCardProps {
  label: string;
  valorFormatado: string;
  subtexto: string;
  icon: LucideIcon;
  iconColor?: string;
  variacaoTexto?: string;
  variacaoPositiva?: boolean;
  variacaoNeutra?: boolean;
  onDrillDown?: () => void;
  drillDownText?: string;
  gaugeValue?: number; // Para circular gauge
  children?: React.ReactNode; // para conteúdos extra tipo badges
  valorCor?: string;
}

export function CeoKpiCard({
  label,
  valorFormatado,
  subtexto,
  icon: Icon,
  iconColor = Colors.GRAY_200_BORDAS,
  variacaoTexto,
  variacaoPositiva,
  variacaoNeutra,
  onDrillDown,
  drillDownText,
  gaugeValue,
  children,
  valorCor = Colors.GRAY_900_TEXTO1
}: CeoKpiCardProps) {
  
  // Lógica para cor de variação
  let VarIcon = ArrowUpRight;
  let varColor: string = Colors.GRAY_500_TEXTO2;
  
  if (variacaoNeutra) {
    VarIcon = Minus;
    varColor = Colors.GRAY_500_TEXTO2;
  } else if (variacaoPositiva) {
    VarIcon = ArrowUpRight;
    varColor = Colors.SUCESSO_TEXT;
  } else if (variacaoTexto) {
    VarIcon = ArrowDownRight;
    varColor = Colors.ERRO_TEXT;
  }

  // Cor do Gauge progressivo
  let gaugeColor: string = Colors.SUCESSO_TEXT;
  if (gaugeValue !== undefined) {
    if (gaugeValue < 70) gaugeColor = Colors.ERRO_TEXT;
    else if (gaugeValue < 85) gaugeColor = Colors.AVISO_TEXT;
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Icon size={24} color={iconColor} />
      </View>

      {gaugeValue !== undefined ? (
        <View style={styles.gaugeContainer}>
          <View style={styles.gaugeCircle}>
             {/* Simulação de SVG arc para React Native Web s/ biblioteca extra */}
             <View style={[styles.gaugeInner, { borderColor: gaugeColor }]} />
             <Text style={[styles.gaugeText, { color: gaugeColor }]}>{gaugeValue}%</Text>
          </View>
        </View>
      ) : (
        <Text style={[styles.value, { color: valorCor }]}>{valorFormatado}</Text>
      )}

      {children}

      {variacaoTexto && (
        <View style={styles.variacaoRow}>
          <VarIcon size={14} color={varColor} />
          <Text style={[styles.variacaoText, { color: varColor }]}>{variacaoTexto}</Text>
        </View>
      )}

      <Text style={styles.subtexto}>{subtexto}</Text>

      {onDrillDown && drillDownText && (
        <>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.btnDrillDown} onPress={onDrillDown}>
            <Text style={styles.btnDrillDownText}>{drillDownText}</Text>
            <ChevronRight size={14} color={Colors.INFO_TEXT} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.BRANCO,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    borderRadius: 16,
    padding: 20,
    flex: 1,
    shadowColor: Colors.PRETO_PRIMARIO,
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.GRAY_500_TEXTO2,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  variacaoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  variacaoText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  subtexto: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.GRAY_200_BORDAS,
    marginVertical: 12,
  },
  btnDrillDown: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnDrillDownText: {
    fontSize: 12,
    color: Colors.INFO_TEXT,
    fontWeight: '500',
    marginRight: 4,
  },
  gaugeContainer: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  gaugeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 8,
    borderColor: Colors.GRAY_200_BORDAS,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gaugeInner: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 32,
    borderWidth: 8,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
  gaugeText: {
    fontSize: 16,
    fontWeight: '700',
  }
});
