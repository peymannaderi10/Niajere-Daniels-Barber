'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import Link from 'next/link';

// Booking data interface
interface BookingData {
  date: string;
  time: string;
  barberId: string | number;
  barberName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
}

interface PaymentFormProps {
  bookingData: BookingData;
}

export default function PaymentForm({ bookingData }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet. 
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    // Complete the payment
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/book/confirmation?paymentSuccess=true`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setPaymentError(error.message || 'An error occurred with your payment');
      setIsProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment successful, save the booking and redirect to confirmation
      try {
        // Call the bookings API to save the booking with payment info
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...bookingData,
            paymentIntentId: paymentIntent.id,
            paymentStatus: 'paid',
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to save booking');
        }

        // Redirect to confirmation page
        router.push(`/book/confirmation?booking=${encodeURIComponent(JSON.stringify(data.booking))}`);
      } catch (err) {
        console.error('Error saving booking:', err);
        setPaymentError('Payment successful, but there was an error saving your booking. Please contact support.');
        setIsProcessing(false);
      }
    } else {
      setPaymentError('Payment processing failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {paymentError && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md mb-4">
          {paymentError}
        </div>
      )}
      
      <PaymentElement />
      
      <div className="text-sm text-gray-500 mt-4">
        <p>Your card will be charged $10.00. This is a non-refundable booking fee.</p>
        <p className="mt-2">You can cancel or reschedule your appointment up to 24 hours before your scheduled time.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <Link href="/book/customer-info" className="text-gray-600 hover:text-black">
          ← Back
        </Link>
        
        <button
          type="submit"
          disabled={!stripe || !elements || isProcessing}
          className="bg-black text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {isProcessing ? 'Processing...' : 'Pay $10.00'}
        </button>
      </div>
    </form>
  );
} 