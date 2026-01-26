document.addEventListener('DOMContentLoaded', () => {
    const leadForm = document.getElementById('leadForm');
    const submitBtn = document.getElementById('submitBtn');
    const responseMsg = document.getElementById('responseMessage');

    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // UI State: Loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'TRANSMITTING...';
        responseMsg.textContent = '';

        const payload = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            interest: document.getElementById('interest').value,
            timestamp: new Date().toISOString()
        };

        try {
            // Backend Integration Point
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                responseMsg.className = 'message success';
                responseMsg.textContent = 'Access confirmed. Welcome to the MGDG reserve. Your guide will arrive shortly.';
                leadForm.reset();
                submitBtn.textContent = 'ACCESS GRANTED';
            } else {
                throw new Error('Submission failed');
            }
        } catch (err) {
            responseMsg.className = 'message error';
            responseMsg.textContent = 'System error. Please verify your connection and try again.';
            submitBtn.disabled = false;
            submitBtn.textContent = 'JOIN THE WAITLIST';
        }
    });

    // Reveal elements on scroll for a premium feel
    const reveal = () => {
        const reveals = document.querySelectorAll('.profile-card, .stat-box, .launch-box');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state for reveal
    document.querySelectorAll('.profile-card, .stat-box, .launch-box').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
    });

    window.addEventListener('scroll', reveal);
});