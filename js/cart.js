// DOM Elements
const cartItemsContainer = document.querySelector('.cart-items');
const emptyCart = document.querySelector('.empty-cart');
const subtotalElement = document.querySelector('.subtotal');
const shippingElement = document.querySelector('.shipping');
const taxElement = document.querySelector('.tax');
const totalElement = document.querySelector('.total-amount');
const checkoutBtn = document.querySelector('.checkout-btn');

// Cart data
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize cart
document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
    updateCartSummary();
    updateCartCount();
});

// Display cart items
function displayCartItems() {
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        checkoutBtn.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    checkoutBtn.style.display = 'block';
    
    let output = '';
    
    cart.forEach(item => {
        output += `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="item-details">
                    <h3 class="item-title">${item.title}</h3>
                    <div class="item-price">$${item.price.toFixed(2)}</div>
                    <div class="item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}"><i class="fas fa-minus"></i></button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="remove-item" data-id="${item.id}"><i class="fas fa-times"></i></button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = output;
    
    // Add event listeners
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', removeItem);
    });
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    shippingElement.textContent = subtotal > 50 ? 'Free' : `$${shipping.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Quantity functions
function increaseQuantity(e) {
    const productId = parseInt(e.target.closest('button').getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    item.quantity += 1;
    saveCart();
    displayCartItems();
    updateCartSummary();
    updateCartCount();
}

function decreaseQuantity(e) {
    const productId = parseInt(e.target.closest('button').getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    
    saveCart();
    displayCartItems();
    updateCartSummary();
    updateCartCount();
}

function removeItem(e) {
    const productId = parseInt(e.target.closest('button').getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    
    saveCart();
    displayCartItems();
    updateCartSummary();
    updateCartCount();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}