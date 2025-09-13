const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

const box = 20;
let snake = [];
let direction;
let score = 0;
let food = {};
let lastTime = 0;
const speed = 5; // celle al secondo
let isRunning = false;
let gameOver = false;

// Inizializza il gioco
function initGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = null; // non si muove finché non premi freccia
  score = 0;
  scoreEl.textContent = score;
  food = {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
  };
  gameOver = false;
}

// Controlli tastiera
document.addEventListener("keydown", changeDirection);
function changeDirection(event) {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

// Funzione collisione
function collision(head, array) {
  return array.some(segment => head.x === segment.x && head.y === segment.y);
}

// Funzione principale
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

// Aggiorna stato gioco
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
    food = {
      x: Math.floor(Math.random() * 19) * box,
      y: Math.floor(Math.random() * 19) * box
    };
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

// Controlli bottoni
document.getElementById("startBtn").addEventListener("click", () => {
  if (!isRunning) {
    if (gameOver) initGame(); // reset automatico se Game Over
    isRunning = true;
    lastTime = 0;
    requestAnimationFrame(gameLoop);
  }
});

document.getElementById("pauseBtn").addEventListener("click", () => {
  isRunning = false;
});

document.getElementById("resumeBtn").addEventListener("click", () => {
  if (!isRunning && !gameOver) {
    isRunning = true;
  }
});

// Inizializza al caricamento
initGame();
