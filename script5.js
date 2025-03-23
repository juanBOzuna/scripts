// Función para calcular comisión
function calcularComision(valor) {
    if (valor >= 10000 && valor <= 99999) return 1000;
    if (valor >= 100000 && valor <= 300099) return 2000;
    if (valor >= 301000 && valor <= 500099) return 3000;
    if (valor >= 501000 && valor <= 700099) return 4000;
    if (valor >= 701000 && valor <= 800000) return 5000;
    return 0;
}

// Permitir copiado de todo el contenido de la tabla
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

// Función para procesar la tabla
function procesarTabla() {
    const idTransaccionOrigen = localStorage.getItem('idTransaccionOrigen');
    const idTransaccionFin = localStorage.getItem('idTransaccionFin');

    if (!idTransaccionOrigen || !idTransaccionFin) {
        console.log("❌ Las variables idTransaccionOrigen o idTransaccionFin no están en el localStorage.");
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
        if (celdas.length < 5) return;

        const tipo = celdas[2].textContent.trim();
        const valor = parseFloat(celdas[3].textContent.replace(/[^\d.]/g, '')) || 0;
        const estado = celdas[4].textContent.trim().toUpperCase();
        const idTransaccion = celdas[0].textContent.trim();

        if (!fila.querySelector('.btn-procesar')) {
            const botonInicio = document.createElement('button');
            botonInicio.textContent = 'Inicio';
            botonInicio.className = 'btn-procesar';
            botonInicio.onclick = () => {
                localStorage.setItem('idTransaccionOrigen', idTransaccion);
                botonInicio.textContent = 'Fin';
                botonInicio.onclick = () => {
                    localStorage.setItem('idTransaccionFin', idTransaccion);
                    botonInicio.disabled = true;
                    console.log('📌 Rango seleccionado con éxito.');
                };
            };
            celdas[0].appendChild(botonInicio);
        }

        if (idTransaccion === idTransaccionOrigen) {
            procesar = true;
        }

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
            if (estado === 'EXITOSA' && comision > 0) totalComisiones += comision;
        }

        if (idTransaccion === idTransaccionFin) {
            procesar = false;
        }
    });

    let totalComisionRow = cuerpoTabla.querySelector('.total-comisiones');
    if (!totalComisionRow) {
        totalComisionRow = document.createElement('tr');
        totalComisionRow.className = 'total-comisiones';
        cuerpoTabla.appendChild(totalComisionRow);
    }
    totalComisionRow.innerHTML = `<td colspan='5' style='text-align: right; font-weight: bold; background-color: #f5f5f5;'>Total Comisiones Válidas:</td><td style='font-weight: bold; background-color: #f5f5f5;' class='ng-binding'>$${totalComisiones.toLocaleString('es-CO')}</td>`;
}

// Función para restaurar cambios
function restaurarCambios() {
    localStorage.removeItem('idTransaccionOrigen');
    localStorage.removeItem('idTransaccionFin');
    console.log('🔄 Cambios restaurados.');
    procesarTabla();
}

// Función para agregar botones flotantes
function agregarBotonesFlotantes() {
    const botonProcesar = document.createElement('button');
    botonProcesar.textContent = 'Empezar';
    botonProcesar.className = 'boton-flotante';
    botonProcesar.onclick = procesarTabla;

    const botonRestaurar = document.createElement('button');
    botonRestaurar.textContent = 'Restaurar';
    botonRestaurar.className = 'boton-flotante';
    botonRestaurar.onclick = restaurarCambios;

    document.body.appendChild(botonProcesar);
    document.body.appendChild(botonRestaurar);
}

agregarBotonesFlotantes();
procesarTabla();
