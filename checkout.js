const stripe = Stripe("pk_test_51RqTusIYN93J3xT0G6t4Ec9g3pYFV8D6ThQuGEKJOl6AqwlclatwQ4FSg6Xwo1ksV6mAoKoUDhGEOQOBKy2DVQdu00WEwOg9KT");

// 🛒 Global cart array (should be populated via addToCart)
let cart = [];

async function handleCheckout(e) {
  e.preventDefault();

  const form = document.getElementById("checkout-form");
  const formData = new FormData(form);

  const customerData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  };

  if (cart.length === 0) {
    showError("Your cart is empty.");
    return;
  }

  try {
    const response = await fetch("http://localhost:4242/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...customerData, cart }),
    });

    const { id } = await response.json();
    stripe.redirectToCheckout({ sessionId: id });
  } catch (err) {
    showError("Checkout failed. Please try again.");
  }
}

function showError(message) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

document.getElementById("checkout-form").addEventListener("submit", handleCheckout);