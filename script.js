const PRODUCTS = [
  { id: 1, name: "Deep Tissue Massage (60 min)", desc: "Firm-pressure massage targeting muscle tension.", price: 55.00 },
  { id: 2, name: "Sports Massage (30 min)", desc: "Focused pre/post-activity massage for recovery.", price: 35.00 },
  { id: 3, name: "Dry Cupping Therapy", desc: "Suction cupping to ease muscle tightness.", price: 40.00 },
  { id: 4, name: "Dry Needling", desc: "Targeted needling to release trigger points.", price: 35.00 },
];

let basket = [];

function formatPrice(amount) {
  return `£${amount.toFixed(2)}`;
}

function renderProducts() {
  const list = document.getElementById("product-list");
  list.innerHTML = "";
  PRODUCTS.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-name">${product.name}</div>
      <div class="product-desc">${product.desc}</div>
      <div class="product-footer">
        <span class="product-price">${formatPrice(product.price)}</span>
        <button class="add-btn" data-id="${product.id}">Add</button>
      </div>
    `;
    list.appendChild(card);
  });

  list.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => addToBasket(Number(btn.dataset.id)));
  });
}

function addToBasket(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  const existing = basket.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    basket.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  }
  renderBasket();
}

function removeFromBasket(productId) {
  basket = basket.filter(item => item.id !== productId);
  renderBasket();
}

function renderBasket() {
  const container = document.getElementById("basket-items");
  const totalEl = document.getElementById("basket-total");

  if (basket.length === 0) {
    container.innerHTML = `<p class="empty-basket">Nothing added yet</p>`;
    totalEl.textContent = formatPrice(0);
    updateCheckoutAvailability();
    return;
  }

  container.innerHTML = "";
  let total = 0;
  basket.forEach(item => {
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    const row = document.createElement("div");
    row.className = "basket-row";
    row.innerHTML = `
      <span>${item.qty} × ${item.name}</span>
      <span>${formatPrice(lineTotal)} <button data-id="${item.id}">remove</button></span>
    `;
    container.appendChild(row);
  });

  container.querySelectorAll("button[data-id]").forEach(btn => {
    btn.addEventListener("click", () => removeFromBasket(Number(btn.dataset.id)));
  });

  totalEl.textContent = formatPrice(total);
  updateCheckoutAvailability();
}

function updateCheckoutAvailability() {
  const nameInput = document.getElementById("customer-name");
  const dateInput = document.getElementById("booking-date");
  const checkoutBtn = document.getElementById("checkout-btn");
  checkoutBtn.disabled = basket.length === 0 || !nameInput.value.trim() || !dateInput.value;
}

function setupCheckout() {
  const overlay = document.getElementById("confirmation-overlay");
  document.getElementById("checkout-btn").addEventListener("click", () => {
    overlay.classList.remove("hidden");
    basket = [];
    renderBasket();
    document.getElementById("customer-name").value = "";
    document.getElementById("booking-date").value = "";
  });
  document.getElementById("close-overlay").addEventListener("click", () => overlay.classList.add("hidden"));
}

function setupDatePicker() {
  const dateInput = document.getElementById("booking-date");
  const today = new Date();
  const pad = n => String(n).padStart(2, "0");
  dateInput.min = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  dateInput.addEventListener("change", updateCheckoutAvailability);
}

document.getElementById("customer-name").addEventListener("input", updateCheckoutAvailability);

renderProducts();
renderBasket();
setupCheckout();
setupDatePicker();
