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
   ACTUALIZAR ESTADO DE LA COMPRA
   ========================================================= */

function updatePurchaseStatus() {

    const subtotal =
        calculateSubtotal();


    const minimumOrder =
        100000;


    const freeShipping =
        250000;


    const progressFill =
        document.getElementById(
            "cart-progress-fill"
        );


    const progressMarker =
        document.getElementById(
            "cart-progress-marker"
        );


    const statusMessage =
        document.getElementById(
            "cart-status-message"
        );


    /* =====================================================
       PORCENTAJE DE LA BARRA
       La barra llega al 100% con $250.000
       ===================================================== */

    const progress =
        Math.min(
            (subtotal / freeShipping) * 100,
            100
        );


    if (progressFill) {

        progressFill.style.width =
            `${progress}%`;

    }


    if (progressMarker) {

        progressMarker.style.left =
            `${progress}%`;

    }


    /* =====================================================
       MENOS DEL PEDIDO MÍNIMO
       ===================================================== */

    if (subtotal < minimumOrder) {

        const missing =
            minimumOrder - subtotal;


        if (statusMessage) {

            statusMessage.innerHTML = `

                <div class="cart-status-message-title">

                    <span class="cart-status-symbol">
                        ×
                    </span>

                    <strong>
                        Aún no alcanzas el pedido mínimo.
                    </strong>

                </div>


                <p>
                    Te faltan
                    <strong>
                        ${formatPrice(missing)}
                    </strong>
                    para realizar tu solicitud.
                </p>

            `;

        }

        return;

    }


    /* =====================================================
       PEDIDO MÍNIMO ALCANZADO
       PERO AÚN NO HAY ENVÍO GRATIS
       ===================================================== */

    if (
        subtotal >= minimumOrder &&
        subtotal < freeShipping
    ) {

        const missing =
            freeShipping - subtotal;


        if (statusMessage) {

            statusMessage.innerHTML = `

                <div class="cart-status-message-title">

                    <span class="cart-status-symbol">
                        ✓
                    </span>

                    <strong>
                        ¡Pedido mínimo alcanzado!
                    </strong>

                </div>


                <p>
                    Te faltan
                    <strong>
                        ${formatPrice(missing)}
                    </strong>
                    para obtener envío GRATIS.
                </p>

            `;

        }

        return;

    }


    /* =====================================================
       ENVÍO GRATIS
       ===================================================== */

    if (subtotal >= freeShipping) {

        if (statusMessage) {

            statusMessage.innerHTML = `

                <div class="cart-status-message-title">

                    <span class="cart-status-symbol">
                        ✓
                    </span>

                    <strong>
                        ¡Tienes envío GRATIS!
                    </strong>

                </div>


                <p>
                    Tu compra cumple con el valor
                    necesario para obtener envío GRATIS.
                </p>

            `;

        }

    }

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
