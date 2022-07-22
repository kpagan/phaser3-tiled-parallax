import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene {
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

	private backgrounds: { ratioX: number, sprite: Phaser.GameObjects.TileSprite }[] = [];

	private player!: Phaser.Physics.Arcade.Sprite;

	private speed = 300;
	touchingDown: boolean = false;

	constructor() {
		super('game');
	}

	init() {
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	preload() {
		this.load.image('sky', 'assets/bg/Sky.png');
		this.load.image('mountains', 'assets/bg/Mountains.png');
		this.load.image('middle', 'assets/bg/Middle.png');
		this.load.image('foreground', 'assets/bg/Foreground.png');
		this.load.image('ground1', 'assets/bg/Ground_01.png');
		this.load.image('ground2', 'assets/bg/Ground_02.png');

		this.load.image('snowman', 'assets/Snowman.png');

		// add the snow particle
		this.load.image('snow-particle', 'assets/particles/snow.png');

		// load tiled assets
		this.load.image("tiles", "assets/snowTiles.png");
		this.load.tilemapTiledJSON("map", "assets/snow.json");
	}

	create() {
		const { width, height } = this.scale;

		this.add.image(0, 0, 'sky')
			.setOrigin(0, 0)
			.setScrollFactor(0);

		// this.add.image(0, 0, 'mountains').setOrigin(0, 0)
		this.backgrounds.push({
			ratioX: 0.01,
			sprite: this.add.tileSprite(0, 0, width, height, 'mountains')
				.setOrigin(0, 0)
				.setScrollFactor(0, 0)
		});


		// this.add.image(0, 0, 'middle').setOrigin(0, 0)
		this.backgrounds.push({
			ratioX: 0.1,
			sprite: this.add.tileSprite(0, 0, width, height, 'middle')
				.setOrigin(0, 0)
				.setScrollFactor(0, 0)
		});

		// this.add.image(0, 0, 'foreground').setOrigin(0, 0)
		this.backgrounds.push({
			ratioX: 0.3,
			sprite: this.add.tileSprite(0, 0, width, height, 'foreground')
				.setOrigin(0, 0)
				.setScrollFactor(0, 0)
		});

		// this.add.image(0, 0, 'ground1').setOrigin(0, 0)
		this.backgrounds.push({
			ratioX: 0.7,
			sprite: this.add.tileSprite(0, 0, width, height, 'ground1')
				.setOrigin(0, 0)
				.setScrollFactor(0, 0)
		});

		// this.add.image(0, 0, 'ground2').setOrigin(0, 0)
		this.backgrounds.push({
			ratioX: 1,
			sprite: this.add.tileSprite(0, 0, width, height, 'ground2')
				.setOrigin(0, 0)
				.setScrollFactor(0, 0)
		});

		this.player = this.physics.add.sprite(width * 0.5, height * 0.5, 'snowman')
			.setOrigin(0.5, 1)
			.setScale(2);

		this.cameras.main.startFollow(this.player);
		this.cameras.main.setFollowOffset(0, 145);

		const particles = this.add.particles('snow-particle');
		particles.createEmitter({
			x: 0,
			y: 0,
			// emitZone
			emitZone: {
				source: new Phaser.Geom.Rectangle(-width * 3, 0, width * 7, 100),
				type: 'random',
				quantity: 70
			},
			speedY: { min: 50, max: 70 },
			speedX: { min: -20, max: 20 },
			accelerationY: { random: [10, 15] },
			// lifespan
			lifespan: { min: 8000, max: 10000 },
			scale: { random: [0.25, 0.75] },
			alpha: { random: [0.1, 0.8] },
			gravityY: 10,
			frequency: 10,
			blendMode: 'ADD',
			// follow the player at an offset
			follow: this.player,
			followOffset: { x: -width * 0.5, y: -height - 100 }
		});


		const map = this.make.tilemap({ key: 'map' });
		const tileset = map.addTilesetImage('snowTiles', 'tiles');

		const tileLayer = map.createLayer('Tile Layer 1', tileset, 0, -128);

		tileLayer.setCollisionByProperty({ collision: true });
		this.physics.add.collider(this.player, tileLayer, this.handleLayerCollision);

		const debugGraphics = this.add.graphics().setAlpha(0.75);
		tileLayer.renderDebug(debugGraphics, {
			tileColor: null, // Color of non-colliding tiles
			collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
			faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
		});
	}


	handleLayerCollision = (object1: Phaser.Types.Physics.Arcade.GameObjectWithBody, object2: Phaser.Types.Physics.Arcade.GameObjectWithBody) => {
		this.touchingDown = true;
	}

	update() {
		if (this.cursors.left.isDown) {
			this.player.setVelocityX(-this.speed);
		}
		else if (this.cursors.right.isDown) {
			this.player.setVelocityX(this.speed);
		}
		else {
			this.player.setVelocityX(0);
		}

		let upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
        if (upJustPressed && this.touchingDown) {
            this.player.setVelocityY(-150);
			this.touchingDown = false;
        }

		for (let i = 0; i < this.backgrounds.length; ++i) {
			const bg = this.backgrounds[i];

			bg.sprite.tilePositionX = this.cameras.main.scrollX * bg.ratioX;
		}
	}
}
