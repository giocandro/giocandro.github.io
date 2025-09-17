const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gridSize = 20;
let count = 0;
let snake = [{x: 160, y: 160}];
let dx = gridSize;
let dy = 0;
let berry = randomBerry();
let score = 0;

document.addEventListener("keydown", keyDown);

function gameLoop() {
  requestAnimationFrame(gameLoop);
  if (++count < 6) return;
  count = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Muove il serpente
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head);

  // Collisione bacche
  if (head.x === berry.x && head.y === berry.y) {
    score++;
    berry = randomBerry();
  } else {
    snake.pop();
  }

  // Collisione muri o se stesso
  if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height ||
      snake.slice(1).some(s => s.x === head.x && s.y === head.y)) {
    snake = [{x: 160, y: 160}];
    dx = gridSize;
    dy = 0;
    berry = randomBerry();
    score = 0;
  }

  // Disegna serpente
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "#2e7d32" : "#4caf50";
    ctx.beginPath();
    ctx.arc(part.x + gridSize/2, part.y + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Occhi sulla testa
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

  // Fogliolina verde sopra la bacca
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

requestAnimationFrame(gameLoop);
