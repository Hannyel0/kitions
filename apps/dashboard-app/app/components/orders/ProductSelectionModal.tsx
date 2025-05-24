'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X as CloseIcon,
  Search as SearchIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  case_size: number;
  category: string;
}

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductsSelect: (
    selectedProducts: {
      product_id: string;
      quantity: number;
    }[],
  ) => void;
  existingSelections?: {
    product_id: string;
    quantity: number;
  }[];
}

export function ProductSelectionModal({
  isOpen,
  onClose,
  products,
  onProductsSelect,
  existingSelections = [],
}: ProductSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, number>
  >(() => {
    const initial: Record<string, number> = {};
    existingSelections.forEach((selection) => {
      initial[selection.product_id] = selection.quantity;
    });
    return initial;
  });

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleQuantityChange = (productId: string, change: number) => {
    setSelectedProducts((prev) => {
      const currentQuantity = prev[productId] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);
      if (newQuantity === 0) {
        const { [productId]: removed, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [productId]: newQuantity,
      };
    });
  };

  const handleSubmit = () => {
    const selections = Object.entries(selectedProducts).map(
      ([product_id, quantity]) => ({
        product_id,
        quantity,
      }),
    );
    onProductsSelect(selections);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
        >
          <motion.div 
            className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1], delay: 0.02 }}
          >
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-gray-900 text-xl font-semibold">Select Products</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <CloseIcon size={20} />
          </button>
        </div>
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>
        <div className="overflow-y-auto max-h-[50vh] p-6">
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`flex border border-gray-200 rounded-lg overflow-hidden ${selectedProducts[product.id] ? 'bg-gray-50 ring-1 ring-blue-100' : 'bg-white'}`}
              >
                <div className="w-32 h-32 flex-shrink-0">
                  {product.image && !product.image.includes('placeholder.com') ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // If image fails to load, replace with fallback
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.querySelector('.fallback-container')!.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className="fallback-container flex items-center justify-center h-full w-full bg-gray-100 border border-gray-200">
                      <Image 
                        src="/package-open.svg" 
                        alt="Package icon" 
                        width={64} 
                        height={64} 
                        className="h-16 w-16" 
                        priority
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {product.category}
                      </p>
                      <p className="text-gray-900 text-sm font-medium mt-1">
                        ${product.price}/case
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(product.id, -1)}
                        className="font-bold cursor-pointer p-1 text-gray-500 hover:text-gray-700"
                      >
                        <MinusIcon size={16} />
                      </button>
                      <span className="text-gray-900 w-8 text-center">
                        {selectedProducts[product.id] || 0}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(product.id, 1)}
                        className="font-bold cursor-pointer p-1 text-gray-500 hover:text-gray-700"
                      >
                        <PlusIcon size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {Object.keys(selectedProducts).length} products selected
            </div>
            <div className="space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer text-gray-500 hover:text-gray-700 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
              >
                Add Selected Products
              </button>
            </div>
          </div>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
