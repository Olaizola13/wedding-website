The website automatically switches to its thank-you version on **18 October 2026
at 05:00 in Europe/Madrid** (also 05:00 in Germany; 03:00 UTC).
The timestamp is configured in `js/wedding-phase.js` with an explicit `+02:00`
offset so guests in other timezones see the same phase.

After the switch:

- The homepage replaces the invitation with a thank-you message in English,
  Spanish or German, a photo-sharing link, and a brief confetti animation.
- Countdown, weather, weekend details, wedding FAQ and calendar prompts disappear.
- Memories, Gifts, Recommendations and its subpages remain available, as does
  the love story. Memories and Gifts use wording appropriate after the wedding.
- RSVP, Locations, Transport, Arrival, Kids, Accommodation and the old RSVP
  confirmation page redirect to the homepage, preserving the language.
- Open tabs refresh at the cutoff; returning to a sleeping tab also checks it.
- Confetti ends after a few seconds and respects reduced-motion preferences.

Deploy these files before the cutoff using the website's normal publishing
process. No scheduled job or further deployment is required for the switch.
This static-site behavior uses the visitor's device clock and requires JavaScript;
retired HTML files remain on the host, with navigation redirected in the browser.

Run the date, bookmark and open-tab checks with:

```sh
node --test tests/wedding-phase.test.cjs
```

To preview either phase locally without changing the production date, serve the
site and use a browser automation clock set before or after
`2026-10-18T03:00:00Z`.
