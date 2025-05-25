'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft as ArrowLeftIcon,
  Plus as PlusIcon,
  UserPlus as UserPlusIcon,
  Search as SearchIcon,
  Trash2 as Trash2Icon,
  PackageX as PackageXIcon,
} from 'lucide-react';
import { ProductSelectionModal } from '@/app/components/orders/ProductSelectionModal';
import { RetailerSelectionDropdown } from '@/app/components/orders/RetailerSelectionDropdown';
import { createBrowserClient } from '@supabase/ssr';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  case_size: number;
  category: string;
  category_id?: string; // Add category_id for database operations
}

interface OrderProduct {
  product_id: string;
  quantity: number;
}

interface OrderFormState {
  retailer_id?: string;
  newRetailer: boolean;
  retailerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  products: OrderProduct[];
  discount: number;
  notes?: string;
  // Used for temporary empty discount input state
  isDiscountInputActive?: boolean;
}

interface Retailer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export function CreateOrder() {
  const router = useRouter();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const fetchData = useCallback(async () => {
    try {
      setIsDataLoading(true);
      setError(null);
      
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // First, get the distributor record for this user
      const { data: distributorData, error: distributorError } = await supabase
        .from('distributors')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (distributorError) {
        throw new Error('Could not find distributor record for this user');
      }
      
      const distributorId = distributorData.id;
      
      // Fetch retailers from the retailers table
      // Note: Retailers don't have a direct link to distributors in your schema
      // We're fetching all retailers for now
      const { data: retailersData, error: retailersError } = await supabase
        .from('retailers')
        .select(`
          id,
          user_id,
          store_address,
          store_type,
          users(id, email, first_name, last_name, phone, business_name)
        `);
      
      if (retailersError) throw retailersError;
      
      // Transform retailers data to match our Retailer interface
      const transformedRetailers = retailersData.map((retailer: any) => ({
        id: retailer.id,
        name: retailer.users?.business_name || 'Unknown Business',
        email: retailer.users?.email || '',
        phone: retailer.users?.phone || '',
        address: retailer.store_address || '',
      }));
      
      // Fetch products from the distributor_products table where we know we have data
      const { data: productsData, error: productsError } = await supabase
        .from('distributor_products')
        .select(`
          id,
          name,
          description,
          price,
          image_url,
          case_size,
          category_id,
          product_categories(name)
        `)
        .eq('distributor_id', distributorId);
      
      if (productsError) {
        console.error('Error fetching products:', productsError);
        throw new Error(`Could not fetch products: ${productsError.message}`);
      }
      
      if (!productsData || productsData.length === 0) {
        console.log('No products found for this distributor');
      } else {
        console.log(`Found ${productsData.length} products`);
      }
      
      // Transform products data to match our Product interface
      const transformedProducts = productsData.map((product: any) => ({
        id: product.id,
        name: product.name || 'Unnamed Product',
        description: product.description || '',
        price: product.price || 0,
        image: product.image_url || '/package-open.svg',
        case_size: product.case_size || 1,
        category: product.product_categories?.name || 'Uncategorized',
        category_id: product.category_id, // Store the category_id for later use
      }));
      
      console.log('Transformed products:', transformedProducts.length);
      
      setRetailers(transformedRetailers);
      setProducts(transformedProducts);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setIsDataLoading(false);
    }
  }, [supabase]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const [orderForm, setOrderForm] = useState<OrderFormState>({
    newRetailer: false,
    retailerInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    products: [],
    discount: 0,
    notes: '',
  });
  
  const handleRetailerSelect = (retailerId: string) => {
    const selectedRetailer = retailers.find((r) => r.id === retailerId);
    if (selectedRetailer) {
      setOrderForm({
        ...orderForm,
        retailer_id: retailerId,
        newRetailer: false,
        retailerInfo: {
          name: selectedRetailer.name,
          email: selectedRetailer.email,
          phone: selectedRetailer.phone,
          address: selectedRetailer.address,
        },
      });
    }
  };
  
  const handleProductsSelect = (selectedProducts: OrderProduct[]) => {
    // Make sure we're using valid product IDs that exist in the products table
    const validSelectedProducts = selectedProducts.filter(item => {
      // Only include products that exist in our fetched products array
      return products.some(p => p.id === item.product_id);
    });
    
    setOrderForm((prev) => ({
      ...prev,
      products: validSelectedProducts,
    }));
  };
  
  const calculateSubtotal = () => {
    return orderForm.products.reduce((total, orderProduct) => {
      const product = products.find((p) => p.id === orderProduct.product_id);
      return total + (product?.price || 0) * orderProduct.quantity;
    }, 0);
  };
  
  const calculateDiscount = (subtotal: number) => {
    return (subtotal * orderForm.discount) / 100;
  };
  
  const calculateTax = (subtotal: number, discount: number) => {
    // Return 0 to maintain function signature but not apply tax
    return 0;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    // Tax no longer included in total
    return subtotal - discount;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      // Get distributor data
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      // Get distributor ID from the distributors table
      const { data: distributorData, error: distributorError } = await supabase
        .from('distributors')
        .select('id')
        .eq('user_id', session.user.id)
        .single();
        
      if (distributorError) {
        throw new Error('Could not find distributor record');
      }
      
      const distributorId = distributorData.id;
      let retailerId = orderForm.retailer_id;
      
      // Create new retailer if needed
      if (orderForm.newRetailer) {
        // First create a user for the retailer
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert({
            email: orderForm.retailerInfo.email,
            first_name: orderForm.retailerInfo.name.split(' ')[0] || '',
            last_name: orderForm.retailerInfo.name.split(' ').slice(1).join(' ') || '',
            phone: orderForm.retailerInfo.phone,
            business_name: orderForm.retailerInfo.name,
            user_type: 'retailer'
          })
          .select()
          .single();
          
        if (userError) {
          console.error(userError);
          throw new Error(`Failed to create user: ${userError.message}`);
        }
        
        // Then create the retailer record linked to the user
        const { data: newRetailer, error: retailerError } = await supabase
          .from('retailers')
          .insert({
            user_id: newUser.id,
            store_address: orderForm.retailerInfo.address,
            store_type: 'default' // You might want to add a field for this in your form
          })
          .select()
          .single();
          
        if (retailerError) {
          console.error(retailerError);
          throw new Error(`Failed to create retailer: ${retailerError.message}`);
        }
        
        retailerId = newRetailer.id;
      }
      
      if (!retailerId) {
        throw new Error('No retailer selected');
      }
      
      const subtotal = calculateSubtotal();
      const discount = calculateDiscount(subtotal);
      const tax = 0; // Tax set to 0 as per requirement
      const total = subtotal - discount;
      
      // Generate order number (simple implementation)
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          retailer_id: retailerId,
          distributor_id: distributorId,
          status: 'pending',
          payment_status: 'pending', // Set default payment status
          subtotal,
          tax,
          discount,
          total,
          notes: orderForm.notes || '',
        })
        .select()
        .single();
        
