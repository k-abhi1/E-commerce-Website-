// DOM Elements
const productsGrid = document.querySelector('.products-grid');
const categoryFilter = document.getElementById('category-filter');
const sortBy = document.getElementById('sort-by');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const pageNumbers = document.querySelectorAll('.page-numbers span');

// Product data (same as in main.js)
const products = [
    // Copy the products array from main.js
];

// Pagination variables
let currentPage = 1;
const productsPerPage = 8;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCartCount();
    
    // Get category from URL if exists
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        categoryFilter.value = category;
    }
    
    // Get search term from URL if exists
    const searchTerm = urlParams.get('search');
    
    if (searchTerm) {
        document.querySelector('.search-form-container input').value = searchTerm;
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
                    <a href="product-detail.html?id=${product.id}" class="view-details">View Details</a>
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
        case 'newest':
            return [...products].reverse(); // Assuming newer products are at the end
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
    const searchTerm = document.querySelector('.search-form-container input').value.toLowerCase();
    
    let filteredProducts = products;
    
    // Filter by category
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
            product.category === category
        );
    }
    
    // Filter by search term
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
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
            page.style.display = 'inline-block';
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

// Cart functions (same as main.js)
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
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
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.title} added to cart!`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
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