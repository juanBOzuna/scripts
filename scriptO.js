let inicio = null;
let fin = null;

function calcularComision(valor) {
    if (valor >= 10000 && valor <= 99999) return 1000;
    if (valor >= 100000 && valor <= 300099) return 2000;
    if (valor >= 301000 && valor <= 500099) return 3000;
    if (valor >= 501000 && valor <= 700099) return 4000;
    if (valor >= 701000 && valor <= 800000) return 5000;
    return 0;
}

function actualizarBotones() {
    document.querySelectorAll('.btn-inicio').forEach(boton => {
        boton.textContent = 'Inicio';
        boton.disabled = false;
    });
    document.querySelectorAll('.btn-fin').forEach(boton => {
        boton.textContent = 'Fin';
        boton.disabled = false;
    });


}

function limpiarTabla() {
    inicio = null;
    fin = null;
    actualizarBotones();
    procesarTablaInicio();
}

function agregarBotonesInicio() {
    const tabla = document.querySelector('.adaptable-table');
    if (!tabla) return;

    const cuerpoTabla = tabla.querySelector('tbody');

    cuerpoTabla.querySelectorAll('tr.ng-scope').forEach(fila => {
        const celdas = fila.querySelectorAll('td.ng-binding');
        if (celdas.length < 5) return;

        const idTransaccion = celdas[0].textContent.trim();

        let boton = fila.querySelector('.btn-inicio, .btn-fin');
        if (!boton) {
            boton = document.createElement('button');
            boton.className = 'btn-inicio';
            boton.textContent = 'Inicio';
            boton.onclick = () => {
                if (!inicio) {
                    inicio = idTransaccion;
                    boton.textContent = 'Inicio ✓';
                    boton.disabled = true;

                    document.querySelectorAll('.btn-inicio').forEach(btn => {
                        if (btn !== boton) {
                            btn.className = 'btn-fin';
                            btn.textContent = 'Fin';
                        }
                    });
                } else if (!fin && boton.classList.contains('btn-fin')) {
                    fin = idTransaccion;
                    boton.textContent = 'Fin ✓';
                    boton.disabled = true;
                }


            };

            const celdaBoton = document.createElement('td');
            celdaBoton.appendChild(boton);
            fila.appendChild(celdaBoton);
        }
    });
}

function procesarTablaInicio() {
    const tabla = document.querySelector('.adaptable-table');
    if (!tabla) return;

    habilitarCopiadoTabla();
    agregarBotonesInicio();

    const cuerpoTabla = tabla.querySelector('tbody');
    const encabezado = tabla.querySelector('thead tr');
    if (!encabezado.querySelector('.col-orden')) {
        encabezado.insertAdjacentHTML('beforeend', '<th class="ng-binding col-orden">Orden</th>');
    }
}

function habilitarCopiadoTabla() {
    const tabla = document.querySelector('.adaptable-table');
    if (!tabla) return;

    tabla.style.userSelect = 'text';
    tabla.style.webkitUserSelect = 'text';
    tabla.style.MozUserSelect = 'text';
    tabla.style.msUserSelect = 'text';

    tabla.onselectstart = null;
    tabla.oncopy = null;

    console.log("✅ Copiado del contenido de la tabla habilitado.");
}


    procesarTablaInicio();



