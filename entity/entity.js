var Markov = require('./../util/markov');
var distance = require('./../util/distance');

function Entity(world, config) {
	this.world = world;
	this.originalConfig = {};

	for (var i in config) {
		this.originalConfig[i] = config[i];
		this[i] = config[i];
	}

	// Build markov evaluator.
	var markovProces = new Markov.Process(this.markovReward.bind(this));
	for (var i in this.states) {
		var state = this.states[i];
		markovProces.add(i, state.next);

		if (!this.state) {
			this.state = i;
		}
	}
	this.markov = markovProces;

	this.world.update(this, 'created');
}

Entity.prototype = {

	markovReward: function(currentState, state) {
		return this[state + 'Score'];
	},

	tick: function() {
		this.state = this.markov.evaluate(this.state, this);
		var strategyMixin = require('./strategies/' + this.state);
		var strategy = this.states[this.state].strategy;
		strategyMixin[strategy].call(this);
	},

	/**
	 * How hungry is this cell?
	 */
	get eatingScore() {
		// Set to higher to increase hunger.
		var hungerScoreMultiplier = 1.5;
		return (this.requiredFuelToSpawn * hungerScoreMultiplier) - this.currentFuel;
	},

	get breedingScore() {
		// Set to higher to wait longer before breeding.
		var breedScoreAdjust = 10;
		return breedScoreAdjust - this.eatingScore;
	},

	/**
	 * Moves the cell towards a position.
	 * @param {Position} newPosition
	 */
	moveTowards: function(newPosition) {
		this.world.unregisterPosition(this.id, this.position);

		var dist = distance(this.position, newPosition);

		if (dist < this.speed) {
			this.position[0] = newPosition[0];
			this.position[1] = newPosition[1];
			this.world.registerPosition(this);
			this.world.update(this, 'moved');
			return;
		}

		var toPointX = (newPosition[0] - this.position[0]) / dist;
		var toPointY = (newPosition[1] - this.position[1]) / dist;

		this.position[0] += Math.round(toPointX * this.speed);
		this.position[1] += Math.round(toPointY * this.speed);

		this.world.registerPosition(this);
		this.world.update(this, 'moved');
	}
};

module.exports = Entity;
