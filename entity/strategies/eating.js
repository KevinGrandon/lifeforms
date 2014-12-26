var Entity = require('./../entity');
var random = require('./../../util/random');

exports.searchFood = function() {
	// Got to goal. Is food?
	if (this.targetCoords && this.targetCoords[0] === this.position[0] && this.targetCoords[1] === this.position[1]) {
		this.targetCoords = null;
	} else if (this.targetCoords) {
		// Move towards goal.
		Entity.prototype.moveTowards.call(this, this.targetCoords);
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
};

/**
 * Handles eating of a cellular lifeform.
 */
exports.hunt = function() {
	exports.searchFood.call(this);
	var fuel = this.world.tryToEatAtCurrentLocation(this, this.consumes);
	// Increment the fuel by what we ate.
	this.currentFuel += fuel;	
};

/**
 * Absorbs minerals from the environment.
 */
exports.absorb = function() {
	if (Math.random() > 0.5) {
		this.currentFuel++;
	}
};

