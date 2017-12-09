const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const healthBar = document.querySelector("progress");

let points = 0;
function increaseScore() {
  if (healthBar.value > 0) {
    points += 10;
  }
  document.getElementById("score").innerHTML = points;
}

class Sprite {
}

class Player extends Sprite {
  constructor(x, y, speed) {
    super();
    this.image = new Image();
    this.image.src =
      "http://vignette2.wikia.nocookie.net/clubpenguin/images/b/b8/Clothing_Icons_5436.png/revision/latest?cb=20140418022827";
    Object.assign(this, { x, y, speed });
    this.width = 42
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, 75, 30);
  }
}

let player = new Player(250, 150, 0.07);

class Enemy extends Sprite {
  constructor(x, y, speed) {
    super();
    this.image = new Image();
    this.image.src =
      "https://www.jamiesale-cartoonist.com/wp-content/uploads/cartoon-cat-free.png";
    Object.assign(this, { x, y, speed });
    this.width = 20;
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, 100, 50);
  }
}
let enemies;

let mouse = { x: 0, y: 0 };
document.body.addEventListener("mousemove", updateMouse);
function updateMouse(event) {
  const { left, top } = canvas.getBoundingClientRect();
  mouse.x = event.clientX - left;
  mouse.y = event.clientY - top;
}

function moveToward(leader, follower, speed) {
  follower.x += (leader.x - follower.x) * speed;
  follower.y += (leader.y - follower.y) * speed;
}

function pushOff(c1, c2) {
  let [dx, dy] = [c2.x - c1.x, c2.y - c1.y];
  const L = Math.hypot(dx, dy);
  let distToMove = c1.width + c2.width - L;
  if (distToMove > 0) {
    dx /= L;
    dy /= L;
    c1.x -= dx * distToMove / 2;
    c1.y -= dy * distToMove / 2;
    c2.x += dx * distToMove / 2;
    c2.y += dy * distToMove / 2;
  }
}

function distanceBetween(sprite1, sprite2) {
  return Math.hypot(sprite1.x - sprite2.x, sprite1.y - sprite2.y);
}

function haveCollided(sprite1, sprite2) {
  return distanceBetween(sprite1, sprite2) < sprite1.width + sprite2.width;
}

function updateEnemies() {
  enemies.forEach(enemy => moveToward(player, enemy, enemy.speed));
  enemies.forEach((enemy, i) =>
    pushOff(enemy, enemies[(i + 1) % enemies.length])
  );
  enemies.forEach(enemy => {
    if (haveCollided(enemy, player)) {
      healthBar.value -= 2;
    }
  });
}

function updateScene() {
  moveToward(mouse, player, player.speed);
  updateEnemies();
}

function clearBackground() {
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawStartScreen() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "45px Comic Sans MS";
  ctx.textAlign = "center";
  ctx.fillStyle = "pink";
  ctx.fillText("Click to Start", canvas.width / 2, canvas.height / 2 + 40);
  canvas.addEventListener("click", restartGame);
}

function drawDeathScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "30px Comic Sans MS";
  ctx.textAlign = "center";
  ctx.fillStyle = "pink";
  ctx.fillText("The Cats got You!", canvas.width / 2, canvas.height / 2);
  ctx.font = "20px";
  ctx.fillText("click to restart", canvas.width / 2, canvas.height / 2 + 40);
  canvas.addEventListener("click", restartGame);
  clearInterval();
}

function restartGame() {
  canvas.removeEventListener("click", restartGame);
  points = 0;
  document.getElementById("score").innerHTML = points;
  healthBar.value = 100;
  Object.assign(player, { x: canvas.width / 2, y: canvas.height / 2 });
  enemies = [
    new Enemy(200, 10, 0.02),
    new Enemy(0, 325, 0.03),
    new Enemy(400, 325, 0.04)
  ];
  requestAnimationFrame(drawScene);
}

function drawScene() {
  clearBackground();
  player.draw();
  enemies.forEach(enemy => enemy.draw());
  updateScene();
  if (healthBar.value <= 0) {
    drawDeathScreen();
  } else {
    requestAnimationFrame(drawScene);
  }
}

setInterval(increaseScore, 1000);
drawStartScreen();
