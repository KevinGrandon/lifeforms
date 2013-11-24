var Particle = require('./particle').Particle

function Water() {
	Particle.apply(this, arguments)
}

Water.prototype = {

	__proto__: Particle.prototype,

	color: 'blueBG',

	/**
	 * Called on every tick
	 */
	tick: function() {
		Particle.prototype.tick.apply(this, arguments)
	}
}

exports.Water = Water
