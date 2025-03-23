function calcularComision(valor) {
    if (valor >= 10000 && valor <= 99999) return 1000;
    if (valor >= 100000 && valor <= 300099) return 2000;
    if (valor >= 301000 && valor <= 500099) return 3000;
    if (valor >= 501000 && valor <= 700099) return 4000;
    if (valor >= 701000 && valor <= 800000) return 5000;
    return 0;
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

function agregarBotonesFlotantes() {
    const botonesExistentes = document.querySelectorAll('.boton-flotante');
    if (botonesExistentes.length > 0) return;

    const botonesContainer = document.createElement('div');
    botonesContainer.className = 'botones-flotantes';

    botonesContainer.innerHTML = `
        <button id="btn-reversar" class="boton-flotante">Reversar Cambios</button>
        <button id="btn-reprocesar" class="boton-flotante">Reprocesar</button>
        <button id="btn-empezar" class="boton-flotante">Empezar Procesamiento</button>
    `;

    document.body.appendChild(botonesContainer);

    document.getElementById('btn-reversar').addEventListener('click', () => location.reload());
    document.getElementById('btn-reprocesar').addEventListener('click', procesarTabla);
    document.getElementById('btn-empezar').addEventListener('click', procesarTabla);
}

function actualizarBotonesFila(fila, esInicio) {
    const boton = document.createElement('button');
    boton.className = 'btn-inicio-fin';
    boton.textContent = esInicio ? 'Inicio' : 'Fin';

    boton.addEventListener('click', () => {
        const idTransaccion = fila.querySelector('td:nth-child(1)').textContent.trim();
        if (esInicio) {
            localStorage.setItem('idTransaccionOrigen', idTransaccion);
            boton.textContent = 'Fin';
            actualizarBotonesFila(fila, false);
        } else {
            localStorage.setItem('idTransaccionFin', idTransaccion);
            boton.remove();
        }
    });

    fila.appendChild(boton);
}

function procesarTabla() {
    const idTransaccionOrigen = localStorage.getItem('idTransaccionOrigen');
    const idTransaccionFin = localStorage.getItem('idTransaccionFin');
    let totalComisiones = 0;
    let procesar = false;

    const tabla = document.querySelector('.adaptable-table');
    if (!tabla) return;

    habilitarCopiadoTabla();
    agregarBotonesFlotantes();

    const cuerpoTabla = tabla.querySelector('tbody');
    const encabezado = tabla.querySelector('thead tr');

    if (!encabezado.querySelector('.col-comision')) {
        encabezado.insertAdjacentHTML('beforeend', '<th class="ng-binding col-comision">Comisión</th>');
    }

    cuerpoTabla.querySelectorAll('tr.ng-scope').forEach(fila => {
        if (!fila.querySelector('.btn-inicio-fin')) {
            actualizarBotonesFila(fila, true);
        }

        const celdas = fila.querySelectorAll('td.ng-binding');
        if (celdas.length < 5) return;

        const tipo = celdas[2].textContent.trim();
        const valor = parseFloat(celdas[3].textContent.replace(/[^\d.]/g, '')) || 0;
        const estado = celdas[4].textContent.trim().toUpperCase();
        const idTransaccion = celdas[0].textContent.trim();

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

    console.log('Tabla procesada correctamente.');
}

procesarTabla();

new MutationObserver(() => procesarTabla()).observe(document.querySelector('.adaptable-table tbody'), {
    childList: true,
    subtree: true
});
