/* =========================================================
   MOSTRAR PRODUCTOS DEL CARRITO
   ========================================================= */

function renderCart() {

    if (!cartProducts) {

        return;

    }


    /* =====================================================
       CARRITO VACÍO
       ===================================================== */

    if (cart.length === 0) {

        cartProducts.innerHTML = `

            <div class="cart-empty">

                <p>
                    Tu carrito está vacío.
                </p>

                <a
                    href="index.html"
                    class="whatsapp-button"
                >
                    Ver productos
                </a>

            </div>

        `;


        updateCartCount();

        updateSubtotal();

        updatePurchaseStatus();


        return;

    }


    /* =====================================================
       AGRUPAR PRODUCTOS
       ===================================================== */

    const groupedCart =
        getGroupedCart();


    /* =====================================================
       GENERAR HTML
       ===================================================== */

    cartProducts.innerHTML =
        groupedCart.map(item => {

            const product =
                item.product;


            const quantity =
                item.quantity;


            const price =
                Number(
                    product[
                        selectedCustomer.priceField
                    ]
                ) || 0;


            const productSubtotal =
                price * quantity;


            const iva =
                Number(product.iva) || 0;


            const minimum =
                Number(
                    product[
                        selectedCustomer.minimumField
                    ]
                ) || 0;


            return `

                <article
                    class="cart-product-card"
                    data-product-code="${product.codigo}"
                >


                    <!-- IMAGEN -->

                    <div class="cart-product-image">

                        ${
                            product.imagen

                                ? `

                                    <img
                                        src="assets/assets/productos/${String(product.imagen).trim()}.png"
                                        alt="${product.producto || ""}"
                                        loading="lazy"
                                    >

                                  `

                                : `

                                    <div class="cart-product-image-placeholder">
                                        🐾
                                    </div>

                                  `
                        }

                    </div>


                    <!-- INFORMACIÓN DEL PRODUCTO -->

                    <div class="cart-product-info">


                        <h2 class="cart-product-name">
                            ${product.producto || ""}
                        </h2>


                        <p class="cart-product-price">

                            <strong>
                                ${formatPrice(price)}
                            </strong>

                            <span>
                                + IVA (${iva}%)
                            </span>

                            <span class="price-unit-label">
                                Precio unidad
                            </span>

                        </p>


                        <p class="cart-product-minimum">

                            Pedido mínimo:
                            ${minimum}

                        </p>


                    </div>


                    <!-- CANTIDAD Y PRECIO DE UNIDADES PEDIDAS -->

                    <div class="cart-product-actions">


                        <div class="cart-quantity">


                            <button
                                type="button"
                                class="cart-quantity-button"
                                data-action="decrease"
                                data-product-code="${product.codigo}"
                                aria-label="Disminuir cantidad"
                            >
                                −
                            </button>


                            <span
                                class="cart-quantity-value"
                            >
                                ${quantity}
                            </span>


                            <button
                                type="button"
                                class="cart-quantity-button"
                                data-action="increase"
                                data-product-code="${product.codigo}"
                                aria-label="Aumentar cantidad"
                            >
                                +
                            </button>


                        </div>


                        <div class="cart-product-subtotal">

                            <strong>
                                ${formatPrice(productSubtotal)}
                            </strong>

                            <span>
                                + IVA (${iva}%)
                            </span>

                            <span class="price-unit-label">
                                Precio unidades pedidas
                            </span>

                        </div>


                    </div>


                </article>

            `;

        }).join("");


    /* =====================================================
       ACTUALIZAR INFORMACIÓN
       ===================================================== */

    updateCartCount();

    updateSubtotal();

    updatePurchaseStatus();


    /* =====================================================
       BOTONES DE CANTIDAD
       ===================================================== */

    const quantityButtons =
        document.querySelectorAll(
            ".cart-quantity-button"
        );


    quantityButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const productCode =
                    button.dataset.productCode;


                const action =
                    button.dataset.action;


                changeQuantity(
                    productCode,
                    action
                );

            }
        );

    });

}

/* =========================================================
   CAMBIAR CANTIDAD
   ========================================================= */

