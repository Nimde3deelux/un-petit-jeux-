// Game Configuration (phaser setup)
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var zombies;
var cursors;
var bullets;
var soundShoot;
var soundHit;

var game = new Phaser.Game(config);

// Charger les ressources
function preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('zombie', 'assets/zombie.png');
    this.load.image('bullet', 'assets/shot.png');
    this.load.audio('shoot', 'assets/sound_effects/shoot.wav');
    this.load.audio('hitZombie', 'assets/sound_effects/hit_zombie.wav');
}

// Créer les objets et initialiser le jeu
function create() {
    // Création du joueur
    player = this.physics.add.image(100, 450, 'player').setScale(0.5);
    player.setCollideWorldBounds(true);

    // Création des zombies
    zombies = this.physics.add.group({
        key: 'zombie',
        repeat: 5,
        setXY: { x: 400, y: 0, stepX: 150 }
    });
    zombies.children.iterate(function(zombie) {
        zombie.setBounce(1);
        zombie.setCollideWorldBounds(true);
        zombie.setVelocity(Phaser.Math.Between(-200, 200), 20);
    });

    // Groupes de balles
    bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 10
    });

    // Sons
    soundShoot = this.sound.add('shoot');
    soundHit = this.sound.add('hitZombie');

    // Cursors pour le déplacement
    cursors = this.input.keyboard.createCursorKeys();

    // Menu principal
    var text = this.add.text(300, 200, 'Appuyez sur "Entrée" pour commencer', { font: '32px Arial', fill: '#fff' });
    this.input.keyboard.on('keydown-ENTER', startGame, this);
}

// Démarrer le jeu
function startGame() {
    // Commence le jeu une fois "Entrée" pressée
    this.scene.start('gameScene');
}

// Gestion du gameplay
function update() {
    // Déplacement du joueur
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }

    // Tirer
    if (cursors.space.isDown) {
        shootBullet();
    }
}

// Créer les balles
function shootBullet() {
    var bullet = bullets.get(player.x + 50, player.y);
    if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.setVelocityX(400);
        soundShoot.play();
    }
}

// Collision entre les balles et les zombies
function hitZombie(bullet, zombie) {
    bullet.setActive(false);
    bullet.setVisible(false);
    zombie.setTint(0xff0000);
    zombie.setVelocity(0);
    soundHit.play();
    setTimeout(() => {
        zombie.clearTint();
        zombie.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }, 500);
}

// Ajouter les collisions
this.physics.add.collider(bullets, zombies, hitZombie, null, this);
