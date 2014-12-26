var distance = require('./../util/distance');

function BaseEntity(world, config) {
	this.world = world;
	this.originalConfig = {};

	for (var i in config) {
		this.originalConfig[i] = config[i];
		this[i] = config[i];
	}

	this.world.update(this, 'created');
}

BaseEntity.prototype = {

	tick: function() {
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

module.exports = BaseEntity;
