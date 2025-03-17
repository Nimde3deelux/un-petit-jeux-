class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        this.load.image('background', 'assets/background.png');
    }

    create() {
        this.add.image(400, 300, 'background');

        this.add.text(220, 250, 'Appuyez sur "Entrée" pour commencer', {
            font: '24px Arial',
            fill: '#ffffff'
        });

        this.input.keyboard.on('keydown-Enter', () => {
            this.scene.start('GameScene');
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('zombie', 'assets/zombie.png');
        this.load.image('bullet', 'assets/shot.png');
        this.load.image('background', 'assets/background.png');
        this.load.audio('shoot', 'assets/sound_effects/shoot.wav');
        this.load.audio('hitZombie', 'assets/sound_effects/hit_zombie.wav');
    }

    create() {
        this.add.image(400, 300, 'background');

        this.player = this.physics.add.image(100, 450, 'player').setScale(0.5);
        this.player.setCollideWorldBounds(true);

        this.zombies = this.physics.add.group({
            key: 'zombie',
            repeat: 5,
            setXY: { x: 400, y: 0, stepX: 150 }
        });

        this.zombies.children.iterate((zombie) => {
            zombie.setBounce(1);
            zombie.setCollideWorldBounds(true);
            zombie.setVelocity(Phaser.Math.Between(-200, 200), 20);
        });

        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 10
        });

        this.soundShoot = this.sound.add('shoot');
        this.soundHit = this.sound.add('hitZombie');

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.physics.add.collider(this.bullets, this.zombies, this.hitZombie, null, this);
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.player.body.blocked.down) {
            this.player.setVelocityY(-330);
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
            this.shootBullet();
        }
    }

    shootBullet() {
        if (!this.bullets) return;

        let bullet = this.bullets.get(this.player.x + 50, this.player.y, 'bullet');
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setVelocityX(400);
            this.soundShoot.play();
        }
    }

    hitZombie(bullet, zombie) {
        if (!bullet || !zombie) return;

        bullet.destroy();
        zombie.setTint(0xff0000);
        zombie.setVelocity(0);
        this.soundHit.play();

        this.time.delayedCall(500, () => {
            zombie.clearTint();
            zombie.setVelocity(Phaser.Math.Between(-200, 200), 20);
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: [MainMenu, GameScene]
};

const game = new Phaser.Game(config);
