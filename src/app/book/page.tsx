'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { FaInstagram, FaFacebook, FaTiktok, FaCheck } from 'react-icons/fa6';
import Calendar, { Value } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Temporary data (will come from database later)
const barbers = [
  {
    id: 1,
    name: 'Niajere Daniels',
    role: 'Master Barber & Owner',
    image: '/niajere.jpg',
    qualifications: [
      'Licensed Master Barber',
      'Precision Cutting Specialist',
      '10+ Years Experience'
    ],
    specialties: 'Fades, Design Work, Beard Sculpting',
    bio: 'With over a decade of experience, Niajere brings unparalleled expertise and artistry to every cut.',
    social: {
      instagram: '#',
      facebook: '#',
      tiktok: '#'
    }
  },
  // Add more barbers as needed
];

// Temporary time slots (will come from database later)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 19; hour++) {
    for (let minute of ['00', '30']) {
      if (hour === 19 && minute === '30') continue;
      slots.push(`${hour}:${minute}`);
    }
  }
  return slots;
};

export default function BookingPage() {
  const searchParams = useSearchParams();
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Handle pre-selected barber from URL
  useEffect(() => {
    const barberId = searchParams.get('barber');
    if (barberId) {
      const id = parseInt(barberId);
      if (barbers.some(barber => barber.id === id)) {
        setSelectedBarber(id);
      }
    }
  }, [searchParams]);

  const handleDateSelect = (value: Date | Date[]) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      setSelectedTime(null);
    }
  };

  const timeSlots = generateTimeSlots();

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
            <div className="flex flex-wrap justify-center gap-8">
              {barbers.map((barber) => (
                <div
                  key={barber.id}
                  onClick={() => setSelectedBarber(barber.id)}
                  className={`relative bg-white rounded-xl shadow-md overflow-hidden w-full max-w-sm cursor-pointer transition-all duration-300 
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
                      className="object-cover"
                    />
                  </div>

                  {/* Content Container */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
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
              ))}
            </div>
          </section>

          {/* Step 2: Select Date */}
          {selectedBarber && (
            <section className="flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">2. Choose a Date</h2>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <Calendar
                  onChange={handleDateSelect}
                  value={selectedDate}
                  minDate={new Date()}
                  className="border-0"
                />
              </div>
            </section>
          )}

          {/* Step 3: Select Time */}
          {selectedDate && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">3. Choose a Time</h2>
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
            </section>
          )}

          {/* Booking Button */}
          {selectedTime && (
            <div className="flex justify-center mt-8">
              <button
                className="bg-black text-white px-8 py-4 rounded-md font-semibold hover:bg-gray-800 transition-colors duration-300"
                onClick={() => {
                  // Here you would typically handle the booking submission
                  alert('Booking functionality will be implemented when database is ready');
                }}
              >
                Confirm Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 