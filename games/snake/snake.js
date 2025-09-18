const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  let size = Math.min(window.innerWidth * 0.9, 400); // 90% dello schermo, max 400
  canvas.width = size;
  canvas.height = size;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let gridSize = 20;
let count = 0;
let snake = [{x: 160, y: 160}];
let dx = gridSize;
let dy = 0;
let berry = randomBerry();
let score = 0;
let running = false;
let paused = false;
let gameOver = false;
let speed = 10; // velocità iniziale (più alto = più lento)

function updateScore() {
  document.getElementById("score").textContent = "Punteggio: " + score;

  // aumento difficoltà in base al punteggio
  if (score === 8) {
    speed = 8; // aumenta velocità
  } else if (score === 16) {
    speed = 6; // aumenta ancora
  }
}

document.addEventListener("keydown", keyDown);

function gameLoop() {
  if (!running || paused || gameOver) return;
  requestAnimationFrame(gameLoop);

  if (++count < speed) return;
  count = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head);

  if (head.x === berry.x && head.y === berry.y) {
    score++;
    updateScore();
    berry = randomBerry();
  } else {
    snake.pop();
  }

  // Controllo collisioni
  if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height ||
      snake.slice(1).some(s => s.x === head.x && s.y === head.y)) {
    endGame();
    return;
  }

  // Disegna serpente
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "#2e7d32" : "#4caf50";
    ctx.beginPath();
    ctx.arc(part.x + gridSize/2, part.y + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    if (index === 0) {
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(part.x + 6, part.y + 6, 3, 0, Math.PI * 2);
      ctx.arc(part.x + 14, part.y + 6, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(part.x + 6, part.y + 6, 1.5, 0, Math.PI * 2);
      ctx.arc(part.x + 14, part.y + 6, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Disegna bacca
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(berry.x + gridSize/2, berry.y + gridSize/2, gridSize/2 - 3, 0, Math.PI * 2);
  ctx.fill();

  // Fogliolina
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.ellipse(berry.x + gridSize/2, berry.y + 4, 4, 8, Math.PI/4, 0, Math.PI*2);
  ctx.fill();
}

function randomBerry() {
  return {
    x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
  };
}

function keyDown(e) {
  if (e.key === "ArrowLeft" && dx === 0) { dx = -gridSize; dy = 0; }
  else if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -gridSize; }
  else if (e.key === "ArrowRight" && dx === 0) { dx = gridSize; dy = 0; }
  else if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = gridSize; }
}

function setDirection(dir) {
  if (dir === "left" && dx === 0) { dx = -gridSize; dy = 0; }
  else if (dir === "up" && dy === 0) { dx = 0; dy = -gridSize; }
  else if (dir === "right" && dx === 0) { dx = gridSize; dy = 0; }
  else if (dir === "down" && dy === 0) { dx = 0; dy = gridSize; }
}

function startGame() {
  if (running && !gameOver) return;
  resetGame();
  running = true;
  paused = false;
  gameOver = false;
  requestAnimationFrame(gameLoop);
}

function pauseGame() {
  if (!running || gameOver) return;
  paused = true;
}

function resumeGame() {
  if (!running || !paused || gameOver) return;
  paused = false;
  requestAnimationFrame(gameLoop);
}

function resetGame() {
  snake = [{x: 160, y: 160}];
  dx = gridSize;
  dy = 0;
  berry = randomBerry();
  score = 0;
  speed = 10; // reset velocità iniziale
  updateScore();
}

function endGame() {
  running = false;
  paused = false;
  gameOver = true;
  showPopup("Game Over! Punteggio finale: " + score);
}

function showPopup(message) {
  document.getElementById("popupMessage").textContent = message;
  document.getElementById("gameOverPopup").style.display = "flex";
}

function closePopup() {
  document.getElementById("gameOverPopup").style.display = "none";
}
