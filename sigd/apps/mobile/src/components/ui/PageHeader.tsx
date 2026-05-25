import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

interface PageHeaderProps {
  title: string;
  breadcrumbs: { label: string }[];
}

export function PageHeader({ title, breadcrumbs }: PageHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.breadcrumbs}>
        {breadcrumbs.map((b, i) => (
          <React.Fragment key={i}>
            {b.label}
            {i < breadcrumbs.length - 1 && <Text style={styles.separator}> / </Text>}
          </React.Fragment>
        ))}
      </Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    paddingBottom: 0,
    backgroundColor: Colors.BRANCO,
  },
  breadcrumbs: {
    fontSize: 12,
    color: Colors.GRAY_500_TEXTO2,
    marginBottom: 8,
  },
  separator: {
    color: Colors.GRAY_200_BORDAS,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
  },
});
