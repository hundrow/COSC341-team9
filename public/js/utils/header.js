/* Site-wide header include
   Usage: include this script on pages that contain <div id="site-header"></div>
   The module injects accessible header markup and wires up the nav toggle and cart count.
*/
(function () {
  function getBasePath() {
    // Detect if we're in /pages/ subdirectory or root
    const path = window.location.pathname;
    return path.includes('/pages/') ? '../' : './';
  }

  function createHeader() {
    const base = getBasePath();
    // If we're already in /pages/ do not repeat the "pages/" segment when building links.
    const pagesPrefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
    const container = document.createElement('header');
    container.className = 'site-header';
    container.setAttribute('role', 'banner');

    container.innerHTML = `
      <div class="container header-inner">
        <a class="brand" href="${base}index.html" aria-label="Redolent Fragrances home">
          <img class="brand__logo" src="${base}assets/logo/rf-logo-primary.svg" alt="" aria-hidden="true" />
          <span class="brand__name">Redolent Fragrances</span>
        </a>

        <button class="nav-toggle" aria-controls="primary-nav" aria-expanded="false" aria-label="Open menu">
          <span class="nav-toggle__bar"></span>
          <span class="nav-toggle__bar"></span>
          <span class="nav-toggle__bar"></span>
        </button>

        <nav id="primary-nav" class="primary-nav" aria-label="Primary">
          <ul>
            <li><a href="${base}index.html">Home</a></li>
            <li><a href="${base}${pagesPrefix}shop.html">Shop</a></li>
            <li><a href="${base}${pagesPrefix}customizer.html">Customize</a></li>
            <li><a href="${base}${pagesPrefix}blog.html">Blog</a></li>
            <li><a href="${base}${pagesPrefix}about.html">About</a></li>
            <li><a href="${base}${pagesPrefix}contact.html">Contact</a></li>
          </ul>
        </nav>

        <form class="site-search" role="search" aria-label="Site search">
          <input type="search" name="q" placeholder="Search fragrances" aria-label="Search" />
          <button type="submit" class="btn btn--accent">Search</button>
        </form>

        <a href="${base}pages/cart.html" class="cart" aria-label="View cart">
          <span class="cart__icon" aria-hidden="true">🛒</span>
          <span id="cart-count" class="cart__count" aria-live="polite">0</span>
        </a>
      </div>
    `;

    return container;
  }

  function initHeader() {
    const placeholder = document.getElementById('site-header');
    if (!placeholder) return;
    const header = createHeader();
    placeholder.replaceWith(header);

    // wire nav toggle
    const toggle = header.querySelector('.nav-toggle');
    const nav = header.querySelector('#primary-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        nav.style.display = expanded ? '' : 'block';
      });
    }

    // update cart count if Cart is present
    function refreshCount() {
      try {
        if (window.Cart && typeof window.Cart.getCount === 'function') {
          const el = header.querySelector('#cart-count');
          if (el) el.textContent = String(window.Cart.getCount() || 0);
        }
      } catch (e) {
        // noop
      }
    }

    // initial refresh
    refreshCount();

    // listen for storage events to update across tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'rf_cart_v1') refreshCount();
    });

    // expose a small API for other modules to request refresh
    window.SiteHeader = { refreshCount };
  }

  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
  } else {
    initHeader();
  }
})();
