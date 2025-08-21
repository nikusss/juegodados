// Variables de estado y lógica del dado
let lanzando = false;
let resultadoDado = 1;
let rotacionX, rotacionY, rotacionZ;
let tiempoLanzamiento = 1500; // Duración de la animación en milisegundos
let inicioLanzamiento;

// Variable para el movimiento del título
let tituloX;

// Variable para la imagen de fondo
let bgImage;

// Nuevo lienzo 2D para las notas y los títulos
let pg;

// Variable para la tipografía Oswald-Bold
let myFont;

// Probabilidades de cada cara (del 1 al 6)
// El 1 ahora tiene la probabilidad más baja (0.01), el 6 la más alta (0.25)
let probabilidades = [0.01, 0.19, 0.20, 0.15, 0.20, 0.25];
let limitesProbabilidad; // Acumulación de probabilidades

// Parámetros para el dado 3D
let tamanoDado = 160;

// Array con las notas que quieres mostrar (índice 0 = nota para el 1, etc.)
let notas = [
  "1: Hola",
  "2: ¿Cómo va?",
  "3: Estoy bien",
  "4: Muy, muy bien",
  "5: ¿Cómo estuvo tu día?",
  "6: Estuvo bien"
];

// Función para precargar la imagen y la fuente antes del setup
function preload() {
  // Ahora carga el archivo llamado fondo.jpg
  bgImage = loadImage('fondo.jpg');
  // Carga la nueva tipografía Oswald-Bold
  myFont = loadFont('Oswald-Bold.ttf');
}

function setup() {
  createCanvas(400, 700, WEBGL);
  
  // Creamos el lienzo 2D para los elementos de la interfaz
  pg = createGraphics(400, 700);
  
  // Preparamos la lógica de probabilidades
  limitesProbabilidad = new Array(probabilidades.length);
  let suma = 0;
  for (let i = 0; i < probabilidades.length; i++) {
    suma += probabilidades[i];
    limitesProbabilidad[i] = suma;
  }
  
  // Establecemos los ángulos de rotación iniciales
  rotacionX = 0;
  rotacionY = 0;

  // Inicializamos la posición del título fuera de la pantalla, a la izquierda
  tituloX = -pg.width / 2;
}

function draw() {
  // Dibuja la imagen de fondo para que cubra todo el canvas
  image(bgImage, -width/2, -height/2, width, height);

  // Traslada toda la escena 3D hacia arriba para que el dado no se corte con el fondo
  translate(0, -50, 0);
  
  // Sombra del dado
  push();
  noStroke();
  // Hemos aumentado la opacidad para que la sombra sea más visible
  fill(0, 150); 
  translate(0, 100, 0); // Posición de la sombra
  rotateX(HALF_PI);
  ellipse(0, 0, tamanoDado * 1.5, tamanoDado * 1.5);
  pop();
  
  // --- Iluminación mejorada ---
  // Aumentamos la luz ambiental para iluminar toda la escena
  ambientLight(200); 
  // Luz direccional para crear brillo y sombras
  directionalLight(255, 255, 255, 0, -1, 0);
  // Aumentamos la segunda luz direccional para iluminar las caras en sombra
  directionalLight(200, 200, 200, 1, 1, 1);
  
  if (lanzando) {
    if (millis() - inicioLanzamiento > tiempoLanzamiento) {
      lanzando = false;
      resultadoDado = lanzarDado();
    } else {
      rotacionX += 0.2;
      rotacionY += 0.3;
      rotacionZ += 0.1;
      drawCube(rotacionX, rotacionY, rotacionZ);
    }
  } else {
    drawFinalCube(resultadoDado);
  }
  
  // Agrega los títulos y las notas al lienzo 2D
  drawInterface(resultadoDado);
  
  // Dibuja el lienzo 2D sobre el 3D
  image(pg, -width/2, -height/2);
}

function mousePressed() {
  iniciarLanzamiento();
}

function touchStarted() {
  iniciarLanzamiento();
}

