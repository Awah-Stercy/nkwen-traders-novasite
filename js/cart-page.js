// Renders the cart list, wires quantity controls, and runs the
// front-end-only checkout flow (no real order is sent anywhere).

document.addEventListener('DOMContentLoaded', () => {
  const emptyMsg = document.getElementById('cart-empty');
  const listEl = document.getElementById('cart-list');
  const summaryEl = document.getElementById('cart-summary');
  const totalEl = document.getElementById('cart-total');
  const checkoutToggle = document.getElementById('checkout-toggle');
  const checkoutSection = document.getElementById('checkout-section');
  const orderReview = document.getElementById('order-review');
  const checkoutForm = document.getElementById('checkout-form');
  const confirmationEl = document.getElementById('order-confirmation');
  const orderNumberEl = document.getElementById('order-number');

  function formatPrice(amount) {
    return `${amount.toLocaleString()} XAF`;
  }

  function renderCart() {
    const cart = getCart();

    if (cart.length === 0) {
      emptyMsg.hidden = false;
      listEl.hidden = true;
      summaryEl.hidden = true;
      checkoutToggle.hidden = true;
      checkoutSection.hidden = true;
      listEl.innerHTML = '';
      return;
    }

    emptyMsg.hidden = true;
    listEl.hidden = false;
    summaryEl.hidden = false;
    checkoutToggle.hidden = false;

    listEl.innerHTML = '';
    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-item';

      const img = document.createElement('img');
      img.src = item.image || `https://placehold.co/120x100?text=${encodeURIComponent(item.name)}`;
      img.alt = item.name;
      img.onerror = function () {
        this.src = `https://placehold.co/120x100?text=${encodeURIComponent(item.name)}`;
      };

      const info = document.createElement('div');
      info.className = 'item-info';
      const nameEl = document.createElement('h3');
      nameEl.textContent = item.name;
      const priceEl = document.createElement('p');
      priceEl.textContent = `${formatPrice(item.price)} each`;
      info.appendChild(nameEl);
      info.appendChild(priceEl);

      const stepper = document.createElement('div');
      stepper.className = 'qty-stepper';
      const minusBtn = document.createElement('button');
      minusBtn.type = 'button';
      minusBtn.textContent = '–';
      minusBtn.setAttribute('aria-label', `Decrease quantity of ${item.name}`);
      minusBtn.addEventListener('click', () => {
        setQuantity(item.name, item.quantity - 1);
        renderCart();
      });
      const qtySpan = document.createElement('span');
      qtySpan.textContent = String(item.quantity);
      const plusBtn = document.createElement('button');
      plusBtn.type = 'button';
      plusBtn.textContent = '+';
      plusBtn.setAttribute('aria-label', `Increase quantity of ${item.name}`);
      plusBtn.addEventListener('click', () => {
        setQuantity(item.name, item.quantity + 1);
        renderCart();
      });
      stepper.appendChild(minusBtn);
      stepper.appendChild(qtySpan);
      stepper.appendChild(plusBtn);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'item-remove';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => {
        removeFromCart(item.name);
        renderCart();
      });

      row.appendChild(img);
      row.appendChild(info);
      row.appendChild(stepper);
      row.appendChild(removeBtn);
      listEl.appendChild(row);
    });

    totalEl.textContent = formatPrice(getCartTotal(cart));
  }

  function renderOrderReview() {
    const cart = getCart();
    orderReview.innerHTML = '';
    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'review-row';
      row.innerHTML = `<span>${item.name} × ${item.quantity}</span><span>${formatPrice(item.price * item.quantity)}</span>`;
      orderReview.appendChild(row);
    });
    const totalRow = document.createElement('div');
    totalRow.className = 'review-row review-total';
    totalRow.innerHTML = `<span>Total</span><span>${formatPrice(getCartTotal(cart))}</span>`;
    orderReview.appendChild(totalRow);
  }

  checkoutToggle.addEventListener('click', () => {
    renderOrderReview();
    checkoutSection.hidden = false;
    checkoutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  checkoutForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!checkoutForm.checkValidity()) {
      checkoutForm.reportValidity();
      return;
    }

    const orderNumber = 'NT-' + Math.floor(100000 + Math.random() * 900000);
    orderNumberEl.textContent = orderNumber;

    listEl.hidden = true;
    summaryEl.hidden = true;
    checkoutToggle.hidden = true;
    checkoutSection.hidden = true;
    confirmationEl.hidden = false;
    confirmationEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

    clearCart();
    checkoutForm.reset();
  });

  renderCart();
});
