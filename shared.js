// Shared utilities and components for City Pulse Furniture

// Toast notification system
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease;
    font-weight: 500;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add toast animations to head if not present
if (!document.getElementById('toast-styles')) {
  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(400px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// Shopping Cart Management
class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
    this.updateCartBadge();
  }

  addItem(item) {
    const existingItem = this.items.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ ...item, quantity: 1 });
    }
    this.save();
    this.updateCartBadge();
    showToast('Item added to cart!', 'success');
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.save();
    this.updateCartBadge();
    showToast('Item removed from cart', 'success');
  }

  updateQuantity(itemId, quantity) {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(itemId);
      } else {
        item.quantity = quantity;
        this.save();
        this.updateCartBadge();
      }
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
      return total + (price * item.quantity);
    }, 0);
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  clear() {
    this.items = [];
    this.save();
    this.updateCartBadge();
  }

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      const count = this.getItemCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'block' : 'none';
    }
  }
}

// Initialize global cart instance
window.cart = new ShoppingCart();

// Navigation Component
function loadNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navHTML = `
    <header>
      <div id="navbar">
        <a href="index.html" id="navTitle" class="${currentPage === 'index.html' ? 'active' : ''}">City Pulse Furniture</a>
        <div class="nav-links">
          <a href="index.html" class="navbarCls ${currentPage === 'index.html' ? 'active' : ''}">Home</a>
          <a href="aboutUs.html" class="navbarCls ${currentPage === 'aboutUs.html' ? 'active' : ''}">About Us</a>
          <a href="furniture.html" class="navbarCls ${currentPage === 'furniture.html' ? 'active' : ''}">Furniture</a>
          <a href="ourServices.html" class="navbarCls ${currentPage === 'ourServices.html' ? 'active' : ''}">Our Services</a>
          <a href="contactUs.html" class="navbarCls ${currentPage === 'contactUs.html' ? 'active' : ''}">Contact Us</a>
          <a href="adminLogin.html" class="navbarCls admin-link ${currentPage === 'adminLogin.html' || currentPage === 'adminDashboard.html' ? 'active' : ''}">Admin</a>
          <a href="cart.html" class="navbarCls cart-link">
            <span>🛒</span>
            <span id="cart-badge" class="cart-badge" style="display: none;">0</span>
          </a>
        </div>
        <button class="mobile-menu-toggle" id="mobileMenuToggle">☰</button>
      </div>
    </header>
  `;
  
  const navContainer = document.getElementById('nav-container');
  if (navContainer) {
    navContainer.innerHTML = navHTML;
  } else {
    // If no nav-container exists, create one and insert at the beginning
    const container = document.createElement('div');
    container.id = 'nav-container';
    container.innerHTML = navHTML;
    document.body.insertBefore(container, document.body.firstChild);
  }
  
  // Update cart badge on load
  if (window.cart) {
    window.cart.updateCartBadge();
  }
  
  // Mobile menu toggle
  setTimeout(() => {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
      });
    }
  }, 100);
}

// Form validation helper
function validateForm(formElement) {
  const inputs = formElement.querySelectorAll('input[required], textarea[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.style.borderColor = '#dc3545';
      setTimeout(() => {
        input.style.borderColor = '';
      }, 3000);
    } else {
      input.style.borderColor = '#28a745';
    }
  });
  
  return isValid;
}

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadNavigation);
} else {
  loadNavigation();
}