function iniciarLanzamiento() {
  if (!lanzando) {
    lanzando = true;
    inicioLanzamiento = millis();
    rotacionX = random(TWO_PI);
    rotacionY = random(TWO_PI);
    rotacionZ = random(TWO_PI);
    // Reiniciamos el resultado para que no haya notas resaltadas durante el lanzamiento
    resultadoDado = 0;
  }
}

function lanzarDado() {
  let r = random(1);
  let acumulado = 0;
  for (let i = 0; i < probabilidades.length; i++) {
    acumulado += probabilidades[i];
    if (r <= acumulado) {
      console.log("El dado cayó en el:", i + 1);
      return i + 1;
    }
  }
  console.log("El dado cayó en el:", 6);
  return 6;
}

// ===========================================
// FUNCIONES PARA DIBUJAR EL DADO Y SUS PUNTOS
// ===========================================

function drawCube(rotX, rotY, rotZ) {
  push();
  rotateX(rotX);
  rotateY(rotY);
  rotateZ(rotZ);
  
  // Dibuja todas las caras para la animación de lanzamiento
  drawFace(tamanoDado, 1, 'front');
  drawFace(tamanoDado, 6, 'back');
  drawFace(tamanoDado, 3, 'right');
  drawFace(tamanoDado, 4, 'left');
  drawFace(tamanoDado, 2, 'top');
  drawFace(tamanoDado, 5, 'bottom');
  
  pop();
}

// Nueva función para dibujar el dado en su posición final
function drawFinalCube(num) {
  push();
  
  // Ajustamos la rotación para que el número del dado coincida con la cara que se muestra
  switch(num) {
    case 1:
      // Cara 1: Sin rotación
      break;
    case 2:
      // Cara 2: Rotación para mostrar la cara superior
      rotateX(-HALF_PI);
      break;
    case 3:
      // Cara 3: Rotación para mostrar la cara derecha
      rotateY(-HALF_PI);
      break;
    case 4:
      // Cara 4: Rotación para mostrar la cara izquierda
      rotateY(HALF_PI);
      break;
    case 5:
      // Cara 5: Rotación para mostrar la cara inferior
      rotateX(HALF_PI);
      break;
    case 6:
      // Cara 6: Rotación para mostrar la cara trasera
      rotateY(PI);
      break;
  }
  
  // Dibuja todas las caras para que el cubo sea completo
  drawFace(tamanoDado, 1, 'front');
  drawFace(tamanoDado, 6, 'back');
  drawFace(tamanoDado, 3, 'right');
  drawFace(tamanoDado, 4, 'left');
  drawFace(tamanoDado, 2, 'top');
  drawFace(tamanoDado, 5, 'bottom');
  
  pop();
}

function drawFace(s, num, side) {
  push();
  
  switch(side) {
    case 'front':
      translate(0, 0, s / 2);
      break;
    case 'back':
      translate(0, 0, -s / 2);
      break;
    case 'right':
      rotateY(HALF_PI);
      translate(0, 0, s / 2);
      break;
    case 'left':
      rotateY(-HALF_PI);
      translate(0, 0, s / 2);
      break;
    case 'top':
      rotateX(HALF_PI);
      translate(0, 0, s / 2);
      break;
    case 'bottom':
      rotateX(-HALF_PI);
      translate(0, 0, s / 2);
      break;
  }
  
  // Dibuja la cara (el cuadrado del dado)
  stroke(0);
  strokeWeight(2);
  fill(255); // Color de la cara del dado: blanco
  rectMode(CENTER);
  rect(0, 0, s, s, s / 10);
  
  // Llama a la función para dibujar los puntos
  noStroke();
  drawDots(num, s);
  
  pop();
}

