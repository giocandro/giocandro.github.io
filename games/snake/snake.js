const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20; // ogni "quadrato" sarà 20x20 px

let snake = [];
let dx = gridSize;
let dy = 0;
let berry = null;
let score = 0;
let running = false;
let paused = false;
let gameOver = false;

let lastTime = 0;
let snakeSpeed = 150; // ms tra un movimento e l'altro (più basso = più veloce)

function resizeCanvas() {
  let size = Math.min(window.innerWidth * 0.9, 400);
  size = Math.floor(size / gridSize) * gridSize; // multiplo di gridSize

  canvas.width = size;
  canvas.height = size;

  // Sposta il serpente al centro solo se il gioco è in corso
  if (snake.length > 0 && running) {
    const centerX = Math.floor(canvas.width / 2 / gridSize) * gridSize;
    const centerY = Math.floor(canvas.height / 2 / gridSize) * gridSize;
    const dxShift = centerX - snake[0].x;
    const dyShift = centerY - snake[0].y;

    snake = snake.map(part => ({
      x: part.x + dxShift,
      y: part.y + dyShift
    }));
  }

  // Rigenera la bacca se ora è fuori dai bordi
  if (berry && (berry.x >= canvas.width || berry.y >= canvas.height)) {
    berry = randomBerry();
  }
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function updateScore() {
  document.getElementById("score").textContent = "Punteggio: " + score;

  // Controllo vittoria
	if (score === 5) {
	  running = false;
	  paused = false;
	  gameOver = true;
	  showPopup("winPopup");
	}
}

document.addEventListener("keydown", keyDown);

function gameLoop(timestamp) {
  if (!running || paused || gameOver) return;

  requestAnimationFrame(gameLoop);

  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;

  if (delta < snakeSpeed) return;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === berry.x && head.y === berry.y) {
    score++;
    updateScore();
    berry = randomBerry();

    // aumenta velocità con il punteggio
    if (score === 8) snakeSpeed = 120;
    else if (score === 16) snakeSpeed = 90;
    else if (score === 24) snakeSpeed = 60;
  } else {
    snake.pop();
  }

  // Controllo collisioni
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height ||
    snake.slice(1).some(s => s.x === head.x && s.y === head.y)
  ) {
    endGame();
    return;
  }

  // Disegna serpente
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "#2e7d32" : "#4caf50";
    ctx.beginPath();
    ctx.arc(part.x + gridSize / 2, part.y + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Occhi
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
  ctx.arc(berry.x + gridSize / 2, berry.y + gridSize / 2, gridSize / 2 - 3, 0, Math.PI * 2);
  ctx.fill();

  // Fogliolina
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.ellipse(berry.x + gridSize / 2, berry.y + 4, 4, 8, Math.PI / 4, 0, Math.PI * 2);
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
  const startX = Math.floor(canvas.width / 2 / gridSize) * gridSize;
  const startY = Math.floor(canvas.height / 2 / gridSize) * gridSize;
  snake = [{ x: startX, y: startY }];
  dx = gridSize;
  dy = 0;
  berry = randomBerry();
  score = 0;
  snakeSpeed = 150;
  updateScore();
}

function endGame() {
  running = false;
  paused = false;
  gameOver = true;
  showPopup("gameOverPopup", "Game Over! Punteggio finale: " + score);
}

function showPopup(id, message = "") {
  const popup = document.getElementById(id);
  if (!popup) return;
  popup.style.display = "flex";

  // Se è il popup "gameOver", inserisci il messaggio
  if (id === "gameOverPopup" && message) {
    document.getElementById("popupMessage").textContent = message;
  }
}

function closePopup(id) {
  const popup = document.getElementById(id);
  if (!popup) return;
  popup.style.display = "none";
}

// --- TOUCH CONTROLS REATTIVI ---
function bindTouchControls() {
  const buttons = document.querySelectorAll(".touch-controls button");
  buttons.forEach(btn => {
    const direction = btn.getAttribute("onclick").match(/'(\w+)'/)[1];
    btn.addEventListener("touchstart", e => {
      e.preventDefault();
      setDirection(direction);
    });
  });
}

bindTouchControls();
