import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/agriconnect',
    icon: (
      <svg
        width='20'
        height='20'
        viewBox='0 0 24 24'
        fill='currentColor'
        aria-hidden='true'
      >
        <path d='M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5.02 3.66 9.18 8.44 9.92v-7.03H8.1v-2.89h2.34V9.41c0-2.32 1.38-3.6 3.5-3.6.99 0 2.03.18 2.03.18v2.23h-1.14c-1.13 0-1.48.7-1.48 1.42v1.71h2.52l-.4 2.89h-2.12v7.03C18.34 21.25 22 17.09 22 12.07z' />
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/agriconnect',
    icon: (
      <svg
        width='20'
        height='20'
        viewBox='0 0 24 24'
        fill='currentColor'
        aria-hidden='true'
      >
        <path d='M22 5.92c-.63.28-1.3.46-2 .54a3.48 3.48 0 0 0 1.53-1.92 6.9 6.9 0 0 1-2.2.85 3.44 3.44 0 0 0-5.86 3.13A9.76 9.76 0 0 1 3.1 4.7a3.44 3.44 0 0 0 1.06 4.6 3.4 3.4 0 0 1-1.56-.43v.04a3.44 3.44 0 0 0 2.76 3.37 3.5 3.5 0 0 1-.9.12c-.22 0-.44-.02-.65-.06a3.44 3.44 0 0 0 3.21 2.39 6.9 6.9 0 0 1-4.28 1.48c-.28 0-.56-.02-.83-.05A9.73 9.73 0 0 0 8.77 20c6.18 0 9.56-5.12 9.56-9.56v-.44A6.83 6.83 0 0 0 22 5.92z' />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/agriconnect',
    icon: (
      <svg
        width='20'
        height='20'
        viewBox='0 0 24 24'
        fill='currentColor'
        aria-hidden='true'
      >
        <path d='M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.5A4.5 4.5 0 1 0 16.5 13 4.5 4.5 0 0 0 12 8.5zm6.5-2.4a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1zM12 10.5A1.5 1.5 0 1 1 10.5 12 1.5 1.5 0 0 1 12 10.5z' />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/agriconnect',
    icon: (
      <svg
        width='20'
        height='20'
        viewBox='0 0 24 24'
        fill='currentColor'
        aria-hidden='true'
      >
        <path d='M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z' />
      </svg>
    ),
  },
];

const quickLinks = [
  { name: 'Products', to: '/products' },
  { name: 'Categories', to: '/categories' },
  { name: 'My Orders', to: '/orders' },
  { name: 'Cart', to: '/cart' },
  { name: 'Wishlist', to: '/wishlist' },
];

const supportLinks = [
  { name: 'Help Center', href: '/help' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'Shipping Info', href: '/shipping' },
  { name: 'Returns', href: '/returns' },
];

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Cookie Policy', href: '/cookies' },
  { name: 'Sitemap', href: '/sitemap' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const isValidEmail = useCallback((v) => {
    return /^\S+@\S+\.\S+$/.test(v);
  }, []);

  const handleSubscribe = useCallback(
    async (e) => {
      e.preventDefault();
      if (!isValidEmail(email)) {
        setStatus({
          type: 'error',
          text: 'Please enter a valid email address.',
        });
        return;
      }

      setIsSubscribing(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setStatus({
          type: 'success',
          text: 'Successfully subscribed! Check your inbox for confirmation.',
        });
        setEmail('');
      } catch {
        setStatus({
          type: 'error',
          text: 'Something went wrong. Please try again.',
        });
      } finally {
        setIsSubscribing(false);
        setTimeout(() => setStatus(null), 5000);
      }
    },
    [email, isValidEmail]
  );

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <footer
      className='bg-gradient-to-br from-secondary-50 to-secondary-100 border-t border-secondary-200 text-secondary-900'
      role='contentinfo'
      aria-labelledby='footer-heading'
    >
      {/* Main Footer Content */}
      <div className='max-w-7xl mx-auto px-4 py-12 lg:py-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12'>
          {/* Brand Section */}
          <div className='lg:col-span-1'>
            <div className='flex items-center gap-3 mb-4' id='footer-heading'>
              {logo ? (
                <img
                  src={logo}
                  alt='AgriConnect Logo'
                  className='w-12 h-12 object-contain rounded-lg shadow-sm'
                />
              ) : (
                <div className='w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center'>
                  <span className='text-white font-bold text-xl'>A</span>
                </div>
              )}
              <div>
                <h2 className='font-bold text-xl text-secondary-900'>
                  AgriConnect
                </h2>
                <p className='text-primary-600 text-sm font-medium'>
                  Connecting farmers to markets
                </p>
              </div>
            </div>

            <p className='text-secondary-700 text-sm mb-6 leading-relaxed'>
              Empowering farmers with direct market access, fair pricing, and
              sustainable agriculture practices. Building a stronger food supply
              chain together.
            </p>

            {/* Social Links */}
            <div className='flex items-center gap-3'>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-secondary-200 text-secondary-600 hover:text-primary-600 hover:border-primary-300 hover:shadow-md transition-all duration-200'
                  aria-label={`Follow us on ${social.name}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='font-semibold text-secondary-900 mb-4'>
              Quick Links
            </h3>
            <nav className='space-y-2' aria-label='Quick navigation'>
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className='block text-secondary-700 hover:text-primary-600 hover:translate-x-1 transition-all duration-200 text-sm py-1'
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div>
            <h3 className='font-semibold text-secondary-900 mb-4'>Support</h3>
            <nav className='space-y-2' aria-label='Support links'>
              {supportLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className='block text-secondary-700 hover:text-primary-600 hover:translate-x-1 transition-all duration-200 text-sm py-1'
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className='font-semibold text-secondary-900 mb-4'>
              Stay Updated
            </h3>
            <p className='text-secondary-700 text-sm mb-4 leading-relaxed'>
              Get the latest updates on new products, seasonal offers, and
              farming tips.
            </p>

            <form onSubmit={handleSubscribe} className='space-y-3'>
              <div className='relative'>
                <input
                  id='newsletter-email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email'
                  className='w-full px-4 py-3 border border-secondary-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-sm'
                  aria-label='Email address for newsletter'
                  disabled={isSubscribing}
                />
              </div>

              <button
                type='submit'
                disabled={isSubscribing || !email}
                className='w-full px-4 py-3 bg-primary-600 text-white rounded-lg font-medium text-sm transition-all duration-200 hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              >
                {isSubscribing ? (
                  <>
                    <svg
                      className='w-4 h-4 animate-spin'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      />
                    </svg>
                    Subscribing...
                  </>
                ) : (
                  <>
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                      />
                    </svg>
                    Subscribe
                  </>
                )}
              </button>

              {status && (
                <div
                  className={`text-sm p-2 rounded-lg ${
                    status.type === 'error'
                      ? 'text-red-800 bg-red-50 border border-red-200'
                      : 'text-green-800 bg-green-50 border border-green-200'
                  }`}
                  role='alert'
                  aria-live='polite'
                >
                  {status.text}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className='border-t border-secondary-200 bg-secondary-50/50'>
        <div className='max-w-7xl mx-auto px-4 py-6'>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
            {/* Copyright */}
            <div className='text-secondary-600 text-sm order-2 sm:order-1'>
              © {year} AgriConnect. All rights reserved. Built with ❤️ by{' '}
              <a
                href='https://github.com/tukaramchate'
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary-600 hover:text-primary-700 font-medium transition-colors'
              >
                Tukaram Chate
              </a>
            </div>

            {/* Legal Links & Back to Top */}
            <div className='flex items-center gap-6 order-1 sm:order-2'>
              <div className='flex items-center gap-4'>
                {legalLinks.map((link, index) => (
                  <React.Fragment key={link.name}>
                    <a
                      href={link.href}
                      className='text-secondary-600 hover:text-primary-600 text-sm transition-colors duration-200'
                    >
                      {link.name}
                    </a>
                    {index < legalLinks.length - 1 && (
                      <span className='text-secondary-400'>•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <button
                onClick={scrollToTop}
                className='inline-flex items-center gap-2 px-4 py-2 bg-white border border-secondary-200 rounded-lg text-secondary-700 text-sm font-medium transition-all duration-200 hover:bg-secondary-50 hover:border-secondary-300 hover:shadow-sm focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                aria-label='Scroll back to top'
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 10l7-7m0 0l7 7m-7-7v18'
                  />
                </svg>
                Back to Top
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
