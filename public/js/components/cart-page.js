// Cart page component - renders cart items and handles updates
(function () {
  'use strict';

  function renderCartItems() {
    const cart = window.Cart ? window.Cart.getCart() : { items: [], subtotal: 0 };
    const container = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal');

    if (!container) {
      return;
    }

    if (cart.items.length === 0) {
      container.innerHTML = '<p>Your cart is empty.</p>';
      if (subtotalEl) {
        subtotalEl.textContent = '$0.00';
      }
      return;
    }

    container.innerHTML = cart.items.map((item) => {
      const name = item.name || item.customBlend?.name || 'Product';
      const price = item.unitPrice || 0;
      const qty = item.quantity || 1;
      return `
        <div class="cart-item" data-line-id="${item.lineId}">
          <h3>${name}</h3>
          <p>Price: $${price.toFixed(2)}</p>
          <p>Quantity: ${qty}</p>
          <button class="btn-remove" data-line-id="${item.lineId}">Remove</button>
        </div>
      `;
    }).join('');

    if (subtotalEl) {
      subtotalEl.textContent = `$${cart.subtotal.toFixed(2)}`;
    }

    // Attach remove handlers
    container.querySelectorAll('.btn-remove').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const lineId = e.target.getAttribute('data-line-id');
        if (window.Cart && lineId) {
          window.Cart.removeItem(lineId);
          renderCartItems();
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', renderCartItems);
})();
