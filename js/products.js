// Sample product data
const products = [
    { id: 1, title: "Wireless Headphones", price: 79.99, category: "electronics", image: "images/headphones.jpg" },
    { id: 2, title: "Smart Watch", price: 129.99, category: "electronics", image: "images/smartwatch.jpg" },
    { id: 3, title: "Cotton T-Shirt", price: 19.99, category: "fashion", image: "images/tshirt.jpg" },
    { id: 4, title: "Ceramic Vase", price: 34.99, category: "home", image: "images/vase.jpg" }
];

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
});

function displayProducts(filteredProducts = products) {
    const grid = document.querySelector('.products-grid');
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h3>${product.title}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Filter functionality
document.getElementById('category-filter').addEventListener('change', (e) => {
    const category = e.target.value;
    const filtered = category === 'all' ? products : products.filter(p => p.category === category);
    displayProducts(filtered);
});