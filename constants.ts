import { Table, TableStatus, MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [];

export const INITIAL_TABLES: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  status: TableStatus.Vacant,
  order: [],
}));
