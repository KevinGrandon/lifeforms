var BaseEntity = require('./base_entity');
var MarkovChainEvaluator = require('./../util/markov').ChainEvaluator;
var random = require('./../util/random');

function PlantParticle(world, config) {
	BaseEntity.call(this, world, config);
}

PlantParticle.prototype = {

	__proto__: BaseEntity.prototype,

	tick: function() {
		var states = {
			eating: this.hungerScore,
			breeding: this.breedScore,
		};

		var action = MarkovChainEvaluator.evaluate(states);
		this['_handle_' + action]();
	},

	_handle_eating: function() {
		if (Math.random() > 0.5) {
			this.currentFuel++;
		}
	},

	_handle_breeding: function() {
		if (this.currentFuel > this.requiredFuelToSpawn) {
			this.world.spawnNear(this, PlantParticle);
			this.currentFuel = 0;
		}
	}
};

module.exports = PlantParticle;
