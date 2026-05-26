import { SortConfig } from '../components/ui/SortableHeader';

export function sortList<T>(list: T[], config: SortConfig | null): T[] {
  if (!config) return list;
  return [...list].sort((a, b) => {
    const aVal = (a as any)[config.field];
    const bVal = (b as any)[config.field];
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    const cmp = typeof aVal === 'string' 
      ? aVal.localeCompare(bVal) 
      : aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return config.direction === 'asc' ? cmp : -cmp;
  });
}
