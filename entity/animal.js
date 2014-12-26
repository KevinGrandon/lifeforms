var BaseEntity = require('./base_entity');
var MarkovChainEvaluator = require('./../util/markov').ChainEvaluator;
var random = require('./../util/random');

function AnimalParticle(world, config) {
	this.targetCoords = null;
	BaseEntity.call(this, world, config);
}

AnimalParticle.prototype = {

	__proto__: BaseEntity.prototype,

	tick: function() {
		var states = {
			eating: this.hungerScore,
			breeding: this.breedScore,
		};

		var action = MarkovChainEvaluator.evaluate(states);
		this['_handle_' + action]();
	},

	findFood: function() {
		// Got to goal. Is food?
		if (this.targetCoords && this.targetCoords[0] === this.position[0] && this.targetCoords[1] === this.position[1]) {
			this.targetCoords = null;
		} else if (this.targetCoords) {
			// Move towards goal.
			BaseEntity.prototype.moveTowards.call(this, this.targetCoords);
		} else {
			// Find food and set coords to walk to.
			var closest = this.world.findClosestWithinSensors(this, {
				consumes: this.consumes,
				notSpecies: this.species
			});
			if (closest) {
				this.targetCoords = closest.position;
			} else {
				// Walk in a random direction if closest target is null to find food.
				this.targetCoords = [this.position[0] + random(-30, 30), this.position[1] + random(-30, 30)];
			}
		}
	},

	_handle_eating: function() {
		this.findFood();
		var fuel = this.world.tryToEatAtCurrentLocation(this, this.consumes);
		// Increment the fuel by what we ate.
		this.currentFuel += fuel;
	},

	_handle_breeding: function() {
		if (this.currentFuel > this.requiredFuelToSpawn) {
			this.world.spawnNear(this, AnimalParticle);
			this.currentFuel = 0;
		}
	}
};

module.exports = AnimalParticle;
