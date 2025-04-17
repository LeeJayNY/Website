// js/main.js

// Wrap everything in a DOMContentLoaded listener to ensure elements exist
document.addEventListener('DOMContentLoaded', () => {

    // --- Custom Cursor Script --- 
    const cursor = document.getElementById('custom-cursor');
    if (cursor) { // Check if cursor element exists
        let targetX = -100;
        let targetY = -100;
        let currentX = -100;
        let currentY = -100;
        const lagFactor = 0.05;
        const stopThreshold = 1;
        let animationFrameId = null;

        function lerp(start, end, factor) {
            return start + (end - start) * factor;
        }

        function updateCursor() {
            currentX = lerp(currentX, targetX, lagFactor);
            currentY = lerp(currentY, targetY, lagFactor);
            const dx = targetX - currentX;
            const dy = targetY - currentY;
            const distanceSquared = dx * dx + dy * dy;
            cursor.style.left = currentX + 'px';
            cursor.style.top = currentY + 'px';
            cursor.style.opacity = (distanceSquared < stopThreshold * stopThreshold) ? '0' : '1';
            animationFrameId = requestAnimationFrame(updateCursor);
        }

        document.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
            cursor.style.opacity = '1';
        });
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
        document.addEventListener('mouseenter', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
            cursor.style.opacity = '1';
        });
        animationFrameId = requestAnimationFrame(updateCursor);
    }

    // --- Theme Toggle Script --- 
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) { // Check if button exists
        const moonIcon = themeToggle.querySelector('.moon-icon');
        const sunIcon = themeToggle.querySelector('.sun-icon');
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        const currentTheme = localStorage.getItem('theme');

        function applyTheme(theme) {
            document.body.classList.toggle('light-mode', theme === 'light');
            if (moonIcon && sunIcon) { // Check if icons exist
                moonIcon.style.display = theme === 'light' ? 'block' : 'none';
                sunIcon.style.display = theme === 'light' ? 'none' : 'block';
            }
        }

        let initialTheme = currentTheme || 'dark'; // Default to dark if no theme saved
        applyTheme(initialTheme);

        themeToggle.addEventListener('click', () => {
            let newTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });

        prefersDarkScheme.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // --- Dynamic Time Script --- 
    const timeElement = document.getElementById('current-time');
    if (timeElement) { // Only run if the time element exists (on index.html)
        function updateDateTime() {
            const now = new Date();
            const options = {
                timeZone: 'America/New_York',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            };
            const formattedDateTime = now.toLocaleString('en-US', options).replace(' at', ' •');
            timeElement.textContent = `Currently ${formattedDateTime} for me.`;
        }

        // Update time immediately and then every minute
        updateDateTime();
        setInterval(updateDateTime, 60000); // Update every 60 seconds
    }

    // Weather script fully removed

}); // End DOMContentLoaded listener 