const CATALOG_URL = '../products.json';

async function loadCatalog() {
  const grid = document.getElementById('catalog-grid');
  const errorMsg = document.getElementById('catalog-error');

  try {
    const response = await fetch(CATALOG_URL);
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    const products = await response.json();
    renderProducts(products, grid);
    document.dispatchEvent(new CustomEvent('catalog:rendered', { detail: { products } }));
  } catch (err) {
    console.error('Failed to load catalog:', err);
    errorMsg.hidden = false;
  }
}

function renderProducts(products, container) {
  if (!products || products.length === 0) {
    container.innerHTML = '<p>No products available right now.</p>';
    return;
  }
  products.forEach(product => {
    const card = createProductCard(product);
    container.appendChild(card);
  });
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.name = product.name.toLowerCase();
  card.dataset.category = product.category;

  const img = document.createElement('img');
  img.src = product.image || `https://placehold.co/300x200?text=${encodeURIComponent(product.name)}`;
  img.alt = product.name;
  img.className = 'product-image';
  img.onerror = function() {
    this.src = 'https://placehold.co/300x200?text=' + encodeURIComponent(product.name);
  };

  const name = document.createElement('h3');
  name.textContent = product.name;

  const category = document.createElement('p');
  category.className = 'product-category';
  category.textContent = product.category;

  const price = document.createElement('p');
  price.className = 'product-price';
  price.textContent = `${product.price.toLocaleString()} XAF`;

  card.appendChild(img);
  card.appendChild(name);
  card.appendChild(category);
  card.appendChild(price);

  return card;
}

document.addEventListener('DOMContentLoaded', loadCatalog);
