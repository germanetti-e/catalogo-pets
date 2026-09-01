/* =========================================================
   SABORIEMOS PETS
   LÓGICA DEL CARRITO
   ========================================================= */


/* =========================================================
   OBTENER TIPO DE CLIENTE
   ========================================================= */

const params =
    new URLSearchParams(
        window.location.search
    );

const customerType =
    params.get("tipo");


/* =========================================================
   CONFIGURACIÓN DE TIPOS DE CLIENTE
   ========================================================= */

const customerTypes = {

    mayorista: {
        name: "MAYORISTA",
        priceField: "precio_mayorista_sin_iva",
        minimumField: "pedido_minimo_mayorista"
    },

    distribuidor: {
        name: "DISTRIBUIDOR",
        priceField: "precio_distribuidor_sin_iva",
        minimumField: "pedido_minimo_distribuidor"
    },

    cliente_final: {
        name: "CLIENTE FINAL",
        priceField: "precio_cliente_final_sin_iva",
        minimumField: "pedido_minimo_cliente_final"
    }

};


/* =========================================================
   VALIDAR TIPO DE CLIENTE
   ========================================================= */

const selectedCustomer =
    customerTypes[customerType] ||
    customerTypes.cliente_final;


/* =========================================================
   OBTENER ELEMENTOS DEL HTML
   ========================================================= */

const cartProducts =
    document.getElementById(
        "cart-products"
    );

const cartCount =
    document.getElementById(
        "cart-count"
    );

const cartSubtotal =
    document.getElementById(
        "cart-subtotal"
    );


/* =========================================================
   OBTENER CARRITO GUARDADO
   ========================================================= */

let cart = JSON.parse(
    localStorage.getItem(
        "saboriemos_cart"
    ) || "[]"
);


/* =========================================================
   FORMATEAR PRECIO
   ========================================================= */

function formatPrice(value) {

    const number =
        Number(value);

    if (isNaN(number)) {

        return "$0";

    }

    return new Intl.NumberFormat(
        "es-CO",
        {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }
    ).format(number);

}


/* =========================================================
   AGRUPAR PRODUCTOS
   ========================================================= */

function getGroupedCart() {

    const grouped = {};


    cart.forEach(product => {

        const code =
            String(product.codigo);


        if (!grouped[code]) {

            grouped[code] = {
                product: product,
                quantity: 0
            };

        }


        grouped[code].quantity++;

    });


    return Object.values(grouped);

}


/* =========================================================
   CALCULAR SUBTOTAL
   ========================================================= */

function calculateSubtotal() {

    return cart.reduce(
        (total, product) => {

            const price =
                Number(
                    product[
                        selectedCustomer.priceField
                    ]
                ) || 0;

            return total + price;

        },
        0
    );

}


/* =========================================================
   MOSTRAR CONTADOR
   ========================================================= */

function updateCartCount() {

    if (!cartCount) {
        return;
    }

    cartCount.textContent =
        cart.length;

}


/* =========================================================
   MOSTRAR SUBTOTAL
   ========================================================= */

function updateSubtotal() {

    if (!cartSubtotal) {
        return;
    }

    const subtotal =
        calculateSubtotal();

    cartSubtotal.textContent =
        formatPrice(subtotal);

}


/* =========================================================
   MOSTRAR PRODUCTOS
   ========================================================= */

function renderCart() {

    if (!cartProducts) {
        return;
    }


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

        return;

    }


    const groupedCart =
        getGroupedCart();


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


            return `

                <article
                    class="cart-product-card"
                    data-product-code="${product.codigo}"
                >

                    <div class="cart-product-info">

                        <p class="cart-product-brand">
                            ${product.marca || ""}
                        </p>

                        <h2 class="cart-product-name">
                            ${product.producto || ""}
                        </h2>

                        <p class="cart-product-price">
                            ${formatPrice(price)}
                            <span>
                                + IVA (${Number(product.iva) || 0}%)
                            </span>
                        </p>

                    </div>


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

                            <span class="cart-quantity-value">
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


                        <strong class="cart-product-subtotal">
                            ${formatPrice(productSubtotal)}
                        </strong>

                    </div>

                </article>

            `;

        }).join("");


    updateCartCount();

    updateSubtotal();


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
       AUMENTAR
       ===================================================== */

    if (action === "increase") {

        cart.push(product);

    }


    /* =====================================================
       DISMINUIR
       Nunca permite bajar del pedido mínimo
       ===================================================== */

    if (action === "decrease") {

        const quantity =
            cart.filter(
                item =>
                    String(item.codigo) ===
                    String(productCode)
            ).length;


        if (
            quantity <=
            minimumQuantity
        ) {

            return;

        }


        cart.splice(
            index,
            1
        );

    }


    /* =====================================================
       GUARDAR CAMBIOS
       ===================================================== */

    localStorage.setItem(
        "saboriemos_cart",
        JSON.stringify(cart)
    );


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
   INICIAR CARRITO
   ========================================================= */

renderCart();
