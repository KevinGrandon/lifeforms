function BaseParticle(config) {
	this.config = config;
	this.element = document.createElement('div');
	this.element.className = this.className;
	document.body.appendChild(this.element);

	this.move(config.position);
}

BaseParticle.prototype = {
	move: function(position) {
		this.element.style.transform = 'translate(' + position[0] + 'px, ' + position[1] + 'px)';
	},
	remove: function() {
		document.body.removeChild(this.element);
	}
};



function OrganicBaseParticle(config) {
	this.className = 'organic particle';
	BaseParticle.call(this, config);
}

OrganicBaseParticle.prototype = {
	__proto__: BaseParticle.prototype
};



function OrganicEaterParticle(config) {
	this.className = 'hunter particle';
	BaseParticle.call(this, config);
}

OrganicEaterParticle.prototype = {
	__proto__: BaseParticle.prototype
};



window.ClientParticle = {
	OrganicBaseParticle: OrganicBaseParticle,
	OrganicEaterParticle: OrganicEaterParticle
};
