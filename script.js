/* ==========================================================================
   MADANG PROVINCE TOURISM — SCRIPT
   Almost everything on this site is now handled by CSS alone:
     - the mobile menu open/close, hamburger animation and scroll lock  → :checked / :has()
     - the tide-line scroll progress bar and the nav's solidify-on-scroll → scroll-driven animations
     - the reveal-on-scroll fade-ins and the back-to-top button's fade-in → scroll-driven animations
     - the FAQ accordion and the "Plan Your Trip" cards                 → native <details>/<summary>
   What's left here is only the handful of things CSS genuinely cannot do:
     - reading today's date for the footer's copyright year
     - tracking which homepage section is currently scrolled into view, to
       highlight the matching nav link (there's no CSS selector for "which
       of several sections is currently in the viewport")
     - closing the mobile menu after a link inside it is clicked or Escape
       is pressed, since it's a fixed-position overlay that would otherwise
       stay open on top of the page after navigating
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => { // waits until the HTML is fully loaded/parsed before running any of the code inside

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year'); // grabs the empty <span id="year"> element in the footer
  if (yearEl) yearEl.textContent = new Date().getFullYear(); // if that element exists, fills it with the current four-digit year; CSS has no way to read the system date

  /* ---------- Mobile menu: close after a link is clicked, or on Escape ---------- */
  const navToggle = document.getElementById('navToggle'); // the hidden checkbox that CSS uses to drive the whole open/closed state
  if (navToggle) { // guards against the element being missing, though it's on every page
    document.querySelectorAll('.nav__links .nav__link').forEach(link => { // selects every link inside the mobile menu panel
      link.addEventListener('click', () => { navToggle.checked = false; }); // unchecking the box closes the panel via the existing CSS rules — the panel is a fixed overlay, so without this it would stay open on top of the page after navigating
    });
    document.addEventListener('keydown', (e) => { // listens for any key press on the page
      if (e.key === 'Escape' && navToggle.checked) navToggle.checked = false; // lets keyboard users dismiss the open mobile menu with Escape, same as a native dialog would
    });
  }

  /* ---------- Active nav link highlighting — homepage only ---------- */
  if (document.body.dataset.page === 'home') { // the three standalone sub-pages mark their own nav link active directly in CSS (see body[data-page="..."] rules in style.css), since it never changes; only the homepage has multiple in-page sections to track as the user scrolls
    const sections = ['home', 'discover', 'experiences', 'destinations', 'culture', 'plan'] // ids of the sections tracked by the nav
      .map(id => document.getElementById(id)) // converts each id string into the actual DOM element
      .filter(Boolean); // drops any that don't exist on this page
    const navLinkEls = document.querySelectorAll('.nav__link[href^="#"]'); // only the same-page anchor links can ever become "active" this way — Experiences, Culture and Accommodation are separate pages now

    const setActiveLink = () => { // figures out which section is currently in view and highlights the matching link
      let currentId = sections[0] ? sections[0].id : null; // defaults to the first section in case nothing else matches yet
      const scrollPos = window.scrollY + 140; // scroll position plus an offset, so a section counts as "active" a bit before it reaches the very top
      sections.forEach(section => { if (section.offsetTop <= scrollPos) currentId = section.id; }); // the last section the user has scrolled past becomes the current one
      navLinkEls.forEach(link => { link.classList.toggle('is-active', link.getAttribute('href') === '#' + currentId); }); // marks the one matching link active and clears the rest
    };
    setActiveLink(); // runs once immediately so the correct link is highlighted on page load
    window.addEventListener('scroll', setActiveLink, { passive: true }); // re-checks on every scroll; passive:true improves scroll performance
  }
});
