import Stripe from 'stripe';
import { NextResponse } from 'next/server';

// Check if the Stripe API key is available
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
  console.error('ERROR: Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export async function POST(req: Request) {
  console.log('Stripe checkout session request received');
  
  try {
    // Parse the request body
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body));
    
    const { priceId, planName, customerEmail } = body;

    // Validate required fields
    if (!priceId) {
      console.error('Missing priceId in request');
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    console.log(`Creating checkout session for price ID: ${priceId}, plan: ${planName}`);

    // Determine return URLs based on environment
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://websites.kitions.com' 
      : 'http://localhost:3002';
    
    console.log(`Base URL for redirects: ${baseUrl}`);
    
    try {
      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card', 'cashapp', 'us_bank_account'],
        customer_email: customerEmail,
        line_items: [{ 
          price: priceId,
          quantity: 1 
        }],
        metadata: {
          planName: planName,
        },
        // Collect phone number
        phone_number_collection: {
          enabled: true,
        },
        // Collect billing address which includes email
        billing_address_collection: 'required',
        // Allow customer to update quantity
        allow_promotion_codes: true,
        // Custom fields if needed
        custom_fields: [
          {
            key: 'websiteType',
            label: {
              type: 'custom',
              custom: 'What type of website do you need?',
            },
            type: 'dropdown',
            dropdown: {
              options: [
                { label: 'Business', value: 'business' },
                { label: 'E-commerce', value: 'ecommerce' },
                { label: 'Portfolio', value: 'portfolio' },
                { label: 'Blog', value: 'blog' },
                { label: 'Other', value: 'other' },
              ],
            },
          }
        ],
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/pricing`,
      });

      console.log('Checkout session created successfully:', {
        sessionId: session.id,
        url: session.url
      });

      if (!session.url) {
        console.error('No URL returned from Stripe session creation');
        return NextResponse.json(
          { error: 'Failed to generate checkout URL' },
          { status: 500 }
        );
      }

      return NextResponse.json({ url: session.url });
    } catch (stripeError: unknown) {
      // Handle specific Stripe errors
      console.error('Stripe API error:', stripeError instanceof Error ? {
        message: stripeError.message,
        // Safely access Stripe specific properties if they exist
        code: 'code' in stripeError ? (stripeError as { code: string }).code : undefined,
        type: 'type' in stripeError ? (stripeError as { type: string }).type : undefined,
      } : 'Unknown error');
      
      return NextResponse.json(
        { 
          error: 'Stripe API error',
          details: stripeError instanceof Error ? stripeError.message : 'Unknown error',
          code: stripeError instanceof Error && 'code' in stripeError ? (stripeError as { code: string }).code : undefined
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Stripe session creation error:', error);
    
    // Provide more specific error message when possible
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error 
      ? (error.message as string) 
      : 'There was an error creating the checkout session';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 