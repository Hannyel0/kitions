import React from 'react';
import { DashboardLayout } from '@/app/components/layout';
import { CreateOrder } from '@/app/components/orders/CreateOrder';

export default function CreateOrderPage() {
  return (
    <DashboardLayout userType="distributor">
      <div className="container mx-auto py-6">
        <CreateOrder />
      </div>
    </DashboardLayout>
  );
}
