# Stripe Payment Integration Setup

This document outlines how to set up and test the Stripe integration for the website plans on the Kitions Websites app.

## Configuration

1. **Environment Variables**

   Create a `.env.local` file in the project root with the following variables:

   ```
   STRIPE_SECRET_KEY=sk_test_your_test_key_here
   STRIPE_PUBLIC_KEY=pk_test_your_test_key_here
   ```

   For production, use your live keys in the deployment environment.

2. **Product and Price IDs**

   The following Stripe products and price IDs are configured in the app:

   - **Basic Plan**
     - Product ID: `prod_SGsFjKed2Kz5zQ`
     - Price ID: `price_1RMUXAGhNGM7Ot8Z5cMDUeID`

   - **Pro Plan**
     - Product ID: `prod_SH2aIyBsYi0nHe`
     - Price ID: `price_1RMUV1GhNGM7Ot8Z7EMmeGUV`

   - **Enterprise Plan**
     - Product ID: `prod_SH2c90AFjaPO88`
     - Price ID: `price_1RMUXCGhNGM7Ot8Z5cMDUeID`

## Testing

1. **Stripe Test Mode**

   Make sure your Stripe account is in test mode when testing payments.

2. **Test Cards**

   Use the following Stripe test cards for testing:

   - **Successful payment**: 4242 4242 4242 4242
   - **Payment requires authentication**: 4000 0025 0000 3155
   - **Payment declined**: 4000 0000 0000 9995

   For all test cards:
   - Use any future date for expiration
   - Use any 3-digit CVC
   - Use any postal code

3. **Testing Workflow**

   1. Select a plan on the pricing page
   2. Complete the checkout form with a test card
   3. Verify you're redirected to the success page
   4. Check that the subscription appears in your Stripe dashboard

## Webhook Setup (Optional)

For a complete implementation, consider setting up webhooks to:

1. Handle subscription lifecycle events
2. Update user subscription status in your database
3. Handle payment failures

Add a webhook endpoint at `/api/stripe/webhook` and configure it in your Stripe dashboard.

## Production Considerations

1. Replace test keys with production keys
2. Set up proper error logging
3. Implement email notifications for successful subscriptions
4. Configure subscription management capabilities 