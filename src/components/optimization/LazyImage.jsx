// Simple Lazy Image Component
import React, { useState, useRef, useEffect } from 'react';
import './LazyImage.css';

const LazyImage = ({
  src,
  alt,
  placeholder = '/placeholder.jpg', 
  className = '',
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    setIsError(false);
  };

  const handleError = () => {
    setIsError(true);
    setIsLoaded(false);
  };

  return (
    <div ref={imgRef} className={`lazy-image-container ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`lazy-image ${isLoaded ? 'loaded' : ''} ${isError ? 'error' : ''}`}
        {...props}
      />
    </div>
  );
};

export default LazyImage;