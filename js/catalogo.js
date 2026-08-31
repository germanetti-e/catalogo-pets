/* =========================================================
   SABORIEMOS PETS
   LÓGICA DEL CATÁLOGO
   ========================================================= */


/* =========================================================
   OBTENER TIPO DE CLIENTE
   ========================================================= */

const params = new URLSearchParams(window.location.search);

const customerType = params.get("tipo");


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
   ACTUALIZAR TÍTULO DEL CATÁLOGO
   ========================================================= */

const customerKicker =
    document.getElementById("customer-kicker");

const catalogTitle =
    document.getElementById("catalog-title");

const catalogDescription =
    document.getElementById("catalog-description");


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
   INFORMACIÓN DISPONIBLE PARA EL CATÁLOGO
   ========================================================= */

console.log(
    "Tipo de cliente:",
    selectedCustomer.name
);

console.log(
    "Campo de precio:",
    selectedCustomer.priceField
);

console.log(
    "Campo de pedido mínimo:",
    selectedCustomer.minimumField
);
