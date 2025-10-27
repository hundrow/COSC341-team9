/* Simple localStorage-backed cart module for development.
   Exposes a global `Cart` object with functions:
   - loadCart(), saveCart(cart), getCart(), addItem(item), removeItem(lineId), updateQty(lineId, qty), getCount(), clearCart()
   This is intentionally small and dependency-free so it's easy to test and replace with a framework-specific store.
*/
(function (global) {
  const STORAGE_KEY = 'rf_cart_v1';

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { id: null, items: [], currency: 'USD', subtotal: 0 };
      const cart = JSON.parse(raw);
      cart.subtotal = calculateSubtotal(cart.items);
      return cart;
    } catch (e) {
      console.error('Error loading cart', e);
      return { id: null, items: [], currency: 'USD', subtotal: 0 };
    }
  }

  function saveCart(cart) {
    cart.subtotal = calculateSubtotal(cart.items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateCartCountUI(getCount());
  }

  function calculateSubtotal(items) {
    return items.reduce((sum, it) => sum + (it.unitPrice || 0) * (it.quantity || 1), 0);
  }

  function ensureCart() {
    const cart = loadCart();
    if (!cart.id) cart.id = `cart_${Date.now()}`;
    return cart;
  }

  function _makeLineId() {
    return 'line_' + Math.random().toString(36).slice(2, 9);
  }

  function addItem({ productId, variantId, quantity = 1, unitPrice = 0, customBlend = null, name = null }) {
    const cart = ensureCart();

    // If customBlend is present treat as unique line; otherwise combine like items
    if (customBlend) {
      const line = { lineId: _makeLineId(), customBlend, quantity, unitPrice };
      cart.items.push(line);
      saveCart(cart);
      return cart;
    }

    // try to find existing line
    const existing = cart.items.find(it => it.productId === productId && it.variantId === variantId && !it.customBlend);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + quantity;
    } else {
      cart.items.push({ lineId: _makeLineId(), productId, variantId, quantity, unitPrice, name });
    }

    saveCart(cart);
    return cart;
  }

  function removeItem(lineId) {
    const cart = ensureCart();
    cart.items = cart.items.filter(it => it.lineId !== lineId);
    saveCart(cart);
    return cart;
  }

  function updateQty(lineId, qty) {
    const cart = ensureCart();
    const it = cart.items.find(i => i.lineId === lineId);
    if (!it) return cart;
    it.quantity = qty;
    if (it.quantity <= 0) cart.items = cart.items.filter(i => i.lineId !== lineId);
    saveCart(cart);
    return cart;
  }

  function clearCart() {
    const cart = { id: null, items: [], currency: 'USD', subtotal: 0 };
    saveCart(cart);
    return cart;
  }

  function getCount() {
    const cart = loadCart();
    return cart.items.reduce((sum, it) => sum + (it.quantity || 0), 0);
  }

  function getCart() {
    return loadCart();
  }

  function updateCartCountUI(count) {
    try {
      const el = document.getElementById('cart-count');
      if (el) el.textContent = String(count || 0);
    } catch (e) {
      // ignore in non-browser contexts
    }
  }

  // Initialize UI count on load
  if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => updateCartCountUI(getCount()));
  }

  global.Cart = {
    loadCart,
    saveCart,
    getCart,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    getCount
  };
})(window || this);
