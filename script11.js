// Corregir función de cálculo
function calcularComision(valor) {
    if (valor >= 10000 && valor <= 99999) return 1000;
    if (valor >= 100000 && valor <= 300099) return 2000;
    if (valor >= 301000 && valor <= 500099) return 3000; // ¡Error tipográfico corregido!
    if (valor >= 501000 && valor <= 700099) return 4000;
    if (valor >= 701000 && valor <= 800000) return 5000;
    return 0;
}

// Modificar función de procesamiento
function procesarTabla() {
    if (!inicio || !fin) {
        alert('⚠️ Debes seleccionar primero un inicio y un fin');
        return;
    }

    const tabla = document.querySelector('.adaptable-table');
    if (!tabla) return;

    habilitarCopiadoTabla();
    let totalComisiones = 0;
    let procesar = false;

    // Reiniciar estilos
    tabla.querySelectorAll('tr').forEach(fila => {
        fila.style.backgroundColor = '';
    });

    tabla.querySelectorAll('tr.ng-scope').forEach(fila => {
        const celdas = fila.querySelectorAll('td.ng-binding');
        if (celdas.length < 5) return;

        const idTransaccion = celdas[0].textContent.trim();
        const tipo = celdas[2].textContent.trim();
        const valor = parseFloat(celdas[3].textContent.replace(/[^\d.]/g, '')) || 0;
        const estado = celdas[4].textContent.trim().toUpperCase();

        // Lógica corregida para incluir ambos límites
        if (idTransaccion === inicio) procesar = true;
        if (procesar) {
            const comision = ['RETIRO NEQUI', 'DEPOSITO NEQUI'].includes(tipo) ? calcularComision(valor) : 0;
            
            let celdaComision = fila.querySelector('.celda-comision');
            if (!celdaComision) {
                celdaComision = document.createElement('td');
                celdaComision.className = 'celda-comision';
                fila.appendChild(celdaComision);
            }
            
            celdaComision.textContent = comision.toLocaleString('es-CO');
            fila.style.backgroundColor = estado === 'EXITOSA' ? '#e8f5e9' : '';
            
            if (estado === 'EXITOSA') totalComisiones += comision;
        }
        if (idTransaccion === fin) procesar = false; // Procesar hasta incluir el fin
    });

    // Actualizar totales
    let totalComisionRow = tabla.querySelector('.total-comisiones');
    if (!totalComisionRow) {
        totalComisionRow = document.createElement('tr');
        totalComisionRow.className = 'total-comisiones';
        tabla.querySelector('tbody').appendChild(totalComisionRow);
    }
    totalComisionRow.innerHTML = `
        <td colspan="6" style="text-align: right; font-weight: bold; background-color: #f5f5f5;">
            Total Comisiones Válidas:
        </td>
        <td style="font-weight: bold; background-color: #f5f5f5;">
            $${totalComisiones.toLocaleString('es-CO')}
        </td>
    `;
}
