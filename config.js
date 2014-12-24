var defaultConfig = {
	worldSize: 2000,

	tickDelay: 100,

	initialParticles: [
		{
			count: 4000,
			name: 'Plant',
			classificaiton: 'Plant',
			size: 1,
			speed: 1,
			color: '#00FF00',
			eyesight: 0,
			requiredFuelToSpawn: 10,
			fuelValueWhenConsumed: 1
		},
		{
			count: 200,
			name: 'OrganicEater',
			classificaiton: 'Animal',
			size: 1,
			speed: 1,
			color: '#FF0000',
			eyesight: 20,
			requiredFuelToSpawn: 8,
			fuelValueWhenConsumed: 2
		},
		{
			count: 6,
			name: 'HungryGuy',
			classificaiton: 'Animal',
			size: 5,
			speed: 2,
			color: '#0000FF',
			eyesight: 100,
			requiredFuelToSpawn: 20,
			fuelValueWhenConsumed: 5
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
