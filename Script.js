let playerRow = 0;
let playerCol = 0;
const exitRow = 20;
const exitCol = 20;
let minotaurs = [];
const mapContainer = document.getElementById('mapContainer');
const mapWidth = 21;
const mapHeight = 21;
let interval;
let map =[];
let puntuacionTotal=0;
let puntuacion=0;
// Generate map matrix
map = generateMap(mapWidth, mapHeight);


let countdown = 35; // Variable para almacenar el tiempo restante
let countdownInterval; // Variable para almacenar el intervalo del temporizador
startCountdown();// inicia la cuenta

// Function to generate a random number within a range
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate the map matrix with island-like obstacles
function generateMap(rows, cols) {

    // Initialize map with all cells as empty
    for (let i = 0; i < rows; i++) {
        map[i] = Array(cols).fill(0);
    }

    // Define the number of islands
    const numIslands = 30

    // Generate islands
    for (let i = 0; i < numIslands; i++) {
        // Randomly choose the center of the island
        const islandRow = getRandomNumber(0, rows - 1);
        const islandCol = getRandomNumber(0, cols - 1);
        
        // Perform flood-fill algorithm to expand the island
        let islandCount = 0;
        const stack = [{ row: islandRow, col: islandCol }];
        while (islandCount < 4 && stack.length > 0) {
            const index = getRandomNumber(0, stack.length - 1);
            const { row, col } = stack.splice(index, 1)[0]; 
            if (row >= 0 && row < rows && col >= 0 && col < cols && map[row][col] === 0) {
                map[row][col] = 1;
                islandCount++;
                const neighbors = [
                    { row: row - 1, col: col },
                    { row: row + 1, col: col },
                    { row: row, col: col - 1 },
                    { row: row, col: col + 1 }
                ];
                shuffleArray(neighbors);
                stack.push(...neighbors);
            }
        }
    }

    // Place empty squares in top-left and bottom-right corners
    for (let r = 0; r <= 2; r++) {
        for (let c = 0; c <= 2; c++) {

                map[r][c] = 0; // Surrounding obstacles
            
        }
    }
    // Place empty squares in top-left and bottom-right corners
    for (let r = 17; r <= 20; r++) {
        for (let c = 17; c <= 20; c++) {

                map[r][c] = 0; // Surrounding obstacles
            
        }
    }
    map[0][0] = 0;
    map[0][1] = 0;
    map[1][0] = 0;
    map[1][1] = 0;   
    map[rows - 1][cols - 1] = 0;
    map[rows - 1][cols - 2] = 0;
    map[rows - 2][cols - 1] = 0;
    map[rows - 2][cols - 2] = 0;

    // Place empty 3x3 surrounded by obstacles
    const emptyRow = Math.floor(rows / 2);
    const emptyCol = Math.floor(cols / 2);
    for (let r = emptyRow - 2; r <= emptyRow + 2; r++) {
        for (let c = emptyCol - 2; c <= emptyCol + 2; c++) {

                map[r][c] = 1; // Surrounding obstacles
            
        }
    }
    for (let r = emptyRow - 1; r <= emptyRow + 1; r++) {
        for (let c = emptyCol - 1; c <= emptyCol + 1; c++) {

                map[r][c] = 0; // Surrounding obstacles
            
        }
    }
    map[emptyRow][emptyCol-2] = 0;
    map[emptyRow][emptyCol+2] = 0;
    map[emptyRow+2][emptyCol] = 0;
    map[emptyRow-2][emptyCol] = 0;
  
    return map;
}

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
// Función para mover al minotauro

class Minotaur {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }

    move() {
        const direction = getRandomNumber(0, 3);

        switch (direction) {
            case 0: // Arriba
                if (this.row > 0 && map[this.row - 1][this.col] !== 1) {
                    this.row--;
                }
                break;
            case 1: // Abajo
                if (this.row < mapHeight - 1 && map[this.row + 1][this.col] !== 1) {
                    this.row++;
                }
                break;
            case 2: // Izquierda
                if (this.col > 0 && map[this.row][this.col - 1] !== 1) {
                    this.col--;
                }
                break;
            case 3: // Derecha
                if (this.col < mapWidth - 1 && map[this.row][this.col + 1] !== 1) {
                    this.col++;
                }
                break;
        }
    }
}


function generateMinotaurs(numMinotaurs) {
    for (let i = 0; i < numMinotaurs; i++) {
        const row = getRandomNumber(0, mapHeight - 1);
        const col = getRandomNumber(0, mapWidth - 1);
        const minotaur = new Minotaur(row, col);
        minotaurs.push(minotaur);
    }
}

// Function to move all minotaurs
function moveMinotaurs() {
    minotaurs.forEach(minotaur => minotaur.move());
}


// Función para dibujar el mapa
function drawMap() {
    const mapContainer = document.getElementById('mapContainer');
    mapContainer.innerHTML = '';

    // Draw the map
    for (let row = 0; row < mapHeight; row++) {
        for (let col = 0; col < mapWidth; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (map[row][col] === 1) {
                cell.classList.add('obstacle');
            } else if (row === playerRow && col === playerCol) {
                cell.classList.add('player');
            } else if (row === exitRow && col === exitCol) {
                cell.classList.add('exit');
            } else {
                // Check if there is a minotaur at this position
                const minotaurAtPosition = minotaurs.find(minotaur => minotaur.row === row && minotaur.col === col);
                if (minotaurAtPosition) {
                    cell.classList.add('minotaur');
                }
            }
            mapContainer.appendChild(cell);
        }
    }
}


