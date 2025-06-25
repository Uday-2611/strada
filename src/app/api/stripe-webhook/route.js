import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import client from '@/api/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request) {
  const sig = headers().get('stripe-signature')
  const body = await request.text()

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Event Handler -> 
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const bookingId = session.metadata.booking_id
    const transactionId = session.payment_intent

    if (!bookingId) {
      console.error('Webhook received checkout.session.completed but booking_id was not in metadata.')
      return NextResponse.json({ error: 'Booking ID not found in session metadata' }, { status: 400 })
    }

    try {
      // Booking Status: Confirmed -> 
      const { error: bookingUpdateError } = await client.from('bookings').update({ status: 'confirmed', payment_method: 'Stripe', updated_at: new Date().toISOString() }).eq('id', bookingId)

      if (bookingUpdateError) throw bookingUpdateError

      // Booking fetch for total amount -> 
      const { data: bookingData, error: bookingFetchError } = await client.from('bookings').select('total_amount').eq('id', bookingId).single()

      if (bookingFetchError) throw bookingFetchError

      // Data inserted into payments table
      const { error: paymentInsertError } = await client.from('payments').insert({
        booking_id: bookingId,
        amount: bookingData.total_amount,
        payment_method: 'Stripe',
        transaction_id: transactionId,
        status: 'completed',
        created_at: new Date().toISOString(),
      })

      if (paymentInsertError) throw paymentInsertError

    } catch (error) {
      console.error(`Database error processing booking ${bookingId}:`, error)
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
} 