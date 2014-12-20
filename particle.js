var express = require('express');
var app = express();
var debug = require('debug')('particle')
var uuid = require('node-uuid');

var config = require('./config');
var random = require('./util/random');

var particleTypes = {};
particleTypes.OrganicBase = require('./particle/organic_base');

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
	 * Spawns a new particle near a location.
	 * @param {Object} particle
	 * @param {Object} BaseClass Of the new particle to spawn.
	 */
	spawnNear: function(particle, BaseClass) {
		var newParticlePosition = [
			particle.position[0] + random(0 - particle.maxOffshootSpawnDistance, particle.maxOffshootSpawnDistance),
			particle.position[1] + random(0 - particle.maxOffshootSpawnDistance, particle.maxOffshootSpawnDistance)
		];
		var newParticle = new particleTypes[i](
			worldObject,
			{
				id: uuid.v4(),
				position: newParticlePosition
			});
		//debug('spawning', newParticle.name, newParticlePosition);
		particles.push(newParticle);
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
		particle.tick();
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

	// Export data for the view.
	for (var i = req.params.lastFetched, iLen = worldObject.updates.length; i < iLen; i++) {
		var update = worldObject.updates[i];
		particleData.updates.push(update);
		particleData.lastFetched = i;
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
