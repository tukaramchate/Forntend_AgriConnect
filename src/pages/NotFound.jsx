import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-extrabold text-primary-600 mb-4">404</h1>
      <p className="text-2xl text-secondary-900 mb-6">Oops! Page not found.</p>
      <p className="text-lg text-secondary-700 mb-8 text-center">
        The page you're looking for might have been removed or is temporarily unavailable.
      </p>
      <Link to="/" className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
