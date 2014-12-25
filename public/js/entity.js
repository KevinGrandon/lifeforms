function Entity(config) {
	this.config = config;
	this.move(config.position);
}

Entity.prototype = {

	get color() {
		return this.config.color;
	},

	move: function(position) {
		this.position = position;
	}
};
