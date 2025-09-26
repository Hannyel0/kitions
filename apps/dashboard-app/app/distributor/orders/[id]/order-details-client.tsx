'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import {
  ArrowLeft as ArrowLeftIcon,
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon,
  XCircle as XCircleIcon,
  AlertTriangle as AlertTriangleIcon,
  Package as PackageIcon,
  User as UserIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Calendar as CalendarIcon,
  Hash as HashIcon,
  ShoppingBag as ShoppingBagIcon,
  DollarSign as DollarSignIcon,
  FileText as FileTextIcon,
  Download as DownloadIcon,
  Edit3 as EditIcon,
  Truck as TruckIcon,
  CreditCard as CreditCardIcon,
  Tag as TagIcon,
  Star as StarIcon,
  Sparkles as SparklesIcon,
} from 'lucide-react';

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product_name: string;
  product_image: string;
  product_description: string;
  product_category: string;
}

interface Retailer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Order {
  id: string;
  order_number: string;
  retailer_id: string;
  distributor_id: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment_status: 'paid' | 'pending' | 'failed';
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes: string;
  created_at: string;
  retailer: Retailer;
  items: OrderItem[];
}

export function OrderDetailsClient({ orderId }: { orderId: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Fetch order details including retailer information
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select(`
            id, 
            order_number, 
            retailer_id, 
            distributor_id, 
            status, 
            payment_status,
            subtotal, 
            tax, 
            discount, 
            total, 
            notes, 
            created_at
          `)
          .eq('id', orderId)
          .single();

        if (orderError) throw new Error(`Failed to fetch order: ${orderError.message}`);
        if (!orderData) throw new Error('Order not found');

        // Fetch retailer information
        const { data: retailerData, error: retailerError } = await supabase
          .from('retailers')
          .select(`
            id,
            store_address,
            users:user_id (business_name, email, phone)
          `)
          .eq('id', orderData.retailer_id)
          .single();

        if (retailerError) throw new Error(`Failed to fetch retailer: ${retailerError.message}`);

        // Fetch order items
        const { data: orderItemsData, error: orderItemsError } = await supabase
          .from('order_items')
          .select(`
            id, 
            order_id, 
            product_id, 
            quantity, 
            price
          `)
          .eq('order_id', orderId);

        if (orderItemsError) throw new Error(`Failed to fetch order items: ${orderItemsError.message}`);

        // Fetch product details for each order item from distributor_products
        const productIds = orderItemsData.map(item => item.product_id);
        
        let productDetails: Record<string, {name: string, image_url: string, description: string, category: string}> = {};
        
        if (productIds.length > 0) {
          const { data: productsData, error: productsError } = await supabase
            .from('distributor_products')
            .select(`
              id, 
              name, 
              description,
              image_url,
              product_categories(name)
            `)
            .in('id', productIds);
            
          if (productsError) throw new Error(`Failed to fetch product details: ${productsError.message}`);
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          productDetails = (productsData || []).reduce((acc, product: any) => {
            acc[product.id] = { 
              name: product.name,
              image_url: product.image_url,
              description: product.description || '',
              category: product.product_categories?.name || 'Uncategorized'
            };
            return acc;
          }, {} as Record<string, {name: string, image_url: string, description: string, category: string}>);
        }

        // Combine order items with product details
        const orderItemsWithProducts = orderItemsData.map(item => ({
          ...item,
          product_name: productDetails[item.product_id]?.name || 'Unknown Product',
          product_image: productDetails[item.product_id]?.image_url || '/package-open.svg',
          product_description: productDetails[item.product_id]?.description || '',
          product_category: productDetails[item.product_id]?.category || 'Uncategorized'
        }));

        // The users property is an object with user details
        const userData = retailerData.users as { 
          business_name?: string; 
          email?: string; 
          phone?: string; 
        };
        
        // Create the complete order object
        const orderWithDetails: Order = {
          ...orderData,
          retailer: {
            name: userData?.business_name || 'Unknown Business',
            email: userData?.email || '',
            phone: userData?.phone || '',
            address: retailerData.store_address || '',
          },
          items: orderItemsWithProducts
        };

        setOrderDetails(orderWithDetails);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load order details';
        console.error('Error fetching order details:', err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon size={20} className="text-emerald-500" />;
      case 'processing':
        return <ClockIcon size={20} className="text-blue-500" />;
      case 'cancelled':
        return <XCircleIcon size={20} className="text-red-500" />;
      default:
        return <AlertTriangleIcon size={20} className="text-amber-500" />;
    }
  };

  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50/80 text-emerald-700 border-emerald-200/50';
      case 'processing':
        return 'bg-blue-50/80 text-blue-700 border-blue-200/50';
      case 'cancelled':
        return 'bg-red-50/80 text-red-700 border-red-200/50';
      default:
        return 'bg-amber-50/80 text-amber-700 border-amber-200/50';
    }
  };

  const getPaymentStatusStyle = (status: Order['payment_status']) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-50/80 text-emerald-700 border-emerald-200/50';
      case 'failed':
        return 'bg-red-50/80 text-red-700 border-red-200/50';
      default:
        return 'bg-amber-50/80 text-amber-700 border-amber-200/50';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/30 to-purple-50/20">
        <div className="flex items-center justify-center h-96">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="relative mx-auto w-16 h-16 mb-6">
              <div className="absolute inset-0 bg-[#8982cf]/20 rounded-full blur-lg animate-pulse"></div>
              <div className="relative bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center w-full h-full border border-white/30">
                <div className="w-8 h-8 border-3 border-[#8982cf]/30 border-t-[#8982cf] rounded-full animate-spin"></div>
              </div>
            </div>
            <p className="text-gray-600 font-medium">Loading order details...</p>
            <p className="text-gray-500 text-sm mt-1">Please wait while we fetch the information</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/30 to-purple-50/20">
        <div className="flex items-center justify-center h-96">
          <motion.div 
            className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 p-8 rounded-2xl shadow-lg max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="p-2 bg-red-100/80 rounded-xl">
                  <XCircleIcon className="h-6 w-6 text-red-500" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-700 mb-2">Unable to Load Order</h3>
                <p className="text-red-600 mb-4">{error || 'Failed to load order details'}</p>
                <Link 
                  href="/distributor/orders"
                  className="inline-flex items-center px-4 py-2 bg-red-600/80 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-red-600 transition-all duration-300 space-x-2"
                >
                  <ArrowLeftIcon size={16} />
                  <span>Back to Orders</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/30 to-purple-50/20">
      {/* Hero Header */}
      <motion.div 
        className="relative overflow-hidden bg-white/40 backdrop-blur-md border border-white/20 mx-4 mt-4 rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#8982cf]/3 to-purple-500/3"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-2 -left-2 w-12 h-12 bg-[#8982cf]/5 rounded-full blur-xl"></div>
          <div className="absolute top-4 right-4 w-16 h-16 bg-purple-500/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-2 left-1/4 w-8 h-8 bg-[#8982cf]/5 rounded-full blur-lg"></div>
        </div>
        
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/distributor/orders"
                className="flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm text-gray-700 font-medium rounded-xl hover:bg-white/80 transition-all duration-300 border border-white/30"
              >
                <ArrowLeftIcon size={16} />
                <span>Back to Orders</span>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[#8982cf]/10 backdrop-blur-sm rounded-xl border border-[#8982cf]/20">
                  <ShoppingBagIcon className="h-6 w-6 text-[#8982cf]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Order {orderDetails.order_number}
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Placed on {new Date(orderDetails.created_at).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.div
                className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium border backdrop-blur-sm ${getStatusStyle(orderDetails.status)}`}
                whileHover={{ scale: 1.05 }}
              >
                {getStatusIcon(orderDetails.status)}
                <span className="ml-2 capitalize">{orderDetails.status}</span>
              </motion.div>
              <motion.div
                className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium border backdrop-blur-sm ${getPaymentStatusStyle(orderDetails.payment_status)}`}
                whileHover={{ scale: 1.05 }}
              >
                <CreditCardIcon size={16} className="mr-2" />
                <span className="capitalize">{orderDetails.payment_status}</span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Order Items */}
            <motion.div 
              className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#8982cf]/10 backdrop-blur-sm rounded-xl border border-[#8982cf]/20">
                      <PackageIcon className="h-5 w-5 text-[#8982cf]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Order Items</h2>
                      <p className="text-gray-600 text-sm">{orderDetails.items.length} items in this order</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SparklesIcon className="h-4 w-4 text-[#8982cf]" />
                    <span className="text-sm font-medium text-[#8982cf]">Premium Products</span>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-white/20">
                {orderDetails.items.map((item, index) => (
                  <motion.div 
                    key={item.id} 
                    className="p-6 hover:bg-white/40 transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden bg-white/80 shadow-sm border border-white/30">
                        {item.product_image && item.product_image !== '/package-open.svg' ? (
                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              img.style.display = 'none';
                              const fallback = img.parentElement?.querySelector('.fallback') as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="fallback flex items-center justify-center h-full w-full" style={{ display: (!item.product_image || item.product_image === '/package-open.svg') ? 'flex' : 'none' }}>
                          <PackageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900 mb-1">{item.product_name}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.product_description}</p>
                        <div className="flex items-center space-x-3">
                          <span className="inline-flex items-center px-2 py-1 bg-[#8982cf]/10 backdrop-blur-sm text-[#8982cf] text-xs font-medium rounded-lg border border-[#8982cf]/20">
                            <TagIcon size={10} className="mr-1" />
                            {item.product_category}
                          </span>
                          <span className="text-sm text-gray-600">
                            <span className="font-semibold text-gray-900">${item.price.toFixed(2)}</span> per unit
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-xs font-medium text-gray-600 mb-1">Quantity</p>
                          <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/40">
                            <span className="text-lg font-bold text-gray-900">
                              {item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-medium text-gray-600 mb-1">Total</p>
                          <div className="bg-[#8982cf]/80 backdrop-blur-sm text-white rounded-lg px-4 py-2 border border-[#8982cf]/50">
                            <span className="text-lg font-bold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Payment Summary */}
            <motion.div 
              className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#8982cf]/10 backdrop-blur-sm rounded-xl border border-[#8982cf]/20">
                    <DollarSignIcon className="h-5 w-5 text-[#8982cf]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Payment Summary</h2>
                    <p className="text-gray-600 text-sm">Breakdown of order costs</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Subtotal</span>
                      <span className="text-lg font-bold text-gray-900">
                        ${orderDetails.subtotal.toFixed(2)}
                      </span>
                    </div>
                    {orderDetails.discount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium flex items-center">
                          <TagIcon size={16} className="mr-2 text-red-500" />
                          Discount Applied
                        </span>
                        <span className="text-lg font-bold text-red-600">
                          -${orderDetails.discount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {orderDetails.tax > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Tax</span>
                        <span className="text-lg font-bold text-gray-900">
                          ${orderDetails.tax.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200/50 to-transparent my-4"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">Total Payment</span>
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-[#8982cf]/10 rounded-lg">
                          <DollarSignIcon className="h-5 w-5 text-[#8982cf]" />
                        </div>
                        <span className="text-2xl font-bold text-[#8982cf]">
                          {orderDetails.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Notes */}
            {orderDetails.notes && (
              <motion.div 
                className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="p-6 border-b border-white/20">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#8982cf]/10 backdrop-blur-sm rounded-xl border border-[#8982cf]/20">
                      <FileTextIcon className="h-5 w-5 text-[#8982cf]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Order Notes</h2>
                      <p className="text-gray-600 text-sm">Special instructions from customer</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                    <p className="text-gray-700 leading-relaxed">{orderDetails.notes}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <motion.div 
              className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#8982cf]/10 backdrop-blur-sm rounded-xl border border-[#8982cf]/20">
                    <UserIcon className="h-5 w-5 text-[#8982cf]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Customer</h2>
                    <p className="text-gray-600 text-sm">Retailer information</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/60 rounded-lg">
                      <UserIcon size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{orderDetails.retailer.name}</p>
                      <p className="text-xs text-gray-600">Business Name</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/60 rounded-lg">
                      <MailIcon size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{orderDetails.retailer.email}</p>
                      <p className="text-xs text-gray-600">Email Address</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/60 rounded-lg">
                      <PhoneIcon size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{orderDetails.retailer.phone || 'Not provided'}</p>
                      <p className="text-xs text-gray-600">Phone Number</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-white/60 rounded-lg">
                      <MapPinIcon size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{orderDetails.retailer.address || 'Not provided'}</p>
                      <p className="text-xs text-gray-600">Store Address</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Information */}
            <motion.div 
              className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#8982cf]/10 backdrop-blur-sm rounded-xl border border-[#8982cf]/20">
                    <HashIcon className="h-5 w-5 text-[#8982cf]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
                    <p className="text-gray-600 text-sm">Order information</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon size={16} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Order Date</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {new Date(orderDetails.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <HashIcon size={16} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Order ID</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{orderDetails.order_number}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <PackageIcon size={16} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Items</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{orderDetails.items.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <StarIcon size={16} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Priority</span>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 bg-[#8982cf]/10 text-[#8982cf] text-xs font-medium rounded-lg border border-[#8982cf]/20">
                      Standard
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div 
              className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#8982cf]/10 backdrop-blur-sm rounded-xl border border-[#8982cf]/20">
                    <EditIcon className="h-5 w-5 text-[#8982cf]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
                    <p className="text-gray-600 text-sm">Manage this order</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <motion.button 
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#8982cf]/80 backdrop-blur-sm text-white font-medium rounded-xl shadow-lg hover:bg-[#8982cf] transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <TruckIcon size={16} />
                    <span>Update Status</span>
                  </motion.button>
                  <motion.button 
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-white/60 backdrop-blur-sm text-gray-700 font-medium rounded-xl border border-white/30 hover:bg-white/80 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <DownloadIcon size={16} />
                    <span>Generate Invoice</span>
                  </motion.button>
                  <motion.button 
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-white/60 backdrop-blur-sm text-gray-700 font-medium rounded-xl border border-white/30 hover:bg-white/80 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MailIcon size={16} />
                    <span>Contact Customer</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
