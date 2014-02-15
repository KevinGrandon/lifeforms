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
	},

	/**
	 * Returns the partle at a location
	 * @param {Array} x, y, z coordinates
	 */
	particleAtLocation: function(coords) {
		for (var i = 0, iLen = this._particles.length; i < iLen; i++ ) {
			if (coords[0] === this._particles[i].location[0]
				&& coords[1] === this._particles[i].location[1]
				&& coords[2] === this._particles[i].location[2]) {
				return this._particles[i]
			}
		}
		return false
	}
}

exports.particleManager = new ParticleManager()