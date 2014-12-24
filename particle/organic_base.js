var BaseParticle = require('./base_particle');
var MarkovChainEvaluator = require('./../util/markov').ChainEvaluator;
var random = require('./../util/random');

function OrganicBaseParticle(world, config) {
	BaseParticle.call(this, world, config);
}

OrganicBaseParticle.prototype = {

	__proto__: BaseParticle.prototype,

	tick: function() {
		var states = {
			eating: this.hungerScore,
			growing: this.growScore,
		};

		var action = MarkovChainEvaluator.evaluate(states);
		if (action === 'eating') {
			this.feed();
		} else if (action === 'growing') {
			this.grow();
		}

		this.action = action;
	},

	/**
	 * How hungry is this cell?
	 * 10 is really hungry!
	 */
	get hungerScore() {
		return 10 - this.currentFuel;
	},

	get growScore() {
		return this.currentFuel;
	},

	feed: function() {
		if (Math.random() > 0.5) {
			this.currentFuel++;
		}
	},

	grow: function() {
		if (this.currentFuel > this.requiredFuelToSpawn) {
			this.world.spawnNear(this, OrganicBaseParticle);
			this.currentFuel = 0;
		}
	}
};

module.exports = OrganicBaseParticle;
