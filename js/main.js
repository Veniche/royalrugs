// Touch device detection
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

// Handle touch events for QCDS items on iOS
document.addEventListener('DOMContentLoaded', function() {
    // Add touch event listeners for QCDS items
    if (isTouchDevice) {
        const qcdsItems = document.querySelectorAll('.qcds-item');
        
        qcdsItems.forEach(item => {
            // Remove hover effects on touch devices to prevent sticky states
            item.classList.add('touch-device');
            
            // Add touch start/end events
            item.addEventListener('touchstart', function() {
                this.classList.add('tapped');
            }, { passive: true });
            
            item.addEventListener('touchend', function() {
                // Small delay to allow the user to see the tap effect
                setTimeout(() => {
                    this.classList.remove('tapped');
                }, 300);
            }, { passive: true });
            
            // Prevent long press context menu on iOS
            item.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            }, false);
        });
    }
    
    // Live Status Banner Functionality
    const banner = document.querySelector('.live-status-banner');
    const closeButton = document.querySelector('.live-status-close');
    
    // Check if banner was previously closed
    const bannerClosed = localStorage.getItem('liveBannerClosed');
    
    // Show banner if not closed before and within live hours (9AM - 11PM)
    function checkLiveStatus() {
        const now = new Date();
        const currentHour = now.getHours();
        const isLiveTime = currentHour >= 9 && currentHour < 23; // 9AM to 11PM
        
        if (isLiveTime && !bannerClosed) {
            // Show banner after a short delay for better UX
            setTimeout(() => {
                banner.classList.add('visible');
                
                // Auto-hide after 10 seconds
                setTimeout(() => {
                    if (banner.classList.contains('visible')) {
                        banner.classList.remove('visible');
                    }
                }, 10000);
            }, 3000);
        }
    }
    
    // Close button functionality
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            banner.classList.remove('visible');
            // Remember user's preference
            localStorage.setItem('liveBannerClosed', 'true');
        });
    }
    
    // Check if we should show the banner
    checkLiveStatus();
    
    // Re-check every 5 minutes to update live status
    setInterval(checkLiveStatus, 5 * 60 * 1000);
    
    // Show banner on hover for better UX
    banner.addEventListener('mouseenter', function() {
        clearTimeout(window.bannerHideTimeout);
    });
    
    banner.addEventListener('mouseleave', function() {
        if (banner.classList.contains('visible')) {
            window.bannerHideTimeout = setTimeout(() => {
                banner.classList.remove('visible');
            }, 5000);
        }
    });
});