      if (orderError) {
        console.error(orderError);
        throw new Error(`Failed to create order: ${orderError.message}`);
      }
      
      // For each product in the order, ensure there's a corresponding entry in the products table
      // (since order_items.product_id references products.id)
      for (const item of orderForm.products) {
        const distributorProduct = products.find(p => p.id === item.product_id);
        if (!distributorProduct) continue; // Skip if product not found
        
        // Check if this product already exists in the products table
        const { data: existingProduct } = await supabase
          .from('products')
          .select('id')
          .eq('id', item.product_id)
          .maybeSingle();
        
        // If no existing product with this ID, create one
        if (!existingProduct) {
          const { error: insertProductError } = await supabase
            .from('products')
            .insert({
              id: distributorProduct.id,
              name: distributorProduct.name || 'Unnamed Product', // Required field
              description: distributorProduct.description,
              price: distributorProduct.price || 0, // Required field
              image_url: distributorProduct.image,
              case_quantity: distributorProduct.case_size,
              distributor_id: distributorId, // Required field
              created_at: new Date().toISOString(), // Required field
              category_id: distributorProduct.category_id,
              sku: '', // Optional
              upc: '' // Optional
            });
            
          if (insertProductError) {
            console.error('Error creating product in products table:', insertProductError);
            throw new Error(`Failed to create product reference: ${insertProductError.message}`);
          }
        }
      }
      
      // Now create order items referencing products
      const orderItems = orderForm.products.map(item => {
        const product = products.find(p => p.id === item.product_id);
        return {
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: product?.price || 0
        };
      });
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        throw new Error(`Failed to create order items: ${itemsError.message}`);
      }
      
      // Set success message and redirect after a short delay
      setFormError(null);
      setSuccessMessage('Order created successfully!');
      // Redirect after a brief delay to allow the user to see the success message
      setTimeout(() => {
        router.push('/distributor/orders');
      }, 1500);
      
    } catch (error: any) {
      console.error('Error creating order:', error);
      setFormError(error.message || 'Failed to create order. Please try again.');
      // Scroll to the top to show the error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderErrorMessage = () => {
    if (!formError) return null;
    return (
      <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-700">Error</h3>
            <p className="text-sm text-red-600 mt-1">{formError}</p>
          </div>
        </div>
      </div>
    );
  };
  
  const renderSuccessMessage = () => {
    if (!successMessage) return null;
    return (
      <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-700">Success</h3>
            <p className="text-sm text-green-600 mt-1">{successMessage}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link
          href="/distributor/orders"
          className="text-gray-500 hover:text-gray-700 mr-4"
        >
          <ArrowLeftIcon size={20} />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-800">Create New Order</h1>
      </div>
      
      {renderErrorMessage()}
      {renderSuccessMessage()}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-gray-900 text-2xl font-semibold">Create New Order</h1>
      </div>
      
      {isDataLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      ) : error ? (
        null
      ) : (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Retailer Selection/Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900 text-lg font-medium">Retailer Information</h2>
            <button
              type="button"
              onClick={() =>
                setOrderForm((prev) => ({
                  ...prev,
                  newRetailer: !prev.newRetailer,
                }))
              }
              className="flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              {orderForm.newRetailer ? (
                <SearchIcon size={16} className="mr-1" />
              ) : (
                <UserPlusIcon size={16} className="mr-1" />
              )}
              {orderForm.newRetailer
                ? 'Select Existing Retailer'
                : 'Add New Retailer'}
            </button>
          </div>
          {!orderForm.newRetailer ? (
            <div className="space-y-4">
              <RetailerSelectionDropdown
                retailers={retailers}
                selectedRetailerId={orderForm.retailer_id}
                onSelect={handleRetailerSelect}
              />
              {orderForm.retailer_id && (
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Contact
                      </label>
                      <div className="mt-1 flex items-center space-x-4">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900">
                            {orderForm.retailerInfo.phone}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900">
                            {orderForm.retailerInfo.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Shipping Address
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {orderForm.retailerInfo.address}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={orderForm.retailerInfo.name}
                  onChange={(e) =>
                    setOrderForm((prev) => ({
                      ...prev,
                      retailerInfo: {
                        ...prev.retailerInfo,
                        name: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={orderForm.retailerInfo.email}
                  onChange={(e) =>
                    setOrderForm((prev) => ({
                      ...prev,
                      retailerInfo: {
                        ...prev.retailerInfo,
                        email: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={orderForm.retailerInfo.phone}
                  onChange={(e) =>
                    setOrderForm((prev) => ({
                      ...prev,
                      retailerInfo: {
                        ...prev.retailerInfo,
                        phone: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={orderForm.retailerInfo.address}
                  onChange={(e) =>
                    setOrderForm((prev) => ({
                      ...prev,
                      retailerInfo: {
                        ...prev.retailerInfo,
                        address: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>
          )}
        </div>
        {/* Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900 text-lg font-medium">Order Products</h2>
            {orderForm.products.length > 0 && (
              <button
                type="button"
                onClick={() => setIsProductModalOpen(true)}
                className="cursor-pointer px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm font-medium flex items-center hover:bg-blue-100"
              >
                <PlusIcon size={16} className="mr-1" />
                Add Products
              </button>
            )}
          </div>
          {orderForm.products.length > 0 ? (
            <div className="space-y-4">
              {orderForm.products.map((orderProduct) => {
                const product = products.find(
                  (p) => p.id === orderProduct.product_id,
                );
                if (!product) return null;
                return (
                  <div
                    key={orderProduct.product_id}
                    className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-medium">{product.name}</h3>
                      <p className="text-gray-500">
                        <span className="text-gray-900 font-medium">${product.price}</span> / per case
                      </p>
                    </div>
                    <div className="text-gray-800 text-sm">
                      Quantity:{' '}
                      <span className="text-gray-900 font-medium">
                        {orderProduct.quantity}
                      </span>
                    </div>
                    <div className="text-gray-900  font-semibold text-lg">
                      ${(product.price * orderProduct.quantity).toFixed(2)}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOrderForm((prev) => ({
                          ...prev,
                          products: prev.products.filter(
                            (p) => p.product_id !== orderProduct.product_id
                          ),
                        }));
                      }}
                      className="cursor-pointer text-red-500 hover:text-red-700"
                    >
                      <Trash2Icon size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-gray-500">
              <PackageXIcon size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-600 font-medium mb-1">No products in your order</p>
              <p className="text-gray-500 text-sm mb-4">Click "Add Products" to start adding products to your order</p>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(true)}
                className="cursor-pointer px-4 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium flex items-center hover:bg-blue-100"
              >
                <PlusIcon size={16} className="mr-1" />
                Add Products
              </button>
            </div>
          )}
        </div>
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900 text-lg font-medium">Order Summary</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Discount</span>
              <div className="relative w-24">
                <input
                  type="text"
                  inputMode="numeric"
                  value={orderForm.isDiscountInputActive && orderForm.discount === 0 ? '' : orderForm.discount}
                  onFocus={() => {
                    if (orderForm.discount === 0) {
                      setOrderForm((prev) => ({
                        ...prev,
                        isDiscountInputActive: true
                      }));
                    }
                  }}
                  onBlur={() => {
                    setOrderForm((prev) => ({
                      ...prev,
                      isDiscountInputActive: false
                    }));
                  }}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Allow empty string or numbers only
                    if (inputValue === '' || /^\d+$/.test(inputValue)) {
                      const value = inputValue === '' ? 0 : Math.min(
                        100,
                        Math.max(0, Number(inputValue)),
                      );
                      setOrderForm((prev) => ({
                        ...prev,
                        discount: value,
                      }));
                    }
                  }}
                  className="text-gray-900 w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                  placeholder="0"
                  style={{ appearance: 'textfield' }}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  %
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900 font-medium">
                ${calculateSubtotal().toFixed(2)}
              </span>
            </div>
            {orderForm.discount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  Discount ({orderForm.discount}%)
                </span>
                <span className="font-medium text-red-600">
                  -${calculateDiscount(calculateSubtotal()).toFixed(2)}
                </span>
              </div>
            )}
            <div className="h-px bg-gray-200 my-4"></div>
            <div className="flex items-center justify-between">
              <span className="text-gray-900 text-base font-medium">Total Payment</span>
              <span className="text-2xl font-semibold text-blue-600">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <Link
            href="/distributor/products"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={
              isLoading ||
              !orderForm.products.length ||
              (!orderForm.retailer_id && !orderForm.newRetailer) ||
              !!successMessage // Disable when success message is shown
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Order...' : successMessage ? 'Order Created' : 'Create Order'}
          </button>
        </div>
      </form>
      )}
      <ProductSelectionModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        products={products}
        onProductsSelect={handleProductsSelect}
        existingSelections={orderForm.products}
      />
    </div>
  );
}
