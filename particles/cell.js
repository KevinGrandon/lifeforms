var Particle = require('./particle').Particle
var utils = require('../lib/utils')

function Cell(x, y) {

	this.action = 'roam'

	this.energy = {
		// By default cells start with 0 energy. They are hungry
		current: 0,

		// How much energy a cell needs to grow
		growth: 10,

		// Sources of cell energy
		sources: {

			// Water provides us with a little bit of energy
			Water: 1,

			// Cells are mainly carnivores I suppose
			Cell: 10
		}
	}

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
		this.determineAction()
		this[this.action]()
		Particle.prototype.tick.apply(this, arguments)
	},

	/**
	 * Determines what a cell should do next
	 */
	determineAction: function() {
		// Get the cell under this one, if we get energy from it, eat it!
		if (this.onEdibleCell()) {
			this.action = 'eat'
		} else {
			this.action = 'roam'
		}
	},

	onEdibleCell: function() {
		var onCell = this.getOffsetParticle('z', -1)

		for (var i in this.energy.sources) {
			var referenceCellClass = require(__dirname + '/' + i)[i]
			if (onCell instanceof referenceCellClass) {
				return true
			}

		}
		return false
	},

	/**
	 * Trys to eat, increasing energy
	 */
	eat: function() {

	},

	/**
	 * Roams, hopefully in the direction of something useful
	 */
	roam: function() {
		// For now randomly move in x and y coordinate space
		var newX = this.location[0] + utils.random(-1, 1)
		var newY = this.location[1] + utils.random(-1, 1)
		if (newX >= 0 && newX < global.config.world.width) {
			this.location[0] = newX
		}
		if (newY >= 0 && newY < global.config.world.height) {
			this.location[1] = newY
		}
	}
}

exports.Cell = Cell
