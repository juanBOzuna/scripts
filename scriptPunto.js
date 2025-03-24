let inicio = null;
let fin = null;

const tablaSnapshot = document.querySelector('.adaptable-table');
let oldHtml = tablaSnapshot.innerHTML;

function calcularComision(valor) {
    if (valor >= 10000 && valor <= 99999) return 1000;
    if (valor >= 100000 && valor <= 300099) return 2000;
    if (valor >= 301000 && valor <= 500099) return 3000;
    if (valor >= 501000 && valor <= 700099) return 4000;
    if (valor >= 701000 && valor <= 800000) return 5000;
    return 0;
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
            boton.style = "padding: 3px 8px; background-color: #fd098c; color: white; border: none; border-radius: 5px; cursor: pointer";
            boton.textContent = 'Inicio  🏳️';
            boton.onclick = () => {
                if (!inicio) {
                    inicio = idTransaccion;
                    boton.textContent = 'Inicio ✓';
                    boton.disabled = true;
                    boton.style += "font-weight: bold;";

                    document.querySelectorAll('.btn-inicio').forEach(btn => {
                        if (btn !== boton) {
                            btn.className = 'btn-fin';
                            btn.textContent = 'Fin 🏳️';
                        }
                    });
                } else if (!fin && boton.classList.contains('btn-fin')) {

                    let idsBefore = [];
                    let bandera = true;

                    const cuerpoTablaAux = tabla.querySelector('tbody');
                    cuerpoTablaAux.querySelectorAll('tr.ng-scope').forEach(fila => {
                        const celdas = fila.querySelectorAll('td.ng-binding');
                        const idTransaccion = celdas[0].textContent.trim();

                        if (bandera) {
                            if (idTransaccion == inicio) {
                                bandera = false
                            } else {
                                idsBefore.push(idTransaccion)
                            }
                        }
                    });
                    const found = idsBefore.find((element) => element == idTransaccion) ?? "";
                    if (found == "") {
                        fin = idTransaccion;
                        boton.textContent = 'Fin ✓';
                        boton.style += "font-weight: bold;";
                        boton.disabled = true;
                    }else{
                        alert('Tienes que seleccionar otro')
                    }

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

function agregarBotonesFlotantes() {
    const botonesHTML = `
    <div style="position: fixed; bottom: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px;">
        <button id="btnCalcular" style="padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 50px; cursor: pointer;">Calcular comisiones</button>
         <button id="btnLReload" style="padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 50px; cursor: pointer;">Refrescar</button>
         <button id="btnLimpiar" style="padding: 5px 10px; background-color: #F44336; color: white; border: none; border-radius: 50px; cursor: pointer;">Limpiar</button>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', botonesHTML);
    document.getElementById('btnCalcular').addEventListener('click', procesarTabla);
    document.getElementById('btnLimpiar').addEventListener('click', limpiarTabla);
    document.getElementById('btnLReload').addEventListener('click', reloadLogica);
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
                fila.style.backgroundColor = estado == 'EXITOSA' ? '#e8f5e9' : '#ec5353';
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
    } else {
        alert('Tienes q seleccionar el inicio  y el fin');
    }
}


function reloadLogica() {
    limpiarTabla()
    inicio = null;
    fin = null;
    procesarTablaInicio();
}

function limpiarTabla() {
    const tablaSnapshot2 = document.querySelector('.adaptable-table');
    tablaSnapshot2.innerHTML = '';
    tablaSnapshot2.innerHTML = oldHtml;
}


procesarTablaInicio();
agregarBotonesFlotantes()
