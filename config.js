var defaultConfig = {
	worldSize: 2000,

	tickDelay: 100,

	initialParticles: [
		{
			count: 4000,
			className: 'OrganicBase',
			size: 1,
			color: '#00FF00'
		},
		{
			count: 200,
			className: 'OrganicEater',
			size: 1,
			color: '#FF0000'
		},
		{
			count: 6,
			className: 'HungryGuy',
			size: 5,
			color: '#0000FF'
		}
	]
};

// Handle DEBUG cases.
// Pass SMALL=1 node particle to reduce particles.
if (process.env.SMALL) {
	defaultConfig.initialParticles[0].count = 1;
	defaultConfig.initialParticles[1].count = 1;
	defaultConfig.initialParticles[2].count = 1;
	defaultConfig.worldSize = 100;
}

module.exports = defaultConfig;
