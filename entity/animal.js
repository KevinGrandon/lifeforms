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
		if (action === 'eating') {
			this.findFood();
			this.feed();
		} else if (action === 'breeding') {
			this.breed();
		}

		this.action = action;
	},

	/**
	 * How hungry is this cell?
	 */
	get hungerScore() {
		// Set to higher to increase hunger.
		var hungerScoreMultiplier = 1.5;
		return (this.requiredFuelToSpawn * hungerScoreMultiplier) - this.currentFuel;
	},

	get breedScore() {
		// Set to higher to wait longer before breeding.
		var breedScoreAdjust = 10;
		return breedScoreAdjust - this.hungerScore;
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
			var closest = this.world.findClosestWithinSensors(this, this.consumes);
			if (closest) {
				this.targetCoords = closest.position;
			} else {
				// Walk in a random direction if closest target is null to find food.
				this.targetCoords = [this.position[0] + random(-30, 30), this.position[1] + random(-30, 30)];
			}
		}
	},

	feed: function() {
		var fuel = this.world.tryToEatAtCurrentLocation(this, this.consumes);
		// Increment the fuel by what we ate.
		this.currentFuel += fuel;
	},

	breed: function() {
		if (this.currentFuel > this.requiredFuelToSpawn) {
			this.world.spawnNear(this, AnimalParticle);
			this.currentFuel = 0;
		}
	}
};

module.exports = AnimalParticle;
