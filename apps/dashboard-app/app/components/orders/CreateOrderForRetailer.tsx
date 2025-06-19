'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft as ArrowLeftIcon,
  Plus as PlusIcon,
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
  distributor_id?: string;
  distributorInfo: {
    name: string;
    email: string;
    phone: string;
  };
  products: OrderProduct[];
  discount: number;
  notes?: string;
}

interface Distributor {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export function CreateOrderForRetailer() {
  const router = useRouter();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
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
      
      const { data: retailerData, error: retailerError } = await supabase
        .from('retailers')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (retailerError) {
        throw new Error('Could not find retailer record for this user');
      }
      
      const retailerId = retailerData.id;
      
      // Fetch distributors with accepted relationships
      const { data: distributorsData, error: distributorsError } = await supabase
        .from('distributors')
        .select(`
          id,
          user_id,
          users!inner(id, email, first_name, last_name, phone, business_name),
          relationships!distributor_id(
            id,
            status,
            retailer_id
          )
        `)
        .eq('relationships.retailer_id', retailerId)
        .eq('relationships.status', 'accepted');
      
      if (distributorsError) throw distributorsError;
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedDistributors = distributorsData.map((distributor: any) => ({
        id: distributor.id,
        name: distributor.users?.business_name || 'Unknown Business',
        email: distributor.users?.email || '',
        phone: distributor.users?.phone || '',
      }));
      
      setDistributors(transformedDistributors);
      
      // Initially no products until a distributor is selected
      setProducts([]);
      
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
    distributorInfo: {
      name: '',
      email: '',
      phone: '',
    },
    products: [],
    discount: 0,
    notes: '',
  });
  
  const handleDistributorSelect = async (distributorId: string) => {
    const selectedDistributor = distributors.find((d) => d.id === distributorId);
    if (selectedDistributor) {
      setOrderForm({
        ...orderForm,
        distributor_id: distributorId,
        distributorInfo: {
          name: selectedDistributor.name,
          email: selectedDistributor.email,
          phone: selectedDistributor.phone,
        },
        products: [] // Reset products when changing distributor
      });
      
      // Fetch products for the selected distributor
      try {
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
        
        if (productsError) throw productsError;
        
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
        
        setProducts(transformedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      }
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
      if (!orderForm.distributor_id) {
        throw new Error('Please select a distributor');
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
      
      const { data: retailerData, error: retailerError } = await supabase
        .from('retailers')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (retailerError) {
        throw new Error('Could not find retailer record for this user');
      }
      
      const retailerId = retailerData.id;
      
      const orderNumber = `ORD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Date.now().toString().slice(-6)}`;
      const subtotal = calculateSubtotal();
      const discountAmount = calculateDiscount(subtotal);
      const total = calculateTotal();
      
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          distributor_id: orderForm.distributor_id,
          retailer_id: retailerId,
          status: 'pending',
          payment_status: 'pending',
          subtotal: subtotal,
          discount: discountAmount,
          total: total,
          notes: orderForm.notes,
          placed_by_type: 'retailer',
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
      
      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (orderItemsError) {
        console.error('Order items creation error:', orderItemsError);
        throw new Error(`Failed to create order items: ${orderItemsError.message}`);
      }
      
      setSuccessMessage(`Order ${orderNumber} created successfully!`);
      
      setTimeout(() => {
        router.push('/retailer/orders');
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50/30 to-fuchsia-50/40">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#8982cf] via-purple-600 to-fuchsia-600 px-6 py-8 mx-6 mt-6 rounded-3xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/retailer/orders">
              <motion.button 
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeftIcon className="h-5 w-5 text-white" />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Create New Order</h1>
              <p className="text-violet-100 text-sm">Place an order with one of your distributor partners</p>
              <p className="text-amber-200 text-xs mt-1 font-medium">
                📝 This order will be marked as "Placed by Retailer"
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center py-20">
          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-[#8982cf] to-purple-500 rounded-full blur-lg opacity-20"></div>
            <div className="relative bg-gradient-to-r from-[#8982cf]/10 to-purple-100 rounded-full flex items-center justify-center w-full h-full">
              <Building className="h-12 w-12 text-[#8982cf]" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Order Creation Coming Soon</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-center">
            This feature is currently being developed. You'll be able to place orders directly with your distributor partners soon.
          </p>
          <Link href="/retailer/orders">
            <motion.button
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#8982cf] to-purple-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 space-x-3"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeftIcon size={18} />
              <span>Back to Orders</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
} 