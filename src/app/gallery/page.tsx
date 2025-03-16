'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa6';

const galleryImages = [
  {
    src: '/gallery/cut1.jpg',
    alt: 'Classic Fade Haircut'
  },
  {
    src: '/gallery/cut2.jpg',
    alt: 'Modern Textured Cut'
  },
  {
    src: '/gallery/cut3.jpg',
    alt: 'Clean Taper Fade'
  },
  {
    src: '/gallery/cut4.jpg',
    alt: 'Precision Line Up'
  },
  {
    src: '/gallery/cut5.jpg',
    alt: 'Beard Trim and Shape'
  },
  {
    src: '/gallery/cut6.jpg',
    alt: 'Skin Fade with Design'
  }
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-700 hover:text-black transition-colors duration-300"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Gallery Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gallery</h1>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="aspect-square relative rounded-lg overflow-hidden hover:opacity-90 transition-opacity duration-300"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={index < 4} // Load first 4 images immediately
              />
            </div>
          ))}
        </div>

        {/* Book Now CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/book"
            className="inline-block bg-black text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
          >
            Book Your Cut
          </Link>
        </div>
      </div>
    </main>
  );
} 