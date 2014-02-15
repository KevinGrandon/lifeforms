var colors = require('colors');
var particles = require('./lib/particle_manager').particleManager
var Particle = require('./particles/particle').Particle
var utils = require('./lib/utils')

global.config = {

	// World definition
	world: {

		// How tall the world is
		height: 50,

		// How wide the world is
		width: 90,

		// Number of initial cells
		initialCells: 10
	}
}

var count = 0

// Initial particles
var allParticles = ['Substrate', 'Water']
for (var i = 0; i < global.config.world.height; i++) {
	for (var j = 0; j < global.config.world.width; j++) {
		var particleClass = allParticles[Math.floor(Math.random() * allParticles.length)]
		particleClass = require('./particles/' + particleClass)[particleClass]
		particles.add(new particleClass(j, i))
	}
}

// Initial cells
var Cell = require('./particles/cell').Cell
for (var i = 0; i < global.config.world.initialCells; i++) {
	var placement = []
	placement[0] = utils.random(0, global.config.world.width - 1)
	placement[1] = utils.random(0, global.config.world.height - 1)

	var newParticle = new Cell(placement[0], placement[1])
	particles.add(newParticle)
}

process.stdout.write('\033[0;0f')

function main() {
	count++
	// Clear the console completely
	process.stdout.write('\033[0;0f')

	// Tick particles for updates first
	particles.each(function(particle, idx) {
		particle.tick()
	})

	// Sort particles
	particles.sortByPosition()

	// Render particles on screen
	var previousParticle
	particles.each(function(particle, idx) {

		// If this particle has the same position as the previous particle, skip it
		// (This particle has lower z-priority)
		if (previousParticle
			&& particle.location[0] === previousParticle.location[0]
			&& particle.location[1] === previousParticle.location[1]) {
			return
		}
		previousParticle = particle

		// Output new line
		if (particle.location[0] === 0) {
			process.stdout.write('\n')
		}

		particle.draw()
	})

	console.log('\n')
	console.log('Iteration: ' + count)
	setTimeout(main, 200)
}

main()
