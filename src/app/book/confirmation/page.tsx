'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCheck, FaCalendarAlt, FaClock, FaUser } from 'react-icons/fa';

interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  date: string;
  barberName: string;
  "time#barberId#customerId"?: string; // Unusual field name from DynamoDB
  timeBarberCustomer?: string; // Previous field name we tried
  sortKey?: string; // Field added for client-side use
  status: string;
  time: string;
  paymentStatus?: string;
  paymentIntentId?: string;
}

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<BookingData | null>(null);

  useEffect(() => {
    const paymentSuccess = searchParams.get('paymentSuccess');
    const bookingParam = searchParams.get('booking');
    
    // Handle direct payment success redirect from Stripe
    if (paymentSuccess === 'true' && !bookingParam) {
      // Payment was successful, but we need to fetch the booking details
      // In a real app, you'd want to have an API call here to get booking details
      // For now, just show a generic success message
      setBooking({
        status: 'confirmed',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        notes: '',
        date: new Date().toISOString(),
        barberName: '',
        sortKey: '',
        time: '',
        paymentStatus: 'paid'
      });
      return;
    }

    if (!bookingParam) {
      router.push('/book');
      return;
    }

    try {
      const bookingData = JSON.parse(decodeURIComponent(bookingParam)) as BookingData;
      setBooking(bookingData);
    } catch (error) {
      console.error('Error parsing booking data:', error);
      router.push('/book');
    }
  }, [searchParams, router]);

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  if (!booking) {
    return (
      <main className="py-20 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-semibold">Loading confirmation...</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <FaCheck className="text-green-600 text-2xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
          <p className="text-xl text-gray-900 max-w-2xl mx-auto">
            Your appointment has been successfully booked. We&apos;ve sent a confirmation email to {booking.email}.
          </p>
        </div>
        
        {/* Booking Details Card */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Appointment Details</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <FaUser className="text-gray-900 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Barber</p>
                <p className="text-lg font-medium text-gray-900">{booking.barberName}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <FaCalendarAlt className="text-gray-900 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Date</p>
                <p className="text-lg font-medium text-gray-900">{formatDate(booking.date)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <FaClock className="text-gray-900 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Time</p>
                <p className="text-lg font-medium text-gray-900">{booking.time}</p>
              </div>
            </div>
            
            {/* Payment Status */}
            <div className="flex items-start gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 2H8.828a2 2 0 00-1.414.586L6.293 3.707A1 1 0 015.586 4H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900">Payment Status</p>
                <p className="text-lg font-medium">
                  {booking.paymentStatus === 'paid' ? (
                    <span className="text-green-600">Paid</span>
                  ) : (
                    <span className="text-yellow-600">Pending</span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-900 pt-6">
              <p className="text-sm font-medium text-gray-900 mb-2">Customer Information</p>
              <p className="text-gray-900"><strong>Name:</strong> {booking.firstName} {booking.lastName}</p>
              <p className="text-gray-900"><strong>Email:</strong> {booking.email}</p>
              <p className="text-gray-900"><strong>Phone:</strong> {booking.phone}</p>
              {booking.notes && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-900">Additional Notes</p>
                  <p className="mt-1 text-gray-900">{booking.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-2xl mx-auto">
          <Link 
            href="/"
            className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors duration-300 w-full sm:w-auto text-center"
          >
            Return to Home
          </Link>
          
          <button
            onClick={() => window.print()}
            className="bg-white text-black border border-black px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-300 w-full sm:w-auto"
          >
            Print Confirmation
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading confirmation...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
} 