document.addEventListener('DOMContentLoaded', async () => {
  const root = document.getElementById('product-root');

  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function showNotFound() {
    root.innerHTML = '<p>Product not found. <a href="shop.html">Back to shop</a></p>';
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

  const slug = getQueryParam('slug');
  if (!slug) {
    showNotFound();
    return;
  }

  let products = [];
  try {
    const res = await fetch('../data/products.json');
    if (!res.ok) {
      throw new Error('Failed to load products');
    }
    products = await res.json();
  } catch (e) {
    console.error(e);
    root.innerHTML = '<p>Error loading product data. Try again later.</p>';
    return;
  }

  const product = products.find(p => p.slug === slug);
  if (!product) {
    showNotFound();
    return;
  }


  function renderProduct(p) {
    const out = document.createElement('div');
    out.className = 'product-detail';

    const layout = document.createElement('div');
    layout.className = 'product-detail__layout';

    const media = document.createElement('div');
    media.className = 'product-detail__media';
    const img = document.createElement('img');
    img.className = 'product-detail__image';
    img.src = p.images && p.images[0] ? p.images[0] : '/assets/images/rf-placeholder-1x1.png';
    img.alt = p.name;
    media.appendChild(img);

    const info = document.createElement('div');
    info.className = 'product-detail__info';
    const h1 = document.createElement('h1');
    h1.textContent = p.name;
    const price = document.createElement('div');
    price.className = 'product-price product-detail__price';
    price.textContent = `${p.currency} $${p.price.toFixed(2)}`;

    const desc = document.createElement('p');
    desc.textContent = p.description || '';

    // Notes
    const notes = document.createElement('div');
    notes.className = 'product-notes';
    notes.innerHTML = `<strong>Top notes:</strong> ${ (p.notes && p.notes.top || []).join(', ') }<br/><strong>Middle notes:</strong> ${(p.notes && p.notes.middle || []).join(', ')}<br/><strong>Base notes:</strong> ${(p.notes && p.notes.base || []).join(', ')} `;

    // Variant selector
    const variantLabel = document.createElement('label');
    variantLabel.textContent = 'Size:';
    variantLabel.htmlFor = 'variant-select';
    const variantSelect = document.createElement('select');
    variantSelect.id = 'variant-select';
    variantSelect.className = 'variant-select';
    (p.variants || []).forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.id;
      opt.textContent = `${v.size} — ${p.currency} $${v.price.toFixed(2)}`;
      variantSelect.appendChild(opt);
    });

    const qtyLabel = document.createElement('label');
    qtyLabel.textContent = 'Quantity:';
    qtyLabel.htmlFor = 'qty-input';
    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.id = 'qty-input';
    qtyInput.className = 'qty-input';
    qtyInput.min = 1;
    qtyInput.value = 1;

    const addBtn = document.createElement('button');
    addBtn.className = 'btn btn--primary';
    addBtn.textContent = 'Add to Cart';
    addBtn.addEventListener('click', () => {
      const variantId = (p.variants && p.variants[0] && variantSelect.value) || null;
      const variant = (p.variants || []).find(v => v.id === variantId) || (p.variants && p.variants[0]) || null;
      const unitPrice = variant ? variant.price : p.price;
      const quantity = Math.max(1, parseInt(qtyInput.value || '1', 10));
      window.Cart.addItem({ productId: p.id, variantId, quantity, unitPrice, name: p.name });
      showToast(`${p.name} x${quantity} added to cart`);
    });

    info.appendChild(h1);
    info.appendChild(price);
    info.appendChild(desc);
    info.appendChild(notes);
    info.appendChild(variantLabel);
    info.appendChild(variantSelect);
    info.appendChild(document.createElement('br'));
    info.appendChild(qtyLabel);
    info.appendChild(qtyInput);
    info.appendChild(addBtn);

    layout.appendChild(media);
    layout.appendChild(info);

    out.appendChild(layout);
    return out;
  }

  root.innerHTML = '';
  root.appendChild(renderProduct(product));
});
