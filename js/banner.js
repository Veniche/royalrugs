document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing banner...');
    
    const banner = document.querySelector('.live-status-banner');
    const closeButton = document.querySelector('.live-status-close');
    
    if (!banner) {
        console.error('Banner element not found in the DOM');
        return;
    }
    
    console.log('Banner element found');
    
    // Check if banner was previously closed
    const bannerClosed = localStorage.getItem('liveBannerClosed') === 'true';
    console.log('Banner previously closed:', bannerClosed);
    
    // Always show the banner on load
    console.log('Showing banner');
    banner.style.display = 'block';
    banner.classList.add('visible');
    
    // Auto-hide after 15 seconds
    window.bannerHideTimeout = setTimeout(() => {
        banner.classList.remove('visible');
    }, 15000);
    
    // Close button functionality
    if (closeButton) {
        closeButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Closing banner');
            banner.style.display = 'none';
            banner.classList.remove('visible');
            localStorage.setItem('liveBannerClosed', 'true');
        });
    }
    
    // Pause auto-hide on hover
    banner.addEventListener('mouseenter', function() {
        clearTimeout(window.bannerHideTimeout);
    });
    
    // Resume auto-hide when mouse leaves
    banner.addEventListener('mouseleave', function() {
        if (banner.classList.contains('visible')) {
            window.bannerHideTimeout = setTimeout(() => {
                banner.classList.remove('visible');
            }, 5000);
        }
    });
});
