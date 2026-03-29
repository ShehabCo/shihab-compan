import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-10-28.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

// POST /api/v1/webhooks/stripe - Stripe webhook handler
export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (error) {
    console.error('[Webhook] Signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const metadata = paymentIntent.metadata as any

        // Update payment status
        await supabase
          .from('payments')
          .update({
            status: 'completed',
            stripe_payment_id: paymentIntent.id,
          })
          .eq('id', metadata.payment_id)

        // Update order status
        await supabase
          .from('orders')
          .update({ status: 'confirmed' })
          .eq('id', metadata.order_id)

        console.log('[Webhook] Payment succeeded for order:', metadata.order_id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const metadata = paymentIntent.metadata as any

        // Update payment status
        await supabase
          .from('payments')
          .update({ status: 'failed' })
          .eq('id', metadata.payment_id)

        console.log('[Webhook] Payment failed for order:', metadata.order_id)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const metadata = charge.metadata as any

        // Update payment status
        await supabase
          .from('payments')
          .update({ status: 'refunded' })
          .eq('stripe_payment_id', charge.payment_intent as string)

        // Update order status
        await supabase
          .from('orders')
          .update({ status: 'refunded' })
          .eq('id', metadata.order_id)

        console.log('[Webhook] Refund processed for order:', metadata.order_id)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Webhook] Processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
