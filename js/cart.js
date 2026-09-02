// Shared cart logic for Nkwen Traders.
// Cart state lives in localStorage (key below) so it survives navigation
// between pages on this static, no-backend site. No real order is ever
// sent anywhere — checkout produces a front-end-only confirmation, same
// pattern as the contact form.

const CART_STORAGE_KEY = 'nkwen-traders-cart';

function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Could not read cart from storage:', err);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error('Could not save cart to storage:', err);
  }
  updateCartBadge();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image || '',
      quantity: 1
    });
  }
  saveCart(cart);
}

function setQuantity(name, quantity) {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter(item => item.name !== name);
  } else {
    const item = cart.find(i => i.name === name);
    if (item) item.quantity = quantity;
  }
  saveCart(cart);
}

function removeFromCart(name) {
  const cart = getCart().filter(item => item.name !== name);
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function getCartCount(cart = getCart()) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal(cart = getCart()) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = String(count);
  badge.hidden = count === 0;
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
