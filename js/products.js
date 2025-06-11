// DOM Elements
const productsGrid = document.querySelector('.products-grid');
const categoryFilter = document.getElementById('category-filter');
const sortBy = document.getElementById('sort-by');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const pageNumbers = document.querySelectorAll('.page-numbers span');

// Sample product data
const products = [
    {
        id: 1,
        title: "Wireless Bluetooth Headphones",
        price: 79.99,
        oldPrice: 99.99,
        image: "images/headphones.jpg",
        rating: 4.5,
        category: "electronics",
        badge: "Sale"
    },
    {
        id: 2,
        title: "Smart Watch Fitness Tracker",
        price: 129.99,
        oldPrice: 149.99,
        image: "images/smartwatch.png",
        rating: 4.2,
        category: "electronics",
        badge: "Popular"
    },
    {
        id: 3,
        title: "Cotton T-Shirt",
        price: 19.99,
        image: "images/kurta.avif",
        rating: 4.0,
        category: "fashion"
    },
    {
        id: 4,
        title: "Camera",
        price: 34.99,
        image: "images/camera.jpg",
        rating: 4.7,
        category: "home"
    },
    {
        id: 5,
        title: "Mouse",
        price: 59.99,
        oldPrice: 79.99,
        image: "images/mouse.jpg",
        rating: 4.3,
        category: "electronics",
        badge: "New"
    },
    {
        id: 6,
        title: "Mobile",
        price: 49.99,
        image: "images/mobile.avif",
        rating: 4.1,
        category: "fashion"
    },
    {
        id: 7,
        title: "Electronic",
        price: 89.99,
        image: "images/electronic.jpg",
        rating: 4.4,
        category: "home"
    },
    {
        id: 8,
        title: "Running Shoes",
        price: 69.99,
        oldPrice: 89.99,
        image: "images/shoes.jpg",
        rating: 4.6,
        category: "fashion",
        badge: "Best Seller"
    }
];

// Pagination variables
let currentPage = 1;
const productsPerPage = 6;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCartCount();
    
    // Get category from URL if exists
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        categoryFilter.value = category;
        filterProducts();
    }
});

// Display products
function displayProducts(filteredProducts = products) {
    // Sort products
    const sortedProducts = sortProducts(filteredProducts);
    
    // Paginate products
    const paginatedProducts = paginateProducts(sortedProducts);
    
    let output = '';
    
    paginatedProducts.forEach(product => {
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
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <div class="product-rating">
                        ${getRatingStars(product.rating)}
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
    });
    
    productsGrid.innerHTML = output;
    
    // Add event listeners to all add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Sort products
function sortProducts(products) {
    const sortValue = sortBy.value;
    
    switch(sortValue) {
        case 'price-low':
            return [...products].sort((a, b) => a.price - b.price);
        case 'price-high':
            return [...products].sort((a, b) => b.price - a.price);
        case 'rating':
            return [...products].sort((a, b) => b.rating - a.rating);
        default:
            return products;
    }
}

// Paginate products
function paginateProducts(products) {
    const startIndex = (currentPage - 1) * productsPerPage;
    return products.slice(startIndex, startIndex + productsPerPage);
}

// Filter products
function filterProducts() {
    const category = categoryFilter.value;
    
    let filteredProducts = products;
    
    // Filter by category
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
            product.category === category
        );
    }
    
    displayProducts(filteredProducts);
    updatePagination(filteredProducts.length);
}

// Update pagination
function updatePagination(totalProducts) {
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    
    // Update page numbers
    pageNumbers.forEach((page, index) => {
        if (index < totalPages) {
            page.style.display = 'flex';
            page.textContent = index + 1;
            page.classList.toggle('active', index + 1 === currentPage);
        } else {
            page.style.display = 'none';
        }
    });
    
    // Update prev/next buttons
    prevBtn.classList.toggle('disabled', currentPage === 1);
    nextBtn.classList.toggle('disabled', currentPage === totalPages || totalPages === 0);
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

// Event listeners
categoryFilter.addEventListener('change', () => {
    currentPage = 1;
    filterProducts();
});

sortBy.addEventListener('change', () => {
    currentPage = 1;
    filterProducts();
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        filterProducts();
    }
});

nextBtn.addEventListener('click', () => {
    const totalProducts = categoryFilter.value === 'all' ? products.length : 
        products.filter(p => p.category === categoryFilter.value).length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    
    if (currentPage < totalPages) {
        currentPage++;
        filterProducts();
    }
});

pageNumbers.forEach(page => {
    page.addEventListener('click', () => {
        currentPage = parseInt(page.textContent);
        filterProducts();
    });
});