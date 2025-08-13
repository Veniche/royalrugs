document.addEventListener('DOMContentLoaded', function() {
    // Initialize Hero Carousel
    const heroCarousel = document.querySelector('.hero-carousel');
    if (heroCarousel) {
        const heroItems = document.querySelectorAll('.carousel-item');
        
        if (heroItems.length > 0) {
            let heroCurrentIndex = 0;
            const heroIntervalTime = 5000; // 5 seconds
            let heroIntervalId = null;

            function showNextHeroSlide() {
                heroItems[heroCurrentIndex].classList.remove('active');
                heroCurrentIndex = (heroCurrentIndex + 1) % heroItems.length;
                heroItems[heroCurrentIndex].classList.add('active');
            }

            function startHeroAutoTransition() {
                heroItems[0].classList.add('active');
                heroIntervalId = setInterval(showNextHeroSlide, heroIntervalTime);
            }

            startHeroAutoTransition();
        }
    }

    // Initialize Promo Carousel
    const promoCarousel = document.querySelector('.promo-carousel');
    if (promoCarousel) {
        const promoItems = document.querySelectorAll('.promo-carousel-item');
        
        if (promoItems.length > 0) {
            let promoCurrentIndex = 0;
            const promoIntervalTime = 3500; // 3.5 seconds (slightly different from hero for visual interest)
            let promoIntervalId = null;

            function showNextPromoSlide() {
                promoItems[promoCurrentIndex].classList.remove('active');
                promoCurrentIndex = (promoCurrentIndex + 1) % promoItems.length;
                promoItems[promoCurrentIndex].classList.add('active');
            }

            function startPromoAutoTransition() {
                promoItems[0].classList.add('active');
                promoIntervalId = setInterval(showNextPromoSlide, promoIntervalTime);
            }

            startPromoAutoTransition();
        }
    }
});
