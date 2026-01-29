// auto update final test

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const timeEl = document.getElementById("time");
const speedEl = document.getElementById("speed");

canvas.width = 400;
canvas.height = 600;

/* GAME STATE */
let gameState = "running";

/* PLAYER */
let car = {
    x: 180,
    y: 500,
    width: 40,
    height: 80,
    velocity: 0,
    maxSpeed: 7,
    accel: 0.4,
    friction: 0.12
};

/* ENEMIES */
let enemies = [];
let enemySpeed = 3;

/* ROAD */
let roadY = 0;
let keys = {};
let time = 0;

/* INPUT */
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

/* BUTTON ACTIONS */
function pauseGame() {
    if (gameState === "running") gameState = "paused";
}

function resumeGame() {
    if (gameState === "paused") {
        gameState = "running";
        requestAnimationFrame(gameLoop);
    }
}

function restartGame() {
    enemies = [];
    time = 0;
    enemySpeed = 3;
    car.x = 180;
    car.velocity = 0;
    roadY = 0;
    gameState = "running";
    timeEl.textContent = 0;
    speedEl.textContent = 0;
    requestAnimationFrame(gameLoop);
}

function exitGame() {
    gameState = "exit";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "26px Arial";
    ctx.fillText("GAME EXITED", 95, 300);
}

/* ENEMY SPAWN */
function spawnEnemy() {
    let x = Math.random() * 240 + 80;
    enemies.push({ x, y: -100, width: 40, height: 80 });
}

/* MOVE PLAYER */
function moveCar() {
    if (keys["ArrowLeft"]) car.velocity -= car.accel;
    if (keys["ArrowRight"]) car.velocity += car.accel;

    car.velocity *= (1 - car.friction);
    car.velocity = Math.max(Math.min(car.velocity, car.maxSpeed), -car.maxSpeed);

    car.x += car.velocity;
    car.x = Math.max(60, Math.min(300, car.x));

    speedEl.textContent = Math.abs(Math.round(car.velocity * 10));
}

/* DRAW ROAD */
function drawRoad() {
    ctx.fillStyle = "#555";
    ctx.fillRect(50, 0, 300, canvas.height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(200, roadY);
    ctx.lineTo(200, canvas.height);
    ctx.stroke();

    roadY += enemySpeed;
    if (roadY > 40) roadY = 0;
}

/* DRAW PLAYER */
function drawCar() {
    ctx.fillStyle = "red";
    ctx.fillRect(car.x, car.y, car.width, car.height);

    ctx.fillStyle = "#aa0000";
    ctx.fillRect(car.x + 5, car.y + 15, car.width - 10, 30);

    ctx.fillStyle = "#cceeff";
    ctx.fillRect(car.x + 8, car.y + 20, car.width - 16, 20);
}

/* DRAW ENEMIES */
function drawEnemies() {
    enemies.forEach(e => {
        e.y += enemySpeed;
        ctx.fillStyle = "yellow";
        ctx.fillRect(e.x, e.y, e.width, e.height);
    });
    enemies = enemies.filter(e => e.y < canvas.height + 100);
}

/* COLLISION */
function checkCollision() {
    enemies.forEach(e => {
        if (
            car.x < e.x + e.width &&
            car.x + car.width > e.x &&
            car.y < e.y + e.height &&
            car.y + car.height > e.y
        ) {
            gameState = "gameOver";
        }
    });
}

/* GAME LOOP */
function gameLoop() {
    if (gameState !== "running") return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRoad();
    moveCar();
    drawCar();
    drawEnemies();
    checkCollision();

    if (gameState === "gameOver") {
        ctx.fillStyle = "white";
        ctx.font = "28px Arial";
        ctx.fillText("GAME OVER", 110, 300);
        return;
    }

    requestAnimationFrame(gameLoop);
}

/* TIMER */
setInterval(() => {
    if (gameState === "running") {
        time++;
        timeEl.textContent = time;
        if (time % 3 === 0) spawnEnemy();
        if (time % 10 === 0) enemySpeed++;
    }
}, 1000);

/* AUTO START */
window.onload = () => {
    gameState = "running";
    requestAnimationFrame(gameLoop);
};

