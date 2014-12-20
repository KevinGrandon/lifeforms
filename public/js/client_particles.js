function BaseParticle(config) {
	this.config = config;
	this.element = document.createElement('div');
	this.element.className = this.className;
	document.body.appendChild(this.element);

	this.element.style.transform = 'translate(' + config.position[0] + 'px, ' + config.position[1] + 'px)';
}

function OrganicBaseParticle(config) {
	this.className = 'organic particle';
	BaseParticle.call(this, config);
}

OrganicBaseParticle.__proto__ = BaseParticle.prototype;

window.ClientParticle = {
	OrganicBaseParticle: OrganicBaseParticle
};