import React from 'react';
import '../styles/design-system.css';

const HeroSection = () => {
  return (
    <section className="hero bg-[var(--primary-color)] text-white py-16 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to AgriConnect</h1>
        <p className="text-xl mb-8">Connecting local farmers with the best produce directly to you.</p>
        <button className="bg-[var(--secondary-color)] hover:bg-red-600 text-white font-semibold py-2 px-6 rounded">
          Explore Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
