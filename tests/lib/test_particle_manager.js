var particles = require('../../lib/particle_manager').particleManager

exports.testParticleAtLocation = function(test) {

	var mockParticles = [
		{location: [0, 1, 0], idx: 4},
		{location: [1, 0, 0], idx: 4},
		{location: [0, 0, 0], idx: 4},
		{location: [0, 0, 1], idx: 4}
	]

	mockParticles.forEach(particles.add.bind(particles))

    test.expect(1)
    var findAt = [0, 0, 1]
    var expected = 4
    var results = particles.particleAtLocation(findAt)
    test.deepEqual(results.idx, expected, "results idx matches expected");
    test.done();
};
