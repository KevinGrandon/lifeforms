function BaseParticle(config) {
	this.config = config;
	this.move(config.position);
}

BaseParticle.prototype = {
	move: function(position) {
		this.position = position;
	},
	remove: function() {
	}
};



function OrganicBaseParticle(config) {
	this.color = '#00FF00';
	BaseParticle.call(this, config);
}

OrganicBaseParticle.prototype = {
	__proto__: BaseParticle.prototype
};



function OrganicEaterParticle(config) {
	this.color = '#FF0000';
	BaseParticle.call(this, config);
}

OrganicEaterParticle.prototype = {
	__proto__: BaseParticle.prototype
};



function HungryGuyParticle(config) {
	this.color = '#0000FF';
	BaseParticle.call(this, config);
}

HungryGuyParticle.prototype = {
	__proto__: BaseParticle.prototype
};



window.ClientParticle = {
	OrganicBaseParticle: OrganicBaseParticle,
	OrganicEaterParticle: OrganicEaterParticle,
	HungryGuyParticle: HungryGuyParticle
};
