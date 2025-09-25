import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';
import LanguageSwitcher from '../layout/LanguageSwitcher';

export default function Header({
  cartCount = 0,
  wishlistCount = 0,
  onSearch = () => {},
}) {
  const { t } = useTranslation();

  return (
    <header className='w-full' role='banner'>
      <div
        className='w-full bg-secondary-50 text-secondary-900 text-sm border-b'
        aria-hidden='true'
      >
        <div className='max-w-6xl mx-auto flex items-center justify-between py-2 px-4'>
          <div className='text-secondary-700'>
            {t(
              'common.freeDelivery',
              'Free delivery for orders over ₹500 • Fresh from local farms'
            )}
          </div>
          <nav className='flex items-center gap-4' aria-label='utility'>
            <LanguageSwitcher />
            <a className='hover:text-primary-700' href='/help'>
              {t('common.help')}
            </a>
            <a className='hover:text-primary-700' href='/contact'>
              {t('common.contact')}
            </a>
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
