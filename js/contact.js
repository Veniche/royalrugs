// Make closePopup globally available
window.closePopup = function() {
    const popup = document.getElementById('thankYouPopup');
    if (popup) {
        popup.style.display = "none";
        document.body.style.overflow = ''; // Re-enable scrolling
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const popup = document.getElementById('thankYouPopup');

    function showAlert(message) {
        alert(message);
    }

    function validateForm() {
        const email = document.querySelector('input[name="Email"]').value.trim();
        const phone = document.querySelector('input[name="Phone"]').value.trim();

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phonePattern = /^[0-9+\s-]+$/; // Simple pattern for international numbers

        if (!emailPattern.test(email)) {
            showAlert("❌ Please enter a valid email address.");
            return false;
        }

        if (!phonePattern.test(phone)) {
            showAlert("❌ Please enter a valid phone number. Only numbers, spaces, and + are allowed.");
            return false;
        }

        return true; // Proceed if all validations pass
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!validateForm()) {
                return; // Stop form submission if validation fails
            }

            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status === 200) {
                    // Show thank you popup
                    popup.style.display = "flex";
                    document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
                    // Reset form
                    form.reset();
                } else {
                    console.error(response);
                    alert("⚠️ Gagal mengirim pesan: " + json.message);
                }
            })
            .catch(error => {
                console.error(error);
                alert("⚠️ Terjadi kesalahan, silakan coba lagi.");
            });
        });
    }
    
    // Mobile menu functionality (same as in main script)
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const overlay = document.querySelector('.overlay');
    
    if (menuToggle && mainNav && overlay) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
            
            // Toggle between menu and close icon
            const icon = menuToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking on overlay
        overlay.addEventListener('click', () => {
            mainNav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset menu icon
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
        
        // Close menu when clicking on a nav link
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
                
                // Reset menu icon
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
});
