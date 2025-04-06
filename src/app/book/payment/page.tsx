'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import Link from 'next/link';
import PaymentForm from '../../../components/PaymentForm';

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

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get booking data from URL
    const bookingParam = searchParams.get('booking');
    
    if (!bookingParam) {
      router.push('/book');
      return;
    }

    try {
      // Parse the booking data
      const parsedBookingData = JSON.parse(decodeURIComponent(bookingParam)) as BookingData;
      setBookingData(parsedBookingData);

      // Create a payment intent
      const createPaymentIntent = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              bookingData: parsedBookingData,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to create payment intent');
          }

          setClientSecret(data.clientSecret);
        } catch (err) {
          console.error('Error creating payment intent:', err);
          setError('There was an error processing your payment. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      createPaymentIntent();
    } catch (error) {
      console.error('Error parsing booking data:', error);
      router.push('/book');
    }
  }, [searchParams, router]);

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        <p className="ml-3 text-gray-700">Preparing payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Error</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <Link 
              href="/book" 
              className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors duration-300"
            >
              Try Again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret || !bookingData) {
    return (
      <div className="py-20 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading payment information...</h2>
          </div>
        </div>
      </div>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#000000',
    },
  };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  return (
    <main className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Complete Your Payment</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please provide your payment information to confirm your booking
          </p>
        </div>
        
        {/* Booking Summary Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Barber</p>
              <p className="font-medium text-black">{bookingData.barberName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium text-black">{formatDate(bookingData.date)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-medium text-black">{bookingData.time}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Booking Fee</p>
              <p className="font-medium text-black">$10.00</p>
            </div>
          </div>
        </div>
        
        {/* Payment Form */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
          <Elements stripe={stripePromise} options={options}>
            <PaymentForm bookingData={bookingData} />
          </Elements>
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading payment page...</div>}>
      <PaymentContent />
    </Suspense>
  );
} 