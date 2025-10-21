/* Redolent Fragrances — Starter Interactions */

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.getElementById('primary-nav');
if (navToggle && primaryNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    primaryNav.setAttribute('aria-expanded', String(!expanded));
  });
}

// Simple cart add interaction (demo state only)
const cartCountEl = document.querySelector('[data-cart-count]');
let cartCount = 0;

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add-to-cart]');
  if (!btn) return;
  cartCount += 1;
  if (cartCountEl) cartCountEl.textContent = String(cartCount);
  btn.disabled = true;
  btn.textContent = 'Added';
  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = 'Add to Cart';
  }, 1200);
});

// Newsletter mock submit
const nlForm = document.querySelector('[data-newsletter-form]');
const nlFeedback = document.querySelector('.newsletter__feedback');
if (nlForm && nlFeedback) {
  nlForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(nlForm);
    const email = (data.get('email') || '').toString().trim();
    if (!email) return;
    nlFeedback.hidden = false;
    nlFeedback.textContent = 'Thanks! Check your inbox for a confirmation.';
    nlForm.reset();
  });
}
