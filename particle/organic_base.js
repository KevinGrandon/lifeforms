var BaseParticle = require('./base_particle');

function OrganicBaseParticle(world, config) {
	this.currentFuel = 0;
	this.requiredFuelToSpawn = 10;
	this.maxOffshootSpawnDistance = 5;
	this.fuelValueWhenConsumed = 1;

	this.name = 'OrganicBaseParticle';

	BaseParticle.call(this, world, config);
}


OrganicBaseParticle.prototype = {

	__proto__: BaseParticle.prototype,

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
			this.world.spawnNear(this, OrganicBaseParticle);
			this.currentFuel = 0;
		}
	}
};

module.exports = OrganicBaseParticle;