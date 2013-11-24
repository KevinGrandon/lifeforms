function Particle(x, y, z) {
	z = z || 0
	this.location = [x, y, z]
}

Particle.prototype = {

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
