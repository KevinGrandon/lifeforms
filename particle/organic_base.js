var debug = require('debug')('OrganicBaseParticle')

function OrganicBaseParticle(world, config) {
	this.world = world;
	this.currentFuel = 0;
	this.requiredFuelToSpawn = 10;
	this.maxOffshootSpawnDistance = 5;

	this.id = config.id;
	this.name = 'OrganicBaseParticle';
	this.position = config.position;

	this.world.update(this, 'created');
}

OrganicBaseParticle.prototype = {

	tick: function() {
		this.maybeFeed();
		this.maybeGrow();
	},

	maybeFeed: function() {
		if (Math.random() > 0.5) {
			this.currentFuel++;
		}
	},

	maybeGrow: function() {
		if (this.currentFuel > this.requiredFuelToSpawn) {
			//debug('spawing new child')
			this.world.spawnNear(this, OrganicBaseParticle);
			this.currentFuel = 0;
		}
	}
};

module.exports = OrganicBaseParticle;