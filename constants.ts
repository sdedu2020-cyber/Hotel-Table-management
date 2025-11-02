
import { Table, TableStatus, MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  { id: 1, name: 'Bruschetta', price: 8.50, category: 'Appetizer', description: 'Grilled bread with tomatoes, garlic, basil.' },
  { id: 2, name: 'Calamari Fritti', price: 12.00, category: 'Appetizer', description: 'Crispy fried squid with marinara sauce.' },
  { id: 3, name: 'Caprese Salad', price: 9.75, category: 'Appetizer', description: 'Fresh mozzarella, tomatoes, and basil.' },
  { id: 4, name: 'Spaghetti Carbonara', price: 16.00, category: 'Main Course', description: 'Pasta with eggs, cheese, pancetta.' },
  { id: 5, name: 'Margherita Pizza', price: 14.50, category: 'Main Course', description: 'Classic pizza with tomatoes, mozzarella, basil.' },
  { id: 6, name: 'Chicken Parmesan', price: 18.00, category: 'Main Course', description: 'Breaded chicken with marinara and cheese.' },
  { id: 7, name: 'Grilled Salmon', price: 22.50, category: 'Main Course', description: 'Salmon with a lemon-dill sauce.' },
  { id: 8, name: 'Vegetable Lasagna', price: 15.50, category: 'Main Course', description: 'Layered pasta with fresh vegetables and cheese.'},
  { id: 9, name: 'Tiramisu', price: 7.50, category: 'Dessert', description: 'Coffee-flavored Italian dessert.' },
  { id: 10, name: 'Cannoli', price: 6.00, category: 'Dessert', description: 'Pastry shell with sweet, creamy filling.' },
  { id: 11, name: 'Panna Cotta', price: 7.00, category: 'Dessert', description: 'Italian custard with a berry coulis.'},
  { id: 12, name: 'House Red Wine', price: 8.00, category: 'Drink', description: 'A glass of our finest red.' },
  { id: 13, name: 'Sparkling Water', price: 3.50, category: 'Drink', description: '500ml bottle.' },
  { id: 14, name: 'Espresso', price: 3.00, category: 'Drink', description: 'Strong Italian coffee.' },
];

export const INITIAL_TABLES: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  status: TableStatus.Vacant,
  order: [],
}));