// Call drawMap function to generate the map when the page loads
generateMinotaurs(2);
drawMap();
mainLoop();
// Function to handle player movement
// Event listener for key presses
document.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase();
    if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
        movePlayer(key);
    }
});

// Variable para controlar si el jugador puede moverse
let canMove = true;

// Función para manejar el movimiento del jugador
function movePlayer(direction) {
    if (canMove) {
        let newRow = playerRow;
        let newCol = playerCol;

        if (direction === 'w' && playerRow > 0) {
            newRow = playerRow - 1;
        } else if (direction === 's' && playerRow < 20) {
            newRow = playerRow + 1;
        } else if (direction === 'a' && playerCol > 0) {
            newCol = playerCol - 1;
        } else if (direction === 'd' && playerCol < 20) {
            newCol = playerCol + 1;
        }

        // Verifica si la nueva posición es una celda vacía o la salida
        if (map[newRow][newCol] === 0 || (newRow === exitRow && newCol === exitCol)) {
            map[playerRow][playerCol] = 0; // Limpia la posición actual
            playerRow = newRow;
            playerCol = newCol;
            map[playerRow][playerCol] = 'P'; // Actualiza la posición del jugador
            drawMap();

        } else {
            // Si intenta moverse a una posición no válida, muestra un aviso
            
        }

        // Desactiva el movimiento del jugador durante un segundo
        canMove = false;
        setTimeout(() => {
            canMove = true;
        }, 200);
    }
}




// Función para mostrar un mensaje de estado (ganador o perdedor)
function mostrarEstado(mensaje) {
    const estadoModal = document.getElementById('estadoModal');
    const mensajeEstado = document.getElementById('mensajeEstado');
    mensajeEstado.textContent = mensaje;
    estadoModal.style.display = 'block';
}



// Función para reiniciar el juego
function reiniciarJuego() {
    // Reinicia las posiciones del jugador y el minotauro

    mapContainer.innerHTML = '';
    generateMinotaurs(2);
    // Genera un nuevo mapa
    map = generateMap(mapWidth, mapHeight);
    countdown =25;
    
    
    // Dibuja el nuevo mapa
    drawMap();
   
    clearTimeout(interval);
    // Oculta el cuadro emergente de estado
    const estadoModal = document.getElementById('estadoModal');
    estadoModal.style.display = 'none';
    console.log("reiniciarJuego")
}



// Función principal del bucle del juego
async function mainLoop() {
    // Bucle principal del juego
    while (!(playerRow === exitRow && playerCol === exitCol) && !minotaurs.some(minotaur => minotaur.row === playerRow && minotaur.col === playerCol)) {
        // Mueve al minotauro
        moveMinotaurs();

        // Redibuja el mapa con las posiciones actualizadas
        drawMap();
        console.log("hola")
        // Espera un tiempo antes de la próxima iteración para fines de visualización
        
        await new Promise(resolve => setTimeout(resolve, 300)); // Ajusta el tiempo de espera según sea necesario

        
    }


    // Verifica si el jugador ganó o perdió
    if (playerRow === exitRow && playerCol === exitCol) {
        playerRow = 0;
        playerCol = 0;
        //Event listener para el botón de reinicio
         puntuacionTotal+=puntuacion
        reiniciarJuego();
        countdown =35;
        mainLoop();
        
    } else {
        mostrarEstado("🐂🐂 \n VAYA.... \n EL MINOTAURO TE HA ATRAPADO! \n 🐂🐂 \n PUNTUACIÓN: " + puntuacionTotal);
        //Event listener para el botón de reinicio
        const reiniciarJuegoButton = document.getElementById('reiniciarJuego');
        reiniciarJuegoButton.addEventListener('click', reiniciarJuego);
        playerRow = 0;
        playerCol = 0;
        puntuacionTotal=0;
        minotaurs = [];
        countdown =35;
        mainLoop();
    }
}






// Función para iniciar la cuenta atrás
function startCountdown() {
    countdownInterval = setInterval(() => {
        countdown--; // Disminuye el tiempo restante
        let puntos= countdown*10
        puntos-10;
        puntuacion =puntos;
        document.getElementById('p').textContent= "Puntuacion: " + puntuacion;
        document.getElementById('pTotal').textContent= "Puntuacion Total: " + puntuacionTotal
        console.log(puntuacion)
        if (countdown <= 0) {
            mostrarEstado("⏰⏰ \n ¡OH NO!\nSE TERMINÓ EL TIEMPO! \n ⏰⏰ \n PUNTUACIÓN: "+ puntuacionTotal );
            clearInterval(countdownInterval); // Detiene la cuenta atrás cuando llega a cero
            playerRow = 0;
            playerCol = 0;
            minotaurs=[];
            
           
            //Event listener para el botón de reinicio
            const reiniciarJuegoButton = document.getElementById('reiniciarJuego');
            reiniciarJuegoButton.addEventListener('click',()=>{reiniciarJuego(),puntuacionTotal=0,startCountdown()});
            
            
            
        }
        // Actualiza la interfaz de usuario para mostrar el tiempo restante
        document.getElementById('Timer').textContent = "Tiempo restante... " + countdown + " s";
    }, 1000); // Actualiza cada segundo
}



 