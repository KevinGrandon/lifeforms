function BaseParticle(config) {
	this.config = config;
	this.move(config.position);
}

BaseParticle.prototype = {

	get color() {
		return this.config.color;
	},

	move: function(position) {
		this.position = position;
	}
};
