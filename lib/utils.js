/**
 * Sorts particles by x, y, then z coordinates
 */
function sortByPosition(particles) {
	return particles.sort(function(a, b) {

		// Sort by y first
		if (a.location[1] > b.location[1])
			return 1
		else if (a.location[1] < b.location[1])
			return -1

		// Sort by x
		if (a.location[0] > b.location[0])
			return 1
		else if (a.location[0] < b.location[0])
			return -1

		// Finally sort by z, descending
		if (a.location[2] > b.location[2])
			return -1
		else
			return 1
	})
}
exports.sortByPosition = sortByPosition


function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
exports.random = random