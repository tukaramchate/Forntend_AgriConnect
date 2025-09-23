import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';

// Tailwind-only styling

// Lazy load components that might not be visible on initial render
const TeamSection = lazy(() => import('../components/about/TeamSection'));
const TimelineSection = lazy(
  () => import('../components/about/TimelineSection')
);
const TestimonialsSection = lazy(
  () => import('../components/about/TestimonialsSection')
);

function About() {
  return (
    <div className='min-h-screen bg-secondary-50'>
      {/* Header Section */}
      <header className='bg-primary-600 text-white py-16'>
        <div className='container mx-auto text-center'>
          <h1 className='text-5xl font-bold mb-4'>About AgriConnect</h1>
          <p className='text-xl'>
            Connecting farmers with communities for a healthier earth.
          </p>
        </div>
      </header>

      {/* Our Vision Section */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <h2 className='text-4xl font-bold text-center mb-8'>Our Vision</h2>
          <p className='max-w-2xl mx-auto text-center text-lg text-secondary-700'>
            We envision a world where every community has direct access to
            fresh, organic produce from local farmers, fostering sustainability
            and mutual growth.
          </p>
        </div>
      </section>

      {/* Our Team Section */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <h2 className='text-4xl font-bold text-center mb-12'>
            Meet Our Team
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
            <div className='bg-secondary-50 p-6 rounded-lg shadow'>
              <img
                src='/assets/team1.jpg'
                alt='John Doe'
                className='w-24 h-24 rounded-full mx-auto mb-4'
              />
              <h3 className='text-2xl font-semibold text-center'>John Doe</h3>
              <p className='text-center text-secondary-600'>Founder & CEO</p>
            </div>
            <div className='bg-secondary-50 p-6 rounded-lg shadow'>
              <img
                src='/assets/team2.jpg'
                alt='Jane Smith'
                className='w-24 h-24 rounded-full mx-auto mb-4'
              />
              <h3 className='text-2xl font-semibold text-center'>Jane Smith</h3>
              <p className='text-center text-secondary-600'>
                Operations Director
              </p>
            </div>
            <div className='bg-secondary-50 p-6 rounded-lg shadow'>
              <img
                src='/assets/team3.jpg'
                alt='Emily Johnson'
                className='w-24 h-24 rounded-full mx-auto mb-4'
              />
              <h3 className='text-2xl font-semibold text-center'>
                Emily Johnson
              </h3>
              <p className='text-center text-secondary-600'>CTO</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <h2 className='text-4xl font-bold text-center mb-12'>Testimonials</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='bg-white p-8 rounded-lg shadow'>
              <p className='italic text-secondary-700'>
                "AgriConnect has transformed our access to fresh produce. Highly
                recommended!"
              </p>
              <p className='mt-4 font-semibold text-secondary-900'>
                - Alex Brown
              </p>
            </div>
            <div className='bg-white p-8 rounded-lg shadow'>
              <p className='italic text-secondary-700'>
                "A revolutionary platform connecting communities with local
                farmers effectively."
              </p>
              <p className='mt-4 font-semibold text-secondary-900'>
                - Maria Garcia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className='bg-secondary-900 text-white py-8'>
        <div className='container mx-auto text-center'>
          <p className='text-lg'>© 2025 AgriConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default About;
