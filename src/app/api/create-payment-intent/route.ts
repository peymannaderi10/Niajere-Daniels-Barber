import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-03-31.basil'
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingData, payment_method_type = 'card' } = body;

    // Validate the booking data
    if (!bookingData) {
      return NextResponse.json(
        { error: 'Missing booking data' }, 
        { status: 400 }
      );
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // $10.00 in cents
      currency: 'usd',
      payment_method_types: [payment_method_type],
      metadata: {
        barberId: bookingData.barberId,
        barberName: bookingData.barberName,
        date: bookingData.date,
        time: bookingData.time,
        customerEmail: bookingData.email,
        customerName: `${bookingData.firstName} ${bookingData.lastName}`,
      },
    });

    // Return the client secret
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
} 