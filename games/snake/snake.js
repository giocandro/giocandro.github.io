const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

const box = 20; // dimensione del quadrato
let snake = [{ x: 9 * box, y: 10 * box }];
let direction;
let score = 0;

// genera cibo in posizione casuale
let food = {
  x: Math.floor(Math.random() * 19) * box,
  y: Math.floor(Math.random() * 19) * box
};

// controlli da tastiera
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") {
    direction = "LEFT";
  } else if (event.key === "ArrowUp" && direction !== "DOWN") {
    direction = "UP";
  } else if (event.key === "ArrowRight" && direction !== "LEFT") {
    direction = "RIGHT";
  } else if (event.key === "ArrowDown" && direction !== "UP") {
    direction = "DOWN";
  }
}

// funzione collisione
function collision(head, array) {
  return array.some(segment => head.x === segment.x && head.y === segment.y);
}

// tempo dell’ultimo frame
let lastTime = 0;
const speed = 6; // velocità (celle al secondo)

function gameLoop(timestamp) {
  // calcolo del tempo passato
  if (!lastTime) lastTime = timestamp;
  const delta = (timestamp - lastTime) / 1000; // in secondi

  // se è passato abbastanza tempo, aggiorno
  if (delta > 1 / speed) {
    lastTime = timestamp;
    update();
    draw();
  }

  requestAnimationFrame(gameLoop);
}

function update() {
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  // se mangia il cibo
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    scoreEl.textContent = score;
    food = {
      x: Math.floor(Math.random() * 19) * box,
      y: Math.floor(Math.random() * 19) * box
    };
  } else {
    snake.pop(); // rimuove la coda
  }

  const newHead = { x: snakeX, y: snakeY };

  // game over
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    alert("Game Over! Punteggio: " + score);
    document.location.reload();
  }

  snake.unshift(newHead);
}

function draw() {
  // sfondo
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // disegna serpente
  snake.forEach((segment, i) => {
    ctx.fillStyle = i === 0 ? "green" : "lightgreen";
    ctx.fillRect(segment.x, segment.y, box, box);
    ctx.strokeStyle = "black";
    ctx.strokeRect(segment.x, segment.y, box, box);
  });

  // disegna cibo
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);
}

// avvio del loop
requestAnimationFrame(gameLoop);
