document.addEventListener('DOMContentLoaded', () => {
    const productsSection = document.getElementById('products');
    const cartItemsList = document.getElementById('cart-items');
    const checkoutBtn = document.getElementById('checkout-btn');


    window.onload = ()=>{
        localStorage.setItem("bool","false");    
        document.getElementById("scanner").style.display="none";
    }
    // Fetch products from backend

    fetch('/products')
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>Price: $${product.price}</p>
                    <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                `;
                productsSection.appendChild(productElement);
            });
        });

    // Add event listener for adding items to cart
    
    productsSection.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productId = event.target.dataset.id;
            // Send request to add item to cart
            fetch(`/cart/add/${productId}`, { method: 'POST' })
                .then(response => response.json())
                .then(cartItem => {
                    const cartItemElement = document.createElement('li');
                    cartItemElement.textContent = `${cartItem.name} - $${cartItem.price}`;
                    cartItemsList.appendChild(cartItemElement);
                });
        }
    });

    // Event listener for checkout button
    checkoutBtn.addEventListener('click', () => {
        // Send request to backend to process checkout
        fetch('/cart/checkout', { method: 'POST' })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('Checkout successful!');
                    // Clear the cart
                    cartItemsList.innerHTML = '';
                } else {
                    alert('Checkout failed. Please try again.');
                }
            });
    });
});
