function Particle(x, y, z) {
	z = z || 0
	this.location = [x, y, z]
	this.health = 100
}

Particle.prototype = {

	/**
	 * Gets a single particle in an offset direction
	 * @param {String} offset axis. One of x|y|z
	 * @param {Integer} amount of offset. -1 or 1
	 */
	getOffsetParticle: function(axis, amount) {

	},

	/**
	 * Called on every tick
	 */
	tick: function() {
	},

	/**
	 * Renders the particle to the screen
	 */
	draw: function() {
		var colors = require('colors');
				
		process.stdout.write('  '[this.color])
	}
}

exports.Particle = Particle
