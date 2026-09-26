const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

const paddleWidth = 10;
const paddleHeight = 100;

var score = 0

const player = {
    x: 20,
    y: canvas.height / 2 - paddleHeight / 2,
    speed: 6
}

const bot = {
    x: canvas.width - 30,
    y: canvas.height / 2 - paddleHeight / 2,
    speed: 4
}

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speedX: 5 + Math.floor(score / 5),
    speedY: 3 + Math.floor(score / 5)
}

const keys = {
    up: false,
    down: false
};

document.addEventListener("keydown", (e) => {
    if(e.key === "ArrowUp" || e.key === "z") keys.up = true;
    if(e.key === "ArrowDown" || e.key === "s") keys.down = true;
});

document.addEventListener("keyup", (e) => {
    if(e.key === "ArrowUp" || e.key === "z") keys.up = false;
    if(e.key === "ArrowDown" || e.key === "s") keys.down = false;
});

function update() {

    if(keys.up) player.y -= player.speed
    if(keys.down) player.y += player.speed

    player.y = Math.max(0, Math.min(canvas.height - paddleHeight, player.y))

    const botCenter = bot.y + paddleHeight / 2

    if (botCenter < ball.y) bot.y += bot.speed
    if (botCenter > ball.y) bot.y -= bot.speed

    ball.x += ball.speedX
    ball.y += ball.speedY

    if(ball.y <= 0 || ball.y >= canvas.height) {
        ball.speedY *= -1;

        const bounceWallSound = new Audio("../public/sounds/bounce_wall.wav")
        bounceWallSound.currentTime = 0
        bounceWallSound.play()
    }

    if(ball.x <= player.x + paddleWidth && ball.y > player.y && ball.y < player.y + paddleHeight) {
        ball.speedX *= -1;
        score += 1

        document.getElementById("score").textContent = score

        const hitSound = new Audio("../public/sounds/hit.wav")
        hitSound.currentTime = 0
        hitSound.play()
    }

    if(ball.x >= bot.x && ball.y > bot.y && ball.y < bot.y + paddleHeight) {
        ball.speedX *= -1;

        const hitSound = new Audio("../public/sounds/hit.wav")
        hitSound.currentTime = 0
        hitSound.play()
    }

    if(ball.x < 0 || ball.x > canvas.width) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.speedX *= -1;

        score = 0
        document.getElementById("score").textContent = score

        const explosionSound = new Audio("../public/sounds/explosion.wav")
        explosionSound.currentTime = 0
        explosionSound.play()
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";

    // Player
    ctx.fillRect(player.x, player.y, paddleWidth, paddleHeight);

    // Bot
    ctx.fillRect(bot.x, bot.y, paddleWidth, paddleHeight);

    // Ball
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

function gameLoop() {
    update();

    draw();

    requestAnimationFrame(gameLoop);
}

// setInterval(() => {
//         const moveSound = new Audio("../public/sounds/moving.wav")
//         moveSound.currentTime = 0
//         moveSound.volume = .5
//         moveSound.play()
// }, 500)

gameLoop();