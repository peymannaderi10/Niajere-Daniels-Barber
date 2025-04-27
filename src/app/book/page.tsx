'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaCheck, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendar.css';

// Temporary data (will come from database later)
const barbers = [
  {
    id: 1,
    name: 'Mark Smith',
    role: 'Master Barber & Owner',
    image: '/barber1.jpg',
    qualifications: [
      'Licensed Master Barber',
      'Precision Cutting Specialist',
      '10+ Years Experience'
    ],
    specialties: 'Fades, Design Work, Beard Sculpting',
    bio: 'With over a decade of experience, Mark brings unparalleled expertise and artistry to every cut.',
    social: {
      instagram: '#',
      facebook: '#',
      tiktok: '#'
    }
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Senior Barber',
    image: '/barber2.jpg',
    qualifications: [
      'Licensed Barber',
      'Color Treatment Expert',
      '7+ Years Experience'
    ],
    specialties: 'Hair Coloring, Classic Cuts, Hot Towel Shaves',
    bio: 'Marcus specializes in classic cuts and modern color treatments, bringing a fresh perspective to traditional styles.',
    social: {
      instagram: '#',
      facebook: '#',
      tiktok: '#'
    }
  },
  {
    id: 3,
    name: 'David Rodriguez',
    role: 'Style Specialist',
    image: '/barber3.jpg',
    qualifications: [
      'Licensed Barber',
      'Texture Expert',
      '5+ Years Experience'
    ],
    specialties: 'Textured Cuts, Modern Styles, Hair Design',
    bio: 'David is known for his innovative approach to textured hair and contemporary styling techniques.',
    social: {
      instagram: '#',
      facebook: '#',
      tiktok: '#'
    }
  }
];

// Temporary time slots (will come from database later)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 19; hour++) {
    const isPM = hour >= 12;
    const displayHour = hour > 12 ? hour - 12 : hour;
    for (const minute of ['00', '30']) {
      if (hour === 19 && minute === '30') continue;
      slots.push(`${displayHour}:${minute} ${isPM ? 'PM' : 'AM'}`);
    }
  }
  return slots;
};

