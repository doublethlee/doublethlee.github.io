const API_URL = 'https://script.google.com/macros/s/AKfycbxY9GxuQd6fxNUZ0WD0v5TS9rv3djDTR4K3hcNdHZQ0h1uo6RfCVI4Aq-gRdsncNt8BJw/exec';

let products = [];
let filteredProducts = [];
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();

  const form = document.getElementById('order-form');
  form.addEventListener('submit', submitOrder);
});

async function loadProducts() {
  const productList = document.getElementById('product-list');

  try {
    const response = await fetch(`${API_URL}?action=products`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || '載入商品失敗');
    }

    products = data.products;
    filteredProducts = products;
    renderProducts();

  } catch (err) {
    productList.innerHTML = `
      <div class="error">
        商品載入失敗：${err.message}
      </div>
    `;
  }
}

function renderProducts() {
  const productList = document.getElementById('product-list');

  if (filteredProducts.length === 0) {
    productList.innerHTML = '目前沒有商品';
    return;
  }

  productList.innerHTML = filteredProducts.map(product => `
    <article class="product-card">
      <img src="${product.imageUrl}" alt="${product.name}" />

      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>

        <div class="price">NT$ ${product.price}</div>

        <button class="add-button" onclick="addToCart('${product.id}')">
          加入購物車
        </button>
      </div>
    </article>
  `).join('');
}

function filterProducts(category) {
  if (category === '全部') {
    filteredProducts = products;
  } else {
    filteredProducts = products.filter(p => p.category === category);
  }

  renderProducts();
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);

  if (!product) {
    return;
  }

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  renderCart();
}

function renderCart() {
  const cartCount = document.getElementById('cart-count');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = calculateTotal();

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = `NT$ ${totalAmount}`;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p>購物車是空的</p>';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-title">${item.name}</div>
      <div>NT$ ${item.price} × ${item.quantity}</div>

      <div class="cart-item-actions">
        <button onclick="decreaseQuantity('${item.id}')">-</button>
        <span>${item.quantity}</span>
        <button onclick="increaseQuantity('${item.id}')">+</button>
        <button onclick="removeFromCart('${item.id}')">移除</button>
      </div>
    </div>
  `).join('');
}

function increaseQuantity(productId) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += 1;
  }
  renderCart();
}

function decreaseQuantity(productId) {
  const item = cart.find(item => item.id === productId);

  if (!item) {
    return;
  }

  item.quantity -= 1;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== productId);
  }

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart();
}

function calculateTotal() {
  return cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
}

function toggleCart() {
  const panel = document.getElementById('cart-panel');
  panel.classList.toggle('hidden');
}

async function submitOrder(event) {
  event.preventDefault();

  const message = document.getElementById('order-message');

  if (cart.length === 0) {
    message.textContent = '購物車是空的，請先加入商品。';
    return;
  }

  const customer = {
    name: document.getElementById('customer-name').value.trim(),
    phone: document.getElementById('customer-phone').value.trim(),
    email: document.getElementById('customer-email').value.trim(),
    address: document.getElementById('customer-address').value.trim()
  };

  if (!customer.name || !customer.phone) {
    message.textContent = '請填寫姓名與電話。';
    return;
  }

  const payload = {
    action: 'createOrder',
    customer,
    items: cart,
    totalAmount: calculateTotal()
  };

  message.textContent = '訂單送出中...';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || '訂單建立失敗');
    }

    message.textContent = `訂單建立成功！訂單編號：${data.orderId}`;

    cart = [];
    renderCart();

    document.getElementById('order-form').reset();

  } catch (err) {
    message.textContent = `訂單送出失敗：${err.message}`;
  }
}