// Video autoplay fix for cross-browser compatibility
document.addEventListener('DOMContentLoaded', function() {
  const video = document.querySelector('.hero-video');
  
  if (video) {
    // Ensure loop attribute is set
    video.loop = true;
    video.muted = true;
    video.setAttribute('preload', 'metadata');
    
    // Force video to play on load
    const playVideo = () => {
      video.play().catch(error => {
        console.log('Video autoplay was prevented:', error);
        // If autoplay fails, try again after user interaction
        const playOnInteraction = () => {
          video.play().catch(e => console.log('Video play error:', e));
        };
        
        document.addEventListener('click', playOnInteraction, { once: true });
        document.addEventListener('touchstart', playOnInteraction, { once: true });
        document.addEventListener('scroll', playOnInteraction, { once: true });
      });
    };

    // Try to play when video can play
    video.addEventListener('canplay', playVideo, { once: true });

    // Ensure video loops properly
    video.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    });
  }
  
  // Ensure smooth scrolling isn't blocked
  document.body.style.overflow = 'auto';
});
