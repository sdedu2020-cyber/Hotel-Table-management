import React from 'react';
import { Table, OrderItem, TableStatus } from '../types';
import { TrashIcon, XIcon } from './icons';

interface OrderModalProps {
  table: Table;
  onClose: () => void;
  onUpdateOrder: (tableId: number, newOrder: OrderItem[]) => void;
  onUpdateStatus: (tableId: number, newStatus: TableStatus) => void;
  onRequestBill: (table: Table) => void;
  onMarkAsPaid: (tableId: number) => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ table, onClose, onUpdateOrder, onUpdateStatus, onRequestBill, onMarkAsPaid }) => {

  const removeItem = (itemId: number) => {
    const newOrder = table.order.filter(item => item.id !== itemId);
    onUpdateOrder(table.id, newOrder);
     if (newOrder.length === 0) {
        onUpdateStatus(table.id, TableStatus.Vacant);
    }
  };

  const total = table.order.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Table {table.id} - Order</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-grow flex flex-col overflow-auto p-4">
            <div className="flex-grow">
              {table.order.length === 0 ? (
                <p className="text-gray-400 text-center mt-8">No items in order.</p>
              ) : (
                <ul className="space-y-3">
                  {table.order.map(item => (
                    <li key={item.id} className="flex items-center bg-gray-900 p-3 rounded-md">
                      <div className="flex-grow">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-400">₹{item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="font-mono text-center">x {item.quantity}</span>
                         <p className="w-20 text-right font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                         <button 
                            onClick={() => removeItem(item.id)} 
                            className="p-2 rounded-full hover:bg-red-500/20 text-red-400" 
                            aria-label={`Remove ${item.name}`}
                          >
                            <TrashIcon className="w-5 h-5" />
                         </button>
                      </div>
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
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => onRequestBill(table)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors">
                        Request Bill
                    </button>
                     <button onClick={() => onMarkAsPaid(table.id)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition-colors">
                        Mark as Paid
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;