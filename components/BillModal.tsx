import React from 'react';
import { Table } from '../types';
import { PrinterIcon, XIcon } from './icons';

interface BillModalProps {
  table: Table;
  onClose: () => void;
  onMarkAsPaid: (tableId: number) => void;
}

const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

const BillModal: React.FC<BillModalProps> = ({ table, onClose, onMarkAsPaid }) => {
  const handlePrint = () => {
    window.print();
  };

  const subtotal = table.order.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cgst = subtotal * 0.025;
  const sgst = subtotal * 0.025;
  const total = subtotal + cgst + sgst;
  const now = new Date();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="relative bg-gray-800 rounded-lg shadow-xl w-full max-w-md flex flex-col">
        {/* Printable Area */}
        <div id="printable-area" className="p-6 bg-white text-black font-mono text-xs w-[302px] mx-auto my-6 printable-content">
          <div className="text-center">
            <h2 className="text-lg font-bold">Wix Restaurant</h2>
            <p className="text-[10px]">123 Gastronomy Lane, Foodie City</p>
            <p className="text-[10px]">Phone: (123) 456-7890</p>
            <hr className="border-t border-dashed border-black my-2" />
          </div>
          <div className="flex justify-between text-[10px]">
            <span>Bill No: {(Math.random() * 100000).toFixed(0)}</span>
            <span>Table: {table.id}</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span>Date: {now.toLocaleDateString('en-IN')}</span>
            <span>Time: {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <hr className="border-t border-dashed border-black my-2" />
          <table className="w-full text-[11px]">
            <thead>
              <tr className='border-b border-dashed border-black'>
                <th className="text-left font-semibold pb-1">Item</th>
                <th className="text-center font-semibold pb-1">Qty</th>
                <th className="text-right font-semibold pb-1">Price</th>
                <th className="text-right font-semibold pb-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {table.order.map(item => (
                <tr key={item.id}>
                  <td className="text-left pr-1 py-1">{item.name}</td>
                  <td className="text-center py-1">{item.quantity}</td>
                  <td className="text-right py-1">{item.price.toFixed(2)}</td>
                  <td className="text-right py-1">{(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr className="border-t border-dashed border-black my-2" />
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>CGST @2.5%:</span>
              <span>{cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST @2.5%:</span>
              <span>{sgst.toFixed(2)}</span>
            </div>
          </div>
          <hr className="border-t border-dashed border-black my-2" />
          <div className="flex justify-between font-bold text-sm">
            <span>TOTAL:</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <hr className="border-t border-dashed border-black my-2" />
          <p className="text-center mt-4 text-[10px]">
            Thank you for your visit!
          </p>
        </div>

        {/* Action Buttons (Not printable) */}
        <div className="p-4 bg-gray-700 rounded-b-lg grid grid-cols-2 gap-4">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
          >
            <PrinterIcon className="w-5 h-5" />
            Print Bill
          </button>
          <button
            onClick={() => onMarkAsPaid(table.id)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
          >
            Mark as Paid
          </button>
        </div>
        
        <button onClick={onClose} className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-600 transition-colors">
          <XIcon className="w-6 h-6 text-white" />
        </button>

      </div>
    </div>
  );
};

export default BillModal;