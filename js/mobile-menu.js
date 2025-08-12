// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Toggle between hamburger and close icon
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                body.classList.remove('menu-open');
                
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a nav link is clicked
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                body.classList.remove('menu-open');
                
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
});
