document.addEventListener('DOMContentLoaded', () => {

    const isAfterWedding = window.weddingPhase?.isAfterWedding === true;
    if (isAfterWedding) {
        document.querySelectorAll('[data-before-wedding]').forEach(element => element.remove());
        document.querySelectorAll('[data-after-wedding]').forEach(element => { element.hidden = false; });
        const title = document.querySelector('title[data-key="page_title"]');
        if (title) title.dataset.key = 'post_wedding_page_title';
        const postWeddingKeys = {
            memories_intro: 'post_memories_intro',
            memories_tip: 'post_memories_tip',
            gifts_message_intro: 'post_gifts_intro'
        };
        document.querySelectorAll('[data-key]').forEach(element => {
            if (postWeddingKeys[element.dataset.key]) element.dataset.key = postWeddingKeys[element.dataset.key];
        });
    }

    const placeholderLinks = {
        "LINK_POSADA": {
            entries: [
                { url: "https://laposadadelpinar.com/", label: { en: "Website", es: "Sitio web", de: "Webseite" } }
            ]
        },
        "LINK_CAMPO_GRANDE_MAPS": {
            entries: [
                { url: "https://maps.app.goo.gl/quLghu8E6sQYGiou8", label: { en: "Google Maps", es: "Google Maps", de: "Google Maps" } },
                { url: "https://www.valladolid.com/campo-grande", label: { en: "Info page", es: "Página informativa", de: "Info-Seite" } }
            ]
        },
        "LINK_MERCADO_DEL_VAL": {
            entries: [
                { url: "https://itsmy.bio/mercadodelval", label: { en: "Website", es: "Web", de: "Website" } },
                { url: "https://maps.app.goo.gl/yuEuN7ptFCWx1GUW6", label: { en: "Google Maps", es: "Google Maps", de: "Google Maps" } }
            ]
        },
        "LINK_GETRAENKE": {
            entries: [
                { url: "/rec_gastronomy.html#drinks", label: { en: "Drinks guide", es: "Guía de bebidas", de: "Getränkekunde" } }
            ],
            joiner: " "
        },
        "LINK_MATAMALA": {
            entries: [
                { url: "https://matamales.es/", label: { en: "Website", es: "Sitio web", de: "Webseite" } },
                { url: "https://maps.app.goo.gl/EU5eTznsM8Hy2q4B7", label: { en: "Google Maps", es: "Google Maps", de: "Google Maps" } }
            ]
        },
        "LINK_CALLE_SANDOVAL_MAPS": {
            entries: [
                { url: "https://maps.app.goo.gl/kWoN267pAPywkEpE9", label: { en: "Google Maps", es: "Google Maps", de: "Google Maps" } }
            ]
        },
        "LINK_BAR_ZAMORA": {
            entries: [
                { url: "https://maps.app.goo.gl/UUCt3wXywJcaJ8by9", label: { en: "Bar Zamora (Maps)", es: "Bar Zamora (Maps)", de: "Bar Zamora (Maps)" } }
            ]
        },
        "LINK_EL_CORCHO": {
            entries: [
                { url: "https://maps.app.goo.gl/pnXJsm738e2T1dx19", label: { en: "El Corcho (Maps)", es: "El Corcho (Maps)", de: "El Corcho (Maps)" } }
            ]
        },
        "LINK_FRANCISCO_ZARANDONA_MAPS": {
            entries: [
                { url: "https://maps.app.goo.gl/Aehd4vEm8AhqP7Y86", label: { en: "Calle Francisco Zarandona", es: "Calle Francisco Zarandona", de: "Calle Francisco Zarandona" } }
            ]
        },
        "LINK_MERCADO_DEL_VAL_SITE": {
            entries: [
                { url: "https://itsmy.bio/mercadodelval", label: { en: "Mercado del Val site", es: "Web Mercado del Val", de: "Website Mercado del Val" } }
            ]
        },
        "LINK_YLLERA": {
            entries: [
                { url: "https://maps.app.goo.gl/Cnva8HdQB1WWm4Vj6", label: { en: "Bodega Yllera", es: "Bodega Yllera", de: "Bodega Yllera" } }
            ]
        },
        "LINK_ARZUAGA": {
            entries: [
                { url: "https://maps.app.goo.gl/NMCRvMDwYmsxkNVw6", label: { en: "Bodega Arzuaga", es: "Bodega Arzuaga", de: "Bodega Arzuaga" } }
            ]
        },
        "LINK_BODEGA_SORBONA": {
            entries: [
                { url: "https://maps.app.goo.gl/2TPzH82BGiFGwQ3V8", label: { en: "Bodega la Sorbona", es: "Bodega la Sorbona", de: "Bodega la Sorbona" } }
            ]
        }
    };

    const isMapLink = (href) => {
        try {
            const url = new URL(href, window.location.origin);
            return (['www.google.com', 'google.com', 'maps.google.com'].includes(url.hostname) && url.pathname.startsWith('/maps'))
                || url.hostname === 'maps.app.goo.gl'
                || (url.hostname === 'goo.gl' && url.pathname.startsWith('/maps'));
        } catch (_) {
            return false;
        }
    };

    const resolvePlaceholder = (key, language) => {
        const config = placeholderLinks[key];
        if (!config) return null;
        const joiner = typeof config.joiner === 'string' ? config.joiner : ' | ';
        return config.entries.map(entry => {
            const label = (entry.label && entry.label[language]) || (entry.label && entry.label.en) || 'Link';
            const isExternal = /^https?:\/\//i.test(entry.url);
            const target = isExternal && !isMapLink(entry.url) ? ' target="_blank" rel="noopener noreferrer"' : '';
            return `<a href="${entry.url}"${target}>${label}</a>`;
        }).join(joiner);
    };

    const replacePlaceholders = (text, language) => {
        return text.replace(/{{(LINK_[A-Z0-9_]+)}}/g, (_, key) => {
            const replacement = resolvePlaceholder(key, language);
            return replacement || `{{${key}}}`;
        });
    };

    const setLanguage = (language) => {
        if (typeof translations === 'undefined') {
            console.warn('Translations object not found. Skipping language update.');
            return;
        }

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
                element.innerHTML = replacePlaceholders(translationText, language);

                // Also update the alt attribute if the element is an image
                if (element.tagName === 'IMG') {
                    element.alt = translationText;
                }
            }
        });

        document.documentElement.lang = language;
        
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            // Map links navigate directly, avoiding blocked new tabs on phones.
            if (isMapLink(link.href)) link.removeAttribute('target');
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

    if (isAfterWedding) {
        // Also remove retired links that may be embedded in translated content.
        document.querySelectorAll('a[href]').forEach(link => {
            const url = new URL(link.href, window.location.href);
            if (url.origin === window.location.origin && window.weddingPhase.isRetiredPage(url.pathname)) {
                link.replaceWith(...link.childNodes);
            }
        });

        const celebration = document.querySelector('.celebration-confetti');
        if (celebration && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const colors = ['#d1a3a4', '#88a0a8', '#E0B4A2', '#c9a35d'];
            for (let i = 0; i < 36; i++) {
                const piece = document.createElement('span');
                piece.style.setProperty('--left', `${Math.random() * 100}%`);
                piece.style.setProperty('--delay', `${Math.random() * 1.5}s`);
                piece.style.setProperty('--turn', `${180 + Math.random() * 540}deg`);
                piece.style.backgroundColor = colors[i % colors.length];
                celebration.appendChild(piece);
            }
            window.setTimeout(() => celebration.remove(), 8000);
        }
    }

    // --- Language switcher logic ---
    const languageSwitcher = document.querySelector('.language-switcher');
    if (languageSwitcher) {
        languageSwitcher.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link) {
                e.preventDefault();
                const newLang = new URL(link.href).searchParams.get('lang');
                window.location.search = `?lang=${newLang}`;
            }
        });
    }

    // --- Pick-up city selection ---
    const pickupSelector = document.querySelector('[data-pickup-selector]');
    if (pickupSelector) {
        const choices = pickupSelector.querySelectorAll('[data-pickup-city]');
        const panels = pickupSelector.querySelectorAll('[data-pickup-panel]');
        pickupSelector.querySelector('[data-pickup-choices]').setAttribute('aria-label', translations[language].transport_choose_city);
        const showPickup = (city) => {
            choices.forEach(button => button.setAttribute('aria-expanded', String(button.dataset.pickupCity === city)));
            panels.forEach(panel => {
                panel.hidden = panel.dataset.pickupPanel !== city;
                if (!panel.hidden) {
                    const map = panel.querySelector('[data-map-src]');
                    if (map && !map.hasAttribute('src')) map.src = map.dataset.mapSrc;
                }
            });
        };
        const showPickupFromHash = () => {
            if (window.location.hash === '#medina-pickup') showPickup('medina');
            else if (window.location.hash === '#poniente-pickup') showPickup('valladolid');
        };
        choices.forEach(button => button.addEventListener('click', () => showPickup(button.dataset.pickupCity)));
        window.addEventListener('hashchange', showPickupFromHash);
        showPickupFromHash();
    }

    // --- FAQ reveal logic for main page ---
    const floatingHelp = document.querySelector('.floating-help');
    const faqCard = document.getElementById('faq');
    if (floatingHelp && faqCard) {
        const setFaqVisibility = (isVisible) => {
            faqCard.hidden = !isVisible;
            floatingHelp.setAttribute('aria-expanded', String(isVisible));
            floatingHelp.classList.toggle('is-active', isVisible);

            if (isVisible) {
                faqCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };

        floatingHelp.addEventListener('click', () => {
            setFaqVisibility(faqCard.hidden);
        });
    }

    // --- Collapsible section logic for main page ---
    const eventCard = document.querySelector('.event-details-card');
    if (eventCard) {
        const clickableHeader = eventCard.querySelector('.event-card-header');
        const clickableArrow = eventCard.querySelector('.toggle-arrow-container');
        const content = eventCard.querySelector('.collapsible-content');
        const updateExpansion = () => {
            const expanded = eventCard.classList.contains('expanded');
            if (content) content.inert = !expanded;
            if (clickableArrow) {
                clickableArrow.setAttribute('aria-expanded', String(expanded));
                const key = expanded ? 'event_collapse_label' : 'event_expand_label';
                clickableArrow.setAttribute('aria-label', translations[language][key] || translations.en[key]);
            }
        };
        const toggleExpansion = (e) => {
            e.stopPropagation();
            eventCard.classList.toggle('expanded');
            updateExpansion();
        };
        updateExpansion();
        if (clickableHeader) clickableHeader.addEventListener('click', toggleExpansion);
        if (clickableArrow) clickableArrow.addEventListener('click', toggleExpansion);
    }

    // --- Direct calendar links ---
    const calendarEvents = {
        prewedding: {
            title: 'Jessica & Juanma Get-Together',
            start: '20261016T200000',
            end: '20261017T000000',
            location: 'Privee, Valladolid (41.648143,-4.726458)',
            description: 'Friday, 16 October: Privee at 20:00. Cocktail reception with drinks included from 20:00 to 22:00. Venue open from 22:00 to 00:00; additional drinks at your own expense. No organised transport on Friday.'
        },
        wedding: {
            title: 'Jessica & Juanma Wedding',
            start: '20261017T123000',
            end: '20261018T003000',
            location: 'Posada Real del Pinar, Pinar de San Rafael, Pozal de Gallinas, Valladolid',
            description: 'Saturday, 17 October: guest reception at 12:30. Ceremony starts at 13:00 sharp; please be seated beforehand. Buses leave Poniente at 11:00 sharp and pick up at Villa de Ferias at 11:45. Arrive early: buses will not wait. Return buses: 20:00, 22:00 and 00:30 on Sunday, 18 October.'
        }
    };

    const createGoogleCalendarUrl = (event) => {
        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: event.title,
            dates: `${event.start}/${event.end}`,
            details: event.description,
            location: event.location,
            ctz: 'Europe/Madrid'
        });
        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    };

    document.querySelectorAll('[data-calendar-event]').forEach(link => {
        const event = calendarEvents[link.dataset.calendarEvent];
        if (!event) return;
        link.href = createGoogleCalendarUrl(event);
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    });

    // --- Countdown timer logic ---
    const countdownElement = document.getElementById('countdown-timer');
    if (countdownElement) {
        const weddingDate = new Date('2026-10-17T13:00:00+02:00').getTime();

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

        const activateTab = (targetTab) => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabButtons.forEach(btn => {
                if (btn.dataset.tab === targetTab) {
                    btn.classList.add('active');
                }
            });
            tabContents.forEach(content => {
                if (content.id === targetTab) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        };

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                activateTab(button.dataset.tab);
            });
        });

        const hashTarget = window.location.hash.slice(1);
        const tabIds = Array.from(tabContents).map((content) => content.id);
        if (hashTarget && tabIds.includes(hashTarget)) {
            activateTab(hashTarget);
        }
    }

});
