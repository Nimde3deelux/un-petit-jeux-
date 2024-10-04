const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dimensions du canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables de jeu
const gravity = 0.5;
let platforms = [];
let enemies = [];
let keys = {};

// Classe pour les plateformes
class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Classe pour le joueur
class Player {
    constructor() {
        this.x = 50;
        this.y = canvas.height - 150;
        this.width = 50;
        this.height = 50;
        this.speed = 5;
        this.dy = 0;
        this.jumpHeight = 10;
        this.onGround = false;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        if (keys.ArrowRight) this.x += this.speed;
        if (keys.ArrowLeft) this.x -= this.speed;

        this.y += this.dy;
        if (!this.onGround) this.dy += gravity;

        // Collisions avec plateformes
        this.onGround = false;
        platforms.forEach(platform => {
            if (this.x < platform.x + platform.width &&
                this.x + this.width > platform.x &&
                this.y < platform.y + platform.height &&
                this.y + this.height > platform.y) {
                this.dy = 0;
                this.y = platform.y - this.height;
                this.onGround = true;
            }
        });

        this.draw();
    }

    jump() {
        if (this.onGround) {
            this.dy = -this.jumpHeight;
        }
    }
}

// Classe pour les ennemis
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = 2;
        this.dy = 0;
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(player) {
        // Suivre le joueur
        if (player.x > this.x) {
            this.x += this.speed;
        } else {
            this.x -= this.speed;
        }

        // Gravité et plateformes
        this.y += this.dy;
        this.dy += gravity;

        platforms.forEach(platform => {
            if (this.x < platform.x + platform.width &&
                this.x + this.width > platform.x &&
                this.y < platform.y + platform.height &&
                this.y + this.height > platform.y) {
                this.dy = 0;
                this.y = platform.y - this.height;
            }
        });

        this.draw();
    }
}

// Initialisation du joueur
let player = new Player();

// Création des plateformes et des ennemis
function init() {
    platforms = [
        new Platform(100, canvas.height - 100, 300, 20),
        new Platform(500, canvas.height - 200, 300, 20),
        new Platform(900, canvas.height - 150, 300, 20)
    ];

    enemies = [
        new Enemy(600, canvas.height - 200),
        new Enemy(1000, canvas.height - 150)
    ];
}

// Boucle de jeu
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update();

    platforms.forEach(platform => platform.draw());
    enemies.forEach(enemy => enemy.update(player));

    requestAnimationFrame(gameLoop);
}

// Gestion des touches
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space') {
        player.jump();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Initialisation du jeu
init();
gameLoop();
