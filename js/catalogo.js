/* =========================================================
   SABORIEMOS PETS
   LÓGICA DEL CATÁLOGO
   ========================================================= */


/* =========================================================
   URL DE LA API
   ========================================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbxPH1MbR0ceFPFDTQFh1AavHL86SHm7Fixs64xI-qGd0q2ZKbcBQ6I4H7XhEEJ-rQlpWQ/exec";


/* =========================================================
   RUTA DE IMÁGENES
   ========================================================= */

const PRODUCTS_IMAGE_PATH =
    "assets/assets/productos/";


/* =========================================================
   OBTENER TIPO DE CLIENTE
   ========================================================= */

const params =
    new URLSearchParams(window.location.search);

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
   ELEMENTOS DEL HTML
   ========================================================= */

const customerKicker =
    document.getElementById("customer-kicker");

const catalogTitle =
    document.getElementById("catalog-title");

const catalogDescription =
    document.getElementById("catalog-description");

const productsGrid =
    document.getElementById("products-grid");


/* =========================================================
   ACTUALIZAR ENCABEZADO
   ========================================================= */

if (customerKicker) {

    customerKicker.textContent =
        selectedCustomer.name;

}

if (catalogTitle) {

    catalogTitle.textContent =
        "Productos";

}

if (catalogDescription) {

    catalogDescription.textContent =
        "Consulta nuestros productos disponibles.";

}


/* =========================================================
   FORMATEAR PRECIO
   ========================================================= */

function formatPrice(value) {

    const number =
        Number(value);

    if (isNaN(number)) {
        return value;
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
   CONSTRUIR URL DE IMAGEN
   ========================================================= */

function getProductImage(imageName) {

    if (!imageName) {
        return "";
    }

    const cleanName =
        String(imageName)
            .trim();

    if (!cleanName) {
        return "";
    }

    return PRODUCTS_IMAGE_PATH +
        cleanName +
        ".png";

}


/* =========================================================
   CARGAR PRODUCTOS
   ========================================================= */

async function loadProducts() {

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "No se pudo consultar el catálogo."
            );

        }

        const products =
            await response.json();


        /* =================================================
           FILTRAR PRODUCTOS ACTIVOS
           ================================================= */

        const activeProducts =
            products
                .filter(product =>
                    String(product.activo)
                        .trim()
                        .toUpperCase() === "SI"
                )


                /* =============================================
                   ORDENAR PRODUCTOS
                   ============================================= */

                .sort((a, b) =>
                    Number(a.orden || 0) -
                    Number(b.orden || 0)
                );


        /* =================================================
           MOSTRAR PRODUCTOS
           ================================================= */

        renderProducts(activeProducts);


    } catch (error) {

        console.error(
            "Error cargando productos:",
            error
        );

        if (productsGrid) {

            productsGrid.innerHTML = `
                <div class="catalog-error">

                    <p>
                        No pudimos cargar los productos.
                    </p>

                    <p>
                        Por favor, intenta nuevamente.
                    </p>

                </div>
            `;

        }

    }

}


/* =========================================================
   MOSTRAR PRODUCTOS
   ========================================================= */

function renderProducts(products) {

    if (!productsGrid) {
        return;
    }


    /* =======================================================
       SIN PRODUCTOS
       ======================================================= */

    if (products.length === 0) {

        productsGrid.innerHTML = `
            <div class="catalog-empty">

                <p>
                    No hay productos disponibles.
                </p>

            </div>
        `;

        return;

    }


    /* =======================================================
       CREAR TARJETAS
       ======================================================= */

    productsGrid.innerHTML =
        products.map(product => {

            const price =
                product[selectedCustomer.priceField];

            const minimum =
                product[selectedCustomer.minimumField];

            const image =
                getProductImage(product.imagen);


            return `
                <article class="product-card">

                    <div class="product-image-container">

                        ${
                            image
                                ? `
                                    <img
                                        src="${image}"
                                        alt="${product.producto || ""}"
                                        class="product-image"
                                        loading="lazy"
                                    >
                                  `
                                : `
                                    <div class="product-image-placeholder">
                                        🐾
                                    </div>
                                  `
                        }

                    </div>


                    <div class="product-content">

                        <p class="product-brand">
                            ${product.marca || ""}
                        </p>

                        <h2 class="product-name">
                            ${product.producto || ""}
                        </h2>

                        <p class="product-price">
                            ${formatPrice(price)}
                        </p>

                        <p class="product-minimum">
                            Pedido mínimo: ${minimum}
                        </p>

                    </div>

                </article>
            `;

        }).join("");

}


/* =========================================================
   INICIAR CATÁLOGO
   ========================================================= */

loadProducts();
