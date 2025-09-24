import { useTranslation } from 'react-i18next';

// Currency mappings by language/region
const currencyMappings = {
  en: { currency: 'INR', locale: 'en-IN' },
  hi: { currency: 'INR', locale: 'hi-IN' },
  te: { currency: 'INR', locale: 'te-IN' },
  mr: { currency: 'INR', locale: 'mr-IN' },
};

// Regional settings
const regionalSettings = {
  'en-IN': {
    currency: 'INR',
    currencySymbol: '₹',
    numberFormat: 'en-IN',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12-hour',
  },
  'hi-IN': {
    currency: 'INR',
    currencySymbol: '₹',
    numberFormat: 'hi-IN',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12-hour',
  },
  'te-IN': {
    currency: 'INR',
    currencySymbol: '₹',
    numberFormat: 'te-IN',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12-hour',
  },
  'mr-IN': {
    currency: 'INR',
    currencySymbol: '₹',
    numberFormat: 'mr-IN',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12-hour',
  },
};

// Custom hook for currency formatting
export const useCurrency = () => {
  const { i18n } = useTranslation();

  const getCurrentRegion = () => {
    const mapping = currencyMappings[i18n.language] || currencyMappings.en;
    return regionalSettings[mapping.locale];
  };

  const formatCurrency = (amount, options = {}) => {
    const region = getCurrentRegion();
    const {
      currency = region.currency,
      locale = region.numberFormat,
      minimumFractionDigits = 2,
      maximumFractionDigits = 2,
    } = options;

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits,
        maximumFractionDigits,
        ...options,
      }).format(amount);
    } catch {
      // Fallback to simple formatting
      return `${region.currencySymbol}${amount.toLocaleString(locale)}`;
    }
  };

  const formatNumber = (number, options = {}) => {
    const region = getCurrentRegion();
    const locale = options.locale || region.numberFormat;

    try {
      return new Intl.NumberFormat(locale, options).format(number);
    } catch {
      return number.toLocaleString();
    }
  };

  const formatPrice = (price, options = {}) => {
    // Indian numbering system formatting
    if (
      i18n.language.includes('hi') ||
      i18n.language.includes('te') ||
      i18n.language.includes('mr')
    ) {
      return formatIndianCurrency(price, options);
    }
    return formatCurrency(price, options);
  };

  return {
    formatCurrency,
    formatNumber,
    formatPrice,
    getCurrentRegion,
    currencySymbol: getCurrentRegion().currencySymbol,
  };
};

// Indian currency formatting (Lakhs, Crores)
const formatIndianCurrency = (amount, options = {}) => {
  const { showFullForm = false } = options;

  if (amount >= 10000000) {
    // 1 Crore
    const crores = (amount / 10000000).toFixed(2);
    return showFullForm ? `₹${crores} करोड़` : `₹${crores}Cr`;
  } else if (amount >= 100000) {
    // 1 Lakh
    const lakhs = (amount / 100000).toFixed(2);
    return showFullForm ? `₹${lakhs} लाख` : `₹${lakhs}L`;
  } else if (amount >= 1000) {
    // 1 Thousand
    const thousands = (amount / 1000).toFixed(1);
    return `₹${thousands}K`;
  }

  return `₹${amount.toLocaleString('en-IN')}`;
};

// Date formatting based on locale
export const useDate = () => {
  const { i18n } = useTranslation();

  const formatDate = (date, options = {}) => {
    const mapping = currencyMappings[i18n.language] || currencyMappings.en;
    const locale = mapping.locale;

    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    };

    try {
      return new Intl.DateTimeFormat(locale, defaultOptions).format(
        new Date(date)
      );
    } catch {
      return new Date(date).toLocaleDateString();
    }
  };

  const formatTime = (date, options = {}) => {
    const mapping = currencyMappings[i18n.language] || currencyMappings.en;
    const locale = mapping.locale;

    const defaultOptions = {
      hour: '2-digit',
      minute: '2-digit',
      ...options,
    };

    try {
      return new Intl.DateTimeFormat(locale, defaultOptions).format(
        new Date(date)
      );
    } catch {
      return new Date(date).toLocaleTimeString();
    }
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now - targetDate) / 1000);

    const mapping = currencyMappings[i18n.language] || currencyMappings.en;
    const locale = mapping.locale;

    try {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

      if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second');
      if (diffInSeconds < 3600)
        return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
      if (diffInSeconds < 86400)
        return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
      return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    } catch {
      // Fallback
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
  };

  return {
    formatDate,
    formatTime,
    formatRelativeTime,
  };
};

export default { useCurrency, useDate };
