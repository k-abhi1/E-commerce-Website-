// DOM Elements
const aboutImage = document.getElementById('about-image');
const teamImages = document.querySelectorAll('.team-img');

// Animation for about image
aboutImage.addEventListener('mouseenter', () => {
    aboutImage.style.transform = 'scale(1.05)';
});

aboutImage.addEventListener('mouseleave', () => {
    aboutImage.style.transform = 'scale(1)';
});

// Team member hover effect
teamImages.forEach(img => {
    img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.1)';
        img.style.borderColor = 'var(--primary-color)';
    });
    
    img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
        img.style.borderColor = '#f0f0f0';
    });
});

// Counter animation for stats
function animateStats() {
    const statItems = document.querySelectorAll('.stat-item h4');
    const durations = [2000, 2500, 3000];
    
    statItems.forEach((stat, index) => {
        const target = parseInt(stat.textContent);
        const duration = durations[index];
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(timer);
                stat.textContent = target + (index === 0 ? '+' : '');
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Initialize when scrolled to stats
window.addEventListener('scroll', () => {
    const statsSection = document.querySelector('.stats');
    const position = statsSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    
    if (position < screenPosition) {
        animateStats();
        window.removeEventListener('scroll', this);
    }
});

// Update cart count from localStorage
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});