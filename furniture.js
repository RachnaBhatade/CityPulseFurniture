// Furniture Page JavaScript

// Sample furniture data
const defaultFurniture = [
  {
    id: 1,
    title: 'Modern Chair',
    price: '$100',
    description: 'Modern and stylish chair for your living room or office. Features ergonomic design and premium materials.',
    image: 'Images/Chair1.png',
    badge: 'best-seller',
    category: 'chairs'
  },
  {
    id: 2,
    title: 'Elegant Sofa Set',
    price: '$200',
    description: 'Elegant furniture set to elevate your home interior. Comfortable and spacious design perfect for family gatherings.',
    image: 'Images/empty-modern-room-with-furniture.jpg',
    badge: 'new-arrival',
    category: 'sofas'
  },
  {
    id: 3,
    title: 'Classic Armchair',
    price: '$150',
    description: 'Classic design with premium quality and comfort. Timeless elegance that fits any decor style.',
    image: 'Images/pexels-pixabay-416320.jpg',
    badge: 'classic',
    category: 'chairs'
  }
];

// Load furniture from localStorage or use default
function loadFurniture() {
  const savedChairs = JSON.parse(localStorage.getItem('chairs')) || [];
  const allFurniture = [...defaultFurniture];
  
  // Add saved chairs with unique IDs
  savedChairs.forEach((chair, index) => {
    allFurniture.push({
      id: defaultFurniture.length + index + 1,
      title: chair.title || 'Custom Furniture',
      price: chair.price || '$0',
      description: chair.description || 'Custom designed furniture piece.',
      image: chair.image || 'Images/Chair1.png',
      badge: 'custom',
      category: 'custom'
    });
  });
  
  return allFurniture;
}

let allFurniture = loadFurniture();
let filteredFurniture = [...allFurniture];

// Render furniture items
function renderFurniture(furnitureArray) {
  const container = document.getElementById('furnitureContainer');
  const noResults = document.getElementById('noResults');
  
  if (furnitureArray.length === 0) {
    container.innerHTML = '';
    noResults.style.display = 'block';
    return;
  }
  
  noResults.style.display = 'none';
  container.innerHTML = furnitureArray.map(item => `
    <div class="furniture-item" data-id="${item.id}">
      ${item.badge ? `<span class="furniture-badge">${getBadgeText(item.badge)}</span>` : ''}
      <img src="${item.image}" alt="${item.title}" onerror="this.src='Images/Chair1.png'">
      <h3>${item.title}</h3>
      <div class="furniture-price">${item.price}</div>
      <p class="furniture-description">${item.description}</p>
      <div class="furniture-actions">
        <button class="btn-view" onclick="viewProduct(${item.id})">View</button>
        <button class="btn-add-cart" onclick="addToCart(${item.id})">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

function getBadgeText(badge) {
  const badges = {
    'best-seller': 'Best Seller',
    'new-arrival': 'New Arrival',
    'classic': 'Classic',
    'custom': 'Custom'
  };
  return badges[badge] || '';
}

// Search functionality
document.getElementById('searchInput')?.addEventListener('input', function(e) {
  const searchTerm = e.target.value.toLowerCase();
  filterFurniture();
});

// Filter functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    filterFurniture();
  });
});

// Sort functionality
document.getElementById('sortSelect')?.addEventListener('change', function(e) {
  sortFurniture(e.target.value);
});

function filterFurniture() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  
  filteredFurniture = allFurniture.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm) ||
                         item.description.toLowerCase().includes(searchTerm);
    const matchesFilter = activeFilter === 'all' || item.badge === activeFilter;
    return matchesSearch && matchesFilter;
  });
  
  const sortValue = document.getElementById('sortSelect')?.value || 'default';
  sortFurniture(sortValue);
}

function sortFurniture(sortBy) {
  const sorted = [...filteredFurniture];
  
  switch(sortBy) {
    case 'price-low':
      sorted.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
        return priceA - priceB;
      });
      break;
    case 'price-high':
      sorted.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
        return priceB - priceA;
      });
      break;
    case 'name':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }
  
  filteredFurniture = sorted;
  renderFurniture(filteredFurniture);
}

// View product details
function viewProduct(id) {
  const product = allFurniture.find(item => item.id === id);
  if (!product) return;
  
  const modal = document.getElementById('productModal');
  const modalBody = document.getElementById('modalBody');
  const modalTitle = document.getElementById('modalTitle');
  
  modalTitle.textContent = product.title;
  modalBody.innerHTML = `
    <div>
      <img src="${product.image}" alt="${product.title}" class="modal-image" onerror="this.src='Images/Chair1.png'">
    </div>
    <div class="modal-info">
      <h3>${product.title}</h3>
      <div class="modal-price">${product.price}</div>
      <p class="modal-description">${product.description}</p>
      <div class="modal-actions">
        <button class="btn btn-primary" onclick="addToCart(${id}); closeModal();">Add to Cart</button>
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      </div>
    </div>
  `;
  
  modal.classList.add('active');
}

// Close modal
function closeModal() {
  document.getElementById('productModal').classList.remove('active');
}

// Add to cart
function addToCart(id) {
  const product = allFurniture.find(item => item.id === id);
  if (!product) return;
  
  if (window.cart) {
    window.cart.addItem(product);
  }
}

// Close modal on outside click
document.getElementById('productModal')?.addEventListener('click', function(e) {
  if (e.target === this) {
    closeModal();
  }
});

document.getElementById('closeModal')?.addEventListener('click', closeModal);

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  // Reload furniture in case new items were added
  allFurniture = loadFurniture();
  filteredFurniture = [...allFurniture];
  renderFurniture(filteredFurniture);
});

