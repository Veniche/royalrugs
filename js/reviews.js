document.addEventListener('DOMContentLoaded', function() {
    const reviewsGrid = document.getElementById('reviewsGrid');
    
    if (!reviewsGrid) return;

    // Array of review image filenames in the assets/reviews directory
    const reviewImages = [
        'review_9.png',
        'review_8.png',
        'review_1.png',
        'review_2.png',
        'review_3.png',
        'review_4.png',
        'review_5.png',
        'review_6.png',
        'review_7.png'
    ];

    // Function to create a review item
    function createReviewItem(imageSrc, index) {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.style.animationDelay = `${index * 0.1}s`;
        
        reviewItem.innerHTML = `
            <div class="review-image">
                <img src="assets/reviews/${imageSrc}" alt="Customer review ${index + 1}" loading="lazy">
            </div>
        `;
        
        return reviewItem;
    }

    // Load initial reviews
    function loadReviews() {
        reviewImages.forEach((image, index) => {
            const reviewItem = createReviewItem(image, index);
            reviewsGrid.appendChild(reviewItem);
        });
    }

    // Initialize the page
    loadReviews();

    // Handle window resize for responsive layout
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Any resize-related code can go here
        }, 250);
    });
});
