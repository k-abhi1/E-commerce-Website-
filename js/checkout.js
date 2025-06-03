// DOM Elements
const checkoutForm = document.getElementById('checkoutForm');
const paymentMethods = document.querySelectorAll('input[name="payment"]');
const summaryItems = document.querySelector('.summary-items');
const subtotalElement = document.querySelector('.order-summary .subtotal');
const shippingElement = document.querySelector('.order-summary .shipping');
const taxElement = document.querySelector('.order-summary .tax');
const totalElement = document.querySelector('.order-summary .total-amount');
const placeOrderBtn = document.querySelector('.place-order-btn');

// Cart data
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    displayOrderSummary();
    updateCartCount();
    
    // If cart is empty, redirect to cart page
    if (cart.length === 0) {
        window.location.href = 'cart.html';
    }
});

// Display order summary
function displayOrderSummary() {
    let output = '';
    
    cart.forEach(item => {
        output += `
            <div class="order-item">
                <div class="item-info">
                    <span class="item-name">${item.title} × ${item.quantity}</span>
                    <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            </div>
        `;
    });
    
    summaryItems.innerHTML = output;
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    shippingElement.textContent = subtotal > 50 ? 'Free' : `$${shipping.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Payment method toggle
paymentMethods.forEach(method => {
    method.addEventListener('change', () => {
        document.querySelectorAll('.payment-details').forEach(details => {
            details.style.display = 'none';
        });
        
        const detailsId = `${method.value}-details`;
        document.getElementById(detailsId).style.display = 'block';
    });
});

// Form submission
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Disable button to prevent multiple submissions
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = 'Processing...';
    
    // In a real app, you would process payment here
    // For demo purposes, we'll simulate a successful payment
    setTimeout(() => {
        // Create order object
        const order = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: [...cart],
            customer: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zip: document.getElementById('zip').value,
                country: document.getElementById('country').value
            },
            paymentMethod: document.querySelector('input[name="payment"]:checked').value,
            subtotal: parseFloat(subtotalElement.textContent.replace('$', '')),
            shipping: shippingElement.textContent === 'Free' ? 0 : parseFloat(shippingElement.textContent.replace('$', '')),
            tax: parseFloat(taxElement.textContent.replace('$', '')),
            total: parseFloat(totalElement.textContent.replace('$', ''))
        };
        
        // Save order to localStorage (in a real app, send to server)
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Clear cart
        localStorage.removeItem('cart');
        
        // Redirect to thank you page with order ID
        window.location.href = `thank-you.html?orderId=${order.id}`;
    }, 1500);
});

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}