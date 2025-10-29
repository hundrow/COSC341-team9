// Checkout component - handles checkout form submission
(function () {
  'use strict';

  function handleCheckout(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const order = {
      shipping: {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        address: formData.get('address'),
        city: formData.get('city'),
        postalCode: formData.get('postalCode')
      },
      cart: window.Cart ? window.Cart.getCart() : { items: [], subtotal: 0 }
    };

    // TODO: Send to backend API
    console.warn('Checkout payload:', order);
    alert('Order placed! (Mock - backend integration pending)');

    // Clear cart and redirect
    if (window.Cart) {
      window.Cart.clearCart();
    }
    window.location.href = '../index.html';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('checkout-form');
    if (form) {
      form.addEventListener('submit', handleCheckout);
    }
  });
})();
