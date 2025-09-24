import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrency, useDate } from '../utils/localization';
import LanguageSwitcher from '../components/LanguageSwitcher';
import './I18nDemo.css';

const I18nDemo = () => {
  const { t } = useTranslation();
  const { formatCurrency, formatNumber, currencySymbol } = useCurrency();
  const { formatDate, formatTime, formatRelativeTime } = useDate();

  const sampleData = {
    price: 1250.75,
    quantity: 1000000,
    date: new Date('2024-01-15'),
    time: new Date(),
    relativeDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  };

  return (
    <div className='i18n-demo'>
      <div className='i18n-demo-header'>
        <h1>{t('demo.title', 'Internationalization Demo')}</h1>
        <LanguageSwitcher />
      </div>

      <div className='i18n-demo-content'>
        {/* Basic Text Translation */}
        <section className='demo-section'>
          <h2>{t('demo.basicText.title', 'Basic Text Translation')}</h2>
          <div className='demo-grid'>
            <div className='demo-item'>
              <label>{t('demo.basicText.welcome')}</label>
              <span>{t('common.welcome')}</span>
            </div>
            <div className='demo-item'>
              <label>{t('demo.basicText.navigation')}</label>
              <span>
                {t('navigation.home')} | {t('navigation.products')} |{' '}
                {t('navigation.about')}
              </span>
            </div>
          </div>
        </section>

        {/* Currency Formatting */}
        <section className='demo-section'>
          <h2>{t('demo.currency.title', 'Currency Formatting')}</h2>
          <div className='demo-grid'>
            <div className='demo-item'>
              <label>{t('demo.currency.simple')}</label>
              <span>{formatCurrency(sampleData.price)}</span>
            </div>
            <div className='demo-item'>
              <label>{t('demo.currency.symbol')}</label>
              <span>{currencySymbol}</span>
            </div>
            <div className='demo-item'>
              <label>{t('demo.currency.large')}</label>
              <span>{formatCurrency(sampleData.quantity)}</span>
            </div>
          </div>
        </section>

        {/* Number Formatting */}
        <section className='demo-section'>
          <h2>{t('demo.numbers.title', 'Number Formatting')}</h2>
          <div className='demo-grid'>
            <div className='demo-item'>
              <label>{t('demo.numbers.decimal')}</label>
              <span>
                {formatNumber(sampleData.price, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className='demo-item'>
              <label>{t('demo.numbers.integer')}</label>
              <span>{formatNumber(sampleData.quantity)}</span>
            </div>
            <div className='demo-item'>
              <label>{t('demo.numbers.percentage')}</label>
              <span>{formatNumber(0.15, { style: 'percent' })}</span>
            </div>
          </div>
        </section>

        {/* Date & Time Formatting */}
        <section className='demo-section'>
          <h2>{t('demo.datetime.title', 'Date & Time Formatting')}</h2>
          <div className='demo-grid'>
            <div className='demo-item'>
              <label>{t('demo.datetime.date')}</label>
              <span>{formatDate(sampleData.date)}</span>
            </div>
            <div className='demo-item'>
              <label>{t('demo.datetime.time')}</label>
              <span>{formatTime(sampleData.time)}</span>
            </div>
            <div className='demo-item'>
              <label>{t('demo.datetime.relative')}</label>
              <span>{formatRelativeTime(sampleData.relativeDate)}</span>
            </div>
          </div>
        </section>

        {/* E-commerce Context */}
        <section className='demo-section'>
          <h2>{t('demo.ecommerce.title', 'E-commerce Context')}</h2>
          <div className='demo-card'>
            <h3>{t('products.title')}</h3>
            <div className='product-demo'>
              <div className='product-info'>
                <span className='product-name'>
                  {t('demo.ecommerce.productName', 'Organic Tomatoes')}
                </span>
                <span className='product-price'>
                  {formatCurrency(45)} / {t('demo.ecommerce.unit', 'kg')}
                </span>
              </div>
              <div className='product-actions'>
                <button className='btn-primary'>
                  {t('products.addToCart')}
                </button>
                <button className='btn-secondary'>
                  {t('products.addToWishlist')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pluralization */}
        <section className='demo-section'>
          <h2>{t('demo.pluralization.title', 'Pluralization')}</h2>
          <div className='demo-grid'>
            <div className='demo-item'>
              <label>{t('demo.pluralization.one')}</label>
              <span>{t('cart.itemsInCart', { count: 1 })}</span>
            </div>
            <div className='demo-item'>
              <label>{t('demo.pluralization.many')}</label>
              <span>{t('cart.itemsInCart', { count: 5 })}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default I18nDemo;
