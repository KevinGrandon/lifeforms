var colors = require('colors');
var Particle = require('./particles/particle').Particle
var utils = require('./lib/utils')

global.config = {
	worldHeight: 40,
	worldWidth: 80
}

var count = 0
var particles = []

// Initial particles
var allParticles = ['Substrate', 'Water']
for (var i = 0; i < global.config.worldHeight; i++) {
	for (var j = 0; j < global.config.worldWidth; j++) {
		var particleClass = allParticles[Math.floor(Math.random() * allParticles.length)]
		particleClass = require('./particles/' + particleClass)[particleClass]
		particles.push(new particleClass(j, i))
	}
}

// Initial cells
var Cell = require('./particles/cell').Cell
var numCells = 100
for (var i = 0; i < numCells; i++) {
	var placement = []
	placement[0] = utils.random(0, global.config.worldWidth - 1)
	placement[1] = utils.random(0, global.config.worldHeight - 1)

	var newParticle = new Cell(placement[0], placement[1])
	particles.push(newParticle)
}

function main() {
	count++
	// Clear the console completely
	process.stdout.write('\u001B[2J\u001B[0;0f')

	// Tick particles for updates first
	particles.forEach(function(particle, idx) {
		particle.tick()
	})

	// Sort particles
	particles = utils.sortByPosition(particles)

	// Render particles on screen
	particles.forEach(function(particle, idx) {

		// If this particle has the same position as the previous particle, skip it
		// (This particle has lower z-priority)
		var previousParticle = particles[idx-1]
		if (previousParticle
			&& particle.location[0] === previousParticle.location[0]
			&& particle.location[1] === previousParticle.location[1]) {
			return
		}

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
