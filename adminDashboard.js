// Admin Dashboard JavaScript

let editingId = null;

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    this.classList.add('active');
    const tabId = this.dataset.tab + 'Tab';
    document.getElementById(tabId).classList.add('active');
    
    if (this.dataset.tab === 'manage') {
      loadProducts();
    }
  });
});

// Image preview
document.getElementById('chairImage')?.addEventListener('change', function(e) {
  const file = e.target.files[0];
  const preview = document.getElementById('imagePreview');
  
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 200px; border-radius: 8px; margin-top: 10px;">`;
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = '';
  }
});

// Add product form
document.getElementById('uploadForm')?.addEventListener('submit', function(event) {
  event.preventDefault();

  const title = document.getElementById('chairTitle').value;
  const image = document.getElementById('chairImage').files[0];
  const price = document.getElementById('chairPrice').value;
  const description = document.getElementById('chairDescription').value;
  const badge = document.getElementById('chairBadge').value;

  if (title && image && price && description) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const chairs = JSON.parse(localStorage.getItem('chairs')) || [];
      const newId = Date.now(); // Simple ID generation
      
      const chairData = {
        id: newId,
        title: title,
        image: e.target.result,
        price: price,
        description: description,
        badge: badge
      };

      chairs.push(chairData);
      localStorage.setItem('chairs', JSON.stringify(chairs));

      showToast('Product added successfully!', 'success');
      document.getElementById('uploadForm').reset();
      document.getElementById('imagePreview').innerHTML = '';
      
      // Switch to manage tab
      document.querySelector('[data-tab="manage"]').click();
    };
    reader.readAsDataURL(image);
  } else {
    showToast('Please fill all fields!', 'error');
  }
});

// Load and display products
function loadProducts() {
  const container = document.getElementById('productsContainer');
  const defaultFurniture = [
    { id: 1, title: 'Modern Chair', price: '$100', description: 'Modern and stylish chair', image: 'Images/Chair1.png', badge: 'best-seller' },
    { id: 2, title: 'Elegant Sofa Set', price: '$200', description: 'Elegant furniture set', image: 'Images/empty-modern-room-with-furniture.jpg', badge: 'new-arrival' },
    { id: 3, title: 'Classic Armchair', price: '$150', description: 'Classic design', image: 'Images/pexels-pixabay-416320.jpg', badge: 'classic' }
  ];
  
  const savedChairs = JSON.parse(localStorage.getItem('chairs')) || [];
  const allProducts = [...defaultFurniture, ...savedChairs];
  
  if (allProducts.length === 0) {
    container.innerHTML = '<p class="no-products">No products found. Add your first product!</p>';
    return;
  }
  
  container.innerHTML = allProducts.map(product => `
    <div class="product-card" data-id="${product.id}">
      <div class="product-image">
        <img src="${product.image || 'Images/Chair1.png'}" alt="${product.title}" onerror="this.src='Images/Chair1.png'">
        ${product.badge ? `<span class="product-badge">${getBadgeText(product.badge)}</span>` : ''}
      </div>
      <div class="product-info">
        <h3>${product.title}</h3>
        <p class="product-price">${product.price}</p>
        <p class="product-description">${product.description || ''}</p>
      </div>
      <div class="product-actions">
        <button class="btn btn-primary btn-sm" onclick="editProduct(${product.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Delete</button>
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

// Edit product
function editProduct(id) {
  const defaultFurniture = [
    { id: 1, title: 'Modern Chair', price: '$100', description: 'Modern and stylish chair', image: 'Images/Chair1.png', badge: 'best-seller' },
    { id: 2, title: 'Elegant Sofa Set', price: '$200', description: 'Elegant furniture set', image: 'Images/empty-modern-room-with-furniture.jpg', badge: 'new-arrival' },
    { id: 3, title: 'Classic Armchair', price: '$150', description: 'Classic design', image: 'Images/pexels-pixabay-416320.jpg', badge: 'classic' }
  ];
  
  const savedChairs = JSON.parse(localStorage.getItem('chairs')) || [];
  const allProducts = [...defaultFurniture, ...savedChairs];
  const product = allProducts.find(p => p.id === id);
  
  if (!product) return;
  
  editingId = id;
  document.getElementById('editId').value = id;
  document.getElementById('editTitle').value = product.title;
  document.getElementById('editPrice').value = product.price;
  document.getElementById('editDescription').value = product.description || '';
  document.getElementById('editBadge').value = product.badge || 'custom';
  
  document.getElementById('editModal').classList.add('active');
}

// Save edited product
document.getElementById('editForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const id = parseInt(document.getElementById('editId').value);
  const title = document.getElementById('editTitle').value;
  const price = document.getElementById('editPrice').value;
  const description = document.getElementById('editDescription').value;
  const badge = document.getElementById('editBadge').value;
  
  const savedChairs = JSON.parse(localStorage.getItem('chairs')) || [];
  const index = savedChairs.findIndex(c => c.id === id);
  
  if (index !== -1) {
    savedChairs[index] = {
      ...savedChairs[index],
      title,
      price,
      description,
      badge
    };
    localStorage.setItem('chairs', JSON.stringify(savedChairs));
    showToast('Product updated successfully!', 'success');
  } else {
    showToast('Cannot edit default products. Add a new product to edit.', 'error');
  }
  
  closeEditModal();
  loadProducts();
});

// Delete product
function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  
  const savedChairs = JSON.parse(localStorage.getItem('chairs')) || [];
  const filtered = savedChairs.filter(c => c.id !== id);
  
  if (filtered.length === savedChairs.length) {
    showToast('Cannot delete default products.', 'error');
    return;
  }
  
  localStorage.setItem('chairs', JSON.stringify(filtered));
  showToast('Product deleted successfully!', 'success');
  loadProducts();
}

// Close edit modal
function closeEditModal() {
  document.getElementById('editModal').classList.remove('active');
  editingId = null;
  document.getElementById('editForm').reset();
}

document.getElementById('closeEditModal')?.addEventListener('click', closeEditModal);

document.getElementById('editModal')?.addEventListener('click', function(e) {
  if (e.target === this) {
    closeEditModal();
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  loadProducts();
});
