import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      );
    }
    
    console.log(`Verifying Stripe session: ${sessionId}`);
    
    // Retrieve the session from Stripe with expanded customer details
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'line_items', 'line_items.data.price.product']
    });
    
    console.log('Retrieved session data');
    
    // Extract the plan name from the session metadata
    const planName = session.metadata?.planName || 'Website Plan';
    
    // Get customer email
    const customerEmail = session.customer_email || '';
    
    // Get phone number if available
    const phoneNumber = session.customer_details?.phone || '';
    
    // Get website type preference from custom fields
    let websiteType = 'Not specified';
    if (session.custom_fields && session.custom_fields.length > 0) {
      // Type assertion with Stripe's CustomField type
      const websiteTypeField = session.custom_fields.find(
        field => field.key === 'websiteType'
      );
      
      if (websiteTypeField && 
          websiteTypeField.type === 'dropdown' && 
          websiteTypeField.dropdown && 
          websiteTypeField.dropdown.value) {
        websiteType = websiteTypeField.dropdown.value;
      }
    }
    
    // Get name if available
    const customerName = session.customer_details?.name || '';
    
    // Get address if available
    const address = session.customer_details?.address || null;
    
    return NextResponse.json({
      planName,
      customerEmail,
      phoneNumber,
      customerName,
      address,
      websiteType,
      paymentStatus: session.payment_status,
      subscriptionStatus: session.status,
    });
  } catch (error) {
    console.error('Stripe session verification error:', error);
    return NextResponse.json(
      { error: 'Could not verify payment session' },
      { status: 500 }
    );
  }
} 