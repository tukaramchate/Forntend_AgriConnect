import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="ac-not-found">
      <div className="ac-container">
        <div className="ac-not-found__content">
          <div className="ac-not-found__illustration">
            <span className="ac-not-found__emoji" role="img" aria-hidden="true">🌾</span>
            <span className="ac-not-found__404">404</span>
          </div>
          
          <h1 className="ac-not-found__title">Page Not Found</h1>
          <p className="ac-not-found__message">
            We couldn't find the page you're looking for. 
            Let's get you back on track.
          </p>
          
          <div className="ac-not-found__actions">
            <Link to="/" className="ac-btn ac-btn--primary">
              Return Home
            </Link>
            <Link to="/products" className="ac-btn ac-btn--outline">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;