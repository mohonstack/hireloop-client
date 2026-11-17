import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe';
import { getSession } from '@/lib/core/server';



export async function POST() {

  const userSession = await getSession()

  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Price ID comes from .env (STRIPE_PRICE_ID) so it stays tied to the
          // Stripe account that STRIPE_SECRET_KEY belongs to.
          price: process.env.STRIPE_PRICE_ID as string,
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: userSession?.user.email,
      metadata: {
        userId: userSession?.user.id ?? null,
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: 'hire_loop_web_001',
    });
    return NextResponse.redirect(session.url as string, 303)
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}