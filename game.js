const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let loop;
let gameOver = false;
let frame = 0;
let score = 0;
let obstacles = [];

// Гравець
const player = {
  x: 50,
  y: 150,
  width: 20,
  height: 20,
  velocityY: 0,
  gravity: 0.8,
  jumpPower: -12,
  grounded: true
};

function resetGame() {
  gameOver = false;
  frame = 0;
  score = 0;
  obstacles = [];
  player.y = 150;
  player.velocityY = 0;
  player.grounded = true;
  loop = requestAnimationFrame(update);
}

function spawnObstacle() {
  obstacles.push({
    x: canvas.width,
    y: 160,
    width: 20,
    height: 40
  });
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  frame++;

  // Гравітація
  player.velocityY += player.gravity;
  player.y += player.velocityY;

  if (player.y >= 150) {
    player.y = 150;
    player.velocityY = 0;
    player.grounded = true;
  }

  // Гравець
  ctx.fillStyle = "#000";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Перешкоди
  if (frame % 90 === 0) spawnObstacle();

  obstacles.forEach(obs => {
    obs.x -= 5;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    // Колізія
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      endGame();
    }
  });

  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

  drawScore();

  if (!gameOver) {
    loop = requestAnimationFrame(update);
  }
}

function endGame() {
  gameOver = true;
  ctx.fillStyle = "#000";
  ctx.font = "24px monospace";
  ctx.fillText("GAME OVER", 320, 100);
  ctx.font = "14px monospace";
  ctx.fillText("Press SPACE to restart", 300, 130);
}

function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "16px monospace";
  ctx.fillText(`Score: ${score}`, 10, 20);
}

// Управління
document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    if (gameOver) {
      resetGame();
    } else if (player.grounded) {
      player.velocityY = player.jumpPower;
      player.grounded = false;
    }
  }
});

// Старт
resetGame();
