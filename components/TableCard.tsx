import React from 'react';
import { Table, TableStatus } from '../types';

interface TableCardProps {
  table: Table;
  onSelect: (table: Table) => void;
}

const statusColors = {
  [TableStatus.Vacant]: 'border-green-500 bg-green-500/10 hover:bg-green-500/20',
  [TableStatus.Occupied]: 'border-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20',
  [TableStatus.NeedsBill]: 'border-blue-500 bg-blue-500/10 hover:bg-blue-500/20',
};

const TableCard: React.FC<TableCardProps> = ({ table, onSelect }) => {
  const total = table.order.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div
      onClick={() => onSelect(table)}
      className={`p-4 rounded-lg border-2 flex flex-col justify-between cursor-pointer transition-all duration-300 ${statusColors[table.status]}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Table {table.id}</h3>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[table.status].replace('border-', 'bg-').replace('/10', '')} text-gray-900`}>
          {table.status}
        </span>
      </div>
      <div className="mt-4 text-center">
        <p className="text-base text-gray-400">Order Total</p>
        <p className="text-3xl font-mono font-bold text-white">₹{total.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default TableCard;