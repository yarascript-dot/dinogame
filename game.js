const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===== НАЛАШТУВАННЯ =====
const SCALE = 1;
const GROUND_Y = 150;

// ===== SVG =====
const playerImg = new Image();
playerImg.src = "images/player.svg";
let spriteLoaded = false;

playerImg.onload = () => {
  spriteLoaded = true;
};

// ===== СТАНИ =====
let gameOver = false;
let paused = false;
let frame = 0;
let score = 0;
let obstacles = [];
let loop;

// ===== ГРАВЕЦЬ =====
const player = {
  x: 50,
  y: GROUND_Y,
  width: 20 * SCALE,
  height: 20 * SCALE,
  velocityY: 0,
  gravity: 0.8 * SCALE,
  jumpPower: -12 * SCALE,
  grounded: true
};

// ===== RESET =====
function resetGame() {
  gameOver = false;
  paused = false;
  frame = 0;
  score = 0;
  obstacles = [];
  player.y = GROUND_Y;
  player.velocityY = 0;
  player.grounded = true;
  loop = requestAnimationFrame(update);
}

// ===== ПЕРЕШКОДИ =====
function spawnObstacle() {
  obstacles.push({
    x: canvas.width,
    y: GROUND_Y + 10,
    width: 20 * SCALE,
    height: 40 * SCALE,
    passed: false
  });
}

// ===== LOOP =====
function update() {
  if (paused) {
    drawPause();
    loop = requestAnimationFrame(update);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frame++;

  // --- фізика ---
  player.velocityY += player.gravity;
  player.y += player.velocityY;

  if (player.y >= GROUND_Y) {
    player.y = GROUND_Y;
    player.velocityY = 0;
    player.grounded = true;
  }

  // --- гравець ---
  if (spriteLoaded) {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  } else {
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }

  // --- перешкоди ---
  if (frame % 90 === 0) spawnObstacle();

  obstacles.forEach(obs => {
    obs.x -= 5 * SCALE;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    // колізія
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      endGame();
    }

    // очки
    if (!obs.passed && obs.x + obs.width < player.x) {
      obs.passed = true;
      score++;
    }
  });

  obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

  drawScore();

  if (!gameOver) {
    loop = requestAnimationFrame(update);
  }
}

// ===== UI =====
function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "16px monospace";
  ctx.fillText(`Score: ${score}`, 10, 20);
}

function drawPause() {
  ctx.fillStyle = "#000";
  ctx.font = "24px monospace";
  ctx.fillText("PAUSED", 350, 100);
}

function endGame() {
  gameOver = true;
  ctx.fillStyle = "#000";
  ctx.font = "24px monospace";
  ctx.fillText("GAME OVER", 320, 100);
  ctx.font = "14px monospace";
  ctx.fillText("Press SPACE to restart", 300, 130);
}

// ===== INPUT =====
document.addEventListener("keydown", e => {
  if (e.code === "KeyP" && !gameOver) {
    paused = !paused;
    return;
  }

  if (e.code === "Space") {
    if (gameOver) {
      resetGame();
    } else if (!paused && player.grounded) {
      player.velocityY = player.jumpPower;
      player.grounded = false;
    }
  }
});

// ===== START =====
resetGame();
