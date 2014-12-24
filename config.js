var defaultConfig = {
	worldSize: 2000,

	tickDelay: 100,

	initialParticles: [
		{
			count: 4000,
			classificaiton: 'Plant',
			size: 1,
			speed: 1,
			color: '#00FF00',
			eyesight: 0,
			requiredFuelToSpawn: 10,
			fuelValueWhenConsumed: 1,
			consumes: null
		},
		{
			count: 200,
			classificaiton: 'Animal',
			size: 1,
			speed: 1,
			color: '#FF0000',
			eyesight: 20,
			requiredFuelToSpawn: 8,
			fuelValueWhenConsumed: 2,
			consumes: ['Plant']
		},
		{
			count: 6,
			classificaiton: 'Animal',
			size: 5,
			speed: 2,
			color: '#0000FF',
			eyesight: 100,
			requiredFuelToSpawn: 20,
			fuelValueWhenConsumed: 5,
			consumes: ['Animal']
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
