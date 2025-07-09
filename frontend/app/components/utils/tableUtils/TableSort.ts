import { useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export function useTableSort<T>() {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const toggleSort = (column: keyof T) => {
    if (column === sortColumn) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

const sortData = (data: T[]): T[] => {
  if (!sortColumn) return data;

  return [...data].sort((a, b) => {
    const aRaw = a[sortColumn];
    const bRaw = b[sortColumn];

    if (aRaw == null || bRaw == null) return 0;

    const aValue = typeof aRaw === 'string' || typeof aRaw === 'number' || aRaw instanceof Date
      ? aRaw
      : aRaw.toString();

    const bValue = typeof bRaw === 'string' || typeof bRaw === 'number' || bRaw instanceof Date
      ? bRaw
      : bRaw.toString();

    const isDate = typeof aValue === 'string' && !isNaN(Date.parse(aValue.toString()));

    const aVal = isDate ? new Date(aValue).getTime() : aValue.toString().toLowerCase();
    const bVal = isDate ? new Date(bValue).getTime() : bValue.toString().toLowerCase();

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
};


  return {
    sortColumn,
    sortDirection,
    toggleSort,
    sortData,
  };
}
