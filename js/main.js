document.addEventListener('DOMContentLoaded', () => {

    const setLanguage = (language) => {
        const elements = document.querySelectorAll('[data-key]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[language] && translations[language][key]) {
                element.innerHTML = translations[language][key];
            }
        });

        document.documentElement.lang = language;
        
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            if (link.closest('.language-switcher')) {
                return;
            }

            try {
                const url = new URL(link.href, window.location.origin);
                if (url.pathname.endsWith('.html')) {
                    const urlParams = new URLSearchParams(url.search);
                    urlParams.set('lang', language);
                    url.search = urlParams.toString();
                    link.href = url.href;
                }
            } catch (e) {
                // Ignore invalid URLs
            }
        });
    };

    const urlParams = new URLSearchParams(window.location.search);
    let language = urlParams.get('lang');

    if (!language) {
        language = localStorage.getItem('language');
    }
    
    if (!['en', 'es', 'de'].includes(language)) {
        language = 'en'; 
    }

    localStorage.setItem('language', language);
    
    setLanguage(language);

    // --- Collapsible section logic ---
    const eventCard = document.querySelector('.event-details-card');
    if (eventCard) {
        const clickableHeader = eventCard.querySelector('.event-card-header');
        const clickableArrow = eventCard.querySelector('.toggle-arrow-container');
        const toggleExpansion = (e) => {
            e.stopPropagation(); 
            eventCard.classList.toggle('expanded');
        };
        if (clickableHeader) clickableHeader.addEventListener('click', toggleExpansion);
        if (clickableArrow) clickableArrow.addEventListener('click', toggleExpansion);
    }

    // --- Countdown timer logic ---
    const countdownElement = document.getElementById('countdown-timer');
    if (countdownElement) {
        const weddingDate = new Date('2026-10-17T13:00:00').getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                countdownElement.innerHTML = `<div class="countdown-label" data-key="countdown_married"></div>`;
                setLanguage(localStorage.getItem('language') || 'en');
                clearInterval(countdownInterval);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').innerText = days;
            document.getElementById('hours').innerText = hours;
            document.getElementById('minutes').innerText = minutes;
            document.getElementById('seconds').innerText = seconds;
        };

        const countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // --- Song Request Form Logic ---
    const songRequestForm = document.getElementById('song-request-form');
    if (songRequestForm) {
        songRequestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const successMessage = document.getElementById('form-success-message');
            this.style.display = 'none';
            successMessage.style.display = 'block';
        });
    }
});

