let inicio = null;
let fin = null;

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
    procesarTabla();
}

function procesarTabla() {
    const tabla = document.querySelector('.adaptable-table');
    if (!tabla) return;

    habilitarCopiadoTabla();

    const cuerpoTabla = tabla.querySelector('tbody');
    const encabezado = tabla.querySelector('thead tr');
    if (!encabezado.querySelector('.col-comision')) {
        encabezado.insertAdjacentHTML('beforeend', '<th class="ng-binding col-comision">Comisión</th>');
    }

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

                console.log(`Inicio: ${inicio}, Fin: ${fin}`);
            };

            const celdaBoton = document.createElement('td');
            celdaBoton.appendChild(boton);
            fila.appendChild(celdaBoton);
        }
    });
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

document.addEventListener('DOMContentLoaded', () => {
    const calcularBtn = document.createElement('button');
    calcularBtn.textContent = 'Calcular';
    calcularBtn.className = 'btn-calcular';
    calcularBtn.style.position = 'fixed';
    calcularBtn.style.bottom = '20px';
    calcularBtn.style.right = '100px';
    calcularBtn.style.zIndex = '9999';
    calcularBtn.onclick = procesarTabla;
    document.body.appendChild(calcularBtn);

    const limpiarBtn = document.createElement('button');
    limpiarBtn.textContent = 'Limpiar';
    limpiarBtn.className = 'btn-limpiar';
    limpiarBtn.style.position = 'fixed';
    limpiarBtn.style.bottom = '20px';
    limpiarBtn.style.right = '20px';
    limpiarBtn.style.zIndex = '9999';
    limpiarBtn.onclick = limpiarTabla;
    document.body.appendChild(limpiarBtn);

    procesarTabla();
});
