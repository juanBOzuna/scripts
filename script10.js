// Variables globales para almacenar los IDs
let inicio = null;
let fin = null;

function calcularComision(valor) {
    if (valor >= 10000 && valor <= 99999) return 1000;
    if (valor >= 100000 && valor <= 300099) return 2000;
    if (valor >= 301000 && valor <= 500099) return 3000;
    if (valor >= 501000 && value <= 700099) return 4000;
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
}

function limpiarTabla() {
    // Resetear variables
    inicio = null;
    fin = null;
    
    // Limpiar estilos y columnas
    const tabla = document.querySelector('.adaptable-table');
    if (!tabla) return;

    // Eliminar columna de comisión
    tabla.querySelectorAll('.col-comision, .celda-comision, .total-comisiones').forEach(el => el.remove());
    
    // Restaurar botones
    tabla.querySelectorAll('.btn-transaccion').forEach(btn => {
        btn.textContent = 'Inicio';
        btn.onclick = manejarClickBoton;
    });
    
    console.log("✅ Tabla restaurada a su estado original");
}

function agregarBotonesFlotantes() {
    const contenedor = document.createElement('div');
    contenedor.style.position = 'fixed';
    contenedor.style.bottom = '20px';
    contenedor.style.right = '20px';
    contenedor.style.zIndex = '1000';
    contenedor.style.display = 'flex';
    contenedor.style.gap = '10px';

    const btnCalcular = document.createElement('button');
    btnCalcular.textContent = 'Calcular';
    btnCalcular.style.padding = '10px 20px';
    btnCalcular.style.backgroundColor = '#4CAF50';
    btnCalcular.style.color = 'white';
    btnCalcular.style.border = 'none';
    btnCalcular.style.borderRadius = '5px';
    btnCalcular.onclick = procesarTabla;

    const btnLimpiar = document.createElement('button');
    btnLimpiar.textContent = 'Limpiar';
    btnLimpiar.style.padding = '10px 20px';
    btnLimpiar.style.backgroundColor = '#f44336';
    btnLimpiar.style.color = 'white';
    btnLimpiar.style.border = 'none';
    btnLimpiar.style.borderRadius = '5px';
    btnLimpiar.onclick = limpiarTabla;

    contenedor.appendChild(btnLimpiar);
    contenedor.appendChild(btnCalcular);
    document.body.appendChild(contenedor);
}

function manejarClickBoton(e) {
    const fila = e.target.closest('tr');
    const idTransaccion = fila.querySelector('td:first-child').textContent.trim();
    
    if (e.target.textContent === 'Inicio') {
        inicio = idTransaccion;
        // Cambiar todos los botones a 'Fin'
        document.querySelectorAll('.btn-transaccion').forEach(btn => {
            btn.textContent = 'Fin';
            btn.onclick = manejarClickBoton;
        });
    } else {
        fin = idTransaccion;
        e.target.textContent = 'Fin ✓';
    }
}

function agregarBotonesTransaccion() {
    const tabla = document.querySelector('.adaptable-table');
    if (!tabla) return;

    // Agregar columna de acción si no existe
    if (!tabla.querySelector('th.col-accion')) {
        tabla.querySelector('thead tr').insertAdjacentHTML('afterbegin', '<th class="col-accion">Acción</th>');
    }

    tabla.querySelectorAll('tbody tr.ng-scope').forEach(fila => {
        if (!fila.querySelector('.btn-transaccion')) {
            const celdaAccion = document.createElement('td');
            const boton = document.createElement('button');
            boton.className = 'btn-transaccion';
            boton.textContent = 'Inicio';
            boton.onclick = manejarClickBoton;
            boton.style.cssText = 'padding: 2px 5px; cursor: pointer; font-size: 0.8em;';
            celdaAccion.appendChild(boton);
            fila.insertBefore(celdaAccion, fila.firstElementChild);
        }
    });
}

function procesarTabla() {
    if (!inicio || !fin) {
        alert('⚠️ Debes seleccionar primero un inicio y un fin');
        return;
    }

    const tabla = document.querySelector('.adaptable-table');
    if (!tabla) return;

    habilitarCopiadoTabla();

    // Resto de la lógica de procesamiento (similar a la original pero usando las variables globales)
    const cuerpoTabla = tabla.querySelector('tbody');
    if (!tabla.querySelector('.col-comision')) {
        tabla.querySelector('thead tr').insertAdjacentHTML('beforeend', '<th class="ng-binding col-comision">Comisión</th>');
    }

    let totalComisiones = 0;
    let procesar = false;

    cuerpoTabla.querySelectorAll('tr.ng-scope').forEach(fila => {
        const celdas = fila.querySelectorAll('td.ng-binding');
        if (celdas.length < 5) return;

        const idTransaccion = celdas[0].textContent.trim();
        const tipo = celdas[2].textContent.trim();
        const valor = parseFloat(celdas[3].textContent.replace(/[^\d.]/g, '')) || 0;
        const estado = celdas[4].textContent.trim().toUpperCase();

        if (idTransaccion === inicio) procesar = true;
        if (idTransaccion === fin) procesar = false;

        if (procesar) {
            // Misma lógica de cálculo de comisiones
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
    });

    // Agregar fila de totales
    let totalComisionRow = cuerpoTabla.querySelector('.total-comisiones');
    if (!totalComisionRow) {
        totalComisionRow = document.createElement('tr');
        totalComisionRow.className = 'total-comisiones';
        cuerpoTabla.appendChild(totalComisionRow);
    }
    totalComisionRow.innerHTML = `<td colspan='6' style='text-align: right; font-weight: bold; background-color: #f5f5f5;'>Total Comisiones Válidas:</td><td style='font-weight: bold; background-color: #f5f5f5;' class='ng-binding'>$${totalComisiones.toLocaleString('es-CO')}</td>`;
}

// Inicialización
(function init() {
    agregarBotonesFlotantes();
    agregarBotonesTransaccion();

    new MutationObserver(() => {
        agregarBotonesTransaccion();
    }).observe(document.querySelector('.adaptable-table tbody'), {
        childList: true,
        subtree: true
    });
})();
