var Particle = require('./particle').Particle

function Substrate() {
	Particle.apply(this, arguments)
}

Substrate.prototype = {

	__proto__: Particle.prototype,

	color: 'greenBG',

	/**
	 * Called on every tick
	 */
	tick: function() {
		Particle.prototype.tick.apply(this, arguments)
	}	
}

exports.Substrate = Substrate
