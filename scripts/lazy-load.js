/**
 * Lazy Load Script for Images and Videos
 * Optimizes page loading by deferring media until needed
 */

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLazyLoad);
} else {
  initLazyLoad();
}

function initLazyLoad() {
  // Lazy load videos with Intersection Observer
  lazyLoadVideos();
  
  // Optimize image loading
  optimizeImageLoading();
}

/**
 * Lazy load videos using Intersection Observer
 * Videos load only when they enter the viewport
 */
function lazyLoadVideos() {
  const lazyVideos = document.querySelectorAll('video[data-lazy-video]');
  
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target;
          const sources = video.querySelectorAll('source[data-src]');
          
          // Load video sources
          sources.forEach(source => {
            source.src = source.dataset.src;
            source.removeAttribute('data-src');
          });
          
          // Load the video
          video.load();
          
          // Try to play if autoplay is enabled
          if (video.hasAttribute('autoplay')) {
            video.play().catch(err => {
              console.log('Autoplay prevented:', err);
            });
          }
          
          // Stop observing this video
          observer.unobserve(video);
          video.removeAttribute('data-lazy-video');
        }
      });
    }, {
      rootMargin: '50px 0px', // Start loading 50px before entering viewport
      threshold: 0.01
    });
    
    lazyVideos.forEach(video => {
      videoObserver.observe(video);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyVideos.forEach(video => {
      const sources = video.querySelectorAll('source[data-src]');
      sources.forEach(source => {
        source.src = source.dataset.src;
      });
      video.load();
    });
  }
}

/**
 * Optimize image loading performance
 * Add decode() method for better performance
 */
function optimizeImageLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window && 'decode' in HTMLImageElement.prototype) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Use decode() for smoother loading
          if (img.complete) {
            img.decode().catch(() => {});
          } else {
            img.addEventListener('load', () => {
              img.decode().catch(() => {});
            }, { once: true });
          }
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0.01
    });
    
    images.forEach(img => {
      imageObserver.observe(img);
    });
  }
}

/**
 * Utility: Generate responsive Cloudinary URL
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {string} Optimized URL
 */
export function getCloudinaryUrl(cloudName, publicId, options = {}) {
  const defaults = {
    quality: 'auto:good',
    format: 'auto',
    width: 'auto',
    dpr: 'auto',
    crop: 'limit'
  };
  
  const opts = { ...defaults, ...options };
  const transformations = [];
  
  if (opts.width) transformations.push(`w_${opts.width}`);
  if (opts.height) transformations.push(`h_${opts.height}`);
  if (opts.quality) transformations.push(`q_${opts.quality}`);
  if (opts.format) transformations.push(`f_${opts.format}`);
  if (opts.dpr) transformations.push(`dpr_${opts.dpr}`);
  if (opts.crop) transformations.push(`c_${opts.crop}`);
  
  const transformString = transformations.join(',');
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`;
}

/**
 * Utility: Preload critical images
 * @param {Array<string>} urls - Array of image URLs to preload
 */
export function preloadImages(urls) {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Utility: Check if image is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean}
 */
export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Export for use in other modules
export { initLazyLoad, lazyLoadVideos, optimizeImageLoading };
