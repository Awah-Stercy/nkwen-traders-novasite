// Design Lead's signature interactive feature: a live search box plus
// category tabs that filter the product cards already rendered by
// catalog.js. Listens for the 'catalog:rendered' event so it never runs
// before the cards exist, and never touches how the data is fetched.

document.addEventListener('catalog:rendered', (event) => {
  const products = event.detail.products || [];
  const grid = document.getElementById('catalog-grid');
  const searchInput = document.getElementById('catalog-search');
  const tabsContainer = document.getElementById('filter-tabs');
  const emptyMessage = document.getElementById('filter-empty');

  if (!grid || !searchInput || !tabsContainer) return;

  const categories = ['All', ...new Set(products.map(p => p.category))];
  let activeCategory = 'All';

  categories.forEach(category => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'filter-tab';
    tab.textContent = category;
    tab.setAttribute('aria-pressed', category === 'All' ? 'true' : 'false');
    tab.addEventListener('click', () => {
      activeCategory = category;
      tabsContainer.querySelectorAll('.filter-tab').forEach(t => {
        t.setAttribute('aria-pressed', String(t === tab));
      });
      applyFilters();
    });
    tabsContainer.appendChild(tab);
  });

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    grid.querySelectorAll('.product-card').forEach(card => {
      const matchesCategory = activeCategory === 'All' || card.dataset.category === activeCategory;
      const matchesQuery = !query || card.dataset.name.includes(query);
      const isVisible = matchesCategory && matchesQuery;
      card.classList.toggle('is-filtered-out', !isVisible);
      if (isVisible) visibleCount += 1;
    });

    if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
  }

  searchInput.addEventListener('input', applyFilters);
});
