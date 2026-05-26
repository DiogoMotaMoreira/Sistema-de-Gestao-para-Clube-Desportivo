import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export function SortableHeader({ 
  label, 
  field, 
  sortConfig, 
  onSort 
}: {
  label: string;
  field: string;
  sortConfig: SortConfig | null;
  onSort: (field: string) => void;
}) {
  const isActive = sortConfig?.field === field;
  const icon = !isActive ? '↕' : sortConfig.direction === 'asc' ? '↑' : '↓';
  
  return (
    <TouchableOpacity 
      onPress={() => onSort(field)}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
    >
      <Text style={{ fontWeight: '600', color: isActive ? '#1B2B5E' : '#6B7280' }}>
        {label}
      </Text>
      <Text style={{ color: isActive ? '#1B2B5E' : '#9CA3AF', fontSize: 10 }}>
        {icon}
      </Text>
    </TouchableOpacity>
  );
}
