// SEO optimization utilities and meta tag management

// Default SEO configuration
const defaultSEOConfig = {
  title: 'AgriConnect - Connecting Farmers with Fresh Produce',
  description:
    'AgriConnect is a platform that connects farmers directly with consumers, providing fresh, local produce and supporting sustainable agriculture.',
  keywords:
    'agriculture, farming, fresh produce, local food, sustainable farming, farm to table',
  author: 'AgriConnect Team',
  image: '/assets/logo.png',
  url: window.location.origin,
  siteName: 'AgriConnect',
  type: 'website',
  locale: 'en_US',
  twitterCard: 'summary_large_image',
  twitterSite: '@agriconnect',
  fbAppId: '',
  robots: 'index, follow',
  canonical: window.location.href,
};

// Meta tag manager
export class MetaTagManager {
  constructor() {
    this.defaultConfig = { ...defaultSEOConfig };
  }

  // Set page-specific SEO data
  setSEOData(seoData = {}) {
    const seo = { ...this.defaultConfig, ...seoData };

    // Update document title
    document.title = seo.title;

    // Update meta tags
    this.updateMetaTag('description', seo.description);
    this.updateMetaTag('keywords', seo.keywords);
    this.updateMetaTag('author', seo.author);
    this.updateMetaTag('robots', seo.robots);

    // Update canonical link
    this.updateLinkTag('canonical', seo.canonical);

    // Update Open Graph tags
    this.updateMetaProperty('og:title', seo.title);
    this.updateMetaProperty('og:description', seo.description);
    this.updateMetaProperty('og:image', seo.image);
    this.updateMetaProperty('og:url', seo.url);
    this.updateMetaProperty('og:site_name', seo.siteName);
    this.updateMetaProperty('og:type', seo.type);
    this.updateMetaProperty('og:locale', seo.locale);

    // Update Twitter Card tags
    this.updateMetaName('twitter:card', seo.twitterCard);
    this.updateMetaName('twitter:title', seo.title);
    this.updateMetaName('twitter:description', seo.description);
    this.updateMetaName('twitter:image', seo.image);
    if (seo.twitterSite) {
      this.updateMetaName('twitter:site', seo.twitterSite);
    }

    // Update Facebook App ID
    if (seo.fbAppId) {
      this.updateMetaProperty('fb:app_id', seo.fbAppId);
    }

    return seo;
  }

