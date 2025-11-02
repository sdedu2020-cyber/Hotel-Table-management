import React, { useState } from 'react';
import { Table, MenuItem, OrderItem } from '../types';
import { PlusIcon, MinusIcon, TrashIcon, XIcon, ClipboardListIcon } from './icons';

interface NewOrderModalProps {
  tables: Table[]; // vacant tables
  menu: MenuItem[];
  categories: string[];
  onClose: () => void;
  onCreateOrder: (tableId: number, newOrder: OrderItem[]) => void;
}

const NewOrderModal: React.FC<NewOrderModalProps> = ({ tables, menu, categories, onClose, onCreateOrder }) => {
  const [selectedTableId, setSelectedTableId] = useState<number | null>(tables.length > 0 ? tables[0].id : null);
  const [order, setOrder] = useState<OrderItem[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const addItem = (itemToAdd: MenuItem) => {
    const existingItem = order.find(item => item.id === itemToAdd.id);
    let newOrder;
    if (existingItem) {
      newOrder = order.map(item =>
        item.id === itemToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newOrder = [...order, { ...itemToAdd, quantity: 1 }];
    }
    setOrder(newOrder);
  };

  const removeItem = (itemId: number) => {
    const newOrder = order.filter(item => item.id !== itemId);
    setOrder(newOrder);
  };

  const updateQuantity = (itemId: number, delta: number) => {
    const newOrder = order
      .map(item =>
        item.id === itemId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
      .filter(item => item.quantity > 0);
    setOrder(newOrder);
  };
  
  const handleCreateOrder = () => {
      if (selectedTableId && order.length > 0) {
          onCreateOrder(selectedTableId, order);
      }
  };
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsSidebarVisible(false);
  };
  
  const handleShowCategories = () => {
    setIsSidebarVisible(true);
    setSelectedCategory(null);
  };

  const total = order.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold">New Order</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          {/* Left Side: Order Summary */}
          <div className="w-full md:w-2/5 flex flex-col p-4 border-r border-gray-700">
             <div className="mb-4">
              <label htmlFor="table-select" className="block text-sm font-medium text-gray-300 mb-1">Select Table</label>
              <select
                id="table-select"
                value={selectedTableId ?? ''}
                onChange={(e) => setSelectedTableId(Number(e.target.value))}
                disabled={tables.length === 0}
                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:bg-gray-800 disabled:cursor-not-allowed"
              >
                {tables.length > 0 ? (
                  tables.map(t => <option key={t.id} value={t.id}>Table {t.id}</option>)
                ) : (
                  <option>No vacant tables</option>
                )}
              </select>
            </div>
            <h3 className="text-xl font-semibold mb-2">Order Items</h3>
            <div className="flex-grow overflow-y-auto pr-2">
              {order.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <p>No items added yet.</p>
                    <p className="text-sm">Select items from the menu.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {order.map(item => (
                    <li key={item.id} className="flex items-center bg-gray-900 p-3 rounded-md">
                      <div className="flex-grow">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-400">₹{item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded-full hover:bg-gray-700"><MinusIcon className="w-4 h-4" /></button>
                        <span className="font-mono w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded-full hover:bg-gray-700"><PlusIcon className="w-4 h-4" /></button>
                        <button onClick={() => removeItem(item.id)} className="p-1 rounded-full hover:bg-red-500/20 text-red-400"><TrashIcon className="w-4 h-4" /></button>
                      </div>
                      <p className="w-20 text-right font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-auto pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center text-2xl font-bold mb-4">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCreateOrder} 
                  disabled={!selectedTableId || order.length === 0}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-900 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-colors"
                >
                    Create Order
                </button>
            </div>
          </div>

          {/* Right Side: Menu with Sidebar */}
          <div className="w-full md:w-3/5 flex flex-col p-4">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Menu</h3>
                {!isSidebarVisible && (
                    <button
                        onClick={handleShowCategories}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-md transition-colors flex items-center gap-2"
                        aria-label="Show menu categories"
                    >
                        <ClipboardListIcon className="w-5 h-5" />
                        <span>Categories</span>
                    </button>
                )}
            </div>
            <div className="flex-grow flex gap-4 overflow-hidden">
              {/* Category Sidebar */}
              {isSidebarVisible && (
                <nav className="w-48 flex-shrink-0 bg-gray-900/50 rounded-lg p-2 overflow-y-auto">
                    <ul className="space-y-1">
                    {categories.map(category => (
                        <li key={category}>
                        <button
                            onClick={() => handleCategorySelect(category)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedCategory === category
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            {category}
                        </button>
                        </li>
                    ))}
                    </ul>
                </nav>
              )}

              {/* Menu Items */}
              <div className="flex-grow overflow-y-auto pr-2">
                {!selectedCategory ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <ClipboardListIcon className="w-16 h-16 mb-4" />
                        <h3 className="text-lg font-semibold">Select a category</h3>
                        <p className="text-sm">Choose a category to see menu items.</p>
                    </div>
                ) : (
                 <div className={`grid gap-3 ${isSidebarVisible ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                    {menu.filter(item => item.category === selectedCategory).map(item => (
                      <div key={item.id} onClick={() => addItem(item)} className="bg-gray-700/50 p-3 rounded-md hover:bg-gray-700 cursor-pointer transition-colors flex flex-col h-full">
                        <div className="flex-grow">
                            <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-white pr-2">{item.name}</h4>
                                <p className="font-semibold text-white whitespace-nowrap">₹{item.price.toFixed(2)}</p>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                        </div>
                        <div className="flex justify-end mt-2">
                            <button aria-label={`Add ${item.name} to order`} className="text-purple-400"><PlusIcon className="w-5 h-5"/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrderModal;
