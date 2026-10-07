// Spain's local time at the end of the wedding weekend (also 05:00 in Germany).
// An explicit offset makes this the same instant for guests in every timezone.
(() => {
    const thankYouStartsAt = Date.parse('2026-10-18T05:00:00+02:00');
    const retiredPages = new Set([
        'rsvp.html', 'locations.html', 'transport.html', 'travel.html',
        'kids.html', 'accommodations.html', 'thank-you.html'
    ]);
    const isRetiredPage = (pathname) => retiredPages.has(pathname.split('/').pop());
    const isAfterWedding = Date.now() >= thankYouStartsAt;
    window.weddingPhase = { isAfterWedding, isRetiredPage, thankYouStartsAt };

    if (isAfterWedding) {
        document.documentElement.classList.add('after-wedding');
        if (isRetiredPage(window.location.pathname)) {
            document.documentElement.classList.add('retired-wedding-page');
            const target = new URL('wedding.html', window.location.href);
            target.search = new URL(window.location.href).search;
            target.hash = '';
            // Keep the selected language when following an old bookmark.
            window.location.replace(target.href);
        }
        return;
    }

    // Recheck open tabs, including those restored from the browser's back cache.
    const checkPhase = () => {
        const remaining = thankYouStartsAt - Date.now();
        if (remaining <= 0) window.location.reload();
        else window.setTimeout(checkPhase, Math.min(remaining, 60000));
    };
    checkPhase();
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && Date.now() >= thankYouStartsAt) window.location.reload();
    });
    window.addEventListener('pageshow', () => {
        if (Date.now() >= thankYouStartsAt) window.location.reload();
    });
})();
