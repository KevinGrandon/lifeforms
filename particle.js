var express = require('express');
var app = express();
var debug = require('debug')('particle')
var uuid = require('node-uuid');

var config = require('./config');
var distance = require('./util/distance');
var random = require('./util/random');

var particleTypes = {};
particleTypes.OrganicBase = require('./particle/organic_base');
particleTypes.OrganicEater = require('./particle/organic_eater');

var particles = [];

var worldObject = {

	/**
	 * A list of updates in the order they happen.
	 * An update is an object with the type, location, and action of what happened.
	 */
	updates: [],

	/**
	 * Adds an update to worldObject.updates.
	 */
	update: function(particle, action) {
		this.updates.push({
			name: particle.name,
			id: particle.id,
			time: Date.now(),
			action: action,
			position: particle.position
		});
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
			worldObject,
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
	}
};

// Populate initial particles.
for (var i in config.initialParticles) {
	var count = config.initialParticles[i];

	for (var j = 0; j < count; j++) {
		var position = [
			random(0, config.worldSize),
			random(0, config.worldSize)
		];
		var newParticle = new particleTypes[i](
			worldObject,
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
}, config.tickDelay);

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index.html');
});

app.get('/particles/since/:lastFetched', function(req, res) {
	var particleData = {
		lastFetched: null,
		updates: []
	};

	// Limit to requests at any one time.
	var fetchFrom = parseInt(req.params.lastFetched, 10);
	var limit = fetchFrom + 20000;

	// Export data for the view.
	for (var i = fetchFrom, iLen = worldObject.updates.length; i < iLen; i++) {
		var update = worldObject.updates[i];
		particleData.updates.push(update);
		particleData.lastFetched = i;

		if (i >= limit) {
			break;
		}
	}

	debug('updates found', particleData.updates.length);
	particleData = JSON.stringify(particleData);
    res.send(particleData);
});

app.use(express.static(__dirname + '/public'));

// Web server
var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)

})
