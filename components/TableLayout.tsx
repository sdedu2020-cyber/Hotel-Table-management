
import React from 'react';
import { Table } from '../types';
import TableCard from './TableCard';

interface TableLayoutProps {
  tables: Table[];
  onSelectTable: (table: Table) => void;
}

const TableLayout: React.FC<TableLayoutProps> = ({ tables, onSelectTable }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-100 mb-6">Table Overview</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {tables.map(table => (
          <TableCard key={table.id} table={table} onSelect={onSelectTable} />
        ))}
      </div>
    </div>
  );
};

export default TableLayout;