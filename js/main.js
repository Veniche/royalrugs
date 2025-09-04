// Touch device detection and handling
const isTouchDevice = 'ontouchstart' in window || 
                     navigator.maxTouchPoints > 0 || 
                     navigator.msMaxTouchPoints > 0;

// Handle touch events for QCDS items on iOS
if (isTouchDevice) {
    document.addEventListener('DOMContentLoaded', function() {
        const qcdsItems = document.querySelectorAll('.qcds-item');
        
        qcdsItems.forEach(item => {
            item.classList.add('touch-device');
            
            item.addEventListener('touchstart', function() {
                this.classList.add('tapped');
            }, { passive: true });
            
            item.addEventListener('touchend', function() {
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
    });
}
