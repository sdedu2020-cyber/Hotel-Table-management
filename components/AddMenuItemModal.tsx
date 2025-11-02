import React, { useState } from 'react';
import { MenuItem } from '../types';
import { XIcon } from './icons';

interface AddMenuItemModalProps {
  categories: string[];
  onClose: () => void;
  onAddItem: (item: Omit<MenuItem, 'id'>) => void;
  onAddCategory: (categoryName: string) => void;
}

const AddMenuItemModal: React.FC<AddMenuItemModalProps> = ({ categories, onClose, onAddItem, onAddCategory }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<string>(categories[0] || '');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState({ name: '', price: '', category: '' });

  const validate = () => {
    const newErrors = { name: '', price: '', category: '' };
    let isValid = true;
    if (!name.trim()) {
      newErrors.name = 'Item name is required.';
      isValid = false;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = 'Please enter a valid positive price.';
      isValid = false;
    }
    if (!category) {
        newErrors.category = 'Please select or add a category.';
        isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  
  const handleAddCategoryClick = () => {
    const categoryName = prompt("Enter new category name:");
    if (categoryName) {
        onAddCategory(categoryName);
        setCategory(categoryName); // Select the new category automatically
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAddItem({
        name,
        price: parseFloat(price),
        category,
        description,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md flex flex-col overflow-hidden">
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Add New Menu Item</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="item-name" className="block text-sm font-medium text-gray-300 mb-1">Item Name</label>
              <input
                type="text"
                id="item-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
                aria-invalid={!!errors.name}
                aria-describedby="item-name-error"
              />
              {errors.name && <p id="item-name-error" className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="item-price" className="block text-sm font-medium text-gray-300 mb-1">Price (Rate)</label>
              <input
                type="number"
                id="item-price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
                min="0.01"
                step="0.01"
                aria-invalid={!!errors.price}
                aria-describedby="item-price-error"
              />
               {errors.price && <p id="item-price-error" className="text-red-400 text-xs mt-1">{errors.price}</p>}
            </div>
             <div>
              <label htmlFor="item-category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <select
                id="item-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                {categories.length === 0 ? (
                    <option value="">Please add a category first</option>
                ) : (
                    categories.map(cat => <option key={cat} value={cat}>{cat}</option>)
                )}
              </select>
               {errors.category && <p id="item-category-error" className="text-red-400 text-xs mt-1">{errors.category}</p>}
            </div>
             <div>
              <label htmlFor="item-description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                id="item-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="Optional description of the item."
              />
            </div>
          </div>
          <footer className="p-4 bg-gray-700/50 flex justify-between items-center gap-3">
            <button type="button" onClick={handleAddCategoryClick} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                Add Category
            </button>
            <div className="flex gap-3">
                <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Cancel
                </button>
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Add Item
                </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItemModal;