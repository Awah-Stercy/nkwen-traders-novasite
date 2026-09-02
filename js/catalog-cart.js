// Adds an "Add to Cart" button to each product card once catalog.js has
// rendered them. If the shopper already has that product in their cart
// from a previous visit, the button shows "In Cart (x)" instead of a
// plain "Add to Cart" — so returning from the cart page to add something
// else never looks like their earlier order vanished.

document.addEventListener('catalog:rendered', (event) => {
  const products = event.detail.products || [];
  const cards = document.querySelectorAll('#catalog-grid .product-card');
  const cart = getCart();

  cards.forEach(card => {
    const productName = card.dataset.name
      ? products.find(p => p.name.toLowerCase() === card.dataset.name)?.name
      : card.querySelector('h3')?.textContent;

    const product = products.find(p => p.name === productName);
    if (!product) return;

    const imgEl = card.querySelector('.product-image');
    const productWithImage = { ...product, image: imgEl ? imgEl.src : '' };

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-add-cart';

    const existing = cart.find(item => item.name === product.name);
    setButtonState(btn, existing ? existing.quantity : 0);

    btn.addEventListener('click', () => {
      addToCart(productWithImage);
      const updated = getCart().find(item => item.name === product.name);
      const newQty = updated ? updated.quantity : 0;

      btn.textContent = 'Added ✓';
      btn.disabled = true;
      setTimeout(() => {
        btn.disabled = false;
        setButtonState(btn, newQty);
      }, 800);
    });

    card.appendChild(btn);
  });

  function setButtonState(btn, quantity) {
    if (quantity > 0) {
      btn.textContent = `In Cart (${quantity}) — Add More`;
      btn.classList.add('btn-in-cart');
    } else {
      btn.textContent = 'Add to Cart';
      btn.classList.remove('btn-in-cart');
    }
  }
});
