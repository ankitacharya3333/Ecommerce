import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia' as any,
    })
  : null;

export interface PaymentInitiationResult {
  success: boolean;
  provider: 'STRIPE' | 'ESEWA' | 'KHALTI' | 'MANUAL_BANK_TRANSFER';
  redirectUrl?: string;
  checkoutSessionId?: string;
  instructions?: string;
  error?: string;
  isTestMode: boolean;
}

export interface PaymentVerificationResult {
  verified: boolean;
  status: 'PAID' | 'FAILED' | 'PENDING';
  transactionId?: string;
  amount?: number;
  error?: string;
}

/**
 * Universal Payment Provider Boundary
 * Cleanly abstracts Stripe, eSewa, and Khalti so providers can be switched or extended
 * without altering core order placement transactions.
 */
export async function initiatePayment({
  orderId,
  orderNumber,
  amount,
  currency = 'USD',
  customerEmail,
  provider,
  returnUrl,
  cancelUrl,
}: {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency?: string;
  customerEmail: string;
  provider: 'STRIPE' | 'ESEWA' | 'KHALTI' | 'MANUAL_BANK_TRANSFER';
  returnUrl: string;
  cancelUrl: string;
}): Promise<PaymentInitiationResult> {
  const isTestMode = process.env.NODE_ENV !== 'production' || !!process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_');

  switch (provider) {
    case 'STRIPE': {
      if (!stripe) {
        return {
          success: false,
          provider: 'STRIPE',
          error: 'STRIPE_SECRET_KEY is not configured in environment variables. Please provide valid Stripe credentials.',
          isTestMode: true,
        };
      }

      try {
        const session = await stripe.checkout.sessions.create({
          mode: 'payment',
          customer_email: customerEmail,
          client_reference_id: orderId,
          metadata: {
            orderId,
            orderNumber,
          },
          line_items: [
            {
              price_data: {
                currency: currency.toLowerCase(),
                product_data: {
                  name: `NOVA MARKET Order #${orderNumber}`,
                  description: 'Living objects and lifestyle essentials purchase',
                },
                unit_amount: Math.round(amount * 100), // Stripe expects amounts in cents
              },
              quantity: 1,
            },
          ],
          success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
          cancel_url: `${cancelUrl}?order_id=${orderId}`,
        });

        return {
          success: true,
          provider: 'STRIPE',
          redirectUrl: session.url || undefined,
          checkoutSessionId: session.id,
          isTestMode,
        };
      } catch (err: any) {
        console.error('Stripe session creation error:', err.message);
        return {
          success: false,
          provider: 'STRIPE',
          error: err.message || 'Failed to initiate Stripe Checkout Session.',
          isTestMode,
        };
      }
    }

    case 'ESEWA': {
      // Evaluation based on current Nepal Rastra Bank & eSewa ePay v2/v3 specification:
      // Requires merchant code, secret key for HMAC-SHA256 signature, and transaction uuid
      const esewaMerchantCode = process.env.ESEWA_MERCHANT_CODE;
      if (!esewaMerchantCode) {
        return {
          success: false,
          provider: 'ESEWA',
          error: 'eSewa Merchant Code is unconfigured. eSewa integration requires registered Nepal merchant credentials (ESEWA_MERCHANT_CODE & ESEWA_SECRET_KEY).',
          isTestMode: true,
        };
      }

      // Standard eSewa test/sandbox gateway
      const esewaUrl = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
      return {
        success: true,
        provider: 'ESEWA',
        redirectUrl: `${esewaUrl}?amt=${amount}&psc=0&pdc=0&txAmt=0&tAmt=${amount}&pid=${orderNumber}&scd=${esewaMerchantCode}&su=${encodeURIComponent(returnUrl)}&fu=${encodeURIComponent(cancelUrl)}`,
        isTestMode: true,
      };
    }

    case 'KHALTI': {
      // Evaluation based on Khalti ePayment v2 API (epayment/initiate/):
      // Requires live/sandbox public & secret keys (KHALTI_SECRET_KEY)
      const khaltiSecretKey = process.env.KHALTI_SECRET_KEY;
      if (!khaltiSecretKey) {
        return {
          success: false,
          provider: 'KHALTI',
          error: 'Khalti Secret Key is unconfigured. Khalti payment requires KHALTI_SECRET_KEY environment variable.',
          isTestMode: true,
        };
      }

      try {
        const khaltiEndpoint = 'https://a.khalti.com/api/v2/epayment/initiate/';
        const response = await fetch(khaltiEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Key ${khaltiSecretKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            return_url: returnUrl,
            website_url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            amount: Math.round(amount * 100), // paisa
            purchase_order_id: orderNumber,
            purchase_order_name: `NOVA MARKET Order #${orderNumber}`,
          }),
        });

        const data = await response.json();
        if (data.payment_url) {
          return {
            success: true,
            provider: 'KHALTI',
            redirectUrl: data.payment_url,
            checkoutSessionId: data.pidx,
            isTestMode: true,
          };
        }

        return {
          success: false,
          provider: 'KHALTI',
          error: data.detail || 'Khalti payment initiation failed.',
          isTestMode: true,
        };
      } catch (err: any) {
        return {
          success: false,
          provider: 'KHALTI',
          error: err.message || 'Network error connecting to Khalti.',
          isTestMode: true,
        };
      }
    }

    case 'MANUAL_BANK_TRANSFER':
    default: {
      return {
        success: true,
        provider: 'MANUAL_BANK_TRANSFER',
        instructions: `Please initiate a wire transfer of $${amount.toFixed(2)} to NOVA MARKET Studio Account (Routing: 121000358, Acct: 9400281928) with Reference: #${orderNumber}. Orders ship immediately upon wire settlement.`,
        isTestMode: true,
      };
    }
  }
}
