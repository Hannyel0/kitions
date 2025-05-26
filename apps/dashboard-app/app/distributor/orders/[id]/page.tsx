'use client';

import React from 'react';
import { DashboardLayout } from '@/app/components/layout';
import { OrderDetailsClient } from './order-details-client';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout userType="distributor">
      <div className="p-6">
        <OrderDetailsClient orderId={params.id} />
      </div>
    </DashboardLayout>
  );
}
