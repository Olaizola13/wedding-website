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

    // --- NEW ROBUST Collapsible section logic ---
    const eventCard = document.querySelector('.event-details-card');

    if (eventCard) {
        const clickableHeader = eventCard.querySelector('.event-card-header');
        const clickableArrow = eventCard.querySelector('.toggle-arrow-container');
        const collapsibleContent = eventCard.querySelector('.collapsible-content');

        const toggleExpansion = (e) => {
            e.stopPropagation(); 
            
            const isExpanded = eventCard.classList.contains('expanded');

            if (isExpanded) {
                // Collapse the section by removing the inline style
                collapsibleContent.style.maxHeight = null;
            } else {
                // Expand the section by setting max-height to its scrollHeight
                collapsibleContent.style.maxHeight = collapsibleContent.scrollHeight + "px";
            }
            
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

