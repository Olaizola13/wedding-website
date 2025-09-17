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
            } catch (e) => {
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

    // Collapsible section logic
    const eventCard = document.querySelector('.event-details-card');

    if (eventCard) {
        const clickableHeader = eventCard.querySelector('.event-card-header');
        const clickableArrow = eventCard.querySelector('.toggle-arrow-container');

        const toggleExpansion = (e) => {
            // Stop the event from firing twice if one clickable area is inside another
            e.stopPropagation(); 
            eventCard.classList.toggle('expanded');
        };

        if (clickableHeader) {
            clickableHeader.addEventListener('click', toggleExpansion);
        }
        if (clickableArrow) {
            clickableArrow.addEventListener('click', toggleExpansion);
        }
    }
});

