'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search as SearchIcon,
  Filter as FilterIcon,
  Eye as EyeIcon,
  CheckCircle as CheckCircleIcon,
  Clock as ClockIcon,
  XCircle as XCircleIcon,
  AlertCircle as AlertCircleIcon,
  Check as CheckIcon,
  X as XIcon,
  Calendar,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  Truck,
  FileText,
  Download,
  ArrowUpRight,
  MoreVertical,
  Building,
  Mail,
  Phone,
  MapPin,
  Plus as PlusIcon
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { DashboardLayout } from '@/app/components/layout';

// Loading Skeleton Component
function RetailerOrdersSkeleton() {
  return (
    <DashboardLayout userType="retailer">
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50/30 to-fuchsia-50/40 -m-6 p-6">
        {/* Header Skeleton */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#8982cf] via-purple-600 to-fuchsia-600 px-6 py-8 rounded-3xl mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="h-8 bg-white/20 rounded-lg w-80 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-white/10 rounded w-64 animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="h-10 bg-white/20 rounded-xl w-32 animate-pulse"></div>
              </div>
            </div>
            
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {[...Array(4)].map((_, index) => (
                <div 
                  key={index}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-3 bg-white/20 rounded w-20 mb-2 animate-pulse"></div>
                      <div className="h-6 bg-white/30 rounded w-12 animate-pulse"></div>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                      <div className="h-5 w-5 bg-white/30 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {/* Tabs Skeleton */}
          <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden">
            <div className="p-2">
              <div className="flex space-x-1">
                <div className="flex-1 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse"></div>
                <div className="flex-1 h-16 bg-gray-100 rounded-2xl animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Search and Filter Skeleton */}
          <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="h-12 bg-gray-200 rounded-2xl w-72 animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded-2xl w-36 animate-pulse"></div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded-xl w-10 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-100 rounded w-24 animate-pulse"></div>
                    </div>
                    <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>

                  {/* Distributor Info Skeleton */}
                  <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-gray-200 rounded-xl">
                        <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                        <div className="h-3 bg-gray-100 rounded w-40 mb-2 animate-pulse"></div>
                        <div className="h-3 bg-gray-100 rounded w-36 animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Status and Total Skeleton */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-8 bg-gray-200 rounded-xl w-20 animate-pulse"></div>
                    <div className="text-right">
                      <div className="h-6 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-100 rounded w-20 animate-pulse"></div>
                    </div>
                  </div>

                  {/* Order Items Skeleton */}
                  <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
                    <div className="space-y-2">
                      {[...Array(2)].map((_, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between items-center">
                          <div className="h-3 bg-gray-100 rounded w-24 animate-pulse"></div>
                          <div className="h-3 bg-gray-100 rounded w-16 animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Button Skeleton */}
                  <div className="h-12 bg-gray-200 rounded-2xl w-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

interface PartnershipRequest {
  id: string;
  distributor_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  distributor: {
    id: string;
    business_name: string;
    email: string;
    phone: string;
    address: string;
  };
}

interface Order {
  id: string;
  distributor_id: string;
  total: number;
  discount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  notes: string;
  created_at: string;
  placed_by_type: 'retailer' | 'distributor';
  placed_by_user_name?: string;
  distributor: {
    business_name: string;
    email: string;
    phone: string;
  };
  order_items: {
    id: string;
    product_name: string;
    quantity: number;
    price: number;
  }[];
}

export default function RetailerOrdersPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'orders'>('orders'); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [partnershipRequests, setPartnershipRequests] = useState<PartnershipRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user.id;

      if (!userId) {
        throw new Error('User not authenticated');
      }

              // Get retailer record
        const { data: retailerData, error: retailerError } = await supabase
          .from('retailers')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (retailerError) {
          console.error('Retailer query error:', retailerError);
          throw new Error(`Could not find retailer record for this user: ${retailerError.message}`);
        }

        if (!retailerData?.id) {
          throw new Error('No retailer record found for this user');
        }

                const retailerId = retailerData.id;
        console.log('Found retailer ID:', retailerId, 'for user:', userId);

        // Fetch partnership requests
        const { data: requestsData, error: requestsError } = await supabase
          .from('relationships')
          .select(`
            id,
            distributor_id,
            status,
            created_at,
            distributors!inner(
              id,
              users(business_name, email, phone, business_address)
            )
          `)
          .eq('retailer_id', retailerId)
          .order('created_at', { ascending: false });

        if (requestsError) {
          console.error('Partnership requests query error:', requestsError);
          throw new Error(`Failed to fetch partnership requests: ${requestsError.message}`);
        }

              // Transform partnership requests
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedRequests = requestsData?.map((request: any) => ({
          id: request.id,
          distributor_id: request.distributor_id,
          status: request.status,
          created_at: request.created_at,
          distributor: {
            id: request.distributors.id,
            business_name: request.distributors.users?.business_name || 'Unknown Business',
            email: request.distributors.users?.email || '',
            phone: request.distributors.users?.phone || '',
            address: request.distributors.users?.business_address || '',
          }
        })) || [];

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          distributor_id,
          total,
          discount,
          status,
          notes,
          created_at,
          placed_by_type,
          placed_by_user_id,
          distributors (
            id,
            user_id,
            users!inner(business_name, email, phone)
          ),
          order_items(
            id,
            quantity,
            price,
            distributor_products(
              name
            )
          )
        `)
        .eq('retailer_id', retailerId)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Orders query error:', ordersError);
        throw new Error(`Failed to fetch orders: ${ordersError.message}`);
      }

      console.log('Raw orders data:', ordersData);
      console.log('Orders count:', ordersData?.length || 0);

      // Get unique user IDs from orders to fetch user details
      const userIds = [...new Set(ordersData?.map(order => order.placed_by_user_id) || [])];
      
      let usersData: Array<{id: string, business_name: string | null, first_name: string | null, last_name: string | null}> = [];
      if (userIds.length > 0) {
        // Fetch user details for all placed_by_user_ids
        const { data: fetchedUsersData, error: usersError } = await supabase
          .from('users')
          .select('id, business_name, first_name, last_name')
          .in('id', userIds);

        if (usersError) {
          console.warn('Error fetching user details:', usersError);
        } else {
          usersData = fetchedUsersData || [];
        }
      }

      // Create a map of user details for quick lookup
      const usersMap = new Map();
      usersData?.forEach(user => {
        usersMap.set(user.id, user);
      });

      // Transform orders
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedOrders = ordersData?.map((order: any) => {
        const placedByUser = usersMap.get(order.placed_by_user_id);
        const placedByUserName = placedByUser?.business_name || 
                                `${placedByUser?.first_name || ''} ${placedByUser?.last_name || ''}`.trim() ||
                                'Unknown User';

        // Handle distributors array - get the first distributor
        const distributor = Array.isArray(order.distributors) ? order.distributors[0] : order.distributors;
        const distributorUser = distributor?.users;

        return {
          id: order.id,
          distributor_id: order.distributor_id,
          total: order.total,
          discount: order.discount,
          status: order.status,
          notes: order.notes,
          created_at: order.created_at,
          placed_by_type: order.placed_by_type || 'distributor',
          placed_by_user_name: placedByUserName,
          distributor: {
            business_name: distributorUser?.business_name || 'Unknown Business',
            email: distributorUser?.email || '',
            phone: distributorUser?.phone || '',
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          order_items: order.order_items?.map((item: any) => ({
            id: item.id,
            product_name: item.distributor_products?.name || 'Unknown Product',
            quantity: item.quantity,
            price: item.price
          })) || []
        };
      }) || [];

      setPartnershipRequests(transformedRequests);
      setOrders(transformedOrders);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      console.error('Error fetching data:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePartnershipAction = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      const { error } = await supabase
        .from('relationships')
        .update({ status: action === 'accept' ? 'accepted' : 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      setSuccessMessage(`Partnership request ${action}ed successfully!`);
      setTimeout(() => setSuccessMessage(null), 5000);
      
      // Refresh data
      fetchData();

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : `Failed to ${action} request`;
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'accepted': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'rejected': return 'text-red-700 bg-red-50 border-red-200';
      case 'confirmed': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'shipped': return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'delivered': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'cancelled': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ClockIcon size={14} />;
      case 'accepted': return <CheckCircleIcon size={14} />;
      case 'rejected': return <XCircleIcon size={14} />;
      case 'confirmed': return <CheckCircleIcon size={14} />;
      case 'shipped': return <Truck size={14} />;
      case 'delivered': return <CheckCircleIcon size={14} />;
      case 'cancelled': return <XCircleIcon size={14} />;
      default: return <AlertCircleIcon size={14} />;
    }
  };

  const filteredRequests = partnershipRequests.filter(request => {
    const matchesSearch = request.distributor.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.distributor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.distributor.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.distributor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalOrders = orders.length;
  const totalValue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingRequests = partnershipRequests.filter(req => req.status === 'pending').length;

  // Show loading skeleton while data is loading
  if (isLoading) {
    return <RetailerOrdersSkeleton />;
  }

  return (
    <DashboardLayout userType="retailer">
      <div className="bg-gradient-to-br from-violet-50 via-purple-50/30 to-fuchsia-50/40 -m-6 p-6 min-h-full">
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold">Error: {error}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-semibold">{successMessage}</p>
          </div>
        )}

              {/* Hero Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-[#8982cf] to-purple-600 px-6 py-8 rounded-3xl mb-6">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/90 to-[#8982cf]/90"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-8 right-8 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/15 rounded-full blur-lg"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Orders & Partnerships</h1>
                  <p className="text-violet-100 text-sm">Manage your orders and distributor partnerships</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
                className="group relative px-4 py-2.5 bg-white/20 backdrop-blur-sm text-white font-medium rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 text-sm"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FileText size={16} />
                <span>{viewMode === 'cards' ? 'Table View' : 'Card View'}</span>
              </motion.button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <motion.div 
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-violet-100 text-xs font-medium">Total Orders</p>
                  <p className="text-white text-2xl font-bold">{totalOrders}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-violet-100 text-xs font-medium">Total Spent</p>
                  <p className="text-white text-2xl font-bold">${totalValue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-emerald-500/30 rounded-xl">
                  <DollarSign className="h-5 w-5 text-emerald-200" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-violet-100 text-xs font-medium">Pending Orders</p>
                  <p className="text-white text-2xl font-bold">{pendingRequests}</p>
                </div>
                <div className="p-3 bg-amber-500/30 rounded-xl">
                  <ClockIcon size={16} className="text-amber-200" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-violet-100 text-xs font-medium">Partnerships</p>
                  <p className="text-white text-2xl font-bold">{partnershipRequests.filter(r => r.status === 'accepted').length}</p>
                </div>
                <div className="p-3 bg-blue-500/30 rounded-xl">
                  <Users className="h-5 w-5 text-blue-200" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <motion.div 
          className="mb-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-2">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-[#8982cf] to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Package size={20} />
                <span>Orders</span>
                {orders.length > 0 && (
                  <span className="bg-white/20 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                    {orders.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                  activeTab === 'requests'
                    ? 'bg-gradient-to-r from-[#8982cf] to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Users size={20} />
                <span>Partnership Requests</span>
                {pendingRequests > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                    {pendingRequests}
                  </span>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="mb-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8982cf] to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by business name or email..."
                      className="w-72 pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8982cf]/50 focus:border-transparent transition-all duration-300 shadow-lg text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <SearchIcon
                      size={18}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#8982cf] transition-colors duration-300"
                    />
                  </div>
                </div>
                
                {/* Status Filter */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-3 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl px-4 py-3 shadow-lg">
                    <FilterIcon size={16} className="text-gray-500 group-hover:text-purple-500 transition-colors duration-300" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-transparent text-gray-700 text-sm focus:outline-none cursor-pointer min-w-[120px]"
                    >
                      <option value="all">All Status</option>
                      {activeTab === 'requests' ? (
                        <>
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </>
                      ) : (
                        <>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Results Counter */}
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 bg-gray-100/80 px-4 py-2 rounded-full">
                  <span className="font-semibold text-[#8982cf]">
                    {activeTab === 'orders' ? filteredOrders.length : filteredRequests.length}
                  </span> of {activeTab === 'orders' ? totalOrders : partnershipRequests.length} {activeTab}
                </div>
                
                {activeTab === 'orders' && (
                  <Link href="/retailer/orders/create">
                    <motion.button
                      className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-[#8982cf] to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      title="Create new order"
                    >
                      <PlusIcon size={16} />
                      <span>Create Order</span>
                    </motion.button>
                  </Link>
                )}
                
                <motion.button
                  className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Export data"
                >
                  <Download size={16} className="text-gray-600" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'orders' ? (
            <motion.div
              key="orders"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredOrders.length > 0 ? (
                viewMode === 'cards' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                      >
                        <div className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-1">
                                Order #{order.id.slice(0, 8)}
                              </h3>
                              <p className="text-sm text-gray-500 flex items-center">
                                <Calendar size={14} className="mr-1" />
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <motion.button
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <MoreVertical size={16} />
                              </motion.button>
                            </div>
                          </div>

                          {/* Distributor Info */}
                          <div className="bg-gradient-to-r from-[#8982cf]/10 to-purple-50 rounded-2xl p-4 mb-4">
                            <div className="flex items-start space-x-3">
                              <div className="p-2 bg-[#8982cf]/20 rounded-xl">
                                <Building size={16} className="text-[#8982cf]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-sm truncate">
                                  {order.distributor.business_name}
                                </h4>
                                <p className="text-xs text-gray-600 flex items-center mt-1">
                                  <Mail size={12} className="mr-1" />
                                  {order.distributor.email}
                                </p>
                                <p className="text-xs text-blue-600 font-medium mt-1">
                                  📝 Placed by {order.placed_by_type === 'distributor' ? 'Distributor' : 'Retailer'}: {order.placed_by_user_name}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Status and Total */}
                          <div className="flex items-center justify-between mb-4">
                            <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-xl border text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="capitalize">{order.status}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
                              {order.discount > 0 && (
                                <p className="text-sm text-emerald-600">-${order.discount.toFixed(2)} discount</p>
                              )}
                            </div>
                          </div>

                          {/* Order Items Preview */}
                          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 mb-4">
                            <h4 className="font-medium text-gray-900 mb-3 text-sm">Order Items ({order.order_items.length})</h4>
                            <div className="space-y-2">
                              {order.order_items.slice(0, 2).map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-xs">
                                  <span className="text-gray-700 truncate">{item.product_name}</span>
                                  <span className="text-gray-600 ml-2">
                                    {item.quantity} × ${item.price.toFixed(2)}
                                  </span>
                                </div>
                              ))}
                              {order.order_items.length > 2 && (
                                <p className="text-xs text-gray-500">+{order.order_items.length - 2} more items</p>
                              )}
                            </div>
                          </div>

                          {/* View Button */}
                          <motion.button
                            className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#8982cf] to-purple-600 text-white text-sm font-semibold rounded-2xl hover:from-[#8982cf]/90 hover:to-purple-600/90 transition-all duration-200 space-x-2 shadow-lg"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <EyeIcon size={16} />
                            <span>View Details</span>
                            <ArrowUpRight size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-[#8982cf]/10 to-purple-50 border-b border-gray-200/50">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Distributor</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white/50 divide-y divide-gray-200/50">
                          {filteredOrders.map((order, index) => (
                            <motion.tr 
                              key={order.id} 
                              className="hover:bg-white/80 transition-colors duration-200 cursor-pointer"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05, duration: 0.3 }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                #{order.id.slice(0, 8)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{order.distributor.business_name}</div>
                                <div className="text-xs text-gray-500">{order.distributor.email}</div>
                                <div className="text-xs text-blue-600 font-medium mt-1">
                                  📝 Placed by {order.placed_by_type === 'distributor' ? 'Distributor' : 'Retailer'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-medium ${getStatusColor(order.status)}`}>
                                  {getStatusIcon(order.status)}
                                  <span className="capitalize">{order.status}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                ${order.total.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <motion.button
                                  className="p-2 text-[#8982cf] hover:text-[#8982cf]/80 hover:bg-[#8982cf]/10 rounded-lg transition-colors duration-200"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <EyeIcon size={16} />
                                </motion.button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )
              ) : (
                <motion.div 
                  className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex flex-col items-center justify-center py-20 px-6">
                    <div className="relative mx-auto w-24 h-24 mb-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#8982cf] to-purple-500 rounded-full blur-lg opacity-20"></div>
                      <div className="relative bg-gradient-to-r from-[#8982cf]/10 to-purple-100 rounded-full flex items-center justify-center w-full h-full">
                        <Package className="h-12 w-12 text-[#8982cf]" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto text-center">
                      You don&apos;t have any orders yet. Once distributors place orders with you, they&apos;ll appear here.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="requests"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredRequests.length > 0 ? (
                <div className="space-y-6">
                  {filteredRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-6">
                            <div className="p-3 bg-[#8982cf]/10 rounded-2xl">
                              <Building size={24} className="text-[#8982cf]" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">
                                {request.distributor.business_name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Partnership Request • {new Date(request.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center space-x-3 text-sm text-gray-600 bg-gray-50/80 rounded-xl p-3">
                              <Mail size={16} className="text-[#8982cf]" />
                              <span>{request.distributor.email}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-gray-600 bg-gray-50/80 rounded-xl p-3">
                              <Phone size={16} className="text-[#8982cf]" />
                              <span>{request.distributor.phone || 'No phone'}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-gray-600 bg-gray-50/80 rounded-xl p-3 md:col-span-2">
                              <MapPin size={16} className="text-[#8982cf]" />
                              <span>{request.distributor.address || 'No address'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-4">
                          <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            <span className="capitalize">{request.status}</span>
                          </div>
                          
                          {request.status === 'pending' && (
                            <div className="flex space-x-3">
                              <motion.button
                                onClick={() => handlePartnershipAction(request.id, 'accept')}
                                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 text-sm font-semibold shadow-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <CheckIcon size={16} />
                                <span>Accept</span>
                              </motion.button>
                              <motion.button
                                onClick={() => handlePartnershipAction(request.id, 'reject')}
                                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 text-sm font-semibold shadow-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <XIcon size={16} />
                                <span>Reject</span>
                              </motion.button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex flex-col items-center justify-center py-20 px-6">
                    <div className="relative mx-auto w-24 h-24 mb-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#8982cf] to-purple-500 rounded-full blur-lg opacity-20"></div>
                      <div className="relative bg-gradient-to-r from-[#8982cf]/10 to-purple-100 rounded-full flex items-center justify-center w-full h-full">
                        <Users className="h-12 w-12 text-[#8982cf]" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No Partnership Requests</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto text-center">
                      You don&apos;t have any partnership requests at the moment. Distributors will send you requests to start working together.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </DashboardLayout>
  );
} 