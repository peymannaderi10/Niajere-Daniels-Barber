'use client';
import Image from 'next/image';
import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa6';
import Link from 'next/link';

const barbers = [
  {
    id: 1,
    name: 'Niajere Daniels',
    role: 'Master Barber & Owner',
    image: '/niajere.jpg', // You'll need to add this image
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
  // Add more barbers here as needed
];

const Team = () => {
  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert barbers committed to delivering excellence in every cut
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {barbers.map((barber, index) => (
            <div
              key={barber.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full max-w-sm flex-shrink-0"
            >
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

                {/* Bio */}
                <p className="text-gray-600 text-sm mb-6">{barber.bio}</p>

                {/* Social Links */}
                <div className="flex space-x-4">
                  <a
                    href={barber.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-300"
                  >
                    <FaInstagram size={20} />
                  </a>
                  <a
                    href={barber.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-300"
                  >
                    <FaFacebook size={20} />
                  </a>
                  <a
                    href={barber.social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-300"
                  >
                    <FaTiktok size={20} />
                  </a>
                </div>
              </div>

              {/* Book Now Button */}
              <div className="px-6 pb-6">
                <Link
                  href={`/book?barber=${barber.id}`}
                  className="block w-full text-center bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors duration-300"
                >
                  Book with {barber.name.split(' ')[0]}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team; 