// Type for booked time slot from API
interface BookedTimeSlot {
  time: string;
  barberId: string | number;
  date: string;
}

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number | null>(null);
  const touchMoveRef = useRef<number | null>(null);

  // Handle pre-selected barber from URL
  useEffect(() => {
    const barberId = searchParams.get('barber');
    if (barberId) {
      const id = parseInt(barberId);
      if (barbers.some(barber => barber.id === id)) {
        setSelectedBarber(id);
        const barberIndex = barbers.findIndex(b => b.id === id);
        setSliderIndex(barberIndex);
      }
    }
  }, [searchParams]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    touchMoveRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchMoveRef.current) {
      return;
    }

    const diff = touchStartRef.current - touchMoveRef.current;
    const threshold = window.innerWidth * 0.2; // 20% of screen width

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && sliderIndex < barbers.length - 1) {
        handleSlideChange(sliderIndex + 1);
      } else if (diff < 0 && sliderIndex > 0) {
        handleSlideChange(sliderIndex - 1);
      }
    }

    touchStartRef.current = null;
    touchMoveRef.current = null;
  };

  const handleSlideChange = (newIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(newIndex, barbers.length - 1));
    setSliderIndex(clampedIndex);
  };

  const handleDateSelect = (value: Date | Date[] | null) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      setSelectedTime(null);
      
      // If both date and barber are selected, fetch available time slots
      if (selectedBarber) {
        fetchAvailableTimeSlots(value, selectedBarber);
      }
    }
  };

  // Function to fetch available time slots
  const fetchAvailableTimeSlots = async (date: Date, barberId: number) => {
    setIsLoadingTimeSlots(true);
    setAvailableTimeSlots([]); // Clear previous slots while loading
    
    try {
      // Format date for API (YYYY-MM-DD)
      const formattedDate = date.toISOString().split('T')[0];
      
      // Fetch booked time slots from the API
      const response = await fetch(
        `/api/bookings/available-times?date=${formattedDate}&barberId=${barberId}`
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch available time slots');
      }
      
      // Get all time slots
      const allTimeSlots = generateTimeSlots();
      
      // Filter out booked time slots
      const bookedTimes = new Set(data.bookedTimeSlots.map((slot: BookedTimeSlot) => slot.time));
      const available = allTimeSlots.filter(time => !bookedTimes.has(time));
      
      setAvailableTimeSlots(available);
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      // If there's an error, show all time slots
      setAvailableTimeSlots(generateTimeSlots());
      // You could add a toast notification here to inform the user
    } finally {
      setIsLoadingTimeSlots(false);
    }
  };

  // When barber is selected and date is already selected, fetch available time slots
  useEffect(() => {
    if (selectedBarber && selectedDate) {
      fetchAvailableTimeSlots(selectedDate, selectedBarber);
    }
  }, [selectedBarber, selectedDate]);

  const timeSlots = availableTimeSlots.length > 0 ? availableTimeSlots : generateTimeSlots();

  // Scroll to barber section if pre-selected
  useEffect(() => {
    if (selectedBarber) {
      const element = document.getElementById('choose-barber');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [selectedBarber]);

  return (
    <main className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Appointment</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select your preferred barber, date, and time for your appointment
          </p>
        </div>

        {/* Booking Steps */}
        <div className="space-y-12">
          {/* Step 1: Select Barber */}
          <section id="choose-barber">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">1. Choose Your Barber</h2>
            <div className="relative w-full">
              {/* Carousel Container */}
              <div className="w-full overflow-hidden py-12 relative">
                {/* Left Arrow */}
                {sliderIndex > 0 && (
                  <button 
                    onClick={() => handleSlideChange(sliderIndex - 1)}
                    className="absolute left-[calc(50%-320px)] top-1/2 -translate-y-1/2 z-10 bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
                  >
                    <FaChevronLeft size={20} />
                  </button>
                )}

                {/* Right Arrow */}
                {sliderIndex < barbers.length - 1 && (
                  <button 
                    onClick={() => handleSlideChange(sliderIndex + 1)}
                    className="absolute right-[calc(50%-320px)] top-1/2 -translate-y-1/2 z-10 bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
                  >
                    <FaChevronRight size={20} />
                  </button>
                )}

                <div 
                  ref={containerRef}
                  className="flex w-full transition-transform duration-300 ease-out"
                  style={{ 
                    transform: `translateX(-${sliderIndex * (100 / barbers.length)}%)`,
                    width: `${barbers.length * 100}%`
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {barbers.map((barber) => (
                    <div
                      key={barber.id}
                      className="w-full flex-shrink-0 flex justify-center px-4 relative"
                      style={{ width: `${100 / barbers.length}%` }}
                    >
                      <div 
                        onClick={() => setSelectedBarber(barber.id)}
                        className={`bg-white rounded-xl shadow-md overflow-hidden w-full max-w-sm cursor-pointer transition-all duration-300 h-full relative
                          ${selectedBarber === barber.id ? 'ring-2 ring-black scale-[1.02]' : 'hover:shadow-lg'}`}
                      >
                        {selectedBarber === barber.id && (
                          <div className="absolute top-4 right-4 z-10 bg-black text-white rounded-full p-1">
                            <FaCheck size={16} />
                          </div>
                        )}
                        
                        {/* Image Container */}
                        <div className="relative h-80 w-full">
                          <Image
                            src={barber.image}
                            alt={barber.name}
                            fill
                            className="object-cover object-top"
                          />
                        </div>

                        {/* Content Container */}
                        <div className="p-6">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            {barber.name}
                          </h3>
                          <p className="text-indigo-600 font-semibold mb-4">{barber.role}</p>
                          
                          {/* Qualifications */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Qualifications</h4>
                            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                              {barber.qualifications.map((qual, idx) => (
                                <li key={idx}>{qual}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Specialties */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Specialties</h4>
                            <p className="text-gray-600 text-sm">{barber.specialties}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Pagination Dots */}
              <div className="flex justify-center mt-4 gap-2">
                {barbers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlideChange(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 
                      ${index === sliderIndex ? 'bg-black w-4' : 'bg-gray-300'}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Step 2: Select Date */}
          {selectedBarber && (
            <section className="flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">2. Choose a Date</h2>
              <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
                <Calendar
                  // @ts-expect-error - Calendar's onChange type is complex
                  onChange={handleDateSelect}
                  value={selectedDate}
                  minDate={new Date()}
                  className="mx-auto"
                  next2Label={null}
                  prev2Label={null}
                  showNeighboringMonth={false}
                  tileDisabled={({ date }) => date.getDay() === 0} // Disable Sundays
                />
                {selectedDate && (
                  <div className="mt-4 text-center text-gray-600">
                    Selected Date: {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Step 3: Select Time */}
          {selectedDate && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">3. Choose a Time</h2>
              
              {isLoadingTimeSlots ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
                  <p className="ml-3 text-gray-600">Loading available time slots...</p>
                </div>
              ) : availableTimeSlots.length === 0 ? (
                <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-100 p-4 max-w-md mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-medium text-yellow-800 mb-2">No Available Times</h3>
                  <p className="text-yellow-700">All appointment slots are booked for this date. Please select another date or check back later.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-md text-center transition-colors duration-300
                        ${selectedTime === time
                          ? 'bg-black text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Booking Button */}
          {selectedTime && (
            <div className="flex flex-col items-center mt-8 space-y-4">
              <p className="text-lg text-gray-700">
                You are booking with{' '}
                <span className="font-semibold">{barbers.find(b => b.id === selectedBarber)?.name}</span>{' '}
                on{' '}
                <span className="font-semibold">
                  {selectedDate?.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>{' '}
                at{' '}
                <span className="font-semibold">{selectedTime}</span>
              </p>
              <button
                className="bg-black text-white px-8 py-4 rounded-md font-semibold hover:bg-gray-800 transition-colors duration-300"
                onClick={() => {
                  const selectedBarberObj = barbers.find(b => b.id === selectedBarber);
                  if (selectedBarberObj && selectedDate) {
                    // Format date as ISO string
                    const dateString = selectedDate.toISOString();
                    
                    // Navigate to customer info page with booking details in URL parameters
                    router.push(`/book/customer-info?barberId=${selectedBarber}&barberName=${encodeURIComponent(selectedBarberObj.name)}&date=${encodeURIComponent(dateString)}&time=${encodeURIComponent(selectedTime)}`);
                  }
                }}
              >
                Continue to Customer Information
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading booking page...</div>}>
      <BookingContent />
    </Suspense>
  );
} 