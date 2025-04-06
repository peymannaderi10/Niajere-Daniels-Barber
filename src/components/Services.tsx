import { FaScissors, FaUserPen, FaSprayCanSparkles, FaChildren } from 'react-icons/fa6';
import Link from 'next/link';

const services = [
  {
    title: 'Classic Haircut',
    price: '$55',
    description: 'Precision cut tailored to your style, includes hot towel and styling',
    icon: FaScissors,
    duration: '45 min',
  },
  {
    title: 'Beard Trim & Shape',
    price: '$35',
    description: 'Expert beard grooming with precise trimming and shaping',
    icon: FaUserPen,
    duration: '30 min',
  },
  {
    title: 'Hair & Beard Combo',
    price: '$60',
    description: 'Complete grooming package with haircut and beard service',
    icon: FaSprayCanSparkles,
    duration: '1 hour',
  },
  {
    title: "Kids' Cut",
    price: '$25',
    description: 'Gentle and patient service for our younger gentlemen',
    icon: FaChildren,
    duration: '30 min',
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional grooming services tailored to enhance your unique style
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-black mb-4">
                <service.icon size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-2xl font-bold text-black mb-2">{service.price}</p>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <p className="text-sm text-gray-900">Duration: {service.duration}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/book"
            className="inline-block bg-black text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
          >
            Book Your Service
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services; 