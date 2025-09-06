import React from 'react';
import Navbar from './Navbar';
import './Header.css';

export default function Header({ cartCount = 0, wishlistCount = 0, onSearch = () => {} }) {
  return (
    <header className="ac-site-header" role="banner">
      <div className="ac-topbar" aria-hidden="true">
        <div className="ac-container ac-topbar-inner">
          <div className="ac-topbar-message">Free delivery for orders over ₹500 • Fresh from local farms</div>
          <nav className="ac-topbar-links" aria-label="utility">
            <a href="/help">Help</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>
      </div>

      <Navbar cartCount={cartCount} wishlistCount={wishlistCount} onSearch={onSearch} />
    </header>
  );
}