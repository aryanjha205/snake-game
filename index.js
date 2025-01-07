let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
let restartButton; // Restart button reference

// Snake axis
class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// Speed of the game
let speed = 7;
// Size and count of a tile
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
// Head of the snake
let headX = 10;
let headY = 10;
let snakeParts = [];
let tailLength = 2;
// Apple size
let appleX = 5;
let appleY = 5;
// Movement
let inputsXVelocity = 0;
let inputsYVelocity = 0;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

let gulpSound = new Audio("gulp.mp3");

let startX, startY; // Touch gesture coordinates

// Initialize game
function initializeGame() {
  headX = 10;
  headY = 10;
  snakeParts = [];
  tailLength = 2;
  appleX = 5;
  appleY = 5;
  inputsXVelocity = 0;
  inputsYVelocity = 0;
  xVelocity = 0;
  yVelocity = 0;
  score = 0;
  speed = 7;

  if (restartButton) {
    restartButton.remove(); // Remove restart button if it exists
  }

  drawGame();
}

// Game loop
function drawGame() {
  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;

  changeSnakePosition();
  let result = isGameOver();
  if (result) {
    showRestartButton();
    return;
  }

  clearScreen();

  checkAppleCollision();
  drawApple();
  drawSnake();

  drawScore();

  if (score > 5) {
    speed = 9;
  }
  if (score > 10) {
    speed = 11;
  }

  setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  let gameOver = false;

  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }

  // Walls
  if (headX < 0) {
    gameOver = true;
  } else if (headX === tileCount) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY === tileCount) {
    gameOver = true;
  }

  // Check collision with itself
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "50px Verdana";

    var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");

    ctx.fillStyle = gradient;
    ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
  }

  return gameOver;
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "10px Verdana";
  ctx.fillText("Score " + score, canvas.width - 50, 10);
}

function clearScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "green";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY)); // Put an item at the end of the list next to the head
  while (snakeParts.length > tailLength) {
    snakeParts.shift(); // Remove the furthest item if snake is longer than tail size
  }

  ctx.fillStyle = "orange";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
  if (appleX === headX && appleY === headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;
    gulpSound.play();
  }
}

// Show Restart Button
function showRestartButton() {
  restartButton = document.createElement("button");
  restartButton.innerText = "Restart Game";
  restartButton.style.position = "absolute";
  restartButton.style.top = "60%";
  restartButton.style.left = "50%";
  restartButton.style.transform = "translate(-50%, -50%)";
  restartButton.style.padding = "10px 20px";
  restartButton.style.fontSize = "20px";
  restartButton.style.cursor = "pointer";
  restartButton.style.backgroundColor = "#4caf50";
  restartButton.style.color = "white";
  restartButton.style.border = "none";
  restartButton.style.borderRadius = "5px";
  restartButton.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.2)";

  restartButton.addEventListener("click", initializeGame);

  document.body.appendChild(restartButton);
}

// Keyboard input for movement
document.body.addEventListener("keydown", keyDown);

function keyDown(event) {
  // Up
  if (event.keyCode == 38 || event.keyCode == 87) {
    if (inputsYVelocity == 1) return;
    inputsYVelocity = -1;
    inputsXVelocity = 0;
  }

  // Down
  if (event.keyCode == 40 || event.keyCode == 83) {
    if (inputsYVelocity == -1) return;
    inputsYVelocity = 1;
    inputsXVelocity = 0;
  }

  // Left
  if (event.keyCode == 37 || event.keyCode == 65) {
    if (inputsXVelocity == 1) return;
    inputsYVelocity = 0;
    inputsXVelocity = -1;
  }

  // Right
  if (event.keyCode == 39 || event.keyCode == 68) {
    if (inputsXVelocity == -1) return;
    inputsYVelocity = 0;
    inputsXVelocity = 1;
  }
}

// Touch input for mobile
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);

function handleTouchStart(event) {
  const touch = event.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
}

function handleTouchMove(event) {
  if (!startX || !startY) return;

  const touch = event.touches[0];
  const deltaX = touch.clientX - startX;
  const deltaY = touch.clientY - startY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    if (deltaX > 0 && inputsXVelocity !== -1) {
      inputsXVelocity = 1;
      inputsYVelocity = 0;
    } else if (deltaX < 0 && inputsXVelocity !== 1) {
      inputsXVelocity = -1;
      inputsYVelocity = 0;
    }
  } else {
    // Vertical swipe
    if (deltaY > 0 && inputsYVelocity !== -1) {
      inputsXVelocity = 0;
      inputsYVelocity = 1;
    } else if (deltaY < 0 && inputsYVelocity !== 1) {
      inputsXVelocity = 0;
      inputsYVelocity = -1;
    }
  }

  startX = null;
  startY = null; // Reset touch start coordinates
}

initializeGame();
