// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize checkout process
    initCheckout();
});

function initCheckout() {
    // Load cart items
    loadCartItems();
    
    // Setup checkout navigation
    setupCheckoutNavigation();
    
    // Setup payment method selection
    setupPaymentMethods();
    
    // Setup form submission
    setupFormSubmission();
}

function setupCheckoutNavigation() {
    // Delivery next button
    const deliveryNext = document.getElementById('delivery-next');
    if (deliveryNext) {
        deliveryNext.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Validate delivery form first
            if (!validateDeliveryForm()) {
                return;
            }
            
            document.getElementById('delivery-section').classList.add('hidden');
            document.getElementById('payment-section').classList.remove('hidden');
            
            // Update checkout steps
            updateCheckoutSteps(1);
        });
    }
    
    // Payment back button
    const paymentBack = document.getElementById('payment-back');
    if (paymentBack) {
        paymentBack.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('payment-section').classList.add('hidden');
            document.getElementById('delivery-section').classList.remove('hidden');
            
            // Update checkout steps
            updateCheckoutSteps(0);
        });
    }
}

function validateDeliveryForm() {
    const name = document.getElementById('delivery-name').value.trim();
    const address = document.getElementById('delivery-address').value.trim();
    const city = document.getElementById('delivery-city').value.trim();
    const zip = document.getElementById('delivery-zip').value.trim();
    const phone = document.getElementById('delivery-phone').value.trim();
    const time = document.getElementById('delivery-time').value;
    
    if (!name || !address || !city || !zip || !phone || !time) {
        alert('Please fill in all delivery information');
        return false;
    }
    
    // Basic phone validation
    if (!/^[\d\s\-()+]{10,}$/.test(phone)) {
        alert('Please enter a valid phone number');
        return false;
    }
    
    // Basic ZIP code validation
    if (!/^\d{5}(-\d{4})?$/.test(zip)) {
        alert('Please enter a valid ZIP code');
        return false;
    }
    
    return true;
}

function updateCheckoutSteps(activeIndex) {
    document.querySelectorAll('.checkout-steps .step').forEach((step, index) => {
        if (index === activeIndex) {
            step.classList.add('active');
        } else if (index < activeIndex) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

function setupPaymentMethods() {
    // Payment method selection
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            document.querySelectorAll('.payment-method').forEach(m => {
                m.classList.remove('active');
            });
            this.classList.add('active');
            
            const methodType = this.getAttribute('data-method');
            document.getElementById('credit-card-form').classList.toggle('hidden', methodType !== 'credit');
            document.getElementById('paypal-form').classList.toggle('hidden', methodType !== 'paypal');
        });
    });
}

function setupFormSubmission() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get selected payment method
            const selectedMethod = document.querySelector('.payment-method.active').getAttribute('data-method');
            
            // Validate based on payment method
            if (selectedMethod === 'credit' && !validateCreditCardForm()) {
                return;
            }
            
            // Process payment (simulated)
            processPayment(selectedMethod);
        });
    }
}

function validateCreditCardForm() {
    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    const cardExpiry = document.getElementById('card-expiry').value;
    const cardCvc = document.getElementById('card-cvc').value;
    const cardName = document.getElementById('card-name').value.trim();
    
    if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
        alert('Please fill in all credit card details');
        return false;
    }
    
    // Card number validation (16 digits)
    if (!/^\d{16}$/.test(cardNumber)) {
        alert('Please enter a valid 16-digit card number');
        return false;
    }
    
    // Expiry date validation (MM/YY)
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        alert('Please enter expiry date in MM/YY format');
        return false;
    }
    
    // Check if card is expired
    const [expMonth, expYear] = cardExpiry.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (parseInt(expYear) < currentYear || 
        (parseInt(expYear) === currentYear && parseInt(expMonth) < currentMonth)) {
        alert('This credit card has expired');
        return false;
    }
    
    // CVC validation (3 or 4 digits)
    if (!/^\d{3,4}$/.test(cardCvc)) {
        alert('Please enter a valid CVC (3 or 4 digits)');
        return false;
    }
    
    return true;
}

function processPayment(method) {
    // Show loading state
    const submitButton = document.querySelector('#checkoutForm button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Randomly decide if payment succeeds (80% chance)
        const isSuccess = Math.random() < 0.8;
        
        if (isSuccess) {
            completeCheckout();
        } else {
            // Show payment failed message
            alert('Payment failed. Please try again or use a different payment method.');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }, 1500);
}

function completeCheckout() {
    // Create order summary
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const deliveryFee = 5.99;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + deliveryFee;
    
    // Generate order number
    const orderNumber = 'MC' + Date.now().toString().slice(-6);
    
    // Save order to localStorage (for order history)
    const order = {
        orderNumber,
        date: new Date().toISOString(),
        items: cart,
        subtotal,
        deliveryFee,
        total,
        status: 'Processing'
    };
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear the cart
    localStorage.removeItem('cart');
    updateCartCount();
    
    // Update confirmation modal with order details
    const confirmationModal = document.getElementById('confirmation-modal');
    if (confirmationModal) {
        confirmationModal.querySelector('strong').textContent = `#${orderNumber}`;
        
        // Show order summary
        const orderSummary = document.createElement('div');
        orderSummary.className = 'order-summary';
        orderSummary.innerHTML = `
            <h3>Order Summary</h3>
            <ul>
                ${cart.map(item => `
                    <li>${item.quantity} x ${item.name} - $${(item.price * item.quantity).toFixed(2)}</li>
                `).join('')}
            </ul>
            <div class="order-totals">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Delivery Fee:</span>
                    <span>$${deliveryFee.toFixed(2)}</span>
                </div>
                <div class="total-row grand-total">
                    <span>Total:</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
            </div>
        `;
        
        const modalContent = confirmationModal.querySelector('.modal-content');
        modalContent.insertBefore(orderSummary, modalContent.querySelector('a'));
    }
    
    // Show confirmation modal
    document.getElementById('confirmation-modal').classList.remove('hidden');
    
    // Update checkout steps
    updateCheckoutSteps(3);
}

// Load cart items
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItems = document.getElementById('order-items');
    const subtotalElement = document.querySelector('.subtotal');
    const totalElement = document.querySelector('.total');
    
    orderItems.innerHTML = '';
    
    let subtotal = 0;
    
    if (cart.length === 0) {
        orderItems.innerHTML = '<p>Your cart is empty</p>';
        subtotalElement.textContent = '$0.00';
        totalElement.textContent = '$5.99'; // Just delivery fee
        return;
    }
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="order-item-info">
                <h4>${item.name}</h4>
                <div class="order-item-price">$${item.price.toFixed(2)}</div>
                <div class="order-item-qty">
                    <button class="decrease-qty" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-qty" data-id="${item.id}">+</button>
                </div>
            </div>
        `;
        orderItems.appendChild(orderItem);
    });
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.decrease-qty').forEach(button => {
        button.addEventListener('click', function() {
            updateQuantity(parseInt(this.getAttribute('data-id')), -1);
        });
    });
    
    document.querySelectorAll('.increase-qty').forEach(button => {
        button.addEventListener('click', function() {
            updateQuantity(parseInt(this.getAttribute('data-id')), 1);
        });
    });
    
    // Update totals
    const deliveryFee = 5.99;
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${(subtotal + deliveryFee).toFixed(2)}`;
}

// Update item quantity
function updateQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        // Remove item if quantity is 0 or less
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartCount();
    }
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