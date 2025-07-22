document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const track = document.querySelector('.reviews-mobile-track');
    const slidesContainer = document.querySelector('.reviews-mobile-slides');
    const navContainer = document.querySelector('.reviews-mobile-nav');
    
    // State
    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let slides = [];
    let prevButton, nextButton;
    let slideWidth = 0;
    
    // Initialize the reviews
    function initReviews() {
        if (typeof reviewsData === 'undefined' || !Array.isArray(reviewsData.reviews)) {
            showFallbackMessage();
            return;
        }
        
        const reviews = reviewsData.reviews;
        
        // Clear any existing content
        if (slidesContainer) {
            slidesContainer.innerHTML = '';
        }
        
        // Set slide width to track width
        if (track) {
            slideWidth = track.offsetWidth;
        }
        
        // Create slides
        reviews.forEach((review, index) => {
            // Create slide element
            const slide = document.createElement('div');
            slide.className = 'review-mobile-slide';
            slide.setAttribute('data-index', index);
            slide.setAttribute('aria-hidden', 'true');
            
            // Create stars
            const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
            
            // Set slide content
            slide.innerHTML = `
                <div class="review-mobile-card">
                    <div class="review-mobile-rating" aria-label="${review.rating} out of 5 stars">
                        ${stars}
                    </div>
                    <p class="review-mobile-text">"${review.review}"</p>
                    <div class="review-mobile-author">${review.name}</div>
                </div>
            `;
            
            slidesContainer.appendChild(slide);
            
            // Create navigation arrows if they don't exist
            if (index === 0 && navContainer) {
                // Previous button
                prevButton = document.createElement('button');
                prevButton.className = 'reviews-mobile-arrow';
                prevButton.innerHTML = '&larr;';
                prevButton.setAttribute('aria-label', 'Previous review');
                prevButton.addEventListener('click', () => goToSlide(currentIndex - 1));
                
                // Next button
                nextButton = document.createElement('button');
                nextButton.className = 'reviews-mobile-arrow';
                nextButton.innerHTML = '&rarr;';
                nextButton.setAttribute('aria-label', 'Next review');
                nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));
                
                // Add buttons to nav container
                navContainer.appendChild(prevButton);
                navContainer.appendChild(nextButton);
            }
        });
        
        // Initialize slides and dots
        slides = document.querySelectorAll('.review-mobile-slide');
        updateActiveSlide();
        
        // Setup event listeners
        setupEventListeners();
    }
    
    // Update active slide and navigation
    function updateActiveSlide() {
        if (slides.length === 0) return;
        
        // Update slides
        slides.forEach((slide, index) => {
            const isActive = index === currentIndex;
            slide.setAttribute('aria-hidden', !isActive);
            slide.style.opacity = isActive ? '1' : '0';
            slide.style.pointerEvents = isActive ? 'auto' : 'none';
        });
        
        // Update navigation buttons
        if (prevButton) {
            prevButton.disabled = currentIndex === 0;
        }
        if (nextButton) {
            nextButton.disabled = currentIndex === slides.length - 1;
        }
        
        // Move to the current slide
        setSliderPosition();
    }
    
    // Go to specific slide
    function goToSlide(index) {
        if (index < 0) index = 0;
        if (index >= slides.length) index = slides.length - 1;
        if (index === currentIndex) return;
        
        currentIndex = index;
        updateActiveSlide();
    }
    
    // Set slider position with smooth transition
    function setSliderPosition() {
        if (!slidesContainer) return;
        
        // Calculate the position to move to
        const position = -currentIndex * 100;
        
        // Force a reflow to ensure the transition works
        void slidesContainer.offsetHeight;
        
        // Apply the transform with smooth transition
        slidesContainer.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        slidesContainer.style.transform = `translateX(${position}%)`;
        
        // Update aria attributes and visibility
        slides.forEach((slide, index) => {
            const isActive = index === currentIndex;
            slide.setAttribute('aria-hidden', !isActive);
            slide.style.opacity = isActive ? '1' : '0';
        });
    }
    
    // Handle touch/mouse events
    function setupEventListeners() {
        // Touch events
        track.addEventListener('touchstart', touchStart);
        track.addEventListener('touchend', touchEnd);
        track.addEventListener('touchmove', touchMove);
        
        // Mouse events
        track.addEventListener('mousedown', touchStart);
        track.addEventListener('mouseup', touchEnd);
        track.addEventListener('mouseleave', touchEnd);
        track.addEventListener('mousemove', touchMove);
        
        // Prevent image drag
        const images = track.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });
        
        // Keyboard navigation
        track.setAttribute('tabindex', '0');
        track.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToSlide(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goToSlide(currentIndex + 1);
            } else if (e.key === 'Home') {
                e.preventDefault();
                goToSlide(0);
            } else if (e.key === 'End') {
                e.preventDefault();
                goToSlide(slides.length - 1);
            }
        });
    }
    
    // Touch/mouse start
    function touchStart(e) {
        if (e.type === 'mousedown') {
            e.preventDefault();
            startPos = e.clientX;
        } else {
            startPos = e.touches[0].clientX;
        }
        
        isDragging = true;
        track.classList.add('grabbing');
        
        // Disable transitions while dragging
        if (slidesContainer) {
            const transform = window.getComputedStyle(slidesContainer).transform;
            const matrix = new DOMMatrixReadOnly(transform);
            currentTranslate = matrix.m41;
            slidesContainer.style.transition = 'none';
        }
    }
    
    // Touch/mouse move
    function touchMove(e) {
        if (!isDragging || !slides.length || !slidesContainer) return;
        
        let currentPosition;
        if (e.type === 'mousemove') {
            currentPosition = e.clientX;
            e.preventDefault();
        } else {
            currentPosition = e.touches[0].clientX;
        }
        
        const diff = currentPosition - startPos;
        const maxDrag = slideWidth * 0.5; // Limit drag to 50% of slide width
        const limitedDiff = Math.max(Math.min(diff, maxDrag), -maxDrag);
        const newPosition = currentTranslate + limitedDiff;
        
        // Apply the translation to the slides container without transition
        slidesContainer.style.transition = 'none';
        slidesContainer.style.transform = `translateX(${newPosition}px)`;
    }
    
    // Touch/mouse end
    function touchEnd() {
        if (!isDragging || !slides.length || !slidesContainer) return;
        
        isDragging = false;
        track.classList.remove('grabbing');
        
        // Get the current transform value
        const transform = window.getComputedStyle(slidesContainer).transform;
        const matrix = new DOMMatrixReadOnly(transform);
        const currentX = matrix.m41;
        
        // Calculate the distance moved and determine direction
        const dragDistance = currentX - (currentIndex * -slideWidth);
        const absDistance = Math.abs(dragDistance);
        const threshold = slideWidth * 0.15; // 15% of slide width
        
        let nextIndex = currentIndex;
        
        if (absDistance > threshold) {
            // Swiped enough to change slide
            nextIndex = dragDistance > 0 ? currentIndex - 1 : currentIndex + 1;
        }
        
        // Ensure we don't go out of bounds
        nextIndex = Math.max(0, Math.min(nextIndex, slides.length - 1));
        
        // If we're not changing slides, animate back to the current position
        if (nextIndex === currentIndex) {
            setSliderPosition();
        } else {
            // Otherwise, go to the target slide
            currentIndex = nextIndex;
            setSliderPosition();
        }
    }
    
    // Show fallback message if reviews can't be loaded
    function showFallbackMessage() {
        const container = document.querySelector('.reviews-mobile-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="reviews-fallback">
                <p>We appreciate your feedback! Check back soon for customer reviews.</p>
            </div>
        `;
    }
    
    // Initialize the reviews
    initReviews();
});
