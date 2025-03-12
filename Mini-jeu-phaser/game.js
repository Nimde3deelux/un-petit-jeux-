// Configuration de base de Phaser
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Création du jeu
const game = new Phaser.Game(config);

let player;

function preload() {
    // Charger les ressources nécessaires
    this.load.image('player', 'assets/player.png');
}

function create() {
    // Créer un joueur au centre
    player = this.physics.add.image(400, 300, 'player');
}

function update() {
    // Déplacer le joueur avec les flèches
    if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.LEFT)) {
        player.x -= 5;
    }
    if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.RIGHT)) {
        player.x += 5;
    }
    if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.UP)) {
        player.y -= 5;
    }
    if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.DOWN)) {
        player.y += 5;
    }
}
