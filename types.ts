export enum TableStatus {
  Vacant = 'Vacant',
  Occupied = 'Occupied',
  NeedsBill = 'Needs Bill',
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
}

export interface OrderItem extends MenuItem {
  quantity: number;
}

export interface Table {
  id: number;
  status: TableStatus;
  order: OrderItem[];
}