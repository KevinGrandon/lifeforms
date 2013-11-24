var utils = require('./utils')

function ParticleManager() {
	this._particles = []
}

ParticleManager.prototype = {

	/**
	 * Adds a particle
	 */
	add: function(newParticle) {
		this._particles.push(newParticle)
	},

	/**
	 * Iterates over each particle
	 */
	each: function(cb) {
		this._particles.forEach(cb)
		return this
	},

	sortByPosition: function() {
		this._particles = utils.sortByPosition(this._particles)
		return this
	}
}

exports.particleManager = new ParticleManager()