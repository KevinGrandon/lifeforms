var Particle = require('./particle').Particle
var utils = require('../lib/utils')

function Cell(x, y) {
	var cellZLevel = 1
	Particle.call(this, x, y, cellZLevel)
}

Cell.prototype = {

	__proto__: Particle.prototype,

	color: 'redBG',

	/**
	 * Called on every tick
	 */
	tick: function() {

		// For now randomly move in x and y coordinate space
		var newX = this.location[0] + utils.random(-1, 1)
		var newY = this.location[1] + utils.random(-1, 1)
		if (newX >= 0 && newX <= global.config.worldWidth) {
			this.location[0] = newX
		}
		if (newY >= 0 && newY <= global.config.worldHeight) {
			this.location[1] = newY
		}

		Particle.prototype.tick.apply(this, arguments)
	}
}

exports.Cell = Cell
