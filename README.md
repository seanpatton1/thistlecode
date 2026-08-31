# Thistle Code

The site at [thistlecode.com](https://thistlecode.com) — Sean Patton,
developer, Scotland.

Three static pages, no build step and no dependencies. Open `index.html`
in a browser and that is the site.

    index.html    landing
    work.html     everything built, with its actual state
    contact.html  two ways to get in touch

    site.css      the design system, shared
    hero.css      landing page only
    site.js       reveals, counters, boot readout

## Notes

**Nothing is gated on an animation.** `site.js` adds a `js` class to the
document, and every hidden-then-revealed rule is scoped to it, so with no
JavaScript the page is simply finished. There is also an unconditional
failsafe: four seconds in, everything becomes visible regardless of what
the scroll observer did. A transition only advances while the browser is
painting, and a background tab or low-power mode is enough to leave
content present, correct and invisible.

**Colour has a job.** Thistle purple is the brand and marks anything
interactive; the mint green means status and nothing else. Amber is
in-progress. Nothing on this site is coloured for decoration.

**Deployment** is GitHub Pages from `main`. `CNAME` holds the custom
domain; deleting it detaches the domain.
