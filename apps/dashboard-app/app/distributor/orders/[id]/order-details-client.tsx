'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
} from 'lucide-react';

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product_name: string;
  product_image: string;
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

        // Fetch product details for each order item
        const productIds = orderItemsData.map(item => item.product_id);
        
        let productDetails: Record<string, {name: string, image_url: string}> = {};
        
        if (productIds.length > 0) {
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('id, name, image_url')
            .in('id', productIds);
            
          if (productsError) throw new Error(`Failed to fetch product details: ${productsError.message}`);
          
          productDetails = (productsData || []).reduce((acc, product) => {
            acc[product.id] = { 
              name: product.name,
              image_url: product.image_url 
            };
            return acc;
          }, {} as Record<string, {name: string, image_url: string}>);
        }

        // Combine order items with product details
        const orderItemsWithProducts = orderItemsData.map(item => ({
          ...item,
          product_name: productDetails[item.product_id]?.name || 'Unknown Product',
          product_image: productDetails[item.product_id]?.image_url || '/package-open.svg'
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
      } catch (err: any) {
        console.error('Error fetching order details:', err);
        setError(err.message || 'Failed to load order details');
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
        return <CheckCircleIcon size={16} className="text-green-500" />;
      case 'processing':
        return <ClockIcon size={16} className="text-blue-500" />;
      case 'cancelled':
        return <XCircleIcon size={16} className="text-red-500" />;
      default:
        return <AlertTriangleIcon size={16} className="text-yellow-500" />;
    }
  };

  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700';
      case 'processing':
        return 'bg-blue-50 text-blue-700';
      case 'cancelled':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-yellow-50 text-yellow-700';
    }
  };

  const getPaymentStatusStyle = (status: Order['payment_status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 text-green-700';
      case 'failed':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-yellow-50 text-yellow-700';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !orderDetails) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-700">Error</h3>
            <p className="text-sm text-red-600 mt-1">{error || 'Failed to load order details'}</p>
            <div className="mt-4">
              <Link 
                href="/distributor/orders"
                className="text-sm text-red-700 hover:text-red-600 font-medium"
              >
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/distributor/orders"
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to Orders
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">
            Order {orderDetails.order_number}
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(orderDetails.status)}`}
          >
            {getStatusIcon(orderDetails.status)}
            <span className="ml-1.5 capitalize">{orderDetails.status}</span>
          </span>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusStyle(orderDetails.payment_status)}`}
          >
            <span className="capitalize">{orderDetails.payment_status}</span>
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {orderDetails.items.map((item) => (
                <div key={item.id} className="p-6 flex items-center">
                  <div className="h-14 w-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    {item.product_image && item.product_image !== '/package-open.svg' ? (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // If image fails to load, show fallback
                          const img = e.currentTarget as HTMLImageElement;
                          img.style.display = 'none';
                          const fallback = img.parentElement?.querySelector('.fallback') as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div className="fallback flex items-center justify-center h-full w-full">
                        <Image 
                          src="/package-open.svg" 
                          alt="Product" 
                          width={32} 
                          height={32} 
                          className="opacity-50" 
                        />
                      </div>
                    )}
                  </div>
                  <div className="ml-6 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{item.product_name}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <PackageIcon size={16} className="mr-1.5" />
                      {item.quantity} units
                    </div>
                  </div>
                  <div className="ml-6 text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)} per unit
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Payment Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  ${orderDetails.subtotal.toFixed(2)}
                </span>
              </div>
              {orderDetails.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-red-600">
                    -${orderDetails.discount.toFixed(2)}
                  </span>
                </div>
              )}
              {orderDetails.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">
                    ${orderDetails.tax.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="h-px bg-gray-200 my-3"></div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-900">Total</span>
                <span className="text-xl font-semibold text-blue-600">
                  ${orderDetails.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          
          {orderDetails.notes && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Notes</h2>
              <p className="text-gray-700">{orderDetails.notes}</p>
            </div>
          )}
        </div>
        {/* Customer Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <UserIcon size={16} className="text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{orderDetails.retailer.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MailIcon size={16} className="text-gray-400 mr-3" />
                <p className="text-sm text-gray-600">{orderDetails.retailer.email}</p>
              </div>
              <div className="flex items-center">
                <PhoneIcon size={16} className="text-gray-400 mr-3" />
                <p className="text-sm text-gray-600">{orderDetails.retailer.phone || 'N/A'}</p>
              </div>
              <div className="flex items-start">
                <MapPinIcon size={16} className="text-gray-400 mr-3 mt-0.5" />
                <p className="text-sm text-gray-600">{orderDetails.retailer.address || 'N/A'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order Date</span>
                <span className="font-medium text-gray-900">
                  {new Date(orderDetails.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order ID</span>
                <span className="font-medium text-gray-900">{orderDetails.order_number}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Items</span>
                <span className="font-medium text-gray-900">{orderDetails.items.length}</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
            <div className="space-y-3">
              <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Update Order Status
              </button>
              <button className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
