var defaultConfig = {
	worldSize: 2000,

	tickDelay: 100,

	initialParticles: {
		OrganicBase: 4000,
		OrganicEater: 200,
		HungryGuy: 6
	}
}

// Handle DEBUG cases.
// Pass SMALL=1 node particle to reduce particles.
if (process.env.SMALL) {
	defaultConfig.initialParticles.OrganicBase = 1;
	defaultConfig.initialParticles.OrganicEater = 1;
	defaultConfig.initialParticles.HungryGuy = 1;
	defaultConfig.worldSize = 100;
}

module.exports = defaultConfig;