function changeQuantity(
    productCode,
    action
) {

    const index =
        cart.findIndex(
            product =>
                String(product.codigo) ===
                String(productCode)
        );


    if (index === -1) {

        return;

    }


    const product =
        cart[index];


    /* =====================================================
       PEDIDO MÍNIMO DEL PRODUCTO
       ===================================================== */

    const minimum =
        Number(
            product[
                selectedCustomer.minimumField
            ]
        );


    const minimumQuantity =
        Number.isFinite(minimum) &&
        minimum > 0
            ? minimum
            : 1;


    /* =====================================================
       CANTIDAD ACTUAL
       ===================================================== */

    const currentQuantity =
        cart.filter(
            item =>
                String(item.codigo) ===
                String(productCode)
        ).length;


    /* =====================================================
       AUMENTAR
       Agrega exactamente otro pedido mínimo
       ===================================================== */

    if (action === "increase") {

        for (
            let i = 0;
            i < minimumQuantity;
            i++
        ) {

            cart.push(product);

        }

    }


    /* =====================================================
       DISMINUIR
       Quita exactamente un pedido mínimo
       ===================================================== */

    if (action === "decrease") {

        /*
         * Nunca permite bajar del pedido mínimo.
         */

        if (
            currentQuantity <=
            minimumQuantity
        ) {

            return;

        }


        /*
         * Quita exactamente la cantidad
         * correspondiente a un pedido mínimo.
         */

        for (
            let i = 0;
            i < minimumQuantity;
            i++
        ) {

            const productIndex =
                cart.findIndex(
                    item =>
                        String(item.codigo) ===
                        String(productCode)
                );


            if (
                productIndex !== -1
            ) {

                cart.splice(
                    productIndex,
                    1
                );

            }

        }

    }


    /* =====================================================
   GUARDAR CARRITO ACTUALIZADO
   ===================================================== */

localStorage.setItem(
    "saboriemos_cart",
    JSON.stringify(cart)
);


/* =====================================================
   VOLVER A RENDERIZAR
   ===================================================== */

renderCart();

}


/* =========================================================
   BOTÓN CONTINUAR COMPRANDO
   ========================================================= */

const backLink =
    document.querySelector(
        ".cart-top .back-link"
    );


if (backLink) {

    backLink.addEventListener(
        "click",
        event => {

            event.preventDefault();


            window.location.href =
                `catalogo.html?tipo=${customerType}`;

        }
    );

}
/* =========================================================
   BOTÓN DEL CARRITO EN EL HEADER
   ========================================================= */

const cartButton =
    document.querySelector(
        ".cart-button"
    );


if (cartButton) {

    cartButton.addEventListener(
        "click",
        () => {

            window.location.href =
                `carrito.html?tipo=${customerType}`;

        }
    );

}

/* =========================================================
   PESTAÑA TARIFAS DE ENVÍO
   ========================================================= */

const shippingRatesToggle =
    document.querySelector(
        ".shipping-rates-toggle"
    );


const shippingRatesContent =
    document.getElementById(
        "shipping-rates-content"
    );


const shippingRatesArrow =
    document.querySelector(
        ".shipping-rates-arrow"
    );


if (
    shippingRatesToggle &&
    shippingRatesContent
) {

    shippingRatesToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                shippingRatesToggle.getAttribute(
                    "aria-expanded"
                ) === "true";


            if (isOpen) {

                /* -----------------------------------------
                   CERRAR TARIFAS
                   ----------------------------------------- */

                shippingRatesToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );


                shippingRatesContent.style.display =
                    "none";


                if (shippingRatesArrow) {

                    shippingRatesArrow.textContent =
                        "▼";

                }


            } else {

                /* -----------------------------------------
                   ABRIR TARIFAS
                   ----------------------------------------- */

                shippingRatesToggle.setAttribute(
                    "aria-expanded",
                    "true"
                );


                shippingRatesContent.style.display =
                    "block";


                if (shippingRatesArrow) {

                    shippingRatesArrow.textContent =
                        "▲";

                }

            }

        }
    );

}

/* =========================================================
   INICIAR CARRITO
   ========================================================= */

renderCart();
