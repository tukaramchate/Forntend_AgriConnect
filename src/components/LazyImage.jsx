import React, { useState, useRef, useEffect } from 'react';
import { createLazyLoadObserver } from '../utils/performance';
import './LazyImage.css';

const LazyImage = ({
  src,
  alt,
  placeholder = '/placeholder.jpg',
  className = '',
  sizes = '',
  srcSet = '',
  loading = 'lazy',
  quality = 80,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!imageRef) return;

    // Create intersection observer for lazy loading
    observerRef.current = createLazyLoadObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start loading the actual image
            const img = new Image();
            
            img.onload = () => {
              setImageSrc(src);
              setIsLoaded(true);
              observerRef.current?.unobserve(imageRef);
            };
            
            img.onerror = () => {
              setIsError(true);
              observerRef.current?.unobserve(imageRef);
            };
            
            // Set srcset if provided
            if (srcSet) {
              img.srcset = srcSet;
            }
            
            img.src = src;
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    observerRef.current.observe(imageRef);

    return () => {
      if (observerRef.current && imageRef) {
        observerRef.current.unobserve(imageRef);
      }
    };
  }, [imageRef, src, srcSet]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setIsError(true);
    setImageSrc(placeholder);
  };

  return (
    <div 
      className={`lazy-image-container ${className}`}
      ref={setImageRef}
    >
      <img
        src={imageSrc}
        alt={alt}
        className={`lazy-image ${isLoaded ? 'loaded' : ''} ${isError ? 'error' : ''}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={loading}
        sizes={sizes}
        srcSet={isLoaded ? srcSet : ''}
        {...props}
      />
      
      {!isLoaded && !isError && (
        <div className="lazy-image-skeleton">
          <div className="skeleton-shimmer"></div>
        </div>
      )}
      
      {isError && (
        <div className="lazy-image-error">
          <svg viewBox="0 0 24 24" className="error-icon">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
          <span>Image not available</span>
        </div>
      )}
    </div>
  );
};

// Higher-order component for optimized images
export const withImageOptimization = (WrappedComponent) => {
  return function OptimizedImageComponent(props) {
    // Generate optimized image URLs based on device capabilities
    const generateOptimizedSrc = (src, width, quality = 80) => {
      if (!src || src.startsWith('data:')) return src;
      
      // For Unsplash images, use their optimization parameters
      if (src.includes('unsplash.com')) {
        return `${src}?w=${width}&q=${quality}&auto=format`;
      }
      
      // For other images, you could integrate with services like Cloudinary, ImageKit, etc.
      return src;
    };

    const generateSrcSet = (src, widths = [320, 640, 960, 1280]) => {
      if (!src || src.startsWith('data:')) return '';
      
      return widths
        .map(width => `${generateOptimizedSrc(src, width)} ${width}w`)
        .join(', ');
    };

    const optimizedProps = {
      ...props,
      src: generateOptimizedSrc(props.src, 800),
      srcSet: generateSrcSet(props.src),
      sizes: props.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    };

    return <WrappedComponent {...optimizedProps} />;
  };
};

// Optimized LazyImage with automatic optimization
export const OptimizedLazyImage = withImageOptimization(LazyImage);

// Image preloader utility
export const preloadImages = (urls) => {
  return Promise.all(
    urls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      });
    })
  );
};

// Progressive image loading for hero images
export const ProgressiveImage = ({ 
  lowQualitySrc, 
  highQualitySrc, 
  alt, 
  className = '',
  ...props 
}) => {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc);
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setCurrentSrc(highQualitySrc);
      setIsHighQualityLoaded(true);
    };
    img.src = highQualitySrc;
  }, [highQualitySrc]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={`progressive-image ${className} ${isHighQualityLoaded ? 'high-quality' : 'low-quality'}`}
      {...props}
    />
  );
};

export default LazyImage;