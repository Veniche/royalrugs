document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel) return;

    const items = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;
    const intervalTime = 3000; // 3 seconds
    let intervalId = null;

    // Function to show next slide
    function showNextSlide() {
        // Hide current item
        items[currentIndex].classList.remove('active');
        
        // Move to next item, loop back to start if at end
        currentIndex = (currentIndex + 1) % items.length;
        
        // Show new current item
        items[currentIndex].classList.add('active');
    }

    // Start auto transition
    function startAutoTransition() {
        // Show first item initially
        items[0].classList.add('active');
        
        // Start the interval
        intervalId = setInterval(showNextSlide, intervalTime);
    }

    // Initialize the carousel
    startAutoTransition();
});
