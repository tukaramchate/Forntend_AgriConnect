import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// RTL languages (Right-to-Left)
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

// Languages that might need special font handling
const FONT_FAMILIES = {
  en: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  hi: 'Noto Sans Devanagari, Inter, system-ui, sans-serif',
  te: 'Noto Sans Telugu, Inter, system-ui, sans-serif',
  mr: 'Noto Sans Devanagari, Inter, system-ui, sans-serif',
  ar: 'Noto Sans Arabic, Inter, system-ui, sans-serif',
  default: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
};

const LocalizedLayout = ({ children }) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const isRTL = RTL_LANGUAGES.includes(currentLanguage);

  useEffect(() => {
    // Set document direction
    document.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

    // Set language attribute
    document.documentElement.lang = currentLanguage;

    // Set font family based on language
    const fontFamily = FONT_FAMILIES[currentLanguage] || FONT_FAMILIES.default;
    document.documentElement.style.setProperty('--font-family', fontFamily);

    // Add language-specific class to body for CSS targeting
    document.body.className = document.body.className.replace(
      /\blang-\w+\b/g,
      ''
    );
    document.body.classList.add(`lang-${currentLanguage}`);

    // Add RTL class if needed
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [currentLanguage, isRTL]);

  return (
    <div
      className={`localized-layout ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {children}
    </div>
  );
};

export default LocalizedLayout;
