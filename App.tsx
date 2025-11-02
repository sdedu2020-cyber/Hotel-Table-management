import React, { useState, useCallback, useEffect } from 'react';
import { Table, OrderItem, TableStatus, MenuItem } from './types';
import { INITIAL_TABLES, MENU_ITEMS } from './constants';
import TableLayout from './components/TableLayout';
import OrderModal from './components/OrderModal';
import BillModal from './components/BillModal';
import NewOrderModal from './components/NewOrderModal';
import AddMenuItemModal from './components/AddMenuItemModal';
import { PlusIcon, ClipboardListIcon } from './components/icons';

// Custom hook to manage state with localStorage persistence
const useLocalStorageState = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = window.localStorage.getItem(key);
      // Check if storedValue is not null or undefined before parsing
      if (storedValue) {
        const parsed = JSON.parse(storedValue);
        // Ensure the parsed value is not null before returning
        if (parsed !== null) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Error reading from localStorage for key:", key, error);
    }
    // If anything fails or the stored value is null, return the default value
    return defaultValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error writing to localStorage for key:", key, error);
    }
  }, [key, value]);

  return [value, setValue];
};


const App: React.FC = () => {
  const [tables, setTables] = useLocalStorageState<Table[]>('restaurant-tables', INITIAL_TABLES);
  const [menuItems, setMenuItems] = useLocalStorageState<MenuItem[]>('restaurant-menu', MENU_ITEMS);
  const [categories, setCategories] = useLocalStorageState<string[]>('restaurant-categories', []);
  
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [billingTable, setBillingTable] = useState<Table | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  const handleSelectTable = (table: Table) => {
    if (table.status === TableStatus.NeedsBill) {
        setBillingTable(table);
    } else {
        setSelectedTable(table);
    }
  };

  const handleCloseModal = () => {
    setSelectedTable(null);
  };
  
  const handleCloseBillModal = () => {
    setBillingTable(null);
  }

  const handleUpdateOrder = useCallback((tableId: number, newOrder: OrderItem[]) => {
    setTables(prevTables =>
      prevTables.map(table =>
        table.id === tableId ? { ...table, order: newOrder } : table
      )
    );
    if (selectedTable && selectedTable.id === tableId) {
      setSelectedTable(prev => prev ? { ...prev, order: newOrder } : null);
    }
  }, [selectedTable, setTables]);
  
  const handleUpdateStatus = useCallback((tableId: number, newStatus: TableStatus) => {
      setTables(prevTables =>
          prevTables.map(table =>
              table.id === tableId ? { ...table, status: newStatus } : table
          )
      );
      if (selectedTable && selectedTable.id === tableId) {
          setSelectedTable(prev => prev ? { ...prev, status: newStatus } : null);
      }
  }, [selectedTable, setTables]);

  const handleRequestBill = useCallback((table: Table) => {
    setTables(prevTables =>
        prevTables.map(t =>
            t.id === table.id ? { ...t, status: TableStatus.NeedsBill } : t
        )
    );
    setSelectedTable(null);
    setBillingTable({ ...table, status: TableStatus.NeedsBill });
  }, [setTables]);
  
  const handleMarkAsPaid = useCallback((tableId: number) => {
    setTables(prevTables =>
      prevTables.map(table =>
        table.id === tableId ? { ...table, order: [], status: TableStatus.Vacant } : table
      )
    );
    if (selectedTable && selectedTable.id === tableId) {
      setSelectedTable(null);
    }
    if (billingTable && billingTable.id === tableId) {
      setBillingTable(null);
    }
  }, [selectedTable, billingTable, setTables]);
  
  const handleCreateOrder = useCallback((tableId: number, newOrder: OrderItem[]) => {
    if (newOrder.length > 0) {
        setTables(prevTables =>
            prevTables.map(table =>
                table.id === tableId
                ? { ...table, order: newOrder, status: TableStatus.Occupied }
                : table
            )
        );
    }
    setIsNewOrderModalOpen(false);
  }, [setTables]);
  
  const handleAddNewMenuItem = useCallback((item: Omit<MenuItem, 'id'>) => {
      setMenuItems(prevMenu => {
          const newId = Math.max(0, ...prevMenu.map(i => i.id)) + 1;
          const newItem: MenuItem = { ...item, id: newId };
          return [...prevMenu, newItem];
      });
  }, [setMenuItems]);

  const handleAddCategory = useCallback((categoryName: string) => {
    if (categoryName && !categories.includes(categoryName)) {
        setCategories(prev => [...prev, categoryName].sort());
    }
  }, [categories, setCategories]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-gray-700">
        <div className="flex justify-between items-center container mx-auto">
            <h1 className="text-2xl font-bold text-purple-400">Wix Restaurant POS</h1>
            <div className="flex items-center gap-2 sm:gap-4">
                <button
                    onClick={() => setIsAddItemModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-2 sm:px-4 rounded-md transition-colors flex items-center gap-2"
                    aria-label="Add new menu item"
                >
                    <ClipboardListIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Add Item</span>
                </button>
                <button
                    onClick={() => setIsNewOrderModalOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-2 sm:px-4 rounded-md transition-colors flex items-center gap-2"
                    aria-label="Create new order"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">New Order</span>
                </button>
            </div>
        </div>
      </header>
      <main className="container mx-auto">
        <div className="p-4 sm:p-6 md:p-8">
            <TableLayout tables={tables} onSelectTable={handleSelectTable} />
        </div>
      </main>
      {selectedTable && (
        <OrderModal
          table={selectedTable}
          onClose={handleCloseModal}
          onUpdateOrder={handleUpdateOrder}
          onUpdateStatus={handleUpdateStatus}
          onRequestBill={handleRequestBill}
          onMarkAsPaid={handleMarkAsPaid}
        />
      )}
      {billingTable && (
        <BillModal
          table={billingTable}
          onClose={handleCloseBillModal}
          onMarkAsPaid={handleMarkAsPaid}
        />
      )}
      {isNewOrderModalOpen && (
        <NewOrderModal
            tables={tables.filter(t => t.status === TableStatus.Vacant)}
            menu={menuItems}
            categories={categories}
            onClose={() => setIsNewOrderModalOpen(false)}
            onCreateOrder={handleCreateOrder}
        />
      )}
      {isAddItemModalOpen && (
        <AddMenuItemModal 
            categories={categories}
            onClose={() => setIsAddItemModalOpen(false)}
            onAddItem={handleAddNewMenuItem}
            onAddCategory={handleAddCategory}
        />
      )}
    </div>
  );
};

export default App;