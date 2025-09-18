document.addEventListener('DOMContentLoaded', () => {

    const setLanguage = (language) => {
        const elements = document.querySelectorAll('[data-key]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-key');
            // Check if the key exists in the current language, or fallback to English
            let translationText = '';
            if (translations[language] && translations[language][key]) {
                translationText = translations[language][key];
            } else if (translations['en'] && translations['en'][key]) {
                // Fallback to English if the key is not found in the selected language
                translationText = translations['en'][key];
            }
            
            if (translationText) {
                element.innerHTML = translationText;
            }
        });

        document.documentElement.lang = language;
        
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            // Do not append lang to the language switcher links
            if (link.closest('.language-switcher')) {
                return;
            }

            try {
                const url = new URL(link.href, window.location.origin);
                // only modify local html links
                if (url.pathname.endsWith('.html')) {
                    const urlParams = new URLSearchParams(url.search);
                    urlParams.set('lang', language);
                    url.search = urlParams.toString();
                    link.href = url.href;
                }
            } catch (e) {
                // Catches invalid URLs (like mailto:) and ignores them
            }
        });
    };

    const urlParams = new URLSearchParams(window.location.search);
    let language = urlParams.get('lang');

    if (!language) {
        language = localStorage.getItem('language');
    }
    
    // Default to English if no valid language is set
    if (!['en', 'es', 'de'].includes(language)) {
        language = 'en'; 
    }

    localStorage.setItem('language', language);
    
    // Ensure all translation files are loaded before setting the language
    // This is a simple approach; more complex sites might need promises or callbacks
    // For this project, assuming scripts are loaded sequentially is okay.
    setLanguage(language);

    // --- Collapsible section logic for main page ---
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

    // --- Collapsible section logic for accommodation page hotels ---
    const hotelSections = document.querySelectorAll('.collapsible-hotel-section');
    hotelSections.forEach(section => {
        const header = section.querySelector('.collapsible-hotel-header');
        header.addEventListener('click', () => {
            section.classList.toggle('expanded');
        });
    });

    // --- Countdown timer logic ---
    const countdownElement = document.getElementById('countdown-timer');
    if (countdownElement) {
        const weddingDate = new Date('2026-10-17T13:00:00').getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                // Ensure the "We are married!" text is translatable
                countdownElement.innerHTML = `<div class="countdown-label" data-key="countdown_married"></div>`;
                setLanguage(localStorage.getItem('language') || 'en'); // Re-apply translations
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
    
    // --- History Page Tab Logic ---
    const historyTabsContainer = document.querySelector('.icon-tabs');
    if (historyTabsContainer) {
        const tabButtons = document.querySelectorAll('.icon-tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;

                // Update button states
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Update content visibility
                tabContents.forEach(content => {
                    if (content.id === targetTab) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }

});

