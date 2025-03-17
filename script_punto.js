function calcularComision(valor) {
    if (valor >= 10000 && valor <= 99000) return 1000;
    if (valor >= 100000 && valor <= 300000) return 2000;
    if (valor >= 301000 && valor <= 500000) return 3000;
    if (valor >= 501000 && valor <= 700000) return 4000;
    if (valor >= 701000 && valor <= 800000) return 5000;
    return 0;
}

function procesarTabla() {
    const tabla = document.querySelector('.adaptable-table');
    if (!tabla) return;

    const cuerpoTabla = tabla.querySelector('tbody');
    const encabezado = tabla.querySelector('thead tr');
    if (!encabezado.querySelector('.col-comision')) {
        encabezado.insertAdjacentHTML('beforeend', '<th class="ng-binding col-comision">Comisión</th>');
    }

    let totalComisiones = 0;
    cuerpoTabla.querySelectorAll('tr.ng-scope').forEach(fila => {
        const celdas = fila.querySelectorAll('td.ng-binding');
        if (celdas.length < 5) return;

        const tipo = celdas[2].textContent.trim();
        const valor = parseFloat(celdas[3].textContent.replace(/[^\d.]/g, '')) || 0;
        const estado = celdas[4].textContent.trim().toUpperCase();

        let comision = ['RETIRO NEQUI', 'DEPOSITO NEQUI'].includes(tipo) ? calcularComision(valor) : 0;

        let celdaComision = fila.querySelector('.celda-comision');
        if (!celdaComision) {
            celdaComision = document.createElement('td');
            celdaComision.className = 'ng-binding celda-comision';
            fila.appendChild(celdaComision);
        }
        celdaComision.textContent = `${comision.toLocaleString('es-CO')}`;

        fila.style.backgroundColor = estado === 'EXITOSA' ? '#e8f5e9' : '';
        if (estado === 'EXITOSA' && comision > 0) totalComisiones += comision;
    });

    let totalComisionRow = cuerpoTabla.querySelector('.total-comisiones');
    if (!totalComisionRow) {
        totalComisionRow = document.createElement('tr');
        totalComisionRow.className = 'total-comisiones';
        cuerpoTabla.appendChild(totalComisionRow);
    }
    totalComisionRow.innerHTML = `<td colspan='5' style='text-align: right; font-weight: bold; background-color: #f5f5f5;'> Total Comisiones Válidas:</td><td style='font-weight: bold; background-color: #f5f5f5;' class='ng-binding'>$${totalComisiones.toLocaleString('es-CO')}</td>`
        ;
}

procesarTabla();

new MutationObserver(() => procesarTabla()).observe(document.querySelector('.adaptable-table tbody'), {
    childList: true,
    subtree: true
});
