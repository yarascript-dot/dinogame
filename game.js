const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

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

// Перешкоди
let obstacles = [];
let frame = 0;
let score = 0;

function spawnObstacle() {
  obstacles.push({
    x: canvas.width,
    y: 160,
    width: 20,
    height: 40
  });
}

function update() {
  frame++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Гравітація
  player.velocityY += player.gravity;
  player.y += player.velocityY;

  if (player.y >= 150) {
    player.y = 150;
    player.velocityY = 0;
    player.grounded = true;
  }

  // Малюємо гравця
  ctx.fillStyle = "#000";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Перешкоди
  if (frame % 90 === 0) spawnObstacle();

  obstacles.forEach((obs, index) => {
    obs.x -= 5;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    // Колізія
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      cancelAnimationFrame(loop);
      drawGameOver();
    }

    if (obs.x + obs.width < 0) {
      obstacles.splice(index, 1);
      score++;
    }
  });

  drawScore();
  loop = requestAnimationFrame(update);
}

function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "16px monospace";
  ctx.fillText(`Score: ${score}`, 10, 20);
}

function drawGameOver() {
  ctx.fillStyle = "#000";
  ctx.font = "24px monospace";
  ctx.fillText("GAME OVER", 320, 100);
}

// Стрибок
document.addEventListener("keydown", e => {
  if ((e.code === "Space" || e.code === "ArrowUp") && player.grounded) {
    player.velocityY = player.jumpPower;
    player.grounded = false;
  }
});

let loop = requestAnimationFrame(update);
