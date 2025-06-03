// DOM Elements
const orderIdElement = document.getElementById('orderId');
const summaryDetails = document.querySelector('.summary-details');

// Get order ID from URL
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    if (!orderId) {
        window.location.href = 'index.html';
        return;
    }
    
    // Display order ID
    orderIdElement.textContent = orderId;
    
    // Get order details from localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id.toString() === orderId);
    
    if (order) {
        displayOrderDetails(order);
    } else {
        window.location.href = 'index.html';
    }
    
    updateCartCount();
});

// Display order details
function displayOrderDetails(order) {
    // Format date
    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Calculate item count
    const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
    
    let output = `
        <div class="detail-row">
            <span>Order Date</span>
            <span>${formattedDate}</span>
        </div>
        <div class="detail-row">
            <span>Items</span>
            <span>${itemCount}</span>
        </div>
        <div class="detail-row">
            <span>Payment Method</span>
            <span>${formatPaymentMethod(order.paymentMethod)}</span>
        </div>
        <div class="detail-row">
            <span>Shipping Address</span>
            <span>
                ${order.customer.firstName} ${order.customer.lastName}<br>
                ${order.customer.address}<br>
                ${order.customer.city}, ${order.customer.state} ${order.customer.zip}<br>
                ${order.customer.country}
            </span>
        </div>
        <div class="detail-row total">
            <span>Total</span>
            <span>$${order.total.toFixed(2)}</span>
        </div>
    `;
    
    summaryDetails.innerHTML = output;
}

// Format payment method
function formatPaymentMethod(method) {
    switch(method) {
        case 'credit-card':
            return 'Credit Card';
        case 'paypal':
            return 'PayPal';
        default:
            return method;
    }
}

// Update cart count (should be 0 after checkout)
function updateCartCount() {
    document.querySelector('.cart-count').textContent = '0';
}