  // Update or create meta tag with name attribute
  updateMetaTag(name, content) {
    if (!content) return;

    let metaTag = document.querySelector(`meta[name="${name}"]`);
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = name;
      document.head.appendChild(metaTag);
    }
    metaTag.content = content;
  }

  // Update or create meta tag with property attribute (Open Graph)
  updateMetaProperty(property, content) {
    if (!content) return;

    let metaTag = document.querySelector(`meta[property="${property}"]`);
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('property', property);
      document.head.appendChild(metaTag);
    }
    metaTag.content = content;
  }

  // Update or create meta tag with name attribute (Twitter)
  updateMetaName(name, content) {
    if (!content) return;

    let metaTag = document.querySelector(`meta[name="${name}"]`);
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = name;
      document.head.appendChild(metaTag);
    }
    metaTag.content = content;
  }

  // Update or create link tag
  updateLinkTag(rel, href) {
    if (!href) return;

    let linkTag = document.querySelector(`link[rel="${rel}"]`);
    if (!linkTag) {
      linkTag = document.createElement('link');
      linkTag.rel = rel;
      document.head.appendChild(linkTag);
    }
    linkTag.href = href;
  }

  // Add structured data (JSON-LD)
  addStructuredData(data) {
    // Remove existing structured data
    const existingScript = document.querySelector(
      'script[type="application/ld+json"]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  // Reset to default SEO
  resetSEO() {
    this.setSEOData(this.defaultConfig);
  }
}

// Global meta tag manager instance
export const metaManager = new MetaTagManager();

// SEO data for different pages
export const seoData = {
  home: {
    title: 'AgriConnect - Fresh Local Produce Direct from Farmers',
    description:
      'Discover fresh, locally grown produce directly from farmers. Support sustainable agriculture and enjoy farm-to-table quality with AgriConnect.',
    keywords:
      'local produce, fresh vegetables, farmers market, sustainable farming, organic food, farm to table',
    type: 'website',
  },

  products: {
    title: 'Fresh Produce - AgriConnect Marketplace',
    description:
      'Browse our wide selection of fresh, locally grown produce. From seasonal vegetables to organic fruits, find quality products from local farmers.',
    keywords:
      'fresh produce, vegetables, fruits, organic food, local farmers, seasonal produce',
    type: 'website',
  },

  about: {
    title: 'About AgriConnect - Supporting Local Agriculture',
    description:
      "Learn about AgriConnect's mission to connect farmers with consumers, promoting sustainable agriculture and supporting local communities.",
    keywords:
      'about agriconnect, sustainable agriculture, local farming, community support, farm to table mission',
    type: 'website',
  },

  login: {
    title: 'Login - AgriConnect',
    description:
      'Access your AgriConnect account to discover fresh local produce and connect with farmers in your area.',
    robots: 'noindex, nofollow',
  },

  register: {
    title: 'Join AgriConnect - Connect with Local Farmers',
    description:
      'Create your AgriConnect account and start discovering fresh, local produce from farmers in your community.',
    keywords:
      'join agriconnect, register account, local produce, farmer marketplace',
  },

  cart: {
    title: 'Shopping Cart - AgriConnect',
    description:
      'Review your selected fresh produce and complete your order from local farmers.',
    robots: 'noindex, nofollow',
  },

  checkout: {
    title: 'Checkout - AgriConnect',
    description:
      'Complete your purchase of fresh, local produce from AgriConnect farmers.',
    robots: 'noindex, nofollow',
  },
};

// Generate product-specific SEO data
export const generateProductSEO = (product) => {
  if (!product) return seoData.products;

  return {
    title: `${product.name} - Fresh ${product.category} | AgriConnect`,
    description: `Buy fresh ${product.name} directly from local farmers. ${product.description || ''} Available now on AgriConnect marketplace.`,
    keywords: `${product.name}, ${product.category}, fresh produce, local farmers, ${product.tags?.join(', ') || ''}`,
    image: product.image || defaultSEOConfig.image,
    type: 'product',
    canonical: `${window.location.origin}/products/${product.id}`,
  };
};

// Generate category-specific SEO data
export const generateCategorySEO = (category) => {
  if (!category) return seoData.products;

  return {
    title: `Fresh ${category.name} - Local Produce | AgriConnect`,
    description: `Discover fresh ${category.name.toLowerCase()} from local farmers. Premium quality ${category.name.toLowerCase()} delivered directly from farm to your table.`,
    keywords: `${category.name}, fresh ${category.name.toLowerCase()}, local produce, farmers market, organic ${category.name.toLowerCase()}`,
    canonical: `${window.location.origin}/categories/${category.slug}`,
  };
};

// Structured data generators
export const structuredData = {
  // Organization schema
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AgriConnect',
    description:
      'Platform connecting farmers with consumers for fresh, local produce',
    url: window.location.origin,
    logo: `${window.location.origin}/assets/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-AGRI-CONNECT',
      contactType: 'customer service',
      availableLanguage: ['English'],
    },
    sameAs: [
      'https://facebook.com/agriconnect',
      'https://twitter.com/agriconnect',
      'https://instagram.com/agriconnect',
    ],
  },

  // Website schema
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AgriConnect',
    url: window.location.origin,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${window.location.origin}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },

  // Product schema generator
  generateProduct: (product) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.id,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: product.farmer?.name || 'Local Farmer',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: product.farmer?.name || 'Local Farmer',
      },
    },
    aggregateRating: product.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating.average,
          reviewCount: product.rating.count,
        }
      : undefined,
  }),

  // Breadcrumb schema generator
  generateBreadcrumb: (breadcrumbs) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }),

  // FAQ schema generator
  generateFAQ: (faqs) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }),
};

// Sitemap generator (for development/testing)
export const generateSitemap = (routes = []) => {
  const baseUrl = window.location.origin;
  const defaultRoutes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/products', priority: '0.9', changefreq: 'daily' },
    { path: '/categories', priority: '0.8', changefreq: 'weekly' },
    { path: '/about', priority: '0.7', changefreq: 'monthly' },
  ];

  const allRoutes = [...defaultRoutes, ...routes];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq || 'weekly'}</changefreq>
    <priority>${route.priority || '0.5'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return sitemapXml;
};

// Robots.txt generator
export const generateRobotsTxt = (customRules = []) => {
  const baseUrl = window.location.origin;
  const defaultRules = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    'Disallow: /api/',
    'Disallow: /cart',
    'Disallow: /checkout',
    'Disallow: /login',
    'Disallow: /register',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`,
  ];

  return [...defaultRules, ...customRules].join('\n');
};

// SEO audit utilities
export const seoAudit = {
  // Check if page has basic SEO elements
  checkBasicSEO: () => {
    const results = {
      title: !!document.title && document.title.length > 0,
      description: !!document.querySelector('meta[name="description"]')
        ?.content,
      keywords: !!document.querySelector('meta[name="keywords"]')?.content,
      ogTitle: !!document.querySelector('meta[property="og:title"]')?.content,
      ogDescription: !!document.querySelector('meta[property="og:description"]')
        ?.content,
      ogImage: !!document.querySelector('meta[property="og:image"]')?.content,
      canonical: !!document.querySelector('link[rel="canonical"]')?.href,
      robots: !!document.querySelector('meta[name="robots"]')?.content,
    };

    const passed = Object.values(results).filter(Boolean).length;
    const total = Object.keys(results).length;

    return {
      score: Math.round((passed / total) * 100),
      passed,
      total,
      results,
      recommendations: Object.entries(results)
        .filter(([, value]) => !value)
        .map(([key]) => `Add ${key} meta tag`),
    };
  },

  // Check title length and quality
  checkTitle: () => {
    const title = document.title;
    const length = title.length;

    return {
      title,
      length,
      isOptimal: length >= 30 && length <= 60,
      recommendations: [
        length < 30 ? 'Title is too short (should be 30-60 characters)' : null,
        length > 60 ? 'Title is too long (should be 30-60 characters)' : null,
        !title.includes('AgriConnect') ? 'Consider including brand name' : null,
      ].filter(Boolean),
    };
  },

  // Check description length and quality
  checkDescription: () => {
    const meta = document.querySelector('meta[name="description"]');
    const description = meta?.content || '';
    const length = description.length;

    return {
      description,
      length,
      isOptimal: length >= 120 && length <= 160,
      recommendations: [
        !description ? 'Missing meta description' : null,
        length < 120
          ? 'Description is too short (should be 120-160 characters)'
          : null,
        length > 160
          ? 'Description is too long (should be 120-160 characters)'
          : null,
      ].filter(Boolean),
    };
  },

  // Check heading structure
  checkHeadings: () => {
    const headings = Array.from(
      document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    );
    const h1Count = document.querySelectorAll('h1').length;

    return {
      headings: headings.map((h) => ({
        tag: h.tagName.toLowerCase(),
        text: h.textContent.trim(),
        length: h.textContent.trim().length,
      })),
      h1Count,
      hasH1: h1Count > 0,
      recommendations: [
        h1Count === 0 ? 'Add H1 heading' : null,
        h1Count > 1 ? 'Multiple H1 tags found (should have only one)' : null,
        headings.length === 0 ? 'Add heading structure for better SEO' : null,
      ].filter(Boolean),
    };
  },

  // Run complete SEO audit
  runFullAudit: () => {
    return {
      basic: seoAudit.checkBasicSEO(),
      title: seoAudit.checkTitle(),
      description: seoAudit.checkDescription(),
      headings: seoAudit.checkHeadings(),
      timestamp: new Date().toISOString(),
    };
  },
};

export default {
  MetaTagManager,
  metaManager,
  seoData,
  generateProductSEO,
  generateCategorySEO,
  structuredData,
  generateSitemap,
  generateRobotsTxt,
  seoAudit,
};
