document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle?.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks?.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle?.contains(e.target) && !navLinks?.contains(e.target)) {
            menuToggle?.classList.remove('active');
            navLinks?.classList.remove('active');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu after clicking a link
                menuToggle?.classList.remove('active');
                navLinks?.classList.remove('active');
            }
        });
    });

    // Add scroll reveal animation
    const revealElements = document.querySelectorAll('.feature-card, .hero-content, .section-header');

    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100 && elementBottom > 0) {
                element.classList.add('revealed');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    const waitlistForm = document.getElementById('waitlist-form');
    const submitButton = document.getElementById('submit-button');
    const responseMessage = document.getElementById('response-message');
    const emailInput = document.getElementById('email');

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const contactInfo = emailInput.value;
            const planNodes = document.querySelectorAll('input[name="plan"]:checked');
            const plan = planNodes.length > 0 ? planNodes[0].value : 'Free';

            // Format as "contact | plan"
            const email = `${contactInfo} | ${plan}`;

            const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx82T3MhnFwyAaYUJpK4J0hY1F5LzW6BZ1nr2k4wnWqHhfZE4yqdAZc1eqvyJrJ3L3GBw/exec";

            submitButton.disabled = true;
            submitButton.style.opacity = '0.5';
            submitButton.textContent = 'Submitting...';
            responseMessage.textContent = '';

            try {
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // To avoid CORS issues when testing locally
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                // "no-cors" mode results in an opaque response, so we can't check response.ok
                // We will assume success and provide feedback to the user.
                responseMessage.textContent = 'Thank you for joining the waitlist!';
                emailInput.value = '';

            } catch (error) {
                responseMessage.textContent = 'Something went wrong. Please try again.';
            } finally {
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
                submitButton.textContent = 'Join Waitlist';
            }
        });
    }
});
