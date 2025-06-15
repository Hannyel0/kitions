'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X as CloseIcon,
  Search as SearchIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Package,
  ShoppingCart,
  Filter,
  Grid3X3,
  List,
  Check,
  PackageX
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

// Memoized Product Card Component
const ProductCard = React.memo(({ 
  product, 
  viewMode, 
  selectedQuantity, 
  onQuantityChange 
}: {
  product: Product;
  viewMode: 'grid' | 'list';
  selectedQuantity: number;
  onQuantityChange: (productId: string, change: number) => void;
}) => {
  const handleIncrement = useCallback(() => {
    onQuantityChange(product.id, 1);
  }, [product.id, onQuantityChange]);

  const handleDecrement = useCallback(() => {
    onQuantityChange(product.id, -1);
  }, [product.id, onQuantityChange]);

  return (
    <div
      className={`group bg-white/40 rounded-xl border border-white/30 overflow-hidden hover:bg-white/60 transition-colors duration-200 ${
        selectedQuantity ? 'ring-2 ring-blue-500/50 bg-blue-50/30' : ''
      }`}
    >
      <div className={viewMode === 'grid' ? 'p-4' : 'flex items-center p-4'}>
        {/* Product Image */}
        <div className={`relative flex-shrink-0 ${viewMode === 'grid' ? 'w-full h-32 mb-4' : 'w-16 h-16 mr-4'}`}>
          <div className="w-full h-full bg-white/80 rounded-xl overflow-hidden shadow-sm border border-white/30">
            {product.image && product.image !== '/package-open.svg' ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallbackContainer = e.currentTarget.parentElement!.querySelector('.fallback-container') as HTMLElement;
                  if (fallbackContainer) fallbackContainer.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="fallback-container flex items-center justify-center h-full w-full bg-gray-100/80" style={{ display: (!product.image || product.image === '/package-open.svg') ? 'flex' : 'none' }}>
              <Package className={viewMode === 'grid' ? 'h-8 w-8 text-gray-400' : 'h-6 w-6 text-gray-400'} />
            </div>
          </div>
          {selectedQuantity > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
              <Check size={12} className="text-white" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={`flex-1 ${viewMode === 'grid' ? '' : 'min-w-0'}`}>
          <div className={`flex ${viewMode === 'grid' ? 'flex-col' : 'items-center'} justify-between h-full`}>
            <div className={`flex-1 ${viewMode === 'list' ? 'min-w-0' : ''}`}>
              <h3 className={`font-bold text-gray-900 ${viewMode === 'grid' ? 'text-base mb-1' : 'text-sm mb-0.5'} ${viewMode === 'list' ? 'truncate' : ''}`}>
                {product.name}
              </h3>
              <p className={`text-gray-600 ${viewMode === 'grid' ? 'text-sm mb-2 line-clamp-2' : 'text-xs mb-1 truncate'}`}>
                {product.description}
              </p>
              <div className={`flex items-center ${viewMode === 'grid' ? 'space-x-3 mb-3' : 'space-x-2'}`}>
                <span className={`inline-flex items-center px-2 py-1 bg-blue-100/80 text-blue-700 font-medium rounded-lg border border-blue-200/50 ${viewMode === 'grid' ? 'text-xs' : 'text-xs'}`}>
                  {product.category}
                </span>
                <span className={`text-gray-900 font-bold ${viewMode === 'grid' ? 'text-sm' : 'text-xs'}`}>
                  ${product.price}/case
                </span>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className={`flex items-center ${viewMode === 'grid' ? 'justify-center space-x-3' : 'space-x-2 ml-4'}`}>
              <button
                type="button"
                onClick={handleDecrement}
                className={`p-2 bg-white/80 text-gray-600 rounded-lg hover:bg-white hover:text-gray-800 transition-colors duration-200 border border-white/40 ${viewMode === 'grid' ? '' : 'p-1.5'} disabled:opacity-50`}
                disabled={selectedQuantity === 0}
              >
                <MinusIcon size={viewMode === 'grid' ? 16 : 14} />
              </button>
              <div className={`bg-white/80 rounded-lg px-3 py-2 border border-white/40 min-w-[3rem] text-center ${viewMode === 'grid' ? '' : 'px-2 py-1 min-w-[2.5rem]'}`}>
                <span className={`font-bold text-gray-900 ${viewMode === 'grid' ? 'text-base' : 'text-sm'}`}>
                  {selectedQuantity}
                </span>
              </div>
              <button
                type="button"
                onClick={handleIncrement}
                className={`p-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-500 transition-colors duration-200 border border-blue-400/50 ${viewMode === 'grid' ? '' : 'p-1.5'}`}
              >
                <PlusIcon size={viewMode === 'grid' ? 16 : 14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export function ProductSelectionModal({
  isOpen,
  onClose,
  products,
  onProductsSelect,
  existingSelections = [],
}: ProductSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProducts, setSelectedProducts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    existingSelections.forEach((selection) => {
      initial[selection.product_id] = selection.quantity;
    });
    return initial;
  });

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Memoize categories to avoid recalculation
  const categories = useMemo(() => {
    return ['all', ...Array.from(new Set(products.map(p => p.category)))];
  }, [products]);

  // Memoize filtered products with debounced search
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = !debouncedQuery || 
        product.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(debouncedQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, debouncedQuery, selectedCategory]);

  // Memoize calculations
  const { selectedCount, totalQuantity, totalValue } = useMemo(() => {
    const count = Object.keys(selectedProducts).length;
    const quantity = Object.values(selectedProducts).reduce((sum, qty) => sum + qty, 0);
    const value = Object.entries(selectedProducts).reduce((sum, [productId, qty]) => {
      const product = products.find(p => p.id === productId);
      return sum + (product ? product.price * qty : 0);
    }, 0);
    return { selectedCount: count, totalQuantity: quantity, totalValue: value };
  }, [selectedProducts, products]);

  const handleQuantityChange = useCallback((productId: string, change: number) => {
    setSelectedProducts((prev) => {
      const currentQuantity = prev[productId] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);
      if (newQuantity === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [productId]: newQuantity,
      };
    });
  }, []);

  const handleSubmit = useCallback(() => {
    const selections = Object.entries(selectedProducts).map(
      ([product_id, quantity]) => ({
        product_id,
        quantity,
      }),
    );
    onProductsSelect(selections);
    onClose();
  }, [selectedProducts, onProductsSelect, onClose]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div 
            className="bg-white/90 rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl border border-white/20"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative overflow-hidden bg-white/40 border-b border-white/20 px-6 py-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/60 rounded-xl border border-white/30">
                    <Package className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Select Products</h2>
                    <p className="text-gray-600 text-sm">Choose products and quantities for your order</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 bg-white/60 text-gray-700 rounded-xl hover:bg-white/80 transition-colors duration-200 border border-white/30"
                >
                  <CloseIcon size={18} />
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white/30 border-b border-white/20 px-6 py-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search products by name, category, or description..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/60 border border-white/30 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <SearchIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-amber-100/80 rounded-lg border border-amber-200/50">
                      <Filter size={14} className="text-amber-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Category</span>
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 bg-white/60 border border-white/30 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-white/60 rounded-xl border border-white/30 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-blue-500/80 text-white shadow-sm' 
                        : 'text-gray-600 hover:bg-white/60'
                    }`}
                  >
                    <Grid3X3 size={14} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-blue-500/80 text-white shadow-sm' 
                        : 'text-gray-600 hover:bg-white/60'
                    }`}
                  >
                    <List size={14} />
                  </button>
                </div>
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{filteredProducts.length} products found</span>
                  {debouncedQuery && (
                    <span className="px-2 py-1 bg-blue-100/80 text-blue-700 rounded-lg border border-blue-200/50">
                      "{debouncedQuery}"
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="px-2 py-1 bg-amber-100/80 text-amber-700 rounded-lg border border-amber-200/50">
                      {selectedCategory}
                    </span>
                  )}
                </div>
                {selectedCount > 0 && (
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="p-1.5 bg-emerald-100/80 rounded-lg border border-emerald-200/50">
                      <ShoppingCart size={14} className="text-emerald-600" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      {selectedCount} selected • {totalQuantity} items • ${totalValue.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Products List */}
            <div className="overflow-y-auto flex-1 p-6" style={{ maxHeight: 'calc(95vh - 280px)' }}>
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative mx-auto w-20 h-20 mb-6">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-lg"></div>
                    <div className="relative bg-white/60 rounded-full flex items-center justify-center w-full h-full border border-white/30">
                      <PackageX className="h-10 w-10 text-gray-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {debouncedQuery || selectedCategory !== 'all' ? 'No products match your filters' : 'No products available'}
                  </h3>
                  <p className="text-gray-600 text-center max-w-md text-sm">
                    {debouncedQuery || selectedCategory !== 'all'
                      ? 'Try adjusting your search terms or category filter to find products.'
                      : 'Add products to your inventory before creating an order.'}
                  </p>
                  {(debouncedQuery || selectedCategory !== 'all') && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 bg-blue-500/80 text-white font-medium rounded-xl hover:bg-blue-500 transition-colors duration-200 text-sm"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <motion.div 
                  className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-3'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                      selectedQuantity={selectedProducts[product.id] || 0}
                      onQuantityChange={handleQuantityChange}
                    />
                  ))}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-white/40 border-t border-white/20 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">{selectedCount}</span> products selected
                  </div>
                  {selectedCount > 0 && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">{totalQuantity}</span> total items
                    </div>
                  )}
                  {totalValue > 0 && (
                    <div className="text-sm">
                      <span className="text-gray-600">Total: </span>
                      <span className="font-bold text-blue-600">${totalValue.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-white/60 text-gray-700 font-medium rounded-xl hover:bg-white/80 transition-colors duration-200 border border-white/30 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={selectedCount === 0}
                    className="px-6 py-2 bg-blue-500/80 text-white font-medium rounded-xl hover:bg-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm flex items-center space-x-2"
                  >
                    <ShoppingCart size={16} />
                    <span>Add Selected Products</span>
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
