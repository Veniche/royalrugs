document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.reviews-track');
    let reviews = [];
    let currentIndex = 0;
    let isAnimating = false;
    let totalReviews = 0;

    // Initialize the reviews
    function initReviews() {
        if (typeof reviewsData !== 'undefined' && Array.isArray(reviewsData.reviews)) {
            reviews = reviewsData.reviews;
            totalReviews = reviews.length;
            
            // Clone first and last items for seamless looping
            if (reviews.length > 2) {
                reviews = [
                    reviews[reviews.length - 2], // Second to last item
                    reviews[reviews.length - 1], // Last item
                    ...reviews,                  // All items
                    reviews[0],                  // First item
                    reviews[1]                   // Second item
                ];
                currentIndex = 2; // Start at the first original item
            }
            
            renderReviews();
            updateActiveCard();
            setupEventListeners();
        } else {
            showFallbackMessage();
        }
    }

    // Render all review cards
    function renderReviews() {
        if (!reviews.length) return;

        // Create a wrapper for each review
        const reviewElements = reviews.map((review, index) => {
            const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
            return `
                <div class="review-card-wrapper" data-index="${index}" tabindex="0">
                    <div class="review-card">
                        <div class="review-rating" aria-label="${review.rating} out of 5 stars">
                            ${stars}
                        </div>
                        <p class="review-text">"${review.review}"</p>
                        <div class="review-author">${review.name}</div>
                    </div>
                </div>
            `;
        }).join('');

        track.innerHTML = reviewElements;
    }

    // Update active card and position other cards
    function updateActiveCard() {
        const cards = document.querySelectorAll('.review-card-wrapper');
        if (!cards.length) return;

        // Handle infinite loop boundaries
        if (currentIndex < 0) {
            currentIndex = reviews.length - 1;
        } else if (currentIndex >= reviews.length) {
            currentIndex = 0;
        }

        cards.forEach((card, index) => {
            card.className = 'review-card-wrapper';
            const position = index - currentIndex;
            
            // Set classes based on position
            if (position === 0) {
                card.classList.add('active');
            } else if (position === -1 || position === cards.length - 1) {
                card.classList.add('prev');
            } else if (position === 1 || position === -(cards.length - 1)) {
                card.classList.add('next');
            } else if (Math.abs(position) === 2) {
                card.classList.add(position < 0 ? 'far-prev' : 'far-next');
            } else {
                card.classList.add('hidden');
            }
        });

        // Position the track
        const cardWidth = 100 / 3;
        const offset = -currentIndex * cardWidth + cardWidth;
        track.style.transform = `translateX(calc(${offset}% - 15px))`;
        
        // Reset position after animation if at the cloned items
        if (currentIndex === 1) {
            setTimeout(() => {
                currentIndex = totalReviews + 1;
                updateActiveCard();
            }, 600);
        } else if (currentIndex === totalReviews + 2) {
            setTimeout(() => {
                currentIndex = 2;
                updateActiveCard();
            }, 600);
        }
    }

    // Navigate to a specific card
    function goToCard(index, event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            event.returnValue = false;
        }
        
        if (isAnimating) return false;
        
        const totalItems = reviews.length;
        const isAtFirstItem = currentIndex === 2 && index < 0;
        const isAtLastItem = currentIndex === totalItems - 3 && index >= totalItems;
        
        // If we're at the first or last actual item and trying to loop around
        if (isAtFirstItem || isAtLastItem) {
            isAnimating = true;
            
            // Disable transitions for the jump to clone
            track.style.transition = 'none';
            
            if (isAtFirstItem) {
                // Jump to the clone of the last item
                currentIndex = totalItems - 1;
            } else if (isAtLastItem) {
                // Jump to the clone of the first item
                currentIndex = 0;
            }
            
            // Update immediately without animation
            updateActiveCard();
            
            // Force reflow to ensure the jump happens
            void track.offsetWidth;
            
            // Re-enable transitions for the smooth animation
            track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
            
            // Now animate to the target position
            requestAnimationFrame(() => {
                if (isAtFirstItem) {
                    currentIndex = totalItems - 3; // Second to last actual item
                } else if (isAtLastItem) {
                    currentIndex = 2; // Second actual item
                }
                updateActiveCard();
                
                // Reset animation state after transition completes
                setTimeout(() => {
                    isAnimating = false;
                }, 600);
            });
            
            return false;
        }
        
        // Normal navigation
        isAnimating = true;
        currentIndex = index < 0 ? 0 : (index >= totalItems ? totalItems - 1 : index);
        updateActiveCard();
        
        // Reset animation state
        setTimeout(() => {
            isAnimating = false;
        }, 600);
        
        return false;
    }

    // Set up event listeners
    function setupEventListeners() {
        // Click handler for cards
        track.addEventListener('click', (e) => {
            const card = e.target.closest('.review-card-wrapper');
            if (!card) return;
            
            const index = parseInt(card.getAttribute('data-index'));
            if (index !== currentIndex) {
                goToCard(index, e);
            }
        }, true);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target === track || e.target.closest('.reviews-3col-container')) {
                if (e.key === 'ArrowLeft') {
                    goToCard(currentIndex - 1, e);
                } else if (e.key === 'ArrowRight') {
                    goToCard(currentIndex + 1, e);
                }
            }
        });

        // Touch events for mobile
        let touchStartX = 0;
        let touchStartTime = 0;
        
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartTime = Date.now();
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            // Prevent scrolling while swiping
            if (Math.abs(e.touches[0].clientX - touchStartX) > 10) {
                e.preventDefault();
            }
        }, { passive: false });

        track.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndTime = Date.now();
            const diff = touchStartX - touchEndX;
            const timeDiff = touchEndTime - touchStartTime;
            
            // Only trigger swipe if moved at least 50px and under 300ms
            if (Math.abs(diff) > 50 && timeDiff < 300) {
                if (diff > 0) {
                    goToCard(currentIndex + 1, e);
                } else {
                    goToCard(currentIndex - 1, e);
                }
            }
        }, { passive: true });
        
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                updateActiveCard();
            }, 250);
        });
    }

    // Show fallback message if reviews can't be loaded
    function showFallbackMessage() {
        track.innerHTML = `
            <div class="review-card-wrapper" style="flex: 0 0 100%;">
                <div class="review-card">
                    <div class="review-rating">★★★★★</div>
                    <p class="review-text">Our customers love our rugs! Check back soon to read their reviews.</p>
                    <div class="review-author">The Royal Rugs Team</div>
                </div>
            </div>
        `;
    }

    // Initialize the reviews
    initReviews();
});
