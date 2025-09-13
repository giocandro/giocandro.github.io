const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

let box = 20; // dimensione cella base
let snake = [];
let direction;
let score = 0;
let food = {};
let lastTime = 0;
let speed = 5; // celle al secondo
let isRunning = false;
let gameOver = false;

// Ridimensiona canvas per dispositivi mobili
function resizeCanvas() {
  const maxWidth = window.innerWidth * 0.9; // 90% dello schermo
  canvas.width = Math.min(400, maxWidth);   // max 400px
  canvas.height = canvas.width;             // sempre quadrato

  // aggiorna dimensione box in base a canvas
  box = canvas.width / 20; // 20 celle per lato
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // chiamata iniziale

// Inizializza gioco
function initGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = null;
  score = 0;
  scoreEl.textContent = score;
  spawnFood();
  gameOver = false;
}

// Genera cibo casuale
function spawnFood() {
  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
}

// Controlli tastiera
document.addEventListener("keydown", changeDirection);
function changeDirection(event) {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

// Collisione
function collision(head, array) {
  return array.some(segment => head.x === segment.x && head.y === segment.y);
}

// Game loop
function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = (timestamp - lastTime) / 1000;

  if (delta > 1 / speed && isRunning) {
    lastTime = timestamp;
    update();
    draw();
  }

  requestAnimationFrame(gameLoop);
}

// Aggiorna gioco
function update() {
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  // Mangia cibo
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    scoreEl.textContent = score;
    spawnFood();
  } else {
    snake.pop();
  }

  const newHead = { x: snakeX, y: snakeY };

  // Game over
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    isRunning = false;
    gameOver = true;
    alert("Game Over! Punteggio: " + score);
  }

  snake.unshift(newHead);
}

// Disegna
function draw() {
  ctx.fillStyle = "#e1f5fe";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  snake.forEach((segment, i) => {
    ctx.fillStyle = i === 0 ? "green" : "lightgreen";
    ctx.fillRect(segment.x, segment.y, box, box);
    ctx.strokeStyle = "black";
    ctx.strokeRect(segment.x, segment.y, box, box);
  });

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);
}

// Pulsanti PC
document.getElementById("startBtn").addEventListener("click", () => {
  if (!isRunning) {
    if (gameOver) initGame();
    isRunning = true;
    lastTime = 0;
    requestAnimationFrame(gameLoop);
  }
});

document.getElementById("pauseBtn").addEventListener("click", () => { isRunning = false; });
document.getElementById("resumeBtn").addEventListener("click", () => {
  if (!isRunning && !gameOver) isRunning = true;
});

// Pulsanti touch
document.getElementById("upBtn").addEventListener("click", () => { if (direction !== "DOWN") direction = "UP"; });
document.getElementById("downBtn").addEventListener("click", () => { if (direction !== "UP") direction = "DOWN"; });
document.getElementById("leftBtn").addEventListener("click", () => { if (direction !== "RIGHT") direction = "LEFT"; });
document.getElementById("rightBtn").addEventListener("click", () => { if (direction !== "LEFT") direction = "RIGHT"; });

// Inizializza gioco
initGame();
