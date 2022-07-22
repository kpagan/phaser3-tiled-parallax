import Phaser from 'phaser'

import Game from './scenes/Game'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 450,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200},
			debug: true
		}
	},
	scene: [Game],
	scale: {
		mode: Phaser.Scale.ScaleModes.NONE
	}
}

export default new Phaser.Game(config)