function agregarBotonesFlotantes() {
    const botonesHTML = `
    <div style="position: fixed; bottom: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px;">
        <button id="btnCalcular" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Calcular</button>
         <button id="btnLimpiar" style="padding: 10px 20px; background-color: #F44336; color: white; border: none; border-radius: 5px; cursor: pointer;">Limpiar</button>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', botonesHTML);

    document.getElementById('btnCalcular').addEventListener('click', procesarTabla);
    document.getElementById('btnLimpiar').addEventListener('click', limpiarTabla);
}


function procesarTabla() {
    if (inicio !== null && fin !== null) {



        const idTransaccionOrigen = inicio;
        const idTransaccionFin = fin;

        if (!idTransaccionOrigen || !idTransaccionFin) {
            console.log('❌ Las variables idTransaccionOrigen o idTransaccionFin no están en el localStorage.');
            return;
        }

        const tabla = document.querySelector('.adaptable-table');
        if (!tabla) return;

        habilitarCopiadoTabla();

        const cuerpoTabla = tabla.querySelector('tbody');
        const encabezado = tabla.querySelector('thead tr');

        if (!encabezado.querySelector('.col-comision')) {
            encabezado.insertAdjacentHTML('beforeend', '<th class="ng-binding col-comision">Comisión</th>');
        }

        let totalComisiones = 0;
        let procesar = false;

        cuerpoTabla.querySelectorAll('tr.ng-scope').forEach(fila => {
            const celdas = fila.querySelectorAll('td.ng-binding');

            const tipo = celdas[2].textContent.trim();
            const valor = parseFloat(celdas[3].textContent.replace(/[^\d.]/g, '')) || 0;
            const estado = celdas[4].textContent.trim().toUpperCase();
            const idTransaccion = celdas[0].textContent.trim();

            if (idTransaccion == idTransaccionOrigen) procesar = true;


            if (procesar) {

                let comision = ['RETIRO NEQUI', 'DEPOSITO NEQUI'].includes(tipo) ? calcularComision(valor) : 0;

                let celdaComision = fila.querySelector('.celda-comision');

                if (!celdaComision) {
                    celdaComision = document.createElement('td');
                    celdaComision.className = 'ng-binding celda-comision';
                    fila.appendChild(celdaComision);
                }

                celdaComision.textContent = comision.toLocaleString('es-CO');
                fila.style.backgroundColor = estado === 'EXITOSA' ? '#e8f5e9' : '';
                // alert(comision)
                if (estado === 'EXITOSA' && comision > 0) totalComisiones += comision;
            }

            if (idTransaccion === idTransaccionFin) procesar = false;
        });

        let totalComisionRow = cuerpoTabla.querySelector('.total-comisiones');
        if (!totalComisionRow) {
            totalComisionRow = document.createElement('tr');
            totalComisionRow.className = 'total-comisiones';
            cuerpoTabla.appendChild(totalComisionRow);
        }
        totalComisionRow.innerHTML = `<td colspan='6' style='text-align: right; font-weight: bold; background-color: #f5f5f5;'>Total Comisiones Válidas:</td><td style='font-weight: bold; background-color: #f5f5f5;' class='ng-binding'>$${totalComisiones.toLocaleString('es-CO')}</td>`;
    }
}
// function limpiarTabla() {
//     const tabla = document.querySelector('.adaptable-table');
//     if (!tabla) return;

//     const encabezado = tabla.querySelector('thead tr .col-comision');
//     if (encabezado) encabezado.remove();

//     tabla.querySelectorAll('.celda-comision').forEach(celda => celda.remove());
//     tabla.querySelector('.total-comisiones')?.remove();

//     console.log('🧹 Cambios limpiados de la tabla.');
// }

function limpiarTabla() {
    const tabla = document.querySelector('.adaptable-table');
    if (!tabla) return;

    // Remover columna "Orden" del encabezado
    const encabezadoOrden = tabla.querySelector('thead tr .col-orden');
    if (encabezadoOrden) encabezadoOrden.remove();

    // Remover columna "Comisión" del encabezado
    const encabezadoComision = tabla.querySelector('thead tr .col-comision');
    if (encabezadoComision) encabezadoComision.remove();

    // Remover botones y celdas agregadas en las filas
    const filas = tabla.querySelectorAll('tbody tr.ng-scope');
    filas.forEach(fila => {
        const celdas = fila.querySelectorAll('td');
        // Eliminar última celda si contiene un botón
        if (celdas.length > 0 && celdas[celdas.length - 1].querySelector('button')) {
            celdas[celdas.length - 1].remove();
        }
    });

    // Remover celdas de comisión y fila de totales
    tabla.querySelectorAll('.celda-comision').forEach(celda => celda.remove());
    tabla.querySelector('.total-comisiones')?.remove();

    // Restablecer variables y botones
    inicio = null;
    fin = null;
    actualizarBotones();

    console.log('🧹 Todos los cambios han sido eliminados.');
}

agregarBotonesFlotantes()
