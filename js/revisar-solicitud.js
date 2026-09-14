/* =========================================================
   SABORIEMOS PETS
   LÓGICA — REVISAR SOLICITUD
   ========================================================= */


/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbxPH1MbR0ceFPFDTQFh1AavHL86SHm7Fixs64xI-qGd0q2ZKbcBQ6I4H7XhEEJ-rQlpWQ/exec";


const WHATSAPP_NUMBER =
    "573239445016";


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

        priceField:
            "precio_mayorista_sin_iva",

        minimumField:
            "pedido_minimo_mayorista"

    },


    distribuidor: {

        name: "DISTRIBUIDOR",

        priceField:
            "precio_distribuidor_sin_iva",

        minimumField:
            "pedido_minimo_distribuidor"

    },


    cliente_final: {

        name: "CLIENTE FINAL",

        priceField:
            "precio_cliente_final_sin_iva",

        minimumField:
            "pedido_minimo_cliente_final"

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
       AGRUPAR
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


            return `

                <article
                    class="review-product-card"
                >

                    <div
                        class="review-product-info"
                    >


                        <h3
                            class="review-product-name"
                        >

                            ${product.producto || ""}

                        </h3>


                        <p
                            class="review-product-price"
                        >

                            <strong>
                                ${formatPrice(price)}
                            </strong>

                            <span>
                                Precio unidad
                            </span>

                        </p>


                        <p
                            class="review-product-minimum"
                        >

                            Cantidad:
                            ${quantity}

                        </p>


                        <p
                            class="review-product-subtotal"
                        >

                            <strong>
                                ${formatPrice(productSubtotal)}
                            </strong>

                            <span>
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
   PREPARAR PRODUCTOS PARA GOOGLE SHEETS
   ========================================================= */

function prepareProductsForRequest() {

    const groupedCart =
        getGroupedCart();


    return groupedCart.map(item => {

        return {

            producto:
                item.product.producto || "",

            codigo:
                item.product.codigo || "",

            quantity:
                item.quantity,

            price:
                Number(
                    item.product[
                        selectedCustomer.priceField
                    ]
                ) || 0

        };

    });

}


/* =========================================================
   ENVIAR SOLICITUD A GOOGLE SHEETS
   ========================================================= */

async function saveRequestToGoogleSheets() {

    const subtotal =
        calculateSubtotal();


    const totalWithIva =
        calculateTotalWithIva();


    const products =
        prepareProductsForRequest();


    const requestData = {

        customer: {

            name:
                customerData.name || "",

            business:
                customerData.business || "",

            whatsapp:
                customerData.whatsapp || "",

            address:
                customerData.address || "",

            businessType:
                customerData.businessType || "",

            observations:
                customerData.observations || ""

        },


        customerType:
            customerType || "cliente_final",


        products:
            products,


        subtotal:
            subtotal,


        totalWithIva:
            totalWithIva

    };


    const response =
        await fetch(
            API_URL,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "text/plain;charset=utf-8"

                },

                body:
                    JSON.stringify(
                        requestData
                    )

            }
        );


    if (!response.ok) {

        throw new Error(
            "No fue posible registrar la solicitud."
        );

    }


    const result =
        await response.json();


    if (
        !result.success
    ) {

        throw new Error(
            result.error ||
            "Google Sheets no pudo registrar la solicitud."
        );

    }


    return result;

}


/* =========================================================
   CREAR MENSAJE DE WHATSAPP
   ========================================================= */

function createWhatsAppMessage(
    requestId
) {

    const subtotal =
        calculateSubtotal();


    const totalWithIva =
        calculateTotalWithIva();


    const groupedCart =
        getGroupedCart();


    let message =

        `Hola, quiero confirmar mi solicitud de compra.\n\n`;


    message +=

        `Solicitud: ${requestId}\n`;


    message +=

        `Tipo de cliente: ${selectedCustomer.name}\n\n`;


    message +=

        `*Datos de entrega*\n`;


    message +=

        `Nombre: ${customerData.name || ""}\n`;


    message +=

        `Empresa/Negocio: ${customerData.business || ""}\n`;


    message +=

        `WhatsApp: ${customerData.whatsapp || ""}\n`;


    message +=

        `Dirección: ${customerData.address || ""}\n`;


    message +=

        `Tipo de negocio: ${customerData.businessType || ""}\n\n`;


    message +=

        `*Productos solicitados*\n`;


    groupedCart.forEach(item => {

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


        message +=
            `• ${product.producto} x ${quantity} — ${formatPrice(productSubtotal)}\n`;

    });


    message +=
        `\n*Resumen de solicitud*\n`;


    message +=
        `Subtotal (sin IVA): ${formatPrice(subtotal)}\n`;


    message +=
        `Total (IVA incluido): ${formatPrice(totalWithIva)}\n`;


    if (
        customerData.observations
    ) {

        message +=
            `\n*Observaciones*\n${customerData.observations}\n`;

    }


    message +=
        `\nQuedo pendiente de la confirmación.`;



    return message;

}


/* =========================================================
   ENVIAR A WHATSAPP
   ========================================================= */

function openWhatsApp(
    requestId
) {

    const message =
        createWhatsAppMessage(
            requestId
        );


    const whatsappUrl =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;


    window.location.href =
        whatsappUrl;

}


/* =========================================================
   ACTIVAR BOTÓN
   ========================================================= */

const reviewSubmitButton =
    document.getElementById(
        "review-submit-button"
    );


if (reviewSubmitButton) {

    reviewSubmitButton.addEventListener(
        "click",
        async () => {

            /* =============================================
               EVITAR DOBLE CLIC
               ============================================= */

            reviewSubmitButton.disabled =
                true;


            reviewSubmitButton.textContent =
                "Registrando solicitud...";


            try {

                /* =========================================
                   GUARDAR EN GOOGLE SHEETS
                   ========================================= */

                const result =
                    await saveRequestToGoogleSheets();


                /* =========================================
                   ABRIR WHATSAPP
                   ========================================= */

                openWhatsApp(
                    result.requestId
                );


            } catch (error) {

                console.error(
                    "Error al enviar solicitud:",
                    error
                );


                alert(
                    "No pudimos registrar tu solicitud. Por favor intenta nuevamente."
                );


                /* =========================================
                   RESTAURAR BOTÓN
                   ========================================= */

                reviewSubmitButton.disabled =
                    false;


                reviewSubmitButton.textContent =
                    "Enviar solicitud de compra";

            }

        }
    );

}


/* =========================================================
   INICIAR PÁGINA
   ========================================================= */

renderCustomerData();

renderProducts();

renderSummary();
