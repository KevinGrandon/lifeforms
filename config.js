var defaultConfig = {
	worldSize: 2000,

	tickDelay: 100,

	initialLifeforms: [
		/**
		 * A note about particle configuration:
		 * count - The number of initial particles of this type populated on the map.
		 * classificaiton - What type of particle this is.
		 * size - How large the particle should be.
		 * speed - How fast the particle moves.
		 * color - The color of the particle.
		 * eyesight - How far away the particle can "see". Useful for animal types.
		 * requiredFuelToSpawn - This much fuel is required to breed new generations.
		 * fuelValueWhenConsumed - How much fuel this particle gives when consumed.
		 * consumes - What classification of particles can we eat.
		 * states - A list of all initial states, and what strategy to use for those states.
		 */
		{
			count: 4000,
			species: [1, 0, 0],
			classificaiton: 'Plant',
			size: 1,
			speed: 0,
			color: '#00FF00',
			eyesight: 0,
			requiredFuelToSpawn: 10,
			fuelValueWhenConsumed: 1,
			consumes: null,
			states: {
				eating: {
					next: ['eating', 'breeding'],
					strategy: 'absorb'
				},
				breeding: {
					next: ['eating'],
					strategy: 'asexual'
				}
			}
		},
		{
			count: 200,
			species: [2, 0, 0],
			classificaiton: 'Animal',
			size: 1,
			speed: 1,
			color: '#FF0000',
			eyesight: 20,
			requiredFuelToSpawn: 8,
			fuelValueWhenConsumed: 2,
			consumes: ['Plant'],
			states: {
				eating: {
					next: ['eating', 'breeding'],
					strategy: 'hunt'
				},
				breeding: {
					next: ['eating'],
					strategy: 'asexual'
				}
			}
		},
		{
			count: 6,
			species: [3, 0, 0],
			classificaiton: 'Animal',
			size: 5,
			speed: 2,
			color: '#0000FF',
			eyesight: 100,
			requiredFuelToSpawn: 20,
			fuelValueWhenConsumed: 5,
			consumes: ['Animal'],
			states: {
				eating: {
					next: ['eating', 'breeding'],
					strategy: 'hunt'
				},
				breeding: {
					next: ['eating'],
					strategy: 'asexual'
				}
			}
		}
	]
};

// Handle DEBUG cases.
// Pass SMALL=1 node particle to reduce particles.
if (process.env.SMALL) {
	defaultConfig.initialLifeforms[0].count = 1;
	defaultConfig.initialLifeforms[1].count = 1;
	defaultConfig.initialLifeforms[2].count = 1;
	defaultConfig.worldSize = 100;
}

module.exports = defaultConfig;
