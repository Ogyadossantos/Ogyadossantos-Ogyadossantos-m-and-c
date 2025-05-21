// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count
    updateCartCount();
    
    // Load weekly specials on home page
    if (document.querySelector('.weekly-specials')) {
        loadWeeklySpecials();
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
    
    // Mobile menu toggle (for future mobile responsiveness)
    const mobileMenuToggle = document.createElement('div');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    const header = document.querySelector('.header .container');
    if (header) {
        header.appendChild(mobileMenuToggle);
        
        mobileMenuToggle.addEventListener('click', function() {
            document.querySelector('.nav').classList.toggle('active');
        });
    }
});

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    let totalItems = 0;
    cart.forEach(item => {
        totalItems += item.quantity;
    });
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Load weekly specials
function loadWeeklySpecials() {
    const products = [
        {
            id: 1,
            name: 'Organic Apples',
            price: 2.99,
            image: 'images/apples.jpg',
            rating: 4
        },
        {
            id: 2,
            name: 'Fresh Bananas',
            price: 1.49,
            image: 'images/bananas.jpeg',
            rating: 5
        },
        {
            id: 3,
            name: 'Organic Carrots',
            price: 1.99,
            image: 'images/carrots.jpeg',
            rating: 4
        },
        {
            id: 4,
            name: 'Free Range Eggs',
            price: 3.99,
            image: 'images/eggs.jpeg',
            rating: 5
        }
    ];
    
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-rating">
                    ${'<i class="fas fa-star"></i>'.repeat(product.rating)}
                    ${'<i class="far fa-star"></i>'.repeat(5 - product.rating)}
                </div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Add to cart function
function addToCart(productId) {
    // In a real app, we would fetch the product details from our database
    // For this demo, we'll use a simple object
    const product = {
        id: productId,
        name: `Product ${productId}`,
        price: Math.random() * 10 + 1, // Random price between 1 and 11
        quantity: 1
    };
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show added to cart notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = `${product.name} added to cart!`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2000);
}