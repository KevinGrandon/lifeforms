var distance = require('./util/distance');
var random = require('./util/random');
var uuid = require('node-uuid');

var particleTypes = {};
particleTypes.OrganicBase = require('./particle/organic_base');
particleTypes.OrganicEater = require('./particle/organic_eater');

var particles = [];

function Engine(config, io) {
	this.config = config;
	this.io = io;
}

Engine.prototype = {

	/**
	 * A list of updates in the order they happen.
	 * An update is an object with the type, location, and action of what happened.
	 */
	updates: [],

	/**
	 * Broadcasts an update to the client.
	 */
	update: function(particle, action) {
		this.io.emit('update', this.formatParticleForUI(particle, action));
	},

	/**
	 * Formats a particle and action for transmission over the websocket.
	 */
	formatParticleForUI: function(particle, action) {
		return {
			name: particle.name,
			id: particle.id,
			time: Date.now(),
			action: action,
			position: particle.position
		};
	},

	/**
	 * Creates particles for the initial browser load from the current state.
	 */
	getParticleViewData: function() {
		var particleData = [];

		// Export data for the view.
		for (var i = 0, iLen = particles.length; i < iLen; i++) {
			var item = this.formatParticleForUI(particles[i], 'created');
			particleData.push(item);
		}
		return particleData;
	},

	/**
	 * Removes the particle from our tracked particles.
	 */
	removeParticle: function(particle) {
		this.update(particle, 'removed');

		for (var i = 0, iLen = particles.length; i < iLen; i++) {
			var eachParticle = particles[i];
			if (eachParticle.id === particle.id) {
				particles.splice(i, 1);
				return;
			}
		}
	},

	/**
	 * Spawns a new particle near a location.
	 * @param {Object} particle
	 * @param {Object} BaseClass Of the new particle to spawn.
	 */
	spawnNear: function(particle, BaseClass) {
		var newParticlePosition = [
			particle.position[0] + random(0 - particle.maxOffshootSpawnDistance, particle.maxOffshootSpawnDistance),
			particle.position[1] + random(0 - particle.maxOffshootSpawnDistance, particle.maxOffshootSpawnDistance)
		];
		var newParticle = new BaseClass(
			this,
			{
				id: uuid.v4(),
				position: newParticlePosition
			});
		//debug('spawning', newParticle.name, newParticlePosition);
		particles.push(newParticle);
	},

	/**
	 * Finds the closest requested particle to another particle.
	 * @param {Object} particle
	 * @param {String} lookFor Name of the new particle to look for.
	 */
	findClosest: function(particle, lookFor) {
		var closestDistance = null;
		var target = null;

		for (var i = 0, iLen = particles.length; i < iLen; i++) {
			var eachParticle = particles[i];

			if (eachParticle.name !== lookFor) { continue; }

			var theDistance = distance(eachParticle.position, particle.position);
			if (!closestDistance || theDistance < closestDistance) {
				closestDistance = theDistance;
				target = eachParticle;
			}

			// Bail if we're within acceptable bounds.
			if (target && theDistance < 5) {
				break;
			}
		}
		return target;
	},

	/**
	 * Finds all particles at a location.
	 * @param {Object} particle
	 */
	findAllAtLocation: function(position) {
		var atLocation = [];
		for (var i = 0, iLen = particles.length; i < iLen; i++) {
			var particle = particles[i];
			if (position[0] === particle.position[0] && position[1] === particle.position[1]) {
				atLocation.push(particle);
			}
		}
		return atLocation;
	},

	/**
	 * Tries to consume the type of particle at the current location.
	 * @param {Object} particle
	 * @param {String} targetType The type of particle to consume.
	 * @return {Integer} The amount of fuel gained by consuming this particle.
	 */
	tryToEatAtCurrentLocation: function(particle, targetType) {
		// Find the particle at the current location with the targetType we want. 
		var atCurrentLocation = this.findAllAtLocation(particle.position);
		for (var i = 0, iLen = atCurrentLocation.length; i < iLen; i++) {
			var eachParticle = atCurrentLocation[i];
			if (eachParticle.name === targetType) {
				var fuelGained = eachParticle.fuelValueWhenConsumed;
				this.removeParticle(eachParticle);
				return fuelGained;
			}
		}

		return 0;
	},

	init: function() {
		// Populate initial particles.
		for (var i in this.config.initialParticles) {
			var count = this.config.initialParticles[i];

			for (var j = 0; j < count; j++) {
				var position = [
					random(0, this.config.worldSize),
					random(0, this.config.worldSize)
				];
				var newParticle = new particleTypes[i](
					this,
					{
						id: uuid.v4(),
						position: position
					});
				particles.push(newParticle);
			}
		}

		// Loop
		setInterval(function() {
			for (var i = 0, iLen = particles.length; i < iLen; i++) {
				var particle = particles[i];
				if (particle) {
					particle.tick();
				}
			}
		}, this.config.tickDelay);
	}
};

module.exports = Engine;
