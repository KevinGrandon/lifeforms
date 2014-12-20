var BaseParticle = require('./base_particle');

function OrganicEaterParticle(world, config) {
	this.currentFuel = 0;
	this.requiredFuelToSpawn = 3;
	this.maxOffshootSpawnDistance = 5;

	this.action = 'searching';
	this.targetCoords = null;

	this.name = 'OrganicEaterParticle';

	BaseParticle.call(this, world, config);
}

OrganicEaterParticle.prototype = {

	__proto__: BaseParticle.prototype,

	tick: function() {
		this.maybeFindFood();
		this.maybeFeed();
		this.maybeSpawn();
	},

	maybeFindFood: function() {
		if (this.action !== 'searching') {
			return;
		}

		// Got to goal. Is food?
		if (this.targetCoords && this.targetCoords[0] === this.position[0] && this.targetCoords[1] === this.position[1]) {
			this.action = 'eating';
			this.targetCoords = null;
		} else if (this.targetCoords) {
			// Move towards goal.
			BaseParticle.prototype.moveTowards.call(this, this.targetCoords);
		} else {
			// Find food and set coords to walk to.
			var closest = this.world.findClosest(this, 'OrganicBaseParticle');
			if (closest) {
				this.targetCoords = closest.position;
			}
		}
	},

	maybeFeed: function() {
		if (this.action !== 'eating') {
			return;
		}

		var fuel = this.world.tryToEatAtCurrentLocation(this, 'OrganicBaseParticle');

		// If we can't gain fuel from the current location, search.
		if (!fuel) {
			this.action = 'searching';
		}

		// Increment the fuel by what we ate.
		this.currentFuel += fuel;
	},

	maybeSpawn: function() {
		if (this.currentFuel > this.requiredFuelToSpawn) {
			this.world.spawnNear(this, OrganicEaterParticle);
			this.currentFuel = 0;
			this.action = 'searching';
		}
	}
};

module.exports = OrganicEaterParticle;