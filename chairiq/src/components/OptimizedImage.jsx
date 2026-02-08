import React, { useState, useEffect, useRef } from 'react';
import { 
  getOptimizedImageUrl, 
  generateResponsiveSources,
  lazyLoadOptions,
  getBlurDataUrl,
  preloadImage,
  monitorImagePerformance
} from '../utils/imageOptimization';

/**
 * OptimizedImage Component
 * Implements lazy loading, responsive images, and automatic optimization
 * 
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {string} className - CSS classes
 * @param {Object} style - Inline styles
 * @param {number} width - Display width
 * @param {number} height - Display height
 * @param {string} objectFit - CSS object-fit property
 * @param {boolean} lazy - Enable lazy loading (default: true)
 * @param {boolean} blur - Show blur placeholder (default: true)
 * @param {Function} onLoad - Callback when image loads
 * @param {Function} onError - Callback when image fails
 * @param {Object} optimizationOptions - Image optimization options
 */
const OptimizedImage = ({
  src,
  alt = '',
  className = '',
  style = {},
  width = null,
  height = null,
  objectFit = 'cover',
  lazy = true,
  blur = true,
  onLoad,
  onError,
  optimizationOptions = {},
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState('');
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Generate optimized image URL
  useEffect(() => {
    if (!src) return;

    const options = {
      width,
      height,
      quality: 80,
      format: 'webp',
      ...optimizationOptions
    };

    const optimized = getOptimizedImageUrl(src, options);
    setOptimizedSrc(optimized);
  }, [src, width, height, optimizationOptions]);

  // Setup Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !imgRef?.current) return;

    observerRef.current = new IntersectionObserver((entries) => {
      entries?.forEach((entry) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observerRef?.current?.disconnect();
        }
      });
    }, lazyLoadOptions);

    observerRef?.current?.observe(imgRef?.current);

    return () => {
      if (observerRef?.current) {
        observerRef?.current?.disconnect();
      }
    };
  }, [lazy]);

  // Preload image when in view
  useEffect(() => {
    if (!isInView || !optimizedSrc) return;

    let mounted = true;

    const loadImage = async () => {
      try {
        await preloadImage(optimizedSrc);
        if (mounted) {
          setIsLoaded(true);
          monitorImagePerformance(optimizedSrc, alt || 'unnamed-image');
        }
      } catch (error) {
        if (mounted) {
          setHasError(true);
          console.error('[IMAGE LOAD ERROR]', error);
        }
      }
    };

    loadImage();

    return () => {
      mounted = false;
    };
  }, [isInView, optimizedSrc, alt]);

  const handleImageLoad = (e) => {
    setIsLoaded(true);
    setHasError(false);
    if (onLoad) onLoad(e);
  };

  const handleImageError = (e) => {
    setHasError(true);
    setIsLoaded(false);
    if (onError) onError(e);
    console.error('[IMAGE ERROR]', { src: optimizedSrc, alt });
  };

  // Generate blur placeholder
  const blurDataUrl = blur ? getBlurDataUrl() : '';

  // Generate responsive sources for srcset
  const { srcset, sizes } = generateResponsiveSources(src);

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        ...style
      }}
    >
      {/* Blur placeholder */}
      {blur && !isLoaded && !hasError && (
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            backgroundImage: `url(${blurDataUrl})`,
            backgroundSize: 'cover',
            filter: 'blur(20px)',
            opacity: isInView ? 0.5 : 1
          }}
        />
      )}

      {/* Loading skeleton */}
      {isInView && !isLoaded && !hasError && (
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
      )}

      {/* Actual image */}
      {isInView && !hasError && (
        <img
          src={optimizedSrc}
          srcSet={srcset}
          sizes={sizes}
          alt={alt}
          className={`w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            objectFit,
            position: 'absolute',
            top: 0,
            left: 0
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          {...props}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
        >
          <div className="text-center p-4">
            <svg
              className="mx-auto mb-2"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              style={{ color: '#ef4444' }}
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
              <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" />
            </svg>
            <p className="text-xs" style={{ color: '#fca5a5' }}>
              Image failed to load
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;