/* =========================================================
   SABORIEMOS PETS
   LÓGICA — MIS DATOS
   ========================================================= */


/* =========================================================
   OBTENER TIPO DE CLIENTE
   ========================================================= */

const params =
    new URLSearchParams(
        window.location.search
    );


const urlCustomerType =
    params.get("tipo");


/* =========================================================
   GUARDAR TIPO DE CLIENTE
   ========================================================= */

if (urlCustomerType) {

    localStorage.setItem(
        "saboriemos_customer_type",
        urlCustomerType
    );

}


/* =========================================================
   OBTENER FORMULARIO
   ========================================================= */

const dataForm =
    document.getElementById(
        "data-form"
    );


/* =========================================================
   GUARDAR DATOS DEL CLIENTE
   ========================================================= */

function saveCustomerData() {

    const customerData = {

        name:
            document.getElementById(
                "customer-name"
            ).value.trim(),

        business:
            document.getElementById(
                "customer-business"
            ).value.trim(),

        whatsapp:
            document.getElementById(
                "customer-whatsapp"
            ).value.trim(),

        address:
            document.getElementById(
                "customer-address"
            ).value.trim(),

        businessType:
            document.getElementById(
                "customer-business-type"
            ).value,

        observations:
            document.getElementById(
                "customer-observations"
            ).value.trim()

    };


    /* =====================================================
       GUARDAR DATOS
       ===================================================== */

    localStorage.setItem(
        "saboriemos_customer_data",
        JSON.stringify(
            customerData
        )
    );


    /* =====================================================
       IR A REVISAR SOLICITUD
       ===================================================== */

    window.location.href =
        "revisar-solicitud.html";

}


/* =========================================================
   ENVIAR FORMULARIO
   ========================================================= */

if (dataForm) {

    dataForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            saveCustomerData();

        }
    );

}
