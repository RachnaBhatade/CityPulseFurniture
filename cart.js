// Shopping Cart Page JavaScript

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartSummary = document.getElementById('cartSummary');
  const emptyCart = document.getElementById('emptyCart');
  
  if (!window.cart || window.cart.items.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart" id="emptyCart">
        <p>Your cart is empty</p>
        <a href="furniture.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    `;
    cartSummary.style.display = 'none';
    return;
  }
  
  emptyCart.style.display = 'none';
  cartSummary.style.display = 'block';
  
  cartItems.innerHTML = window.cart.items.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image || 'Images/Chair1.png'}" alt="${item.title}" class="cart-item-image" onerror="this.src='Images/Chair1.png'">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-description">${item.description || ''}</div>
        <div class="cart-item-price">${item.price}</div>
      </div>
      <div class="cart-item-controls">
        <div class="quantity-control">
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
          <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                 onchange="updateQuantity(${item.id}, parseInt(this.value))">
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </div>
        <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
      </div>
    </div>
  `).join('');
  
  updateSummary();
}

function updateQuantity(itemId, quantity) {
  if (window.cart) {
    window.cart.updateQuantity(itemId, quantity);
    renderCart();
  }
}

function removeItem(itemId) {
  if (confirm('Are you sure you want to remove this item from your cart?')) {
    if (window.cart) {
      window.cart.removeItem(itemId);
      renderCart();
    }
  }
}

function updateSummary() {
  if (!window.cart) return;
  
  const subtotal = window.cart.getTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  
  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function checkout() {
  if (!window.cart || window.cart.items.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }
  
  const total = window.cart.getTotal() * 1.1;
  if (confirm(`Proceed to checkout? Total: $${total.toFixed(2)}`)) {
    showToast('Thank you for your purchase! Order placed successfully.', 'success');
    window.cart.clear();
    setTimeout(() => {
      window.location.href = 'furniture.html';
    }, 2000);
  }
}

// Initialize cart page
document.addEventListener('DOMContentLoaded', function() {
  renderCart();
  
  // Update cart badge in navigation
  if (window.cart) {
    window.cart.updateCartBadge();
  }
});

