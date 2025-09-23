import React from 'react';
import Navbar from './Navbar';

export default function Header({
  cartCount = 0,
  wishlistCount = 0,
  onSearch = () => {},
}) {
  return (
    <header className='w-full' role='banner'>
      <div className='w-full bg-secondary-50 text-secondary-900 text-sm border-b' aria-hidden='true'>
        <div className='max-w-6xl mx-auto flex items-center justify-between py-2 px-4'>
          <div className='text-secondary-700'>
            Free delivery for orders over ₹500 • Fresh from local farms
          </div>
          <nav className='flex items-center gap-4' aria-label='utility'>
            <a className='hover:text-primary-700' href='/help'>Help</a>
            <a className='hover:text-primary-700' href='/contact'>Contact</a>
          </nav>
        </div>
      </div>

      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onSearch={onSearch}
      />
    </header>
  );
}
