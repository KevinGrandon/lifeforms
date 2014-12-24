var distance = require('./util/distance');
var random = require('./util/random');
var uuid = require('node-uuid');

var particleTypes = [
	require('./particle/organic_base'),
	require('./particle/organic_eater'),
	require('./particle/hungry_guy')
];

// List of all particles.
var particles = [];

// X/Y nested lookup map of particles to find within a certain position.
var particleMap = {};

function Engine(config, io) {
	this.config = config;
	this.io = io;
}

Engine.prototype = {

	/**
	 * Registers the particles position within the XY map for faster lookup sppeds.
	 * @param {Particle} particle The particle we are registering (e.g., during creation or a move.)
	 */
	registerPosition: function(particle, unregister) {
		var newX = particle.position[0];
		var newY = particle.position[1];
		particleMap[newX] = particleMap[newX] || {};
		particleMap[newX][newY] = particleMap[newX][newY] || [];
		particleMap[newX][newY].push(particle);
	},

	/**
	 * Un-registers the particles position within the XY map.
	 * @param {String} id The id of the particle.
	 * @param {Position} pos The position of the particle of where we think it's registered in.
	 */
	unregisterPosition: function(id, pos) {
		var unregisterFrom = particleMap[pos[0]][pos[1]];
		for (var i = 0, iLen = unregisterFrom.length; i < iLen; i++) {
			if (id === unregisterFrom[i].id) {
				particleMap[pos[0]][pos[1]].splice(i, 1);
				return;
			}
		}
		console.warn('Could not find particle id!', id, pos);
	},

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
			position: particle.position,
			color: particle.color,
			size: particle.size
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

		// Removes the particle in the game loop.
		particle.LOOP_HOOK_REMOVED = true;
	},

	/**
	 * Spawns a new particle near a location.
	 * @param {Object} particle
	 * @param {Object} BaseClass Of the new particle to spawn.
	 */
	spawnNear: function(particle, BaseClass) {
		var spawnDistance = particle.size * 5;
		var newParticlePosition = [
			particle.position[0] + random(0 - spawnDistance, spawnDistance),
			particle.position[1] + random(0 - spawnDistance, spawnDistance)
		];
		this.createParticle(BaseClass, particle.originalConfig, newParticlePosition);
	},

	/**
	 * Finds the closest requested particle to another particle.
	 * Uses the particle.eyesight for distance, searches all blocks within that
	 * distance and returns a randomly selected particle of the requested type.
	 * @param {Object} particle
	 * @param {String} lookFor Name of the new particle to look for.
	 */
	findClosestWithinSensors: function(particle, lookFor) {
		var allParticlesWithTypeInRange = [];
		var closestDistance = null;
		var target = null;

		var minX = particle.position[0] - particle.eyesight;
		var minY = particle.position[1] - particle.eyesight;
		var maxX = particle.position[0] + particle.eyesight;
		var maxY = particle.position[1] + particle.eyesight;

		for (var x = minX; x < maxX; x++) {
			for (var y = minY; y < maxY; y++) {
				var foundParticles = this.getAtLocation([x, y], lookFor);
				allParticlesWithTypeInRange = allParticlesWithTypeInRange.concat(foundParticles);
			}
		}

		if (!allParticlesWithTypeInRange.length) {
			return null;
		}

		for (var i = 0, iLen = allParticlesWithTypeInRange.length; i < iLen; i++) {
			var eachParticle = allParticlesWithTypeInRange[i];
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
	 * Gets all particles at a location.
	 * @param {Object} particle
	 * @param {String} filterType The type of particle to filter by.
	 */
	getAtLocation: function(pos, filterType) {
		var atLocation = [];
		if (!particleMap[pos[0]] || !particleMap[pos[0]][pos[1]]) {
			return [];
		}

		var searchParticles = particleMap[pos[0]][pos[1]];

		for (var i = 0, iLen = searchParticles.length; i < iLen; i++) {
			var particle = searchParticles[i];
			if (pos[0] === particle.position[0] &&
				pos[1] === particle.position[1] &&
				particle.name === filterType) {
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
		var atCurrentLocation = this.getAtLocation(particle.position, targetType);
		for (var i = 0, iLen = atCurrentLocation.length; i < iLen; i++) {
			var eachParticle = atCurrentLocation[i];
			var fuelGained = eachParticle.fuelValueWhenConsumed;
			this.removeParticle(eachParticle);
			return fuelGained;
		}

		return 0;
	},

	createParticle: function(ParticleClass, config, position) {
		config.id = uuid.v4();
		config.position = position;

		// Initial fuel to level. For now we just pick a random number between 0 and the amount needed.
		// This is so that all particles don't replicate at the same time initially, feels more natural if they don't.
		config.currentFuel = random(0, config.requiredFuelToSpawn);

		var newParticle = new ParticleClass(this, config);

		this.registerPosition(newParticle);
		particles.push(newParticle);
	},

	init: function() {
		// Populate initial particles.
		for (var idx = 0; idx < this.config.initialParticles.length; idx++) {
			var particleDef = this.config.initialParticles[idx];
			var count = particleDef.count;

			for (var j = 0; j < count; j++) {
				var position = [
					random(0, this.config.worldSize),
					random(0, this.config.worldSize)
				];
				this.createParticle(particleTypes[idx], particleDef, position);
			}
		}

		// Loop
		var self = this;
		setInterval(function() {
			for (var i = particles.length - 1; i >= 0; i--) {
				var particle = particles[i];
				if (particle.LOOP_HOOK_REMOVED) {
					self.unregisterPosition(particle.id, particle.position);
					particles.splice(i, 1);
					continue;
				}

				if (particle) {
					particle.tick();
				}
			}
		}, this.config.tickDelay);
	}
};

module.exports = Engine;
