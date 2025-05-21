// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Load all products
    loadProducts();
    
    // Search functionality
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterProducts();
        });
    }
    
    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterProducts();
        });
        
        // Check for category in URL
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        if (category) {
            categoryFilter.value = category;
            filterProducts();
        }
    }
});

// Product data
const products = [
    { id: 1, name: 'Organic Apples', price: 2.99, category: 'fruits', image: 'images/apples.jpg', rating: 4 },
    { id: 2, name: 'Fresh Bananas', price: 1.49, category: 'fruits', image: 'images/bananas.jpeg', rating: 5 },
    { id: 3, name: 'Sweet Oranges', price: 3.49, category: 'fruits', image: 'images/oranges.jpg', rating: 4 },
    { id: 4, name: 'Juicy Grapes', price: 4.99, category: 'fruits', image: 'images/grapes.jpeg', rating: 5 },
    { id: 5, name: 'Ripe Strawberries', price: 5.99, category: 'fruits', image: 'images/strawberries.jpeg', rating: 5 },
    { id: 6, name: 'Organic Carrots', price: 1.99, category: 'vegetables', image: 'images/carrots.jpeg', rating: 4 },
    { id: 7, name: 'Fresh Broccoli', price: 2.49, category: 'vegetables', image: 'images/broccoli.jpeg', rating: 4 },
    { id: 8, name: 'Crisp Lettuce', price: 1.79, category: 'vegetables', image: 'images/lettuce.jpeg', rating: 3 },
    { id: 9, name: 'Organic Tomatoes', price: 3.29, category: 'vegetables', image: 'images/tomatoes.jpeg', rating: 5 },
    { id: 10, name: 'Green Bell Peppers', price: 1.99, category: 'vegetables', image: 'images/peppers.jpeg', rating: 4 },
    { id: 11, name: 'Free Range Eggs', price: 3.99, category: 'dairy', image: 'images/eggs.jpeg', rating: 5 },
    { id: 12, name: 'Organic Milk', price: 4.49, category: 'dairy', image: 'images/milk.jpeg', rating: 4 },
    { id: 13, name: 'Cheddar Cheese', price: 5.99, category: 'dairy', image: 'images/cheese.jpeg', rating: 5 },
    { id: 14, name: 'Greek Yogurt', price: 3.49, category: 'dairy', image: 'images/yogurt.jpeg', rating: 4 },
    { id: 15, name: 'Butter', price: 3.99, category: 'dairy', image: 'images/butter.jpeg', rating: 5 },
    { id: 16, name: 'Chicken Breast', price: 7.99, category: 'meat', image: 'images/chicken.jpeg', rating: 4 },
    { id: 17, name: 'Ground Beef', price: 8.49, category: 'meat', image: 'images/beef.jpeg', rating: 5 },
    { id: 18, name: 'Pork Chops', price: 6.99, category: 'meat', image: 'images/pork.jpeg', rating: 4 },
    { id: 19, name: 'Salmon Fillet', price: 12.99, category: 'meat', image: 'images/salmon.jpeg', rating: 5 },
    { id: 20, name: 'Shrimp', price: 14.99, category: 'meat', image: 'images/shrimp.jpg', rating: 5 },
    { id: 21, name: 'Whole Wheat Bread', price: 3.49, category: 'bakery', image: 'images/bread.jpeg', rating: 4 },
    { id: 22, name: 'Bagels', price: 2.99, category: 'bakery', image: 'images/bagels.jpeg', rating: 4 },
    { id: 23, name: 'Croissants', price: 4.99, category: 'bakery', image: 'images/croissants.jpeg', rating: 5 },
    { id: 24, name: 'Mineral Water', price: 1.29, category: 'beverages', image: 'images/water.jpeg', rating: 3 },
    { id: 25, name: 'Orange Juice', price: 3.99, category: 'beverages', image: 'images/orange-juice.jpeg', rating: 4 },
    { id: 26, name: 'Potato Chips', price: 2.49, category: 'snacks', image: 'images/chips.jpeg', rating: 4 },
    { id: 27, name: 'Chocolate Cookies', price: 3.99, category: 'snacks', image: 'images/cookies.jpeg', rating: 5 },
    { id: 28, name: 'Frozen Pizza', price: 6.99, category: 'frozen', image: 'images/pizza.jpeg', rating: 4 },
    { id: 29, name: 'Ice Cream', price: 4.99, category: 'frozen', image: 'images/ice-cream.jpeg', rating: 5 },
    { id: 30, name: 'Frozen Vegetables', price: 2.99, category: 'frozen', image: 'images/frozen-veggies.jpeg', rating: 3 }
];

// Load all products
function loadProducts() {
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        renderProducts(products);
    }
}

// Filter products based on search and category
function filterProducts() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    
    let filteredProducts = products;
    
    // Filter by category
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    // Filter by search term
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
    }
    
    renderProducts(filteredProducts);
}

// Render products to the page
function renderProducts(productsToRender) {
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        productGrid.innerHTML = '';
        
        if (productsToRender.length === 0) {
            productGrid.innerHTML = '<p class="no-results">No products found. Try a different search.</p>';
            return;
        }
        
        productsToRender.forEach(product => {
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
}

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
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