const filas = 10;
const columnas = 10;
const numeroMinas = 15;
let tableroElement = document.getElementById('tablero');
let mensajeElement = document.getElementById('mensaje');
let tableroLogico = [];
let celdas = [];
let juegoTerminado = false;
let banderasColocadas = 0;

function iniciarJuego() {
    tableroLogico = crearTablero(filas, columnas, numeroMinas);
    tableroElement.innerHTML = '';
    celdas = [];
    juegoTerminado = false;
    mensajeElement.textContent = '';
    banderasColocadas = 0;

    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            const celda = document.createElement('div');
            celda.classList.add('celda');
            celda.dataset.fila = i;
            celda.dataset.columna = j;
            celda.addEventListener('click', manejarClicCelda);
            celda.addEventListener('contextmenu', manejarClickDerechoCelda);
            tableroElement.appendChild(celda);
            celdas.push(celda);
        }
    }

    // Ya no es necesario establecer gridTemplateColumns aquí, se define en el CSS
    // tableroElement.style.gridTemplateColumns = `repeat(${columnas}, 30px)`;
}

function crearTablero(filas, columnas, numeroMinas) {
    const tablero = Array(filas).fill(null).map(() => Array(columnas).fill(0));
    let minasColocadas = 0;

    while (minasColocadas < numeroMinas) {
        const filaAleatoria = Math.floor(Math.random() * filas);
        const columnaAleatoria = Math.floor(Math.random() * columnas);

        if (tablero[filaAleatoria][columnaAleatoria] !== 'M') {
            tablero[filaAleatoria][columnaAleatoria] = 'M';
            minasColocadas++;
        }
    }

    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            if (tablero[i][j] !== 'M') {
                let minasAdyacentes = contarMinasAdyacentes(tablero, i, j);
                tablero[i][j] = minasAdyacentes;
            }
        }
    }

    return tablero;
}

function contarMinasAdyacentes(tablero, fila, columna) {
    let contador = 0;
    for (let i = Math.max(0, fila - 1); i <= Math.min(filas - 1, fila + 1); i++) {
        for (let j = Math.max(0, columna - 1); j <= Math.min(columnas - 1, columna + 1); j++) {
            if (tablero[i][j] === 'M' && (i !== fila || j !== columna)) {
                contador++;
            }
        }
    }
    return contador;
}

function manejarClicCelda(evento) {
    if (juegoTerminado) return;

    const celdaElement = evento.target;
    const fila = parseInt(celdaElement.dataset.fila);
    const columna = parseInt(celdaElement.dataset.columna);

    if (celdaElement.classList.contains('revelada') || celdaElement.classList.contains('bandera')) {
        return;
    }

    if (tableroLogico[fila][columna] === 'M') {
        revelarMinas();
        mensajeElement.textContent = '¡Perdiste!';
        juegoTerminado = true;
    } else {
        revelarCelda(fila, columna);
        if (verificarVictoria()) {
            mensajeElement.textContent = '¡Ganaste!';
            juegoTerminado = true;
            revelarMinas(); // Opcional: mostrar las minas al ganar
        }
    }
}

function manejarClickDerechoCelda(evento) {
    evento.preventDefault();
    if (juegoTerminado) return;

    const celdaElement = evento.target;

    if (celdaElement.classList.contains('revelada')) {
        return;
    }

    const esBandera = celdaElement.classList.contains('bandera');

    if (esBandera) {
        celdaElement.classList.remove('bandera');
        banderasColocadas--;
    } else {
        celdaElement.classList.add('bandera');
        banderasColocadas++;
    }
}

function revelarCelda(fila, columna) {
    if (fila < 0 || fila >= filas || columna < 0 || columna >= columnas) {
        return;
    }

    const indice = fila * columnas + columna;
    const celdaElement = celdas[indice];

    if (celdaElement.classList.contains('revelada')) {
        return;
    }

    celdaElement.classList.add('revelada');

    if (tableroLogico[fila][columna] > 0) {
        celdaElement.textContent = tableroLogico[fila][columna];
    } else if (tableroLogico[fila][columna] === 0) {
        for (let i = Math.max(0, fila - 1); i <= Math.min(filas - 1, fila + 1); i++) {
            for (let j = Math.max(0, columna - 1); j <= Math.min(columnas - 1, columna + 1); j++) {
                revelarCelda(i, j);
            }
        }
    }
}

function revelarMinas() {
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            if (tableroLogico[i][j] === 'M') {
                const indice = i * columnas + j;
                celdas[indice].classList.add('revelada', 'mina');
                celdas[indice].textContent = '💣';
            }
        }
    }
}

function verificarVictoria() {
    let celdasNoMinadasReveladas = 0;
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            if (tableroLogico[i][j] !== 'M') {
                const indice = i * columnas + j;
                if (celdas[indice].classList.contains('revelada')) {
                    celdasNoMinadasReveladas++;
                }
            }
        }
    }
    return celdasNoMinadasReveladas === (filas * columnas - numeroMinas);
}

iniciarJuego();