function drawDots(num, s) {
  let r = s / 4;
  let puntoSize = s / 5;
  
  // Cambia el color del punto según el número de la cara
  if (num === 1) {
    fill(255, 0, 0); // Color rojo para el número 1
  } else {
    fill(0); // Color negro para los demás números
  }

  switch(num) {
    case 1:
      ellipse(0, 0, puntoSize, puntoSize);
      break;
    case 2:
      ellipse(-r, -r, puntoSize, puntoSize);
      ellipse(r, r, puntoSize, puntoSize);
      break;
    case 3:
      ellipse(-r, -r, puntoSize, puntoSize);
      ellipse(0, 0, puntoSize, puntoSize);
      ellipse(r, r, puntoSize, puntoSize);
      break;
    case 4:
      ellipse(-r, -r, puntoSize, puntoSize);
      ellipse(r, -r, puntoSize, puntoSize);
      ellipse(-r, r, puntoSize, puntoSize);
      ellipse(r, r, puntoSize, puntoSize);
      break;
    case 5:
      ellipse(-r, -r, puntoSize, puntoSize);
      ellipse(0, 0, puntoSize, puntoSize);
      ellipse(r, -r, puntoSize, puntoSize);
      ellipse(-r, r, puntoSize, puntoSize);
      ellipse(r, r, puntoSize, puntoSize);
      break;
    case 6:
      ellipse(-r, -r, puntoSize, puntoSize);
      ellipse(-r, 0, puntoSize, puntoSize);
      ellipse(-r, r, puntoSize, puntoSize);
      ellipse(r, -r, puntoSize, puntoSize);
      ellipse(r, 0, puntoSize, puntoSize);
      ellipse(r, r, puntoSize, puntoSize);
      break;
  }
}

// Función para dibujar texto con un efecto de resplandor
function drawGlowingText(text, x, y, size, mainColor) {
  // Color del resplandor: blanco con opacidad
  let glowColor = color(255, 255, 255, 20); // Menor opacidad para menos carga
  
  // Dibuja menos veces para crear un efecto de "blur" más ligero
  for (let i = 0; i < 2; i++) { // Reducido de 5 a 2
    pg.fill(glowColor);
    pg.text(text, x, y); // Quitado el random() para más eficiencia
  }
  
  // Dibuja el texto principal con su color definido
  pg.fill(mainColor);
  pg.text(text, x, y);
}


// Nueva función para mostrar la interfaz completa
function drawInterface(dadoResultado) {
  // Limpia el lienzo por completo para evitar bordes o artefactos
  pg.clear();
  
  // Establece la tipografía Oswald-Bold para todos los textos
  pg.textFont(myFont);
  pg.noStroke();
  
  // --- Dibuja el título con efecto de brillo (usando la nueva función) ---
  pg.textSize(32); 
  pg.textAlign(pg.CENTER, pg.TOP);
  // Cambiamos el color principal del texto a magenta
  drawGlowingText("Participa y gana algunos de nuestros premios", tituloX, 80, 32, color(255, 0, 255));
  
  // Actualiza la posición del título
  tituloX += 2; // Velocidad del movimiento
  if (tituloX > pg.width + 50) { // Si el título sale por la derecha, lo reinicia a la izquierda
    tituloX = -pg.width / 2;
  }
  
  // Dibuja las notas
  pg.textSize(28); // Tamaño de fuente más grande
  pg.textAlign(pg.LEFT, pg.TOP); // Alineamos el texto a la izquierda y arriba
  
  let x = 20;
  let lineHeight = 35; // Aumentamos el espacio entre líneas para que se vea mejor
  // Posición Y para las notas en la parte inferior del lienzo 2D
  let yInicial = height - (notas.length * lineHeight) - 10;
  
  for (let i = 0; i < notas.length; i++) {
    let y = yInicial + i * lineHeight;
    let notaTexto = notas[i];
    
    // Si la nota corresponde al resultado, la resalta y cambia el color del texto
    if (i + 1 === dadoResultado) {
      // Dibuja el fondo de resaltador
      pg.noStroke();
      // Opacidad del resaltado más oscura
      pg.fill(0, 200); 
      pg.rectMode(pg.CORNER);
      
      // Ajuste de posición y tamaño para una alineación perfecta
      // Hacemos el rectángulo un poco más grande para que se vea mejor
      pg.rect(x - 5, y + 2, pg.textWidth(notaTexto) + 10, pg.textSize() + 10);
      
      // Dibuja el texto en rojo
      pg.fill(255, 0, 0); 
      pg.text(notaTexto, x, y);
    } else {
      // Dibuja las notas no seleccionadas con el efecto de brillo
      drawGlowingText(notaTexto, x, y, 28, color(255, 0, 255));
    }
  }
}

