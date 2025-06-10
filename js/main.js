// DOM Elements
const searchBtn = document.getElementById('search-btn');
const searchFormContainer = document.querySelector('.search-form-container');
const closeSearch = document.querySelector('.close-search');
const productGrid = document.querySelector('.product-grid');

// Sample product data (in a real app, this would come from an API)
const products = [
    {
        id: 1,
        title: "Wireless Bluetooth Headphones",
        price: 79.99,
        oldPrice: 99.99,
        image: "../images/headphones.jpg",
        rating: 4.5,
        badge: "Sale"
    },
    {
        id: 2,
        title: "Smart Watch Fitness Tracker",
        price: 129.99,
        oldPrice: 149.99,
        image: "images/smartwatch.png",
        rating: 4.2,
        badge: "Popular"
    },
    {
        id: 3,
        title: "4K Ultra HD Smart TV",
        price: 599.99,
        oldPrice: 699.99,
        image: "images/tv.avif",
        rating: 4.8,
        badge: "New"
    },
    {
        id: 4,
        title: "Laptop Pro 16GB RAM 512GB SSD",
        price: 999.99,
        oldPrice: 1099.99,
        image: "images/laptop.jpg",
        rating: 4.7,
        badge: "Hot"
    },
    {
        id: 5,
        title: "Digital Camera 24MP",
        price: 349.99,
        oldPrice: 399.99,
        image: "images/camera.jpg",
        rating: 4.3,
        badge: null
    },
    {
        id: 6,
        title: "Wireless Gaming Mouse",
        price: 49.99,
        oldPrice: 59.99,
        image: "images/mouse.jpg",
        rating: 4.1,
        badge: "Sale"
    },
    {
        id: 7,
        title: "Mechanical Keyboard",
        price: 89.99,
        oldPrice: 99.99,
        image: "images/mck.avif",
        rating: 4.4,
        badge: null
    },
    {
        id: 8,
        title: "Kurta",
        price: 199.99,
        oldPrice: 249.99,
        image: "images/kurta.avif",
        rating: 4.6,
        badge: "Best Seller"
    }
];

// Event Listeners
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    searchFormContainer.classList.add('active');
});

closeSearch.addEventListener('click', () => {
    searchFormContainer.classList.remove('active');
});

// Load featured products
document.addEventListener('DOMContentLoaded', () => {
    displayFeaturedProducts();
});

// Display featured products
function displayFeaturedProducts() {
    // Get first 6 products for featured section
    const featuredProducts = products.slice(0,8);
    
    let output = '';
    
    featuredProducts.forEach(product => {
        output += `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        <span class="old-price">$${product.oldPrice.toFixed(2)}</span>
                    </div>
                    <div class="product-rating">
                        ${getRatingStars(product.rating)}
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
    });
    
    productGrid.innerHTML = output;
    
    // Add event listeners to all add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Get rating stars HTML
function getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show added notification
    showNotification(`${product.title} added to cart!`);
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
 // Mobile menu toggle
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('nav');

menuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuBtn.innerHTML = nav.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Close menu when clicking on a link
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Initialize cart count on page load
updateCartCount();