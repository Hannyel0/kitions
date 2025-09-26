'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft as ArrowLeftIcon,
  Plus as PlusIcon,
  UserPlus as UserPlusIcon,
  Search as SearchIcon,
  Trash2 as Trash2Icon,
  PackageX as PackageXIcon,
  ShoppingCart,
  Users,
  Package,
  Calculator,
  CheckCircle,
  AlertCircle,
  Percent,
  DollarSign,
  Phone,
  MapPin,
  Building,
  Save,
} from 'lucide-react';
import { ProductSelectionModal } from '@/app/components/orders/ProductSelectionModal';

import { CreateOrderSkeleton } from '@/app/components/orders/CreateOrderSkeleton';
import { createBrowserClient } from '@supabase/ssr';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  case_size: number;
  category: string;
  category_id?: string | null;
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
  const [availableRetailers, setAvailableRetailers] = useState<Retailer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const fetchData = useCallback(async () => {
    try {
      setIsDataLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const { data: distributorData, error: distributorError } = await supabase
        .from('distributors')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (distributorError) {
        throw new Error('Could not find distributor record for this user');
      }
      
      const distributorId = distributorData.id;
      
      // Only fetch retailers that have an accepted relationship with this distributor
      const { data: retailersData, error: retailersError } = await supabase
        .from('retailers')
        .select(`
          id,
          user_id,
          store_address,
          store_type,
          users(id, email, first_name, last_name, phone, business_name),
          relationships!retailer_id(
            id,
            status,
            distributor_id
          )
        `)
        .eq('relationships.distributor_id', distributorId)
        .eq('relationships.status', 'accepted');
      
      if (retailersError) throw retailersError;
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedRetailers = retailersData.map((retailer: any) => ({
        id: retailer.id,
        name: retailer.users?.business_name || 'Unknown Business',
        email: retailer.users?.email || '',
        phone: retailer.users?.phone || '',
        address: retailer.store_address || '',
      }));
      
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
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedProducts = productsData.map((product: any) => ({
        id: product.id,
        name: product.name || 'Unnamed Product',
        description: product.description || '',
        price: product.price || 0,
        image: product.image_url || '/package-open.svg',
        case_size: product.case_size || 1,
        category: product.product_categories?.name || 'Uncategorized',
        category_id: product.category_id,
      }));
      
      console.log('Transformed products:', transformedProducts.length);
      
      setRetailers(transformedRetailers);
      
      // Fetch ALL retailers for discovery (no filtering by relationships)
      const { data: availableData, error: availableError } = await supabase
        .from('retailers')
        .select(`
          id,
          user_id,
          store_address,
          store_type,
          users!inner(id, email, first_name, last_name, phone, business_name)
        `);
      
      console.log('Available retailers query error:', availableError);
      console.log('Available retailers raw data:', availableData);
      
      if (availableError) {
        console.error('Error fetching available retailers:', availableError);
        // Don't throw error, just log it and continue with empty array
        setAvailableRetailers([]);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedAvailableRetailers = availableData?.map((retailer: any) => ({
          id: retailer.id,
          name: retailer.users?.business_name || 'Unknown Business',
          email: retailer.users?.email || '',
          phone: retailer.users?.phone || '',
          address: retailer.store_address || '',
        })) || [];

        console.log('Transformed available retailers:', transformedAvailableRetailers);
        setAvailableRetailers(transformedAvailableRetailers);
      }
      setProducts(transformedProducts);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      console.error('Error fetching data:', err);
      setError(errorMessage);
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
        retailerInfo: {
          name: selectedRetailer.name,
          email: selectedRetailer.email,
          phone: selectedRetailer.phone,
          address: selectedRetailer.address,
        },
      });
    }
  };

  const sendRelationshipRequest = async (retailerId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const { data: distributorData, error: distributorError } = await supabase
        .from('distributors')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (distributorError) throw distributorError;

      const { error: insertError } = await supabase
        .from('relationships')
        .insert({
          distributor_id: distributorData.id,
          retailer_id: retailerId,
          status: 'pending'
        });

      if (insertError) throw insertError;

      setSuccessMessage('Partnership request sent! You can create orders once they accept.');
      setTimeout(() => setSuccessMessage(null), 5000);
      
      // Refresh data to update available retailers list
      fetchData();

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send request';
      setFormError(errorMessage);
      setTimeout(() => setFormError(null), 5000);
    }
  };
  
  const handleProductsSelect = (selectedProducts: OrderProduct[]) => {
    setOrderForm((prev) => ({
      ...prev,
      products: selectedProducts,
    }));
    setIsProductModalOpen(false);
  };
  
  const calculateSubtotal = () => {
    return orderForm.products.reduce((total, orderProduct) => {
      const product = products.find((p) => p.id === orderProduct.product_id);
      return total + (product ? product.price * orderProduct.quantity : 0);
    }, 0);
  };
  
  const calculateDiscount = (subtotal: number) => {
    return (subtotal * orderForm.discount) / 100;
  };
  
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    return subtotal - discount;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);
    setSuccessMessage(null);
    
    try {
      // Validate form data
      if (!orderForm.retailer_id && !orderForm.newRetailer) {
        throw new Error('Please select a retailer or add a new one');
      }
      
      if (orderForm.newRetailer) {
        if (!orderForm.retailerInfo.name.trim()) {
          throw new Error('Retailer name is required');
        }
        if (!orderForm.retailerInfo.email.trim()) {
          throw new Error('Retailer email is required');
        }
      }
      
      if (orderForm.products.length === 0) {
        throw new Error('Please add at least one product to the order');
      }
      
      // Validate all products exist
      for (const orderProduct of orderForm.products) {
        const product = products.find((p) => p.id === orderProduct.product_id);
        if (!product) {
          throw new Error(`Product with ID ${orderProduct.product_id} not found`);
        }
        if (orderProduct.quantity <= 0) {
          throw new Error(`Invalid quantity for product ${product.name}`);
        }
      }
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const { data: distributorData, error: distributorError } = await supabase
        .from('distributors')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (distributorError) {
        throw new Error('Could not find distributor record for this user');
      }
      
      const distributorId = distributorData.id;
      let retailerId = orderForm.retailer_id;
      
      if (orderForm.newRetailer) {
        // Generate a temporary password for the new retailer
        const tempPassword = `temp-${Math.random().toString(36).slice(-8)}`;
        
        const { data: newUserData, error: newUserError } = await supabase.auth.signUp({
          email: orderForm.retailerInfo.email,
          password: tempPassword,
          options: {
            data: {
              first_name: orderForm.retailerInfo.name.split(' ')[0] || '',
              last_name: orderForm.retailerInfo.name.split(' ').slice(1).join(' ') || '',
              phone: orderForm.retailerInfo.phone,
              business_name: orderForm.retailerInfo.name,
              role: 'retailer',
            },
          },
        });
        
        if (newUserError) {
          throw new Error(`Failed to create user account: ${newUserError.message}`);
        }
        
        if (!newUserData.user) {
          throw new Error('Failed to create user account - no user data returned');
        }
        
        const { data: newRetailerData, error: newRetailerError } = await supabase
          .from('retailers')
          .insert({
            user_id: newUserData.user.id,
            store_address: orderForm.retailerInfo.address,
            store_type: 'retail',
          })
          .select()
          .single();
        
        if (newRetailerError) {
          throw new Error(`Failed to create retailer profile: ${newRetailerError.message}`);
        }
        
        retailerId = newRetailerData.id;
        
        // Create an accepted relationship between distributor and new retailer
        const { error: relationshipError } = await supabase
          .from('relationships')
          .insert({
            distributor_id: distributorId,
            retailer_id: retailerId,
            status: 'accepted'
          });
        
        if (relationshipError) {
          console.warn('Failed to create relationship:', relationshipError.message);
          // Don't throw error here as the retailer and order creation should still proceed
        }
      }
      
      if (!retailerId) {
        throw new Error('No retailer selected');
      }
      
      const orderNumber = `ORD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Date.now().toString().slice(-6)}`;
      const subtotal = calculateSubtotal();
      const discountAmount = calculateDiscount(subtotal);
      const total = calculateTotal();
      
      console.log('Creating order with data:', {
        order_number: orderNumber,
        distributor_id: distributorId,
        retailer_id: retailerId,
        status: 'pending',
        payment_status: 'pending',
        subtotal: subtotal,
        discount: discountAmount,
        total: total,
        notes: orderForm.notes,
      });

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          distributor_id: distributorId,
          retailer_id: retailerId,
          status: 'pending',
          payment_status: 'pending',
          subtotal: subtotal,
          discount: discountAmount,
          total: total,
          notes: orderForm.notes,
          placed_by_type: 'distributor',
          placed_by_user_id: userId,
        })
        .select()
        .single();
      
      if (orderError) {
        console.error('Order creation error:', orderError);
        throw new Error(`Failed to create order: ${orderError.message}`);
      }
      
      console.log('Order created successfully:', orderData);
      
      const orderItems = orderForm.products.map((orderProduct) => {
        const product = products.find((p) => p.id === orderProduct.product_id);
        if (!product) {
          throw new Error(`Product with ID ${orderProduct.product_id} not found`);
        }
        return {
          order_id: orderData.id,
          product_id: orderProduct.product_id,
          quantity: orderProduct.quantity,
          price: product.price,
        };
      });
      
      console.log('Creating order items:', orderItems);
      
      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (orderItemsError) {
        console.error('Order items creation error:', orderItemsError);
        throw new Error(`Failed to create order items: ${orderItemsError.message}`);
      }
      
      console.log('Order items created successfully');
      
      setSuccessMessage(`Order ${orderNumber} created successfully!`);
      
      setTimeout(() => {
        router.push('/distributor/orders');
      }, 2000);
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      console.error('Error creating order:', err);
      setFormError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderErrorMessage = () => {
    if (!error && !formError) return null;
    const message = error || formError;
    return (
      <motion.div 
        className="mb-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-700 px-4 py-3 rounded-xl shadow-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-sm">Error</h3>
            <p className="text-xs mt-1">{message}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderSuccessMessage = () => {
    if (!successMessage) return null;
    return (
      <motion.div 
        className="mb-4 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/50 text-emerald-700 px-4 py-3 rounded-xl shadow-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-sm">Success</h3>
            <p className="text-xs mt-1">{successMessage}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  if (isDataLoading) {
    return <CreateOrderSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/30 to-purple-50/20">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-white/40 backdrop-blur-md border border-white/20 px-4 py-6 mx-4 mt-4 rounded-2xl shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8982cf]/3 to-purple-500/3"></div>
        
        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-2 -left-2 w-12 h-12 bg-[#8982cf]/5 rounded-full blur-xl"></div>
          <div className="absolute top-4 right-4 w-16 h-16 bg-purple-500/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-2 left-1/4 w-8 h-8 bg-[#8982cf]/5 rounded-full blur-lg"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <Link href="/distributor/orders">
              <motion.button
                className="p-2 bg-white/60 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white/80 transition-all duration-300 border border-white/30"
                whileHover={{ scale: 1.05, x: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeftIcon size={18} />
              </motion.button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#8982cf]/10 backdrop-blur-sm rounded-xl border border-[#8982cf]/20">
                <ShoppingCart className="h-5 w-5 text-[#8982cf]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
                <p className="text-gray-600 text-sm">Build and customize orders for your retail partners</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {renderErrorMessage()}
        {renderSuccessMessage()}
        
        {error ? (
          null
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Retailer Section */}
            <motion.div 
              className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#8982cf]/10 backdrop-blur-sm rounded-xl border border-[#8982cf]/20">
                      <Users className="h-5 w-5 text-[#8982cf]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Customer Information</h2>
                      <p className="text-gray-600 text-sm">Select an existing customer or discover new partners</p>
                      <p className="text-amber-600 text-xs mt-1 font-medium">
                        📝 Orders placed here will be marked as &quot;Placed by Distributor on behalf of Retailer&quot;
                      </p>
                    </div>
                  </div>
                  <motion.button
                    type="button"
                    onClick={() =>
                      setOrderForm((prev) => ({
                        ...prev,
                        newRetailer: !prev.newRetailer,
                      }))
                    }
                    className="flex items-center space-x-2 px-3 py-2 bg-white/60 backdrop-blur-sm text-gray-700 font-medium rounded-xl border border-white/30 hover:bg-white/80 transition-all duration-300 text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {orderForm.newRetailer ? (
                      <>
                        <Users size={14} />
                        <span>Select Existing</span>
                      </>
                    ) : (
                      <>
                        <SearchIcon size={14} />
                        <span>Look Up Customers</span>
                      </>
                    )}
                  </motion.button>
                </div>
                
                {!orderForm.newRetailer ? (
                  <div className="space-y-4">
                    {retailers.length > 0 ? (
                      <>
                        <div className="bg-green-50/60 backdrop-blur-sm border border-green-200/30 rounded-xl p-4 mb-4">
                          <div className="flex items-start space-x-3">
                            <div className="p-1.5 bg-green-100/60 rounded-lg">
                              <Users className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-green-900 text-sm">Your Partners</h4>
                              <p className="text-green-700 text-xs mt-1">
                                Select from your connected partners to create an order.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Partners List */}
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {retailers.map((retailer, index) => (
                            <motion.div
                              key={retailer.id}
                              className={`bg-white/40 backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 cursor-pointer ${
                                orderForm.retailer_id === retailer.id
                                  ? 'border-[#8982cf]/50 bg-[#8982cf]/10'
                                  : 'border-white/30 hover:bg-white/60'
                              }`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleRetailerSelect(retailer.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white/60 rounded-lg">
                                      <Building size={16} className="text-gray-600" />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-gray-900">{retailer.name}</h3>
                                      <p className="text-sm text-gray-600">{retailer.email}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 ml-11">
                                    <div className="flex items-center space-x-1">
                                      <Phone size={12} />
                                      <span>{retailer.phone || 'No phone'}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <MapPin size={12} />
                                      <span>{retailer.address || 'No address'}</span>
                                    </div>
                                  </div>
                                </div>
                                {orderForm.retailer_id === retailer.id && (
                                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#8982cf]/20 backdrop-blur-sm text-[#8982cf] font-medium rounded-lg text-sm">
                                    <CheckCircle size={14} />
                                    <span>Selected</span>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <div className="p-4 bg-white/40 backdrop-blur-sm rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Partners Yet</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          You haven&apos;t connected with any retailers yet. Start by discovering and connecting with potential partners.
                        </p>
                        <motion.button
                          type="button"
                          onClick={() =>
                            setOrderForm((prev) => ({
                              ...prev,
                              newRetailer: true,
                            }))
                          }
                          className="flex items-center space-x-2 px-6 py-3 bg-[#8982cf]/80 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-[#8982cf] transition-all duration-300 shadow-lg mx-auto"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <SearchIcon size={16} />
                          <span>Look Up Customers</span>
                        </motion.button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-blue-50/60 backdrop-blur-sm border border-blue-200/30 rounded-xl p-4 mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-1.5 bg-blue-100/60 rounded-lg">
                          <SearchIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-900 text-sm">Discover New Partners</h4>
                          <p className="text-blue-700 text-xs mt-1">
                            Search for retailers you&apos;d like to partner with. Send them a partnership request to start creating orders together.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search for retailers by business name, email, or location..."
                        className="shadow-sm w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8982cf]/30 focus:border-[#8982cf]/50 transition-all duration-300 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>


                    {/* Available Retailers List */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {availableRetailers
                        .filter(retailer => 
                          retailer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          retailer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          retailer.address.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((retailer, index) => (
                          <motion.div
                            key={retailer.id}
                            className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:bg-white/60 transition-all duration-300"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-white/60 rounded-lg">
                                    <Building size={16} className="text-gray-600" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{retailer.name}</h3>
                                    <p className="text-sm text-gray-600">{retailer.email}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 ml-11">
                                  <div className="flex items-center space-x-1">
                                    <Phone size={12} />
                                    <span>{retailer.phone || 'No phone'}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MapPin size={12} />
                                    <span>{retailer.address || 'No address'}</span>
                                  </div>
                                </div>
                              </div>
                              <motion.button
                                type="button"
                                onClick={() => sendRelationshipRequest(retailer.id)}
                                className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-[#8982cf]/80 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-[#8982cf] transition-all duration-300 shadow-lg text-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <UserPlusIcon size={14} />
                                <span>Send Request</span>
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      
                      {availableRetailers.filter(retailer => 
                        retailer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        retailer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        retailer.address.toLowerCase().includes(searchTerm.toLowerCase())
                      ).length === 0 && (
                        <div className="text-center py-8">
                          <div className="p-3 bg-white/40 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <SearchIcon className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-gray-600 font-medium">No retailers found</p>
                          <p className="text-gray-500 text-sm">Try adjusting your search terms</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Products Section */}
            <motion.div 
              className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#8982cf]/10 backdrop-blur-sm rounded-xl border border-[#8982cf]/20">
                      <Package className="h-5 w-5 text-[#8982cf]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Order Products</h2>
                      <p className="text-gray-600 text-sm">Add products to this order</p>
                    </div>
                  </div>
                  {orderForm.products.length > 0 && (
                    <motion.button
                      type="button"
                      onClick={() => setIsProductModalOpen(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-[#8982cf]/80 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-[#8982cf] transition-all duration-300 shadow-lg text-sm"
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <PlusIcon size={14} />
                      <span>Add More Products</span>
                    </motion.button>
                  )}
                </div>
                
                {orderForm.products.length > 0 ? (
                  <div className="space-y-3">
                    {orderForm.products.map((orderProduct, index) => {
                      const product = products.find(
                        (p) => p.id === orderProduct.product_id,
                      );
                      if (!product) return null;
                      return (
                        <motion.div
                          key={orderProduct.product_id}
                          className="group bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:bg-white/60 transition-all duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <div className="w-full h-full bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm border border-white/30">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-gray-900 mb-1">{product.name}</h3>
                              <p className="text-gray-600 text-sm mb-2 line-clamp-1">{product.description}</p>
                              <div className="flex items-center space-x-3">
                                <span className="inline-flex items-center px-2 py-1 bg-[#8982cf]/10 backdrop-blur-sm text-[#8982cf] text-xs font-medium rounded-lg border border-[#8982cf]/20">
                                  {product.category}
                                </span>
                                <span className="text-sm text-gray-600">
                                  <span className="font-semibold text-gray-900">${product.price}</span> per case
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-center">
                                <p className="text-xs font-medium text-gray-600 mb-1">Quantity</p>
                                <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/40">
                                  <span className="text-base font-bold text-gray-900">
                                    {orderProduct.quantity}
                                  </span>
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="text-xs font-medium text-gray-600 mb-1">Total</p>
                                <div className="bg-[#8982cf]/80 backdrop-blur-sm text-white rounded-lg px-3 py-1 border border-[#8982cf]/50">
                                  <span className="text-base font-bold">
                                    ${(product.price * orderProduct.quantity).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                              <motion.button
                                type="button"
                                onClick={() => {
                                  setOrderForm((prev) => ({
                                    ...prev,
                                    products: prev.products.filter(
                                      (p) => p.product_id !== orderProduct.product_id,
                                    ),
                                  }));
                                }}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50/80 rounded-lg transition-all duration-300"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2Icon size={16} />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-6">
                    <div className="relative mx-auto w-20 h-20 mb-6">
                      <div className="absolute inset-0 bg-[#8982cf]/10 rounded-full blur-lg"></div>
                      <div className="relative bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center w-full h-full border border-white/30">
                        <PackageXIcon className="h-10 w-10 text-gray-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">No products selected</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto text-center text-sm">
                      Start building your order by adding products from your inventory.
                    </p>
                    <motion.button
                      type="button"
                      onClick={() => setIsProductModalOpen(true)}
                      className="inline-flex items-center px-6 py-3 bg-[#8982cf]/80 backdrop-blur-sm text-white font-medium rounded-xl shadow-lg hover:bg-[#8982cf] transition-all duration-300 space-x-2 text-sm"
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <PlusIcon size={16} />
                      <span>Add Products</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div 
              className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#8982cf]/10 backdrop-blur-sm rounded-xl border border-[#8982cf]/20">
                      <Calculator className="h-5 w-5 text-[#8982cf]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
                      <p className="text-gray-600 text-sm">Review totals and apply discount</p>
                    </div>
                  </div>
                  
                  {/* Discount Input */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-amber-100/80 backdrop-blur-sm rounded-lg border border-amber-200/50">
                        <Percent size={14} className="text-amber-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Discount</span>
                    </div>
                    <div className="relative">
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
                        className="w-20 px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl text-gray-700 text-center font-medium focus:outline-none focus:ring-2 focus:ring-[#8982cf]/30 focus:border-[#8982cf]/50 transition-all duration-300 text-sm"
                        placeholder="0"
                      />
                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs font-medium">
                        %
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Subtotal</span>
                      <span className="text-lg font-bold text-gray-900">
                        ${calculateSubtotal().toFixed(2)}
                      </span>
                    </div>
                    {orderForm.discount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">
                          Discount ({orderForm.discount}%)
                        </span>
                        <span className="text-lg font-bold text-red-600">
                          -${calculateDiscount(calculateSubtotal()).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="h-px bg-gray-200/50 my-3"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">Total Payment</span>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-5 w-5 text-[#8982cf]" />
                        <span className="text-2xl font-bold text-[#8982cf]">
                          {calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Order Notes */}
                <div className="mt-4">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={orderForm.notes || ''}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8982cf]/30 focus:border-[#8982cf]/50 transition-all duration-300 resize-none"
                    placeholder="Add any special instructions or notes for this order..."
                  />
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex justify-end space-x-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/distributor/orders">
                <motion.button
                  type="button"
                  className="px-6 py-2.5 bg-white/60 backdrop-blur-sm text-gray-700 font-medium rounded-xl hover:bg-white/80 transition-all duration-300 border border-white/30 text-sm"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </Link>
              <motion.button
                type="submit"
                disabled={
                  isLoading ||
                  !orderForm.products.length ||
                  (!orderForm.retailer_id && !orderForm.newRetailer) ||
                  !!successMessage
                }
                className="px-6 py-2.5 bg-[#8982cf]/80 backdrop-blur-sm text-white font-medium rounded-xl shadow-lg hover:bg-[#8982cf] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm"
                whileHover={{ scale: isLoading || successMessage ? 1 : 1.05, y: isLoading || successMessage ? 0 : -1 }}
                whileTap={{ scale: isLoading || successMessage ? 1 : 0.95 }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Order...</span>
                  </>
                ) : successMessage ? (
                  <>
                    <CheckCircle size={16} />
                    <span>Order Created</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Create Order</span>
                  </>
                )}
              </motion.button>
            </motion.div>
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
    </div>
  );
}
