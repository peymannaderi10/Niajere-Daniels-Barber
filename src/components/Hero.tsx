import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="relative h-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.jpg"
          alt="Barber shop interior"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to<br />
            <span className="text-3xl sm:text-4xl md:text-5xl">Niajere Daniels Barber</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl">
            Where precision meets style. Experience exceptional grooming services
            tailored to enhance your unique look.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
            <Link
              href="/book"
              className="bg-white text-black px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Book Appointment
            </Link>
            <Link
              href="#services"
              className="border-2 border-white text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-white/10 transition-colors duration-300"
            >
              View Services
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Hero; 