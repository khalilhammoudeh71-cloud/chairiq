/**
 * Image Optimization Utilities
 * Provides lazy loading, compression, and performance optimization for images
 */

/**
 * Generates optimized image URL with compression and format conversion
 * @param {string} imageUrl - Original image URL
 * @param {Object} options - Optimization options
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (imageUrl, options = {}) => {
  const {
    width = null,
    height = null,
    quality = 80,
    format = 'webp',
    fit = 'cover'
  } = options;

  if (!imageUrl) return '';

  // Check if it's a Supabase storage URL
  const isSupabaseUrl = imageUrl?.includes('supabase.co/storage');
  
  if (isSupabaseUrl) {
    // Supabase Image Transformation API
    const url = new URL(imageUrl);
    const transformParams = [];
    
    if (width) transformParams?.push(`width=${width}`);
    if (height) transformParams?.push(`height=${height}`);
    if (quality) transformParams?.push(`quality=${quality}`);
    if (format) transformParams?.push(`format=${format}`);
    
    // Add transformation parameters to URL
    if (transformParams?.length > 0) {
      url?.searchParams?.set('transform', transformParams?.join(','));
    }
    
    return url?.toString();
  }

  // For non-Supabase URLs, return original with cache busting
  const url = new URL(imageUrl, window.location.origin);
  url?.searchParams?.set('v', Date.now());
  return url?.toString();
};

/**
 * Preload image for better performance
 * @param {string} imageUrl - Image URL to preload
 * @returns {Promise} Promise that resolves when image is loaded
 */
export const preloadImage = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = imageUrl;
  });
};

/**
 * Generate multiple image sizes for responsive images
 * @param {string} imageUrl - Original image URL
 * @param {Array} sizes - Array of width sizes
 * @returns {Object} Object with srcset and sizes
 */
export const generateResponsiveSources = (imageUrl, sizes = [640, 768, 1024, 1280, 1536]) => {
  if (!imageUrl) return { srcset: '', sizes: '' };

  const srcset = sizes?.map(width => {
      const optimizedUrl = getOptimizedImageUrl(imageUrl, { width, quality: 85 });
      return `${optimizedUrl} ${width}w`;
    })?.join(', ');

  const sizesAttr = sizes?.map((width, index) => {
      if (index === sizes?.length - 1) return `${width}px`;
      return `(max-width: ${width}px) ${width}px`;
    })?.join(', ');

  return { srcset, sizes: sizesAttr };
};

/**
 * Check if browser supports WebP format
 * @returns {Promise<boolean>} True if WebP is supported
 */
export const supportsWebP = async () => {
  if (typeof window === 'undefined') return false;

  // Check if already cached
  if (window.__webpSupport !== undefined) {
    return window.__webpSupport;
  }

  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      const support = webP.height === 2;
      window.__webpSupport = support;
      resolve(support);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Calculate optimal image dimensions based on container
 * @param {HTMLElement} container - Container element
 * @param {number} aspectRatio - Image aspect ratio (width/height)
 * @returns {Object} Optimal width and height
 */
export const calculateOptimalDimensions = (container, aspectRatio = 16/9) => {
  if (!container) return { width: 800, height: 450 };

  const containerWidth = container?.offsetWidth || 800;
  const containerHeight = container?.offsetHeight || 450;

  // Calculate dimensions maintaining aspect ratio
  let width = containerWidth;
  let height = Math.round(width / aspectRatio);

  if (height > containerHeight) {
    height = containerHeight;
    width = Math.round(height * aspectRatio);
  }

  // Add some padding for high DPI displays
  const dpr = window?.devicePixelRatio || 1;
  width = Math.round(width * Math.min(dpr, 2));
  height = Math.round(height * Math.min(dpr, 2));

  return { width, height };
};

/**
 * Intersection Observer options for lazy loading
 */
export const lazyLoadOptions = {
  root: null,
  rootMargin: '50px', // Start loading 50px before image enters viewport
  threshold: 0.01
};

/**
 * Get blur data URL for placeholder
 * @param {number} width - Blur width
 * @param {number} height - Blur height
 * @returns {string} Data URL for blur placeholder
 */
export const getBlurDataUrl = (width = 10, height = 10) => {
  const canvas = document?.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas?.getContext('2d');
  
  // Create gradient for blur effect
  const gradient = ctx?.createLinearGradient(0, 0, width, height);
  gradient?.addColorStop(0, '#2a2d35');
  gradient?.addColorStop(1, '#1a1c22');
  
  ctx.fillStyle = gradient;
  ctx?.fillRect(0, 0, width, height);
  
  return canvas?.toDataURL();
};

/**
 * Compress image file before upload
 * @param {File} file - Image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<Blob>} Compressed image blob
 */
export const compressImage = async (file, options = {}) => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.85,
    outputFormat = 'image/webp'
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document?.createElement('canvas');
        let { width, height } = img;
        
        // Calculate new dimensions maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas?.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas?.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          outputFormat,
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = e?.target?.result;
    };
    
    reader.onerror = () => reject(new Error('File read failed'));
    reader?.readAsDataURL(file);
  });
};

/**
 * Monitor image loading performance
 * @param {string} imageUrl - Image URL
 * @param {string} imageName - Image identifier
 */
export const monitorImagePerformance = (imageUrl, imageName) => {
  if (!window?.performance) return;

  const perfEntries = performance?.getEntriesByName(imageUrl, 'resource');
  
  if (perfEntries?.length > 0) {
    const entry = perfEntries?.[0];
    console.log(`[IMAGE PERFORMANCE] ${imageName}:`, {
      duration: `${Math.round(entry?.duration)}ms`,
      size: `${Math.round(entry?.transferSize / 1024)}KB`,
      cached: entry?.transferSize === 0,
      url: imageUrl?.substring(0, 50)
    });
  }
};