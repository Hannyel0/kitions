import React from 'react';
import { DashboardLayout } from '@/app/components/layout';
import { OrderDetailsClient } from './order-details-client';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <DashboardLayout userType="distributor">
      <div className="p-6">
        <OrderDetailsClient orderId={id} />
      </div>
    </DashboardLayout>
  );
}
