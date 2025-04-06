'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaFacebook, FaTiktok, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

const barbers = [
  {
    id: 1,
    name: 'Niajere Daniels',
    role: 'Master Barber & Owner',
    image: '/niajere.jpg',
    bio: 'With over a decade of experience, Niajere brings unparalleled expertise and artistry to every cut.',
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
    bio: 'David is known for his innovative approach to textured hair and contemporary styling techniques.',
    social: {
      instagram: '#',
      facebook: '#',
      tiktok: '#'
    }
  }
];

export default function Team() {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [showSlider, setShowSlider] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  useEffect(() => {
    const checkWidth = () => {
      // Show slider if screen width is less than 1024px (lg breakpoint)
      const isMobile = window.innerWidth < 1024;
      setShowSlider(isMobile);
      
      // Show 1 item on mobile screens
      setItemsPerPage(1);
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const handleNext = () => {
    if (sliderIndex + itemsPerPage < barbers.length) {
      setSliderIndex(prev => prev + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (sliderIndex > 0) {
      setSliderIndex(prev => prev - itemsPerPage);
    }
  };

  return (
    <section id="team" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our experienced barbers are dedicated to providing you with the perfect cut and grooming experience.
          </p>
        </div>

        <div className="relative px-4">
          {showSlider && (
            <>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                <button
                  onClick={handlePrev}
                  disabled={sliderIndex === 0}
                  className={`p-2 rounded-full bg-black text-white shadow-lg ${sliderIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                  aria-label="Previous barber"
                >
                  <FaChevronLeft size={20} />
                </button>
              </div>
              
              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
                <button
                  onClick={handleNext}
                  disabled={sliderIndex + itemsPerPage >= barbers.length}
                  className={`p-2 rounded-full bg-black text-white shadow-lg ${sliderIndex + itemsPerPage >= barbers.length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                  aria-label="Next barber"
                >
                  <FaChevronRight size={20} />
                </button>
              </div>
            </>
          )}
          
          <div className={`grid ${showSlider ? '' : 'lg:grid-cols-3'} gap-8`}>
            {(showSlider ? barbers.slice(sliderIndex, sliderIndex + itemsPerPage) : barbers).map((barber) => (
              <div
                key={barber.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                <div className="relative h-80 w-full">
                  <Image
                    src={barber.image}
                    alt={barber.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{barber.name}</h3>
                  <p className="text-indigo-600 font-semibold mb-4">{barber.role}</p>
                  <p className="text-gray-600 mb-6">{barber.bio}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4">
                      <a href={barber.social.instagram} className="text-gray-400 hover:text-black transition-colors">
                        <FaInstagram size={20} />
                      </a>
                      <a href={barber.social.facebook} className="text-gray-400 hover:text-black transition-colors">
                        <FaFacebook size={20} />
                      </a>
                      <a href={barber.social.tiktok} className="text-gray-400 hover:text-black transition-colors">
                        <FaTiktok size={20} />
                      </a>
                    </div>
                    <Link
                      href={`/book?barber=${barber.id}`}
                      className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
                    >
                      Book with {barber.name.split(' ')[0]}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination Indicators */}
          {showSlider && (
            <div className="flex justify-center mt-6 gap-2">
              {barbers.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setSliderIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 
                    ${index === sliderIndex ? 'bg-black w-4' : 'bg-gray-300'}`}
                  aria-label={`Go to barber ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 