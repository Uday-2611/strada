import { NextResponse } from 'next/server';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { item } = await request.json();

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: item.name,
              description: item.description,
            },
            unit_amount: item.amount,
          },
          quantity: item.quantity,
        },
      ],
      mode: 'payment',
      metadata: {
        booking_id: item.booking_id,
      },
      success_url: `${request.headers.get('origin')}/order?session_id={CHECKOUT_SESSION_ID}&booking_id=${item.booking_id}`,
      cancel_url: `${request.headers.get('origin')}/order?booking_id=${item.booking_id}`,
    });

    return NextResponse.json({ id: session.id });
  } catch (err) {
    console.error('Error creating Stripe session:', err);
    return NextResponse.json({ error: { message: err.message } }, { status: 500 });
  }
} 