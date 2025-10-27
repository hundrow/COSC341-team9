document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('product-grid');
  const sortSelect = document.getElementById('sort-select');

  async function loadProducts() {
    try {
      const res = await fetch('./data/products.json');
      if (!res.ok) throw new Error('Failed to load products');
      const products = await res.json();
      return products;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  function renderProducts(products) {
    grid.innerHTML = '';
    products.forEach(p => {
      const card = document.createElement('article');
      card.className = 'product-card';

      const img = document.createElement('img');
      img.className = 'product-card__image';
      img.src = p.images && p.images[0] ? p.images[0] : '/assets/images/rf-placeholder-1x1.png';
      img.alt = p.name;

      const title = document.createElement('h3');
      title.className = 'product-card__title';
      title.textContent = p.name;

      const price = document.createElement('div');
      price.className = 'product-card__price product-price';
      price.textContent = `${p.currency} $${p.price.toFixed(2)}`;

      const actions = document.createElement('div');
      actions.className = 'product-actions';

      const addBtn = document.createElement('button');
      addBtn.className = 'btn btn--secondary';
      addBtn.textContent = 'Quick Add';
      addBtn.addEventListener('click', () => {
        const variantId = (p.variants && p.variants[0] && p.variants[0].id) || null;
        const unitPrice = (p.variants && p.variants[0] && p.variants[0].price) || p.price;
        window.Cart.addItem({ productId: p.id, variantId, quantity: 1, unitPrice, name: p.name });
        showToast(`${p.name} added to cart`);
      });

      const moreBtn = document.createElement('a');
      moreBtn.className = 'product-actions__link';
      moreBtn.textContent = 'More';
      moreBtn.href = `product.html?slug=${encodeURIComponent(p.slug)}`;

      actions.appendChild(addBtn);
      actions.appendChild(moreBtn);

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(price);
      card.appendChild(actions);

      grid.appendChild(card);
    });
  }

  function showToast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.position = 'fixed';
    t.style.right = '16px';
    t.style.bottom = '16px';
    t.style.background = 'rgba(0,0,0,0.8)';
    t.style.color = '#fff';
    t.style.padding = '8px 12px';
    t.style.borderRadius = '6px';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  }

  const products = await loadProducts();
  renderProducts(products);

  sortSelect.addEventListener('change', () => {
    const val = sortSelect.value;
    let sorted = [...products];
    if (val === 'price_asc') sorted.sort((a,b) => a.price - b.price);
    if (val === 'price_desc') sorted.sort((a,b) => b.price - a.price);
    renderProducts(sorted);
  });
});
