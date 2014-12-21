var distance = require('./../util/distance');

function BaseParticle(world, config) {
	this.world = world;
	this.id = config.id;
	this.position = config.position;

	this.world.update(this, 'created');
}

BaseParticle.prototype = {
	tick: function() {
	},

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

		this.position[0] += Math.ceil(toPointX * this.speed);
		this.position[1] += Math.ceil(toPointY * this.speed);

		this.world.registerPosition(this);
		this.world.update(this, 'moved');
	}
};

module.exports = BaseParticle;