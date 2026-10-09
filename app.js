// LUNA Earrings Boutique - Interactive Shopping Engine and Cart Management

// Product data from products.js - window.LUNA_PRODUCTS
// UI Elements
const productGrid = document.querySelector('.product-grid');
const categoryFilters = document.querySelectorAll('.category-filter');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const quickViewModal = document.getElementById('quick-view-modal');
const cartDrawer = document.getElementById('cart-drawer');
const cartToggle = document.getElementById('cart-toggle');
const cartClose = document.getElementById('cart-close');
const cartItemsContainer = document.querySelector('.cart-items-container');
const subtotalEl = document.querySelector('.subtotal');
const taxEl = document.querySelector('.tax');
const totalEl = document.querySelector('.total');
const checkoutModal = document.getElementById('checkout-modal');
const orderToast = document.getElementById('order-toast');

// Cart state
let cart = JSON.parse(localStorage.getItem('luna_cart')) || [];

// Render products function
function renderProducts(filteredProducts) {
  if (!productGrid) return;
  productGrid.innerHTML = '';
  
  if (filteredProducts.length === 0) {
    productGrid.innerHTML = '<p class="no-results">No products found matching your criteria.</p>';
    return;
  }
  
  filteredProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `\n      <div class="product-image">\n        <img src="${product.image}" alt="${product.name}" class="product-img">\n      </div>\n      <div class="product-info">\n        <h3 class="product-name">${product.name}</h3>\n        <p class="product-category">${product.category}</p>\n        <p class="product-price">$${product.price.toFixed(2)}</p>\n      </div>\n      <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>\n    `;
    productGrid.appendChild(productCard);
  });
}

// Filter and sort products
function getFilteredProducts() {
  const searchTerm = (searchInput ? searchInput.value : '').toLowerCase();
  const sortBy = sortSelect ? sortSelect.value : 'default';
  const selectedCategory = Array.from(categoryFilters || []).filter(f => f.classList.contains('active'))[0]?.dataset.category || 'all';
  
  let products = window.LUNA_PRODUCTS || [];
  
  // Category filter
  if (selectedCategory !== 'all') {
    products = products.filter(p => p.category === selectedCategory);
  }
  
  // Search filter
  if (searchTerm) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm) || 
      p.category.toLowerCase().includes(searchTerm) ||
      p.material.toLowerCase().includes(searchTerm)
    );
  }
  
  // Sort
  switch (sortBy) {
    case 'price-low':
      products.sort((a