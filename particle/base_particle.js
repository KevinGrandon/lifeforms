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
		if (newPosition[0] > this.position[0])
			this.position[0]++;
		if (newPosition[0] < this.position[0])
			this.position[0]--;
		if (newPosition[1] > this.position[1])
			this.position[1]++;
		if (newPosition[1] < this.position[1])
			this.position[1]--;

		this.world.update(this, 'moved');
	}
};

module.exports = BaseParticle;