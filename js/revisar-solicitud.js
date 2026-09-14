/* =========================================================
   SABORIEMOS PETS
   LÓGICA — REVISAR SOLICITUD
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
   OBTENER DATOS DEL CLIENTE
   ========================================================= */

const customerData =
    JSON.parse(
        localStorage.getItem(
            "saboriemos_customer_data"
        ) || "{}"
    );


/* =========================================================
   OBTENER CARRITO
   ========================================================= */

const cart =
    JSON.parse(
        localStorage.getItem(
            "saboriemos_cart"
        ) || "[]"
    );


/* =========================================================
   DETERMINAR TIPO DE CLIENTE
   ========================================================= */

let selectedCustomer =
    customerTypes[customerType];


/*
 * Si la URL no contiene el tipo de cliente,
 * intentamos recuperarlo del primer producto
 * guardado en el carrito.
 */

if (!selectedCustomer && cart.length > 0) {

    const firstProduct =
        cart[0];


    if (
        firstProduct.customerType &&
        customerTypes[
            firstProduct.customerType
        ]
    ) {

        selectedCustomer =
            customerTypes[
                firstProduct.customerType
            ];

    }

}


/*
 * Si todavía no existe un tipo de cliente,
 * utilizamos Cliente final como respaldo.
 */

if (!selectedCustomer) {

    selectedCustomer =
        customerTypes.cliente_final;

}


/* =========================================================
   FORMATEAR PRECIOS
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
   MOSTRAR DATOS DEL CLIENTE
   ========================================================= */

function renderCustomerData() {


    const reviewName =
        document.getElementById(
            "review-name"
        );


    const reviewBusiness =
        document.getElementById(
            "review-business"
        );


    const reviewWhatsapp =
        document.getElementById(
            "review-whatsapp"
        );


    const reviewAddress =
        document.getElementById(
            "review-address"
        );


    const reviewBusinessType =
        document.getElementById(
            "review-business-type"
        );


    if (reviewName) {

        reviewName.textContent =
            customerData.name || "—";

    }


    if (reviewBusiness) {

        reviewBusiness.textContent =
            customerData.business || "—";

    }


    if (reviewWhatsapp) {

        reviewWhatsapp.textContent =
            customerData.whatsapp || "—";

    }


    if (reviewAddress) {

        reviewAddress.textContent =
            customerData.address || "—";

    }


    if (reviewBusinessType) {

        reviewBusinessType.textContent =
            customerData.businessType || "—";

    }

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


    return Object.values(
        grouped
    );

}


/* =========================================================
   MOSTRAR PRODUCTOS
   ========================================================= */

function renderProducts() {

    const reviewProducts =
        document.getElementById(
            "review-products"
        );


    if (!reviewProducts) {

        return;

    }


    /* =====================================================
       CARRITO VACÍO
       ===================================================== */

    if (cart.length === 0) {

        reviewProducts.innerHTML = `

            <div class="review-empty">

                <p>
                    No hay productos en tu solicitud.
                </p>

            </div>

        `;

        return;

    }


    /* =====================================================
       AGRUPAR PRODUCTOS
       ===================================================== */

    const groupedCart =
        getGroupedCart();


    /* =====================================================
       GENERAR PRODUCTOS
       ===================================================== */

    reviewProducts.innerHTML =
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
                price *
                quantity;


            const iva =
                Number(
                    product.iva
                ) || 0;


            return `

                <article
                    class="review-product-card"
                >


                    <!-- IMAGEN -->

                    <div class="review-product-image">

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

                                    <div class="review-product-image-placeholder">
                                        🐾
                                    </div>

                                  `
                        }

                    </div>



                    <!-- INFORMACIÓN -->

                    <div class="review-product-info">


                        <h3 class="review-product-name">

                            ${product.producto || ""}

                        </h3>



                        <p class="review-product-price">

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



                        <p class="review-product-minimum">

                            Cantidad:
                            ${quantity}

                        </p>



                        <p class="review-product-subtotal">

                            <strong>
                                ${formatPrice(productSubtotal)}
                            </strong>

                            <span>
                                + IVA (${iva}%)
                            </span>

                            <span class="price-unit-label">
                                Precio unidades pedidas
                            </span>

                        </p>


                    </div>


                </article>

            `;

        }).join("");

}


/* =========================================================
   CALCULAR SUBTOTAL SIN IVA
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
   CALCULAR TOTAL CON IVA
   ========================================================= */

function calculateTotalWithIva() {

    return cart.reduce(
        (total, product) => {

            const price =
                Number(
                    product[
                        selectedCustomer.priceField
                    ]
                ) || 0;


            const iva =
                Number(
                    product.iva
                ) || 0;


            return total +
                price *
                (1 + iva / 100);

        },
        0
    );

}


/* =========================================================
   MOSTRAR RESUMEN
   ========================================================= */

function renderSummary() {

    const reviewSubtotal =
        document.getElementById(
            "review-subtotal"
        );


    const reviewTotal =
        document.getElementById(
            "review-total"
        );


    const subtotal =
        calculateSubtotal();


    const totalWithIva =
        calculateTotalWithIva();


    if (reviewSubtotal) {

        reviewSubtotal.textContent =
            formatPrice(
                subtotal
            );

    }


    if (reviewTotal) {

        reviewTotal.textContent =
            formatPrice(
                totalWithIva
            );

    }

}


/* =========================================================
   INICIAR PÁGINA
   ========================================================= */

renderCustomerData();

renderProducts();

renderSummary();
