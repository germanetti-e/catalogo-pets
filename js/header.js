/* =========================================================
   SABORIEMOS PETS
   LÓGICA DEL HEADER
   ========================================================= */


/* =========================================================
   CARGAR CARRITO
   ========================================================= */

function loadCart() {

    const cart =
        JSON.parse(
            localStorage.getItem(
                "saboriemos_cart"
            ) || "[]"
        );

    return cart;

}


/* =========================================================
   ACTUALIZAR CONTADOR DEL CARRITO
   ========================================================= */

function updateCartCount() {

    const cartCount =
        document.getElementById(
            "cart-count"
        );

    if (!cartCount) {
        return;
    }


    const cart =
        loadCart();


    const total =
        cart.length;


    cartCount.textContent =
        total;

}


/* =========================================================
   IR AL CARRITO
   ========================================================= */

function activateCartButton() {

    const cartButton =
        document.querySelector(
            ".cart-button"
        );

    if (!cartButton) {
        return;
    }


    cartButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "carrito.html";

        }
    );

}


/* =========================================================
   INICIAR HEADER
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCartCount();

        activateCartButton();

    }
